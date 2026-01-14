"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import styles from "./position-overview.module.css"

export function PositionOverview() {
  const [positions, setPositions] = useState([
    {
      asset: "ETH",
      collateral: 12.5,
      collateralUSD: '45,231',
      debt: '28,450',
      debtAsset: "USDC",
      ltv: 62.9,
      change: 2.3,
      isPositive: true,
    },
    {
      asset: "WBTC",
      collateral: 2.3,
      collateralUSD: "98,400",
      debt: "45,200",
      debtAsset: "DAI",
      ltv: 45.9,
      change: -1.2,
      isPositive: false,
    },
    {
      asset: "ETH",
      collateral: 8.45,
      collateralUSD: "30,120",
      debt: "15,800",
      debtAsset: "USDC",
      ltv: 52.4,
      change: 1.8,
      isPositive: true,
    },
  ])

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className={styles.title}>Position Overview</CardTitle>
        <CardDescription>Your protected AAVE V3 positions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.positionsContainer}>
          {positions.map((position, index) => (
            <div
              key={index}
              className={styles.positionCard}
            >
              <div className={styles.positionHeader}>
                <div className={styles.assetInfo}>
                  <div className={styles.assetTitleWrapper}>
                    <h3 className={styles.assetName}>{position.asset}</h3>
                  </div>
                  <p className={styles.assetDescription}>Collateral Position</p>
                </div>
                <div
                  className={`${styles.changeIndicator} ${position.isPositive ? styles.positive : styles.negative}`}
                >
                  {position.isPositive ? <TrendingUp className={styles.changeIcon} /> : <TrendingDown className={styles.changeIcon} />}
                  <span>
                    {position.change > 0 ? "+" : ""}
                    {position.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className={styles.metricsGrid}>
                <div>
                  <p className={styles.metricLabel}>Collateral</p>
                  <p className={styles.metricValue}>
                    {position.collateral.toFixed(2)} {position.asset}
                  </p>
                  <p className={styles.collateralUSD}>${position.collateralUSD.toLocaleString()}</p>
                </div>
                <div>
                  <p className={styles.metricLabel}>Debt</p>
                  <p className={styles.metricValue}>
                    {position.debt.toLocaleString()} {position.debtAsset}
                  </p>
                  <p className={styles.metricLabel}>${position.debt.toLocaleString()}</p>
                </div>
                <div>
                  <p className={styles.metricLabel}>LTV Ratio</p>
                  <p className={`${styles.metricValue} ${position.ltv > 70 ? styles.ltvValueWarning : styles.ltvValueSafe}`}>
                    {position.ltv.toFixed(1)}%
                  </p>
                  <p className={styles.metricLabel}>of max 80%</p>
                </div>
                <div>
                  <p className={styles.metricLabel}>Status</p>
                  <p className={`${styles.metricValue} ${position.ltv > 70 ? styles.statusMonitor : styles.statusHealthy}`}>
                    {position.ltv > 70 ? "Monitor" : "Healthy"}
                  </p>
                  <p className={styles.metricLabel}>Active</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
