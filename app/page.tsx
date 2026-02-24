"use client"

import { Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { PositionOverview } from "@/components/position-overview/position-overview"
import { ConnectKitButton } from "connectkit"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import styles from "./page.module.css"

// Предотвращаем hydration mismatch —
// wagmi восстанавливает состояние кошелька только на клиенте
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}


function WalletButton() {
  const mounted = useMounted()

  if (!mounted) {
    return (
      <Button className={styles.settingsButton} disabled>
        CONNECT WALLET
      </Button>
    )
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName }) => {
        if (isConnected) {
          return (
            <Button className={styles.settingsButton} variant="outline" onClick={show}>
              {ensName ?? (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "CONNECTED")}
            </Button>
          )
        }

        return (
          <Button
            className={styles.settingsButton}
            onClick={show}
            disabled={isConnecting}
          >
            CONNECT WALLET
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export default function Home() {
  const mounted = useMounted()
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
        {/* Main Grid */}
        <div className={styles.mainGrid}>
          <div className={styles.overviewContainer}>
            <PositionOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
