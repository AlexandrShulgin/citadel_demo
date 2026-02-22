"use client"

import { useState, useEffect } from "react"
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { useQueryClient } from "@tanstack/react-query"
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
  AAVE_POOL_ABI,
  AAVE_ORACLE_ABI,
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

  // Цены из Aave Oracle (8 decimals)
  const { data: ethPrice, error: ethPriceError } = useReadContract({
    chainId: base.id, address: ADDRESSES.AaveOracle, abi: AAVE_ORACLE_ABI, functionName: "getAssetPrice", args: [ADDRESSES.WETH]
  })
  const { data: usdcPrice, error: usdcPriceError } = useReadContract({
    chainId: base.id, address: ADDRESSES.AaveOracle, abi: AAVE_ORACLE_ABI, functionName: "getAssetPrice", args: [ADDRESSES.USDC]
  })

  // Читаем балансы (collateral и debt) напрямую через balanceOf на токенах
  const { data: aWETHBalance } = useReadContract({
    chainId: base.id, address: ADDRESSES.aWETH, abi: ERC20_ABI, functionName: "balanceOf", args: [vaultAddress]
  })
  const { data: vWETHBalance } = useReadContract({
    chainId: base.id, address: ADDRESSES.vWETH, abi: ERC20_ABI, functionName: "balanceOf", args: [vaultAddress]
  })
  const { data: aUSDCBalance } = useReadContract({
    chainId: base.id, address: ADDRESSES.aUSDC, abi: ERC20_ABI, functionName: "balanceOf", args: [vaultAddress]
  })
  const { data: vUSDCBalance } = useReadContract({
    chainId: base.id, address: ADDRESSES.vUSDC, abi: ERC20_ABI, functionName: "balanceOf", args: [vaultAddress]
  })

  // Прямой запрос к Aave Pool — показывает суммарный collateral и debt (в USD, 8 decimals)
  const { data: aaveAccount } = useReadContract({
    chainId: base.id,
    address: ADDRESSES.AavePool,
    abi: AAVE_POOL_ABI,
    functionName: "getUserAccountData",
    args: [vaultAddress],
  })
  const { data: warningHF } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "warningHF" })
  const { data: targetHF } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "targetHF" })
  const { data: paused } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "paused" })
  const { data: needsProtection } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "needsProtection" })
  const { data: owner } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "owner" })
  const { data: rewardBps } = useReadContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "rewardBps" })

  useEffect(() => {
    if (hf === undefined) return

    if (ethPriceError) console.error("[Citadel] ethPriceError:", ethPriceError)
    if (usdcPriceError) console.error("[Citadel] usdcPriceError:", usdcPriceError)
    console.log("[Citadel] Raw Oracle ETH Price:", String(ethPrice))
    console.log("[Citadel] Raw Oracle USDC Price:", String(usdcPrice))

    const hfNum = hf === maxUint256 ? Infinity : Number(formatUnits(hf as bigint, 18))
    const ethPriceNum = ethPrice ? Number(formatUnits(ethPrice as bigint, 8)) : 0
    const usdcPriceNum = usdcPrice ? Number(formatUnits(usdcPrice as bigint, 8)) : 0

    const ethCollateral = aWETHBalance ? Number(formatUnits(aWETHBalance as bigint, 18)) : 0
    const ethDebt = vWETHBalance ? Number(formatUnits(vWETHBalance as bigint, 18)) : 0
    const usdcCollateral = aUSDCBalance ? Number(formatUnits(aUSDCBalance as bigint, 6)) : 0
    const usdcDebt = vUSDCBalance ? Number(formatUnits(vUSDCBalance as bigint, 6)) : 0

    const ethCollateralUSD = ethCollateral * ethPriceNum
    const ethDebtUSD = ethDebt * ethPriceNum
    const usdcCollateralUSD = usdcCollateral * usdcPriceNum
    const usdcDebtUSD = usdcDebt * usdcPriceNum

    console.group(`[Citadel] Vault #${index + 1}: ${vaultAddress}`)
    console.log("Owner:              ", owner)
    console.log("Status:             ", paused ? "PAUSED" : (needsProtection ? "⚠ NEEDS PROTECTION" : "ACTIVE"))
    console.log("Health Factor:      ", hfNum === Infinity ? "∞ (no debt)" : hfNum.toFixed(6))
    console.log("Warning HF:         ", warningHF ? Number(formatUnits(warningHF as bigint, 18)).toFixed(2) : "—")
    console.log("Target HF:          ", targetHF ? Number(formatUnits(targetHF as bigint, 18)).toFixed(2) : "—")

    console.log("── Aave Account Summary (USD) ───────────────")
    if (aaveAccount) {
      const acc = aaveAccount as unknown as readonly [bigint, bigint, bigint, bigint, bigint, bigint]
      console.log("Total Collateral:   ", Number(formatUnits(acc[0], 8)).toFixed(2), "USD")
      console.log("Total Debt:         ", Number(formatUnits(acc[1], 8)).toFixed(2), "USD")
      console.log("Available Borrows:  ", Number(formatUnits(acc[2], 8)).toFixed(2), "USD")
      console.log("Liquidation Threshold:", Number(acc[3]) / 100, "%")
      console.log("LTV:                ", Number(acc[4]) / 100, "%")
      console.log("Health Factor (Aave):", acc[5] === maxUint256 ? "∞" : Number(formatUnits(acc[5], 18)).toFixed(4))
    }

    console.log("── Collateral Breakdown ──────────────────────")
    if (ethCollateral > 0) {
      console.log(`WETH:  ${ethCollateral.toFixed(6)} WETH (~${ethCollateralUSD.toFixed(2)} USD)`)
    }
    if (usdcCollateral > 0) {
      console.log(`USDC:  ${usdcCollateral.toFixed(2)} USDC (~${usdcCollateralUSD.toFixed(2)} USD)`)
    }
    console.log("Total Collateral USD (sum):", (ethCollateralUSD + usdcCollateralUSD).toFixed(2))

    console.log("── Debt Breakdown ────────────────────────────")
    if (ethDebt > 0) {
      console.log(`WETH:  ${ethDebt.toFixed(6)} WETH (~${ethDebtUSD.toFixed(2)} USD)`)
    }
    if (usdcDebt > 0) {
      console.log(`USDC:  ${usdcDebt.toFixed(2)} USDC (~${usdcDebtUSD.toFixed(2)} USD)`)
    }
    console.log("Total Debt USD (sum):      ", (ethDebtUSD + usdcDebtUSD).toFixed(2))

    console.log("── Prices ────────────────────────────────────")
    console.log("ETH Price:          ", ethPriceNum.toFixed(2), "USD")
    console.log("USDC Price:         ", usdcPriceNum.toFixed(4), "USD")

    console.log("Reward BPS:         ", rewardBps ? Number(rewardBps).toString() + " bps" : "—")
    console.groupEnd()
  }, [hf, ethPrice, usdcPrice, aWETHBalance, vWETHBalance, aUSDCBalance, vUSDCBalance, aaveAccount, warningHF, targetHF, paused, needsProtection, owner, rewardBps, vaultAddress, index])

  return null
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
  const [warningSliderHF, setWarningSliderHF] = useState(1.2)
  const [targetSliderHF, setTargetSliderHF] = useState(1.5)

  const { writeContract, data: txHash, isPending: isTxPending, reset: resetTx } = useWriteContract()
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // Состояние для выпадающего меню действий
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | "borrow" | "repay" | null>(null)

  // Цены из Aave Oracle (8 decimals)
  const { data: ethPrice } = useReadContract({
    chainId: base.id, address: ADDRESSES.AaveOracle, abi: AAVE_ORACLE_ABI, functionName: "getAssetPrice", args: [ADDRESSES.WETH]
  })
  const { data: usdcPrice } = useReadContract({
    chainId: base.id, address: ADDRESSES.AaveOracle, abi: AAVE_ORACLE_ABI, functionName: "getAssetPrice", args: [ADDRESSES.USDC]
  })

  const ethPriceNum = ethPrice ? Number(formatUnits(ethPrice as bigint, 8)) : 0
  const usdcPriceNum = usdcPrice ? Number(formatUnits(usdcPrice as bigint, 8)) : 0

  // Чтение данных vault
  const { data: healthFactorRaw, refetch: refetchHF } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "getHealthFactor",
  })

  const { data: aWETHBalance, refetch: refetchSupply } = useReadContract({
    chainId: base.id,
    address: ADDRESSES.aWETH,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [vaultAddress],
  })

  const { data: vUSDCBalance, refetch: refetchBorrow } = useReadContract({
    chainId: base.id,
    address: ADDRESSES.vUSDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [vaultAddress],
  })

  const { data: aaveAccount, refetch: refetchAave } = useReadContract({
    chainId: base.id,
    address: ADDRESSES.AavePool,
    abi: AAVE_POOL_ABI,
    functionName: "getUserAccountData",
    args: [vaultAddress],
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

  const { data: rewardBpsRaw } = useReadContract({
    chainId: base.id,
    address: vaultAddress,
    abi: CITADEL_VAULT_ABI,
    functionName: "rewardBps",
  })

  // Данные для UI
  const healthFactor = hfToNumber(healthFactorRaw as bigint | undefined)
  const supplyBalanceWETH = aWETHBalance ? Number(formatUnits(aWETHBalance as bigint, 18)) : 0
  const debtBalanceUSDC = vUSDCBalance ? Number(formatUnits(vUSDCBalance as bigint, 6)) : 0

  const accData = aaveAccount as unknown as readonly [bigint, bigint, bigint, bigint, bigint, bigint] | undefined
  const totalCollateralUSD = accData ? Number(formatUnits(accData[0], 8)) : 0
  const totalDebtUSD = accData ? Number(formatUnits(accData[1], 8)) : 0
  const availableBorrowUSD = accData ? Number(formatUnits(accData[2], 8)) : 0
  const rewardBps = rewardBpsRaw ? Number(rewardBpsRaw) : 0

  const warningHF = hfToNumber(warningHFRaw as bigint | undefined) || 1.2
  const targetHF = hfToNumber(targetHFRaw as bigint | undefined) || 1.5

  // Синхронизируем слайдеры с данными из контракта при загрузке
  useEffect(() => {
    if (warningHFRaw) setWarningSliderHF(hfToNumber(warningHFRaw as bigint))
    if (targetHFRaw) setTargetSliderHF(hfToNumber(targetHFRaw as bigint))
  }, [warningHFRaw, targetHFRaw])

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
    refetchBorrow()
    refetchAave()
  }

  // Транзакции
  function handleApproveWETH() {
    console.log("[Citadel] handleApproveWETH", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: ADDRESSES.WETH, abi: ERC20_ABI, functionName: "approve", args: [vaultAddress, amount] })
  }

  function handleDeposit() {
    console.log("[Citadel] handleDeposit", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "deposit", args: [ADDRESSES.WETH, amount] })
  }

  function handleWithdraw() {
    console.log("[Citadel] handleWithdraw", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 18)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "withdraw", args: [ADDRESSES.WETH, amount] })
  }

  function handleBorrow() {
    console.log("[Citadel] handleBorrow", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "borrow", args: [ADDRESSES.USDC, amount] })
  }

  function handleApproveUSDC() {
    console.log("[Citadel] handleApproveUSDC", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: ADDRESSES.USDC, abi: ERC20_ABI, functionName: "approve", args: [vaultAddress, amount] })
  }

  function handleRepay() {
    console.log("[Citadel] handleRepay", { inputAmount, vaultAddress })
    if (!inputAmount) return
    const amount = parseUnits(inputAmount, 6)
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "repay", args: [ADDRESSES.USDC, amount] })
  }

  function handleAutoLoop() {
    const minHFAfter = BigInt(Math.round(targetSliderHF * 1e18))
    const data = encodeAbiParameters(
      parseAbiParameters("uint8, address, uint8, uint256, uint256"),
      [0, ADDRESSES.USDC, 3, BigInt(100), minHFAfter]
    )
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "executeFromModule", args: [ADDRESSES.LoopModule, data] })
  }

  function handleSetWarningHF() {
    const warnRaw = BigInt(Math.round(warningSliderHF * 1e18))
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "setWarningHF", args: [warnRaw] })
  }

  function handleSetTargetHF() {
    const targetRaw = BigInt(Math.round(targetSliderHF * 1e18))
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: "setTargetHF", args: [targetRaw] })
  }

  return (
    <div key={index} className={styles.positionCard}>
      {/* Заголовок */}
      <div className={styles.positionHeader}>
        <div className={styles.assetInfo}>
          <div className={styles.assetTitleWrapper}>
            <h3 className={styles.assetName}>Vault #{index + 1}</h3>
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
          <p className={styles.assetDescription}>{shortAddr(vaultAddress)}</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.actionWrapper}>
            <Button size="sm" variant="outline"
              className={`${styles.headerButton} ${activeAction === 'deposit' ? styles.activeButton : ''}`}
              onClick={() => setActiveAction(activeAction === 'deposit' ? null : 'deposit')}
              disabled={!!isPaused}
            >
              Deposit
            </Button>
            {activeAction === 'deposit' && (
              <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownInputRow}>
                  <input
                    type="number"
                    placeholder="WETH Amount"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className={styles.dropdownInput}
                  />
                  <div className={styles.amountInfo}>
                    <p className={styles.nativeAmount}>{inputAmount || "0"} WETH</p>
                    <p className={styles.usdAmount}>≈ ${(Number(inputAmount || 0) * ethPriceNum).toFixed(2)} USD</p>
                  </div>
                </div>
                <div className={styles.dropdownButtons}>
                  <Button size="sm" variant="outline" onClick={handleApproveWETH} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'deposit' ? <Loader2 size={14} className="animate-spin" /> : "APPROVE"}
                  </Button>
                  <Button size="sm" onClick={handleDeposit} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'deposit' ? <Loader2 size={14} className="animate-spin" /> : "DEPOSIT"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionWrapper}>
            <Button size="sm" variant="outline"
              className={`${styles.headerButton} ${activeAction === 'withdraw' ? styles.activeButton : ''}`}
              onClick={() => setActiveAction(activeAction === 'withdraw' ? null : 'withdraw')}
              disabled={!!isPaused}
            >
              Withdraw
            </Button>
            {activeAction === 'withdraw' && (
              <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownInputRow}>
                  <input
                    type="number"
                    placeholder="WETH Amount"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className={styles.dropdownInput}
                  />
                  <div className={styles.amountInfo}>
                    <p className={styles.nativeAmount}>{inputAmount || "0"} WETH</p>
                    <p className={styles.usdAmount}>≈ ${(Number(inputAmount || 0) * ethPriceNum).toFixed(2)} USD</p>
                  </div>
                </div>
                <div className={styles.dropdownButtons}>
                  <Button size="sm" onClick={handleWithdraw} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'withdraw' ? <Loader2 size={14} className="animate-spin" /> : "WITHDRAW"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionWrapper}>
            <Button size="sm" variant="outline"
              className={`${styles.headerButton} ${activeAction === 'borrow' ? styles.activeButton : ''}`}
              onClick={() => setActiveAction(activeAction === 'borrow' ? null : 'borrow')}
              disabled={!!isPaused}
            >
              Borrow
            </Button>
            {activeAction === 'borrow' && (
              <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownInputRow}>
                  <input
                    type="number"
                    placeholder="USDC Amount"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className={styles.dropdownInput}
                  />
                  <div className={styles.amountInfo}>
                    <p className={styles.nativeAmount}>{inputAmount || "0"} USDC</p>
                    <p className={styles.usdAmount}>≈ ${(Number(inputAmount || 0) * usdcPriceNum).toFixed(2)} USD</p>
                  </div>
                </div>
                <div className={styles.dropdownButtons}>
                  <Button size="sm" onClick={handleBorrow} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'borrow' ? <Loader2 size={14} className="animate-spin" /> : "BORROW"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionWrapper}>
            <Button size="sm" variant="outline"
              className={`${styles.headerButton} ${activeAction === 'repay' ? styles.activeButton : ''}`}
              onClick={() => setActiveAction(activeAction === 'repay' ? null : 'repay')}
              disabled={!!isPaused}
            >
              Repay
            </Button>
            {activeAction === 'repay' && (
              <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownInputRow}>
                  <input
                    type="number"
                    placeholder="USDC Amount"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className={styles.dropdownInput}
                  />
                  <div className={styles.amountInfo}>
                    <p className={styles.nativeAmount}>{inputAmount || "0"} USDC</p>
                    <p className={styles.usdAmount}>≈ ${(Number(inputAmount || 0) * usdcPriceNum).toFixed(2)} USD</p>
                  </div>
                </div>
                <div className={styles.dropdownButtons}>
                  <Button size="sm" variant="outline" onClick={handleApproveUSDC} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'repay' ? <Loader2 size={14} className="animate-spin" /> : "APPROVE"}
                  </Button>
                  <Button size="sm" onClick={handleRepay} disabled={isBusy} className={styles.dropdownActionButton}>
                    {isBusy && activeAction === 'repay' ? <Loader2 size={14} className="animate-spin" /> : "REPAY"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Метрики */}
      <div className={styles.metricsGrid}>
        <div>
          <p className={styles.metricLabel}>Collateral</p>
          <p className={styles.metricValue}>{totalCollateralUSD.toFixed(2)} USD</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Debt</p>
          <p className={styles.metricValue}>{totalDebtUSD.toFixed(2)} USD</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Health Factor</p>
          <p className={`${styles.metricValue} ${hfColor}`}>{hfDisplay}</p>
          <p className={styles.metricLabel}>Current</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Status</p>
          <p className={`${styles.metricValue} ${isHealthy ? styles.statusHealthy : styles.statusMonitor}`}>
            {needsProtectionRaw ? "⚠ Protect" : isHealthy ? "Healthy" : "Monitor"}
          </p>
          <p className={styles.metricLabel}>Active</p>
        </div>
      </div>
      <div className={styles.metricsGrid}>
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
          <p className={styles.metricLabel}>Available to Borrow</p>
          <p className={styles.metricValue}>{availableBorrowUSD.toFixed(2)} USD</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Reward BPS</p>
          <p className={styles.metricValue}>{rewardBps}</p>
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
              <span className={styles.metricLabel}>Warning Health Factor</span>
              <span className={styles.hfValue}>{warningSliderHF.toFixed(1)}</span>
            </div>
            <Slider
              value={[warningSliderHF]}
              onValueChange={(v) => setWarningSliderHF(v[0])}
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
        <div className={styles.controlsRow} style={{ marginTop: '1rem' }}>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderRow}>
              <span className={styles.metricLabel}>Target Health Factor</span>
              <span className={styles.hfValue}>{targetSliderHF.toFixed(1)}</span>
            </div>
            <Slider
              value={[targetSliderHF]}
              onValueChange={(v) => setTargetSliderHF(v[0])}
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
            onClick={handleSetTargetHF} disabled={isBusy}>
            {isBusy ? <Loader2 size={14} className="animate-spin" /> : "SET TARGET HF"}
          </Button>
        </div>

        <p className={styles.autoProtectNote}>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP"}
            </Button>
          </div>
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
  const queryClient = useQueryClient()

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

  const vaults = ((vaultAddresses as `0x${string}`[] | undefined) ?? []).slice(0, 1)

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
          <div className={styles.headerTitleRow}>
            <CardTitle className={styles.title}>Position Overview</CardTitle>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={() => queryClient.invalidateQueries()} title="Обновить">
              <RefreshCw size={14} />
            </Button>
          </div>
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
