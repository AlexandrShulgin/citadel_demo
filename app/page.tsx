"use client"

import { Shield, TrendingUp, Settings, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { HealthFactorGauge } from "@/components/health-factor-gauge/health-factor-gauge"
import { PositionOverview } from "@/components/position-overview/position-overview"
import { ProtectionHistory } from "@/components/protection-history/protection-history"
import { HealthFactorChart } from "@/components/health-factor-chart/health-factor-chart"
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

        {/* Protocol Stats */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statLabel}>Total Value Locked</CardTitle>
              <TrendingUp className={styles.trendingUp} />
            </CardHeader>
            <CardContent>
              <div className={styles.value}>${(tvl / 1000000).toFixed(1)}M</div>
              <p className={styles.change}>+12.5% this week</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statLabel}>Assets Under Protection</CardTitle>
              <Shield className={styles.statIconPrimary} />
            </CardHeader>
            <CardContent>
              <div className={styles.value}>${(assetsProtected / 1000000).toFixed(1)}M</div>
              <p className={styles.change}>+8.2% this week</p>
            </CardContent>
          </Card>

          <Card className={styles.statCard}>
            <CardHeader className={styles.statHeader}>
              <CardTitle className={styles.statLabel}>Active Vaults</CardTitle>
              <Activity className={styles.statIconPrimary} />
            </CardHeader>
            <CardContent>
              <div className={styles.value}>{vaults}</div>
              <p className={styles.monitoringText}>Monitoring 24/7</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Health Factor Gauge */}
          <div className={styles.gaugeContainer}>
            <HealthFactorGauge />
          </div>

          {/* Position Overview */}
          <div className={styles.overviewContainer}>
            <PositionOverview />
          </div>
        </div>

        {/* Health Factor Chart */}
        <div className={styles.chartContainer}>
          <HealthFactorChart />
        </div>

        {/* Protection History */}
        <div className={styles.historyContainer}>
          <ProtectionHistory />
        </div>
      </main>
    </div>
  )
}
