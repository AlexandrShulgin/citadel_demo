"use client"

import { useState, useEffect } from "react"
import {
  useAccount,
  useReadContract,
  useReadContracts,
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
import aaveAssetsRaw from "@/lib/aave-base-assets.json"
import { useMemo } from "react"
import { ChevronDown, ChevronRight, ArrowDownUp } from "lucide-react"
import { toast } from "sonner"

export type AaveSymbol = keyof typeof aaveAssetsRaw;
export interface AaveAsset {
  symbol: AaveSymbol;
  underlying: `0x${string}`;
  aToken: `0x${string}`;
  vToken?: `0x${string}`;
}
export const AAVE_ASSETS: AaveAsset[] = Object.entries(aaveAssetsRaw).map(([symbol, data]) => ({
  symbol: symbol as AaveSymbol,
  underlying: data.underlying as `0x${string}`,
  aToken: data.aToken as `0x${string}`,
  vToken: (data as any).vToken as `0x${string}` | undefined,
}));

export interface ParsedAsset extends AaveAsset {
  decimals: number;
  price: number;
  wallet: number;
  walletUSD: number;
  collateral: number;
  collateralUSD: number;
  debt: number;
  debtUSD: number;
}

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
// Карточка одного Vault
// ──────────────────────────────────────────────────────────────

interface VaultCardProps {
  vaultAddress: `0x${string}`
  index: number
}

function VaultCard({ vaultAddress, index }: VaultCardProps) {
  const { address } = useAccount()
  const [actionModal, setActionModal] = useState<{ type: "deposit" | "withdraw" | "borrow" | "repay", defaultAsset?: AaveSymbol } | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [warningSliderHF, setWarningSliderHF] = useState(1.2)
  const [targetSliderHF, setTargetSliderHF] = useState(1.5)

  const { writeContract, data: txHash, isPending: isTxPending, error: txError } = useWriteContract()
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txError) toast.error("Transaction failed", { description: txError.message })
  }, [txError])

  // Уведомление об успехе транзакции перенесено ниже, чтобы иметь доступ к функциям обновления данных

  // 1. Формируем массив вызовов для multicall
  const baseCalls = useMemo(() => {
    const calls: any[] = []
    AAVE_ASSETS.forEach(asset => {
      // 0: Цена
      calls.push({ chainId: base.id, address: ADDRESSES.AaveOracle, abi: AAVE_ORACLE_ABI, functionName: 'getAssetPrice', args: [asset.underlying] })
      // 1: Decimals
      calls.push({ chainId: base.id, address: asset.underlying, abi: ERC20_ABI, functionName: 'decimals' })
      // 2: Баланс кошелька
      if (address) {
        calls.push({ chainId: base.id, address: asset.underlying, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] })
      } else {
        calls.push({ chainId: base.id, address: asset.underlying, abi: ERC20_ABI, functionName: 'decimals' }) // Заглушка, если нет кошелька
      }
      // 3: aToken (Collateral) баланс Vault'а
      calls.push({ chainId: base.id, address: asset.aToken, abi: ERC20_ABI, functionName: 'balanceOf', args: [vaultAddress] })
      // 4: vToken (Debt) баланс Vault'а
      if (asset.vToken) {
        calls.push({ chainId: base.id, address: asset.vToken, abi: ERC20_ABI, functionName: 'balanceOf', args: [vaultAddress] })
      } else {
        calls.push({ chainId: base.id, address: asset.underlying, abi: ERC20_ABI, functionName: 'decimals' }) // Заглушка
      }
    })
    return calls
  }, [vaultAddress, address])

  const { data: results, refetch: refetchAssets } = useReadContracts({
    contracts: baseCalls,
  })

  // 2. Парсим результаты multicall
  const parsedAssets = useMemo<ParsedAsset[]>(() => {
    if (!results) return []
    return AAVE_ASSETS.map((asset, i) => {
      const idx = i * 5
      const priceRaw = results[idx]?.result as bigint | undefined
      const decimals = (results[idx + 1]?.result as number) || 18

      const walletRaw = results[idx + 2]?.result as bigint | undefined
      const aTokenRaw = results[idx + 3]?.result as bigint | undefined
      const vTokenRaw = asset.vToken ? (results[idx + 4]?.result as bigint | undefined) : 0n

      const price = priceRaw ? Number(formatUnits(priceRaw, 8)) : 0
      const wallet = walletRaw && address ? Number(formatUnits(walletRaw, decimals)) : 0
      const collateral = aTokenRaw ? Number(formatUnits(aTokenRaw, decimals)) : 0
      const debt = vTokenRaw ? Number(formatUnits(vTokenRaw, decimals)) : 0

      return {
        ...asset,
        decimals,
        price,
        wallet,
        walletUSD: wallet * price,
        collateral,
        collateralUSD: collateral * price,
        debt,
        debtUSD: debt * price
      }
    })
  }, [results, address])

  // 3. Данные самого Vault
  const { data: vaultData, refetch: refetchVault } = useReadContracts({
    contracts: [
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'getHealthFactor' },
      { chainId: base.id, address: ADDRESSES.AavePool, abi: AAVE_POOL_ABI, functionName: 'getUserAccountData', args: [vaultAddress] },
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'warningHF' },
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'targetHF' },
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'paused' },
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'needsProtection' },
      { chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: 'rewardBps' },
    ]
  })

  useEffect(() => {
    if (isTxSuccess) {
      toast.success("Transaction confirmed", { description: "Your transaction was confirmed successfully." })
      refetchVault()
      refetchAssets()
    }
  }, [isTxSuccess, refetchVault, refetchAssets])

  const healthFactorRaw = vaultData?.[0]?.result as bigint | undefined
  const aaveAccount = vaultData?.[1]?.result as readonly [bigint, bigint, bigint, bigint, bigint, bigint] | undefined
  const warningHFRaw = vaultData?.[2]?.result as bigint | undefined
  const targetHFRaw = vaultData?.[3]?.result as bigint | undefined
  const isPaused = vaultData?.[4]?.result as boolean | undefined
  const needsProtectionRaw = vaultData?.[5]?.result as boolean | undefined
  const rewardBpsRaw = vaultData?.[6]?.result as bigint | undefined

  // Данные для UI
  const healthFactor = hfToNumber(healthFactorRaw)

  // Aave Account Metrics:
  const totalCollateralUSD = aaveAccount ? Number(formatUnits(aaveAccount[0], 8)) : 0
  const totalDebtUSD = aaveAccount ? Number(formatUnits(aaveAccount[1], 8)) : 0
  const availableBorrowUSD = aaveAccount ? Number(formatUnits(aaveAccount[2], 8)) : 0
  const ltv = aaveAccount ? Number(aaveAccount[4]) / 100 : 0
  const rewardBps = rewardBpsRaw ? Number(rewardBpsRaw) : 0

  const warningHF = hfToNumber(warningHFRaw) || 1.2
  const targetHF = hfToNumber(targetHFRaw) || 1.5

  useEffect(() => {
    if (warningHFRaw) setWarningSliderHF(hfToNumber(warningHFRaw))
    if (targetHFRaw) setTargetSliderHF(hfToNumber(targetHFRaw))
  }, [warningHFRaw, targetHFRaw])

  const isHealthy = healthFactor === 999 || healthFactor >= 1.5
  const isBusy = isTxPending || isTxConfirming

  const hfColor =
    healthFactor >= 1.5 ? styles.statusHealthy :
      healthFactor >= 1.2 ? styles.statusMonitor :
        styles.ltvValueWarning

  const hfDisplay = healthFactor === 999 ? "∞" : healthFactor.toFixed(2)

  // Транзакции защиты
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
            <h3 className={styles.assetName}>Vault {shortAddr(vaultAddress)}</h3>
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
        </div>

        <div className={styles.headerActions}>
          <Button size="sm" variant="outline" className={styles.headerButton} onClick={() => setActionModal({ type: 'deposit' })} disabled={!!isPaused}>
            Deposit
          </Button>
          {totalCollateralUSD > 0 && (
            <>
              <Button size="sm" variant="outline" className={styles.headerButton} onClick={() => setActionModal({ type: 'withdraw' })} disabled={!!isPaused}>
                Withdraw
              </Button>
              <Button size="sm" variant="outline" className={styles.headerButton} onClick={() => setActionModal({ type: 'borrow' })} disabled={!!isPaused}>
                Borrow
              </Button>
            </>
          )}
          {totalDebtUSD > 0 && (
            <Button size="sm" variant="outline" className={styles.headerButton} onClick={() => setActionModal({ type: 'repay' })} disabled={!!isPaused}>
              Repay
            </Button>
          )}
        </div>
      </div>

      {/* Метрики */}
      <div className={styles.metricsGrid}>
        <div>
          <p className={styles.metricLabel}>Collateral</p>
          <p className={styles.metricValue}>{totalCollateralUSD.toFixed(2)} USD</p>
          <div className={styles.detailsArrowBtn} onClick={() => setDetailsModalOpen(true)}>
            View details
          </div>
        </div>
        <div>
          <p className={styles.metricLabel}>Debt</p>
          <p className={styles.metricValue}>{totalDebtUSD.toFixed(2)} USD</p>
          <div className={styles.detailsArrowBtn} onClick={() => setDetailsModalOpen(true)}>
            View details
          </div>
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
          <p className={styles.metricLabel}>LTV</p>
          <p className={styles.metricValue}>{ltv.toFixed(2)}%</p>
          <p className={styles.metricLabel}>Max</p>
        </div>
      </div>

      {/* Protection box */}
      <div className={styles.protectionBox}>
        <div className={styles.protectionHeader}>
          <Shield className={styles.shieldIcon} />
          <Label className={styles.protectionLabel}>Protection Threshold (Warning HF)</Label>
        </div>
        <div className={styles.controlsRow} >
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
        <div className={styles.controlsRow} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
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

        {/* <p className={styles.autoProtectNote}>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" className={styles.headerButton}
              onClick={handleAutoLoop} disabled={isBusy || !!isPaused}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "AUTO LOOP (WETH -> USDC)"}
            </Button>
          </div>
        </p> */}

      </div>

      {actionModal && (
        <ActionModal
          type={actionModal.type}
          defaultAsset={actionModal.defaultAsset}
          assets={parsedAssets}
          vaultAddress={vaultAddress}
          onClose={() => setActionModal(null)}
          refetch={() => { refetchAssets(); refetchVault() }}
        />
      )}

      {
        detailsModalOpen && (
          <AssetDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            assets={parsedAssets}
            onOpenAction={(type, symbol) => {
              setDetailsModalOpen(false);
              setActionModal({ type, defaultAsset: symbol });
            }}
          />
        )
      }
    </div >
  )
}

// ──────────────────────────────────────────────────────────────
// Модалки
// ──────────────────────────────────────────────────────────────

function ActionModal({
  type,
  defaultAsset,
  assets,
  vaultAddress,
  onClose,
  refetch
}: {
  type: "deposit" | "withdraw" | "borrow" | "repay",
  defaultAsset?: AaveSymbol,
  assets: ParsedAsset[],
  vaultAddress: `0x${string}`,
  onClose: () => void,
  refetch: () => void
}) {
  const defaultSymbol = defaultAsset || ((type === 'borrow' || type === 'repay') ? "USDC" : "WETH");
  const [selectedSymbol, setSelectedSymbol] = useState<AaveSymbol>(defaultSymbol);
  const [amount, setAmount] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash: txHash });
  const isBusy = isPending || isConfirming;

  useEffect(() => {
    if (writeError) toast.error("Transaction failed", { description: writeError.message });
  }, [writeError]);

  useEffect(() => {
    if (receiptError) toast.error("Transaction failed", { description: receiptError.message });
  }, [receiptError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction confirmed", { description: `Successfully executed ${type}` });
      setAmount("");
      refetch();
    }
  }, [isSuccess, refetch, type]);

  const handlePercent = (pct: number) => {
    if (!selectedAsset) return;
    let maxVal = 0;
    if (type === 'deposit') maxVal = selectedAsset.wallet;
    if (type === 'withdraw') maxVal = selectedAsset.collateral;
    if (type === 'repay') maxVal = selectedAsset.debt;
    if (type === 'borrow') return; // Maximum borrow is complex to calculate locally

    if (maxVal === 0) return;

    if (pct === 100) {
      setAmount(maxVal.toString());
    } else {
      setAmount((maxVal * pct / 100).toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const shouldShowAsset = (a: ParsedAsset) => {
    switch (type) {
      case "deposit": return true; // Show all Aave assets for deposit
      case "withdraw": return a.collateral > 0;
      case "borrow": return !!a.vToken;
      case "repay": return a.debt > 0;
    }
  };

  const isAssetEnabled = (a: ParsedAsset) => {
    switch (type) {
      case "deposit": return a.wallet > 0;
      case "withdraw": return a.collateral > 0;
      case "borrow": return !!a.vToken;
      case "repay": return a.debt > 0;
    }
  };

  const visibleAssets = assets.filter(shouldShowAsset);

  // If the default selected asset was filtered out, select the first enabled one
  useEffect(() => {
    if (visibleAssets.length > 0 && !visibleAssets.find(a => a.symbol === selectedSymbol)) {
      const firstEnabled = visibleAssets.find(isAssetEnabled) || visibleAssets[0];
      setSelectedSymbol(firstEnabled.symbol);
    }
  }, [visibleAssets, selectedSymbol, type]);

  const selectedAsset = assets.find(a => a.symbol === selectedSymbol);

  if (!selectedAsset) return null;

  const getBalanceLabel = (a: ParsedAsset) => {
    switch (type) {
      case "deposit": return `Wallet: ${a.wallet.toFixed(6)}`;
      case "withdraw": return `Vault: ${a.collateral.toFixed(6)}`;
      case "borrow": return a.vToken ? `Price: $${a.price.toFixed(2)}` : 'Not available';
      case "repay": return `Debt: ${a.debt.toFixed(6)}`;
    }
  };

  const handleApprove = () => {
    if (!amount) return;
    const val = parseUnits(amount, selectedAsset.decimals);
    writeContract({ chainId: base.id, address: selectedAsset.underlying, abi: ERC20_ABI, functionName: "approve", args: [vaultAddress, val] });
  };

  const handleAction = () => {
    if (!amount) return;
    const val = parseUnits(amount, selectedAsset.decimals);
    writeContract({ chainId: base.id, address: vaultAddress, abi: CITADEL_VAULT_ABI, functionName: type, args: [selectedAsset.underlying, val] });
  };

  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Dialog isOpen={true} onClose={onClose} title={`${title} Asset`} size="sm">
      <div>

        {/* Кастомный Select */}
        <div className={styles.customSelectContainer}>
          <label className={styles.metricLabel}>Select Asset</label>
          <div className={styles.customSelectHeader} onClick={() => setIsSelectOpen(!isSelectOpen)}>
            <div className={styles.selectHeaderLeft}>
              <span className={styles.selectSymbol}>{selectedAsset.symbol}</span>
              <span className={styles.selectBalance}>{getBalanceLabel(selectedAsset)}</span>
            </div>
            <ChevronDown size={16} />
          </div>

          {isSelectOpen && (
            <div className={styles.customSelectDropdown}>
              {visibleAssets.map(a => {
                const enabled = isAssetEnabled(a);
                return (
                  <div
                    key={a.symbol}
                    className={`${styles.selectItem} ${!enabled ? styles.selectItemDisabled : ''}`}
                    onClick={() => {
                      if (enabled) {
                        setSelectedSymbol(a.symbol);
                        setIsSelectOpen(false);
                      }
                    }}
                  >
                    <div className={styles.selectHeaderLeft}>
                      <span className={styles.selectSymbol}>{a.symbol}</span>
                      <span className={styles.selectBalance}>{getBalanceLabel(a)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.inputContainer} style={{ marginTop: '1rem' }}>
          <label className={styles.metricLabel}>Amount</label>
          <input
            type="number"
            placeholder={`0.00`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.modalInput}
          />
          <p className={styles.usdAmountPreview}>
            ≈ ${(Number(amount || 0) * selectedAsset.price).toFixed(2)} USD
          </p>
          {type !== 'borrow' && (
            <div className={styles.percentBtnContainer}>
              {[25, 50, 75, 100].map(pct => (
                <button key={pct} onClick={() => handlePercent(pct)} className={styles.percentBtn}>
                  {pct === 100 ? 'MAX' : `${pct}%`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalActions} style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
          {(type === "deposit" || type === "repay") && (
            <Button size="sm" variant="outline" onClick={handleApprove} disabled={isBusy || !amount} className={styles.protectionButtonOutline} style={{ flex: 1, minWidth: 0 }}>
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : "APPROVE"}
            </Button>
          )}
          <Button size="sm" variant="default" onClick={handleAction} disabled={isBusy || !amount} className={styles.protectionButton} style={{ flex: 1, minWidth: 0 }}>
            {isBusy ? <Loader2 size={14} className="animate-spin" /> : `${type.toUpperCase()}`}
          </Button>
        </div>      </div>
    </Dialog>
  );
}

function AssetDetailsModal({ isOpen, onClose, assets, onOpenAction }: { isOpen: boolean, onClose: () => void, assets: ParsedAsset[], onOpenAction: (type: "withdraw" | "repay", symbol: AaveSymbol) => void }) {
  const supplyAssets = assets.filter(a => a.collateral > 0);
  const borrowAssets = assets.filter(a => a.debt > 0);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Asset Details" size="xl">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

        {/* Supplies */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '1rem' }}>Your supplies</h3>
          <div className={styles.modalTableContainer} style={{ maxHeight: '350px' }}>
            <table className={styles.assetTable}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
                  <th>USD Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {supplyAssets.map(a => (
                  <tr key={a.symbol}>
                    <td className={styles.tableAssetCol}>
                      <span className={styles.tableSymbol}>{a.symbol}</span>
                      <span className={styles.tablePrice}>${a.price.toFixed(2)}</span>
                    </td>
                    <td>{a.collateral.toFixed(6)}</td>
                    <td>${a.collateralUSD.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button size="sm" variant="outline" onClick={() => onOpenAction("withdraw", a.symbol)} className={styles.headerButton}>
                        Withdraw
                      </Button>
                    </td>
                  </tr>
                ))}
                {supplyAssets.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "gray" }}>Nothing supplied</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Borrows */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '1rem' }}>Your borrows</h3>
          <div className={styles.modalTableContainer} style={{ maxHeight: '350px' }}>
            <table className={styles.assetTable}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Debt</th>
                  <th>USD Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {borrowAssets.map(a => (
                  <tr key={a.symbol}>
                    <td className={styles.tableAssetCol}>
                      <span className={styles.tableSymbol}>{a.symbol}</span>
                      <span className={styles.tablePrice}>${a.price.toFixed(2)}</span>
                    </td>
                    <td>{a.debt.toFixed(6)}</td>
                    <td>${a.debtUSD.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button size="sm" variant="outline" onClick={() => onOpenAction("repay", a.symbol)} className={styles.headerButton}>
                        Repay
                      </Button>
                    </td>
                  </tr>
                ))}
                {borrowAssets.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "gray" }}>Nothing borrowed</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Dialog>
  )
}


// ──────────────────────────────────────────────────────────────
// Компонент создания нового Vault
// ──────────────────────────────────────────────────────────────

function CreateVaultButton() {
  const queryClient = useQueryClient()
  const [warningHF, setWarningHF] = useState(1.2)
  const [targetHF, setTargetHF] = useState(1.5)
  const { writeContract, isPending, data: txHash, error: txError } = useWriteContract()
  const { isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txError) toast.error("Transaction failed", { description: txError.message })
    if (receiptError) toast.error("Transaction failed", { description: receiptError.message })
  }, [txError, receiptError])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Vault successfully created")
      queryClient.invalidateQueries()
    }
  }, [isSuccess, queryClient])

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
    <div className={styles.positionCard} style={{ marginBottom: '1.5rem' }}>
      <div className={styles.positionHeader}>
        <div className={styles.assetInfo}>
          <div className={styles.assetTitleWrapper}>
            <h3 className={styles.assetName}>Create a New Vault</h3>
          </div>
          <p className={styles.assetDescription}>Deploy a new Citadel vault to manage your positions</p>
        </div>
      </div>

      <div className={styles.protectionBox}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem', marginBottom: '1rem' }}>

          {/* Warning HF Slider */}
          <div className={styles.sliderWrapper} style={{ flex: 1, minWidth: '200px' }}>
            <div className={styles.sliderRow}>
              <span className={styles.metricLabel}>Warning Health Factor</span>
              <span className={styles.hfValue}>{warningHF.toFixed(1)}</span>
            </div>
            <Slider value={[warningHF]} onValueChange={(v) => setWarningHF(v[0])}
              min={1.1} max={2.0} step={0.1} className={styles.slider} />
            <div className={styles.sliderLabels}>
              <span>1.1</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Target HF Slider */}
          <div className={styles.sliderWrapper} style={{ flex: 1, minWidth: '200px' }}>
            <div className={styles.sliderRow}>
              <span className={styles.metricLabel}>Target Health Factor</span>
              <span className={styles.hfValue}>{targetHF.toFixed(1)}</span>
            </div>
            <Slider value={[targetHF]} onValueChange={(v) => setTargetHF(v[0])}
              min={1.2} max={2.5} step={0.1} className={styles.slider} />
            <div className={styles.sliderLabels}>
              <span>1.2</span>
              <span>2.5</span>
            </div>
          </div>

          {/* Create Button */}
          <Button size="sm" onClick={handleCreate} disabled={isPending} style={{ width: '200px', background: 'hsl(var(--primary))', color: '#fff', border: 'none', minWidth: '8.5rem', height: '1.75rem', fontWeight: 500, fontSize: '0.75rem', fontFamily: "'Berkeley Mono', monospace" }}>
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "CREATE VAULT"}
          </Button>

        </div>
      </div>
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    queryClient.invalidateQueries()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

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

  const vaults = [...((vaultAddresses as `0x${string}`[] | undefined) ?? [])].reverse()

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
              onClick={handleRefresh} title="Refresh">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
          </div>
          <CardDescription>
            {mounted && isConnected
              ? `Your vaults on Base mainnet · ${shortAddr(address!)}`
              : "Connect wallet to view positions"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* До монтирования — нейтральный placeholder */}
          {!mounted && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "hsl(var(--muted-foreground))" }}>
              <Shield size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Connect wallet to view positions</p>
              <div style={{ maxWidth: '500px', margin: '24px auto 0', fontSize: '0.875rem', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))', opacity: 0.8 }}>
                <p><strong>Citadel Protocol</strong> is your automated protection layer on Aave V3. Each vault acts as an isolated account.</p>
                <p style={{ marginTop: '8px' }}>You can set custom <strong>Warning</strong> and <strong>Target Health Factors</strong>. When the market drops and your HF hits the Warning level, our smart contracts will automatically execute a flash loan to repay debt and rebalance your position back to the Target HF, preventing liquidations.</p>
              </div>
            </div>
          )}

          {/* После монтирования — реальный UI */}
          {mounted && !isConnected && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "hsl(var(--muted-foreground))" }}>
              <Shield size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Connect wallet to see your vaults</p>
              <div style={{ maxWidth: '500px', margin: '24px auto 0', fontSize: '0.875rem', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))', opacity: 0.8 }}>
                <p><strong>Citadel Protocol</strong> is your automated protection layer on Aave V3. Each vault acts as an isolated account.</p>
                <p style={{ marginTop: '8px' }}>You can set custom <strong>Warning</strong> and <strong>Target Health Factors</strong>. When the market drops and your HF hits the Warning level, our smart contracts will automatically execute a flash loan to repay debt and rebalance your position back to the Target HF, preventing liquidations.</p>
              </div>
            </div>
          )}

          {mounted && isConnected && (isLoadingVaults || isRefreshing) && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "hsl(var(--primary))" }} />
              <p className={styles.metricLabel}>Loading vaults...</p>
            </div>
          )}

          {/* Создать vault */}
          {mounted && isConnected && <CreateVaultButton />}

          {mounted && isConnected && !isLoadingVaults && !isRefreshing && vaults.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: "hsl(var(--muted-foreground))" }}>
              <AlertTriangle size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>You don't have any vaults yet</p>
              <div style={{ maxWidth: '500px', margin: '24px auto 0', fontSize: '0.875rem', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))', opacity: 0.8 }}>
                <p><strong>Citadel Protocol</strong> is your automated protection layer on Aave V3. Each vault acts as an isolated account.</p>
                <p style={{ marginTop: '8px' }}>You can set custom <strong>Warning</strong> and <strong>Target Health Factors</strong>. When the market drops and your HF hits the Warning level, our smart contracts will automatically execute a flash loan to repay debt and rebalance your position back to the Target HF, preventing liquidations.</p>
              </div>
            </div>
          )}

          {/* Список vault'ов */}
          {mounted && !isRefreshing && (
            <div className={styles.positionsContainer}>
              {vaults.map((vaultAddress, index) => (
                <div key={vaultAddress}>
                  <VaultCard vaultAddress={vaultAddress} index={index} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
