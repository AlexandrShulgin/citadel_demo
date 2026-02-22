"use client"

import { Shield, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Button } from "@/components/ui/button/button"
import { PositionOverview } from "@/components/position-overview/position-overview"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import styles from "./page.module.css"

// ──────────────────────────────────────────────────────────────
// Кнопка подключения / отключения кошелька
// ──────────────────────────────────────────────────────────────

function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <Button
        className={styles.settingsButton}
        variant="outline"
        onClick={() => disconnect()}
      >
        <img src="/base.png" alt="Base" className={styles.arbitrumIcon}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        {address.slice(0, 6)}…{address.slice(-4)}
      </Button>
    )
  }

  // Предпочитаем injected (MetaMask) или первый доступный коннектор
  const connector =
    connectors.find((c) => c.id === "injected") ??
    connectors.find((c) => c.id === "metaMask") ??
    connectors[0]

  return (
    <Button
      className={styles.settingsButton}
      onClick={() => connector && connect({ connector })}
      disabled={isPending || !connector}
    >
      <img src="/base.png" alt="Base" className={styles.arbitrumIcon}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
      />
      {isPending ? "Подключение…" : "CONNECT WALLET"}
    </Button>
  )
}

// ──────────────────────────────────────────────────────────────
// Страница
// ──────────────────────────────────────────────────────────────

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContent}`}>
          <div className={styles.headerInner}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoIcon}>
                <Shield className={styles.shieldIcon} />
              </div>
              <div>
                <h1 className={styles.logoTitle}>Citadel Protocol</h1>
                <p className={styles.logoSubTitle}>AAVE V3 Liquidation Protection · Base</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className={`${styles.container} ${styles.main}`}>
        {/* Alert Banner */}
        {isConnected && (
          <div className={styles.alertBanner}>
            <div className={styles.alertContent}>
              <Zap className={styles.alertIcon} />
              <div>
                <h3 className={styles.alertTitle}>Protection Active</h3>
                <p className={styles.alertDescription}>
                  Your positions are being monitored in real-time on Base mainnet.
                  Automatic protection triggers when health factor drops below your threshold.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Position Overview */}
          <div className={styles.overviewContainer}>
            <PositionOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
