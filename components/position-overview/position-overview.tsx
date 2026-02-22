"use client"

import { useState, useEffect } from "react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { parseUnits, formatUnits, encodeAbiParameters, parseAbiParameters, maxUint256 } from "viem"
import { base } from "wagmi/chains"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button/button"
import { Slider } from "@/components/ui/slider/slider"
import { Label } from "@/components/ui/label/label"
import { TrendingUp, TrendingDown, Shield, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { Dialog } from "@/components/ui/dialog/dialog"
import styles from "./position-overview.module.css"
import {
  ADDRESSES,
  VAULT_FACTORY_ABI,
  CITADEL_VAULT_ABI,
  ERC20_ABI,
} from "@/lib/contracts"

// ──────────────────────────────────────────────────────────────
// Вспомогательные утилиты
// ──────────────────────────────────────────────────────────────

function hfToNumber(raw: bigint | undefined): number {
  if (!raw) return 0
  if (raw === maxUint256) return 999
  return Number(formatUnits(raw, 18))
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4)
}

// ──────────────────────────────────────────────────────────────
// Компонент-логгер: читает все view-данные vault'а и выводит в консоль
// ──────────────────────────────────────────────────────────────

function VaultLogger({ vaultAddress, index }: { vaultAddress: `0x${string}`; index: number }) {
  const { data: hf } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "getHealthFactor" })
  const { data: supplyWETH, error: supplyWETHError } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "getSupplyBalance", args: [ADDRESSES.WETH] })
  const { data: supplyUSDC, error: supplyUSDCError } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "getSupplyBalance", args: [ADDRESSES.USDC] })
  const { data: warningHF } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "warningHF" })
  const { data: targetHF } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "targetHF" })
  const { data: paused } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "paused" })
  const { data: needsProtection } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "needsProtection" })
  const { data: owner } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "owner" })
  const { data: rewardBps } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "rewardBps" })

  useEffect(() => {
    if (hf === undefined) return

    const hfNum = hf === maxUint256 ? Infinity : Number(formatUnits(hf as bigint, 18))

    console.group(`[Citadel] Vault #${index + 1}: ${vaultAddress}`)
    console.log("owner:              ", owner)
    console.log("healthFactor:       ", hfNum === Infinity ? "∞ (no debt)" : hfNum.toFixed(6))
    console.log("healthFactor (raw): ", String(hf))
    console.log("warningHF:          ", warningHF ? Number(formatUnits(warningHF as bigint, 18)).toFixed(2) : "—")
    console.log("targetHF:           ", targetHF ? Number(formatUnits(targetHF as bigint, 18)).toFixed(2) : "—")
    console.log("WETH addr:          ", ADDRESSES.WETH)
    console.log("supplyWETH (raw):   ", String(supplyWETH ?? "undefined"))
    console.log("supplyWETH:         ", supplyWETH ? formatUnits(supplyWETH as bigint, 18) + " WETH" : "❌ 0 / undefined")
    if (supplyWETHError) console.error("supplyWETH error:   ", supplyWETHError.message)
    console.log("USDC addr:          ", ADDRESSES.USDC)
    console.log("supplyUSDC (raw):   ", String(supplyUSDC ?? "undefined"))
    console.log("supplyUSDC:         ", supplyUSDC ? formatUnits(supplyUSDC as bigint, 6) + " USDC" : "0")
    if (supplyUSDCError) console.error("supplyUSDC error:   ", supplyUSDCError.message)
    console.log("needsProtection:    ", needsProtection)
    console.log("paused:             ", paused)
    console.log("rewardBps:          ", rewardBps ? Number(rewardBps).toString() + " bps" : "—")
    if (!supplyWETH || (supplyWETH as bigint) === 0n) {
      console.warn("[Citadel] supplyWETH = 0. Возможные причины:")
      console.warn("  1. WETH отправлен напрямую на vault (нужно через vault.deposit())")
      console.warn("  2. Адрес WETH не совпадает:", ADDRESSES.WETH)
      console.warn("  3. deposit() ещё не подтверждён")
    }
    console.groupEnd()
  }, [hf, supplyWETH, supplyWETHError, supplyUSDC, supplyUSDCError, warningHF, targetHF, paused, needsProtection, owner, rewardBps, vaultAddress, index])

  return null // визуально ничего не рендерит
}

// ──────────────────────────────────────────────────────────────
// Карточка одного Vault
// ──────────────────────────────────────────────────────────────

interface VaultCardProps {
  vaultAddress: `0x${string}`
  index: number
}

function VaultCard({ vaultAddress, index }: VaultCardProps) {
  const [modalType, setModalType] = useState<"supply" | "borrow" | null>(null)
  const [inputAmount, setInputAmount] = useState("")
  const [sliderHF, setSliderHF] = useState(1.5)

  const { writeContract, data: txHash, isPending: isTxPending, reset: resetTx } = useWriteContract()
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // Чтение данных vault
  const { data: healthFactorRaw, refetch: refetchHF } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "getHealthFactor",
  })

  const { data: supplyBalanceRaw, refetch: refetchSupply } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "getSupplyBalance",
    args: [ADDRESSES.WETH],
  })

  const { data: warningHFRaw } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "warningHF",
  })

  const { data: targetHFRaw } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "targetHF",
  })

  const { data: isPaused } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "paused",
  })

  const { data: needsProtectionRaw } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "needsProtection",
  })

  // Данные для UI
  const healthFactor = hfToNumber(healthFactorRaw as bigint | undefined)
  const supplyBalanceWETH = supplyBalanceRaw ? Number(formatUnits(supplyBalanceRaw as bigint, 18)) : 0
  const warningHF = hfToNumber(warningHFRaw as bigint | undefined) || 1.2
  const targetHF = hfToNumber(targetHFRaw as bigint | undefined) || 1.5
  const isHealthy = healthFactor === 999 || healthFactor >= 1.5
  const isBusy = isTxPending || isTxConfirming

  const hfColor =
    healthFactor >= 1.5 ? styles.statusHealthy :
      healthFactor >= 1.2 ? styles.statusMonitor :
        styles.ltvValueWarning

  const hfDisplay = healthFactor === 999 ? "∞" : healthFactor.toFixed(2)

  function refetchAll() {
    refetchHF()
    refetchSupply()
  }

  // Транзакции
  function handleApproveWETH() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: ADDRESSES.WETH, abi: ERC20_ABI, functionName: "approve", args: [vaultAddress, amount] })
  }

  function handleDeposit() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "deposit", args: [ADDRESSES.WETH, amount] })
  }

  function handleWithdraw() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "withdraw", args: [ADDRESSES.WETH, amount] })
  }

  function handleBorrow() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "borrow", args: [ADDRESSES.USDC, amount] })
  }

  function handleApproveUSDC() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: ADDRESSES.USDC, abi: ERC20_ABI, functionName: "approve", args: [vaultAddress, amount] })
  }

  function handleRepay() {
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "repay", args: [ADDRESSES.USDC, amount] })
  }

  function handleAutoLoop() {
    const minHFAfter = BigInt(Math.round(sliderHF * 1e18))
    const data = encodeAbiParameters(
      parseAbiParameters("uint8, address, uint8, uint256, uint256"),
      [0, ADDRESSES.USDC, 3, BigInt(100), minHFAfter]
    )
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "executeFromModule", args: [ADDRESSES.LoopModule, data] })
  }

  function handleSetWarningHF() {
    const warnRaw = BigInt(Math.round(sliderHF * 1e18))
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "setWarningHF", args: [warnRaw] })
  }

  return (
    <div key={index} className={styles.positionCard}>
      {/* Заголовок */}
      <div className={styles.positionHeader}>
        <div className={styles.assetInfo}>
          <div className={styles.assetTitleWrapper}>
            <h3 className={styles.assetName}>Vault {index + 1}</h3>
            <span className={styles.assetDescription} title={vaultAddress}>
              {shortAddr(vaultAddress)}
            </span>
            {isPaused && (
              <Badge variant="outline" className={styles.protectedBadge} style={{ color: "orange" }}>
                Paused
              </Badge>
            )}
            {needsProtectionRaw && (
              <Badge variant="outline" className={styles.protectedBadge} style={{ color: "red" }}>
                ⚠ Needs Protection
              </Badge>
            )}
          </div>
          <p className={styles.assetDescription}>WETH Collateral · Base mainnet</p>
        </div>

        <div className={styles.headerActions}>
          <Button size="sm" variant="outline" className={styles.headerButton}
            onClick={() => setModalType("supply")} disabled={!!isPaused}>
            SUPPLY
          </Button>
          <Button size="sm" variant="outline" className={styles.headerButton}
            onClick={() => setModalType("borrow")} disabled={!!isPaused}>
            BORROW
          </Button>
          <Button size="sm" variant="outline" className={styles.headerButton}
            onClick={refetchAll} title="Обновить">
            <RefreshCw size={14} />
          </Button>
        </div>

        <div className={`${styles.changeIndicator} ${isHealthy ? styles.positive : styles.negative}`}>
          {isHealthy ? <TrendingUp className={styles.changeIcon} /> : <TrendingDown className={styles.changeIcon} />}
          <span>HF {hfDisplay}</span>
        </div>
      </div>

      {/* Метрики */}
      <div className={styles.metricsGrid}>
        <div>
          <p className={styles.metricLabel}>Collateral (WETH)</p>
          <p className={styles.metricValue}>{supplyBalanceWETH > 0 ? supplyBalanceWETH.toFixed(4) : "—"} WETH</p>
          <p className={styles.collateralUSD}>Supply balance</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Health Factor</p>
          <p className={`${styles.metricValue} ${hfColor}`}>{hfDisplay}</p>
          <p className={styles.metricLabel}>Current</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Warning HF</p>
          <p className={styles.metricValue}>{warningHF.toFixed(2)}</p>
          <p className={styles.metricLabel}>Threshold</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Target HF</p>
          <p className={styles.metricValue}>{targetHF.toFixed(2)}</p>
          <p className={styles.metricLabel}>After rebalance</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Status</p>
          <p className={`${styles.metricValue} ${isHealthy ? styles.statusHealthy : styles.statusMonitor}`}>
            {needsProtectionRaw ? "⚠ Protect" : isHealthy ? "Healthy" : "Monitor"}
          </p>
          <p className={styles.metricLabel}>Active</p>
        </div>
      </div>

      {/* Protection box */}
      <div className={styles.protectionBox}>
        <div className={styles.protectionHeader}>
          <Shield className={styles.shieldIcon} />
          <Label className={styles.protectionLabel}>Protection Threshold (Warning HF)</Label>
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderRow}>
              <span className={styles.metricLabel}>Minimum Health Factor</span>
              <span className={styles.hfValue}>{sliderHF.toFixed(1)}</span>
            </div>
            <Slider
              value={[sliderHF]}
              onValueChange={(v) => setSliderHF(v[0])}
              min={1.1} max={2.5} step={0.1}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>1.1</span>
              <span>2.5</span>
            </div>
          </div>
          <Button size="sm" variant="default"
            className={`${styles.actionButton} ${styles.protectionButton}`}
            onClick={handleSetWarningHF} disabled={isBusy}>
            {isBusy ? <Loader2 size={14} className="animate-spin" /> : "SET WARNING HF"}
          </Button>
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <Button size="sm" variant="outline" className={styles.headerButton}
            onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
            {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
          </Button>
        </div>

        <p className={styles.autoProtectNote}>
          Smart contract will automatically protect your position when health factor drops below{" "}
          <span className={styles.autoProtectValue}>{sliderHF.toFixed(1)}</span>
        </p>

        {isTxSuccess && (
          <p style={{ color: "var(--primary, #14f46f)", fontSize: "0.75rem", marginTop: 4 }}>
            ✓ Транзакция подтверждена
          </p>
        )}
      </div>

      {/* Модал */}
      <Dialog
        isOpen={!!modalType}
        onClose={() => { setModalType(null); setInputAmount(""); resetTx() }}
        title={modalType === "supply" ? "Supply / Withdraw WETH" : "Borrow / Repay USDC"}
      >
        <input
          type="number"
          placeholder={modalType === "supply" ? "Amount WETH" : "Amount USDC"}
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8,
            background: "hsl(var(--input))", color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))", marginBottom: 12,
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {modalType === "supply" && (
            <>
              <Button size="sm" onClick={handleApproveWETH} disabled={isBusy}>
                {isBusy ? <Loader2 size={14} className="animate-spin" /> : "1. APPROVE WETH"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDeposit} disabled={isBusy}>
                2. DEPOSIT
              </Button>
              <Button size="sm" variant="outline" onClick={handleWithdraw} disabled={isBusy}>
                WITHDRAW
              </Button>
            </>
          )}
          {modalType === "borrow" && (
            <>
              <Button size="sm" onClick={handleBorrow} disabled={isBusy}>
                {isBusy ? <Loader2 size={14} className="animate-spin" /> : "BORROW USDC"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleApproveUSDC} disabled={isBusy}>
                1. APPROVE USDC
              </Button>
              <Button size="sm" variant="outline" onClick={handleRepay} disabled={isBusy}>
                2. REPAY
              </Button>
            </>
          )}
        </div>
        {isTxSuccess && (
          <p style={{ color: "var(--primary, #14f46f)", marginTop: 8, fontSize: "0.8rem" }}>
            ✓ Транзакция подтверждена
          </p>
        )}
      </Dialog>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Компонент создания нового Vault
// ──────────────────────────────────────────────────────────────

function CreateVaultButton() {
  const [warningHF, setWarningHF] = useState(1.2)
  const [targetHF, setTargetHF] = useState(1.5)
  const { writeContract, isPending, data: txHash } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  function handleCreate() {
    writeContract({
      chainId: base.id,
      address: ADDRESSES.VaultFactory,
      abi: VAULT_FACTORY_ABI,
      functionName: "createVault",
      args: [
        BigInt(Math.round(warningHF * 1e18)),
        BigInt(Math.round(targetHF * 1e18)),
      ],
    })
  }

  return (
    <div className={styles.protectionBox} style={{ marginTop: 16 }}>
      <p className={styles.metricLabel} style={{ marginBottom: 8 }}>Создать новый Vault</p>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <Label className={styles.metricLabel}>Warning HF: {warningHF.toFixed(1)}</Label>
          <Slider value={[warningHF]} onValueChange={(v) => setWarningHF(v[0])}
            min={1.1} max={2.0} step={0.1} style={{ width: 120 }} />
        </div>
        <div>
          <Label className={styles.metricLabel}>Target HF: {targetHF.toFixed(1)}</Label>
          <Slider value={[targetHF]} onValueChange={(v) => setTargetHF(v[0])}
            min={1.2} max={2.5} step={0.1} style={{ width: 120 }} />
        </div>
        <Button size="sm" onClick={handleCreate} disabled={isPending}>
          {isPending ? <Loader2 size={14} className="animate-spin" /> : "CREATE VAULT"}
        </Button>
      </div>
      {isSuccess && (
        <p style={{ color: "var(--primary, #14f46f)", marginTop: 8, fontSize: "0.8rem" }}>
          ✓ Vault создан
        </p>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Главный компонент PositionOverview
// ──────────────────────────────────────────────────────────────

export function PositionOverview() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { address, isConnected } = useAccount()

  const {
    data: vaultAddresses,
    isLoading: isLoadingVaults,
  } = useReadContract({
    chainId: base.id,
    address: ADDRESSES.VaultFactory,
    abi: VAULT_FACTORY_ABI,
    functionName: "getVaultsByOwner",
    args: [address!],
    query: { enabled: mounted && isConnected && !!address },
  })

  const vaults = (vaultAddresses as `0x${string}`[] | undefined) ?? []

  // Выводим vault'ы в консоль для отладки
  useEffect(() => {
    if (address) {
      console.log(`[Citadel] getVaultsByOwner(${address}):`, vaults)
    }
  }, [vaults, address])

  return (
    <>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.title}>Position Overview</CardTitle>
          <CardDescription>
            {mounted && isConnected
              ? `Ваши vault'ы на Base mainnet · ${shortAddr(address!)}`
              : "Подключите кошелёк для просмотра позиций"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* До монтирования — нейтральный placeholder */}
          {!mounted && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "hsl(var(--muted-foreground))" }}>
              <Shield size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Подключите кошелёк для просмотра позиций</p>
            </div>
          )}

          {/* После монтирования — реальный UI */}
          {mounted && !isConnected && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "hsl(var(--muted-foreground))" }}>
              <Shield size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Подключите кошелёк, чтобы увидеть ваши vault'ы</p>
            </div>
          )}

          {mounted && isConnected && isLoadingVaults && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px" }} />
              <p className={styles.metricLabel}>Загружаем vault'ы…</p>
            </div>
          )}

          {mounted && isConnected && !isLoadingVaults && vaults.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: "hsl(var(--muted-foreground))" }}>
              <AlertTriangle size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>У вас пока нет vault'ов</p>
            </div>
          )}

          {/* Список vault'ов */}
          {mounted && (
            <div className={styles.positionsContainer}>
              {vaults.map((vaultAddress, index) => (
                <div key={vaultAddress}>
                  <VaultLogger vaultAddress={vaultAddress} index={index} />
                  <VaultCard vaultAddress={vaultAddress} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* Создать vault */}
          {mounted && isConnected && <CreateVaultButton />}
        </CardContent>
      </Card>
    </>
  )
}
