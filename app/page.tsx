"use client"

import { Shield, TrendingUp, Settings, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { PositionOverview } from "@/components/position-overview/position-overview"
import { useState, useEffect } from "react"
import styles from "./page.module.css"

export default function Home() {
  const [tvl, setTvl] = useState(2400000)
  const [assetsProtected, setAssetsProtected] = useState(1800000)
  const [vaults, setVaults] = useState(127)

  useEffect(() => {
    const interval = setInterval(() => {
      setTvl((prev) => prev + Math.floor(Math.random() * 1000))
      setAssetsProtected((prev) => prev + Math.floor(Math.random() * 500))
      setVaults((prev) => (Math.floor(Math.random() * 3) === 0 ? prev + 1 : prev))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
                <p className={styles.logoSubTitle}>AAVE V3 Liquidation Protection</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <Button className={styles.settingsButton}>
                <img src="/arbitrum.png" alt="Arbitrum" className={styles.arbitrumIcon} />
                CONNECT WALLET
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={`${styles.container} ${styles.main}`}>
        {/* Alert Banner */}
        <div className={styles.alertBanner}>
          <div className={styles.alertContent}>
            <Zap className={styles.alertIcon} />
            <div>
              <h3 className={styles.alertTitle}>Protection Active</h3>
              <p className={styles.alertDescription}>
                Your position is being monitored in real-time. Automatic protection will trigger if health factor drops
                below 1.5
              </p>
            </div>
          </div>
        </div>
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
