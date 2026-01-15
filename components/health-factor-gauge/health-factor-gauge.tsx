"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Progress } from "@/components/ui/progress/progress"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import styles from "./health-factor-gauge.module.css"

export function HealthFactorGauge() {
  const [healthFactor, setHealthFactor] = useState(2.34)
  const [collateralAmount, setCollateralAmount] = useState(50000)
  const [debtAmount, setDebtAmount] = useState(35000)
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulatedHF, setSimulatedHF] = useState(healthFactor)

  const isHealthy = healthFactor > 1.5
  const progress = Math.min((healthFactor / 3) * 100, 100)

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthFactor((prev) => {
        const change = (Math.random() - 0.5) * 0.02
        const newVal = prev + change
        return Math.max(1.0, Math.min(3.0, newVal))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSimulation = (newCollateral: number, newDebt: number) => {
    const ltv = newDebt / newCollateral
    const liquidationThreshold = 0.8
    const newHF = liquidationThreshold / ltv
    setSimulatedHF(newHF)
  }

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className={styles.title}>
          <span>Health Factor</span>
        </CardTitle>
        <CardDescription>Current position health status</CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        {/* Circular Gauge */}
        <div className={styles.gaugeWrapper}>
          <div className={styles.gaugeContainer}>
            <svg className={styles.gaugeSvg} viewBox="0 0 160 160">
              {/* Background circle */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={isHealthy ? "hsl(var(--chart-3))" : "hsl(var(--chart-5))"}
                strokeWidth="12"
                strokeDasharray={`${(progress / 100) * 439.8} 439.8`}
                strokeLinecap="round"
                className={styles.gaugeCircleProgress}
              />
            </svg>
            <div className={styles.gaugeCenter}>
              <span className={styles.gaugeValue}>{healthFactor.toFixed(2).replace(".", ",")}</span>
              <span className={styles.gaugeLabel}>Health Factor</span>
              <div className={styles.liveIndicator}>
                {healthFactor > 2.3 ? (
                  <TrendingUp className={styles.trendingIconUp} />
                ) : (
                  <TrendingDown className={styles.trendingIconDown} />
                )}
                <span className={styles.gaugeLabel}>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className={`${styles.statusWrapper} ${isHealthy ? styles.statusHealthy : styles.statusAtRisk}`}>
          {isHealthy ? (
            <>
              <CheckCircle2 className={`${styles.statusIcon} ${styles.statusIconHealthy}`} />
              <div className={styles.statusTextContainer}>
                <h4 className={styles.statusTitle}>Position Healthy</h4>
                <p className={styles.statusDescription}>Your liquidation risk is currently low</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className={`${styles.statusIcon} ${styles.statusIconAtRisk}`} />
              <div className={styles.statusTextContainer}>
                <h4 className={styles.statusTitle}>Position at Risk</h4>
                <p className={styles.statusDescription}>Consider adding collateral to avoid liquidation</p>
              </div>
            </>
          )}
        </div>

        {showSimulator && (
          <div className={styles.simulatorWrapper}>
            <h4 className={styles.simulatorTitle}>Position Simulator</h4>
            <div className={styles.simulatorInputs}>
              <div>
                <Label htmlFor="collateral" className={styles.inputLabel}>
                  Collateral ($)
                </Label>
                <Input
                  id="collateral"
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setCollateralAmount(val)
                    handleSimulation(val, debtAmount)
                  }}
                  className={styles.inputField}
                />
              </div>
              <div>
                <Label htmlFor="debt" className={styles.inputLabel}>
                  Debt ($)
                </Label>
                <Input
                  id="debt"
                  type="number"
                  value={debtAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setDebtAmount(val)
                    handleSimulation(collateralAmount, val)
                  }}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.simulatedResult}>
                <div className={styles.simulatedResultRow}>
                  <span className={styles.gaugeLabel}>Simulated HF</span>
                  <span className={`${styles.simulatedResultValue} ${simulatedHF > 1.5 ? styles.textHealthy : styles.textAtRisk}`}>
                    {simulatedHF.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thresholds */}
        <div className={styles.thresholdsWrapper}>
          <div className={styles.thresholdRow}>
            <span className={styles.gaugeLabel}>Safe Zone</span>
            <span className={styles.statusTitle}>&gt; 2,0</span>
          </div>
          <Progress value={100} className={styles.thresholdProgress} />

          <div className={styles.thresholdRow}>
            <span className={styles.gaugeLabel}>Warning Zone</span>
            <span className={styles.statusTitle}>1,5 - 2,0</span>
          </div>
          <Progress value={66} className={`${styles.thresholdProgress} ${styles.warningProgress}`} />

          <div className={styles.thresholdRow}>
            <span className={styles.gaugeLabel}>Danger Zone</span>
            <span className={styles.statusTitle}>&lt; 1,5</span>
          </div>
          <Progress value={33} className={`${styles.thresholdProgress} ${styles.dangerProgress}`} />
        </div>
      </CardContent>
    </Card>
  )
}
