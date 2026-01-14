"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button/button"
import { Slider } from "@/components/ui/slider/slider"
import { Label } from "@/components/ui/label/label"
import { TrendingUp, TrendingDown, Plus, Minus, Shield } from "lucide-react"
import styles from "./position-overview.module.css"

export function PositionOverview() {
  const [positions, setPositions] = useState([
    {
      asset: "ETH",
      collateral: 12.5,
      collateralUSD: 45231,
      debt: 28450,
      debtAsset: "USDC",
      ltv: 62.9,
      change: 2.3,
      isPositive: true,
      minHealthFactor: 1.5,
      isProtected: false,
    },
    {
      asset: "WBTC",
      collateral: 2.3,
      collateralUSD: 98400,
      debt: 45200,
      debtAsset: "DAI",
      ltv: 45.9,
      change: -1.2,
      isPositive: false,
      minHealthFactor: 1.8,
      isProtected: true,
    },
  ])

  const toggleProtection = (index: number) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, isProtected: !pos.isProtected } : pos))
    )
  }

  const updateMinHealthFactor = (index: number, value: number) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, minHealthFactor: value } : pos))
    )
  }

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
                    {position.isProtected && (
                      <Badge variant="outline" className={styles.protectedBadge}>
                        Protected
                      </Badge>
                    )}
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

              <div className={styles.protectionBox}>
                <div className={styles.protectionHeader}>
                  <Shield className={styles.shieldIcon} />
                  <Label className={styles.protectionLabel}>Protection Threshold</Label>
                </div>
                <div className={styles.sliderWrapper}>
                  <div className={styles.sliderRow}>
                    <span className={styles.metricLabel}>Minimum Health Factor</span>
                    <span className={styles.hfValue}>{position.minHealthFactor.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[position.minHealthFactor]}
                    onValueChange={(value) => updateMinHealthFactor(index, value[0])}
                    min={1.1}
                    max={2.5}
                    step={0.1}
                    className={styles.slider}
                  />
                  <div className={styles.sliderLabels}>
                    <span>1.1</span>
                    <span>2.5</span>
                  </div>
                  <p className={styles.autoProtectNote}>
                    Smart contract will automatically protect your position when health factor drops below{" "}
                    <span className={styles.autoProtectValue}>{position.minHealthFactor.toFixed(1)}</span>
                  </p>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <Button
                  size="sm"
                  className={`${styles.actionButton} ${styles.protectionButton}`}
                  onClick={() => toggleProtection(index)}
                >
                  {position.isProtected ? "UNPROTECT" : "PROTECT"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
