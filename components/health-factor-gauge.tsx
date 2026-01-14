"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"

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
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          Health Factor
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSimulator(!showSimulator)}
            className="bg-transparent"
          >
            {showSimulator ? "Hide" : "Simulate"}
          </Button>
        </CardTitle>
        <CardDescription>Current position health status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative h-40 w-40">
            <svg className="h-40 w-40 -rotate-90 transform" viewBox="0 0 160 160">
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
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{healthFactor.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">Health Factor</span>
              <div className="flex items-center gap-1 mt-1">
                {healthFactor > 2.3 ? (
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-chart-5" />
                )}
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`flex items-center gap-2 rounded-lg p-3 transition-all ${isHealthy ? "bg-chart-3/10 border border-chart-3/20" : "bg-chart-5/10 border border-chart-5/20"}`}
        >
          {isHealthy ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-chart-3 animate-pulse-glow" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Healthy Position</p>
                <p className="text-xs text-muted-foreground">Well above liquidation threshold</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-chart-5 animate-pulse-glow" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">At Risk</p>
                <p className="text-xs text-muted-foreground">Consider adding collateral</p>
              </div>
            </>
          )}
        </div>

        {showSimulator && (
          <div className="space-y-4 rounded-lg border border-primary/20 bg-secondary p-4">
            <h4 className="text-sm font-semibold text-foreground">Position Simulator</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="collateral" className="text-xs text-foreground">
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
                  className="mt-1 bg-input"
                />
              </div>
              <div>
                <Label htmlFor="debt" className="text-xs text-foreground">
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
                  className="mt-1 bg-input"
                />
              </div>
              <div className="rounded-md bg-card p-3 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Simulated HF</span>
                  <span className={`text-lg font-bold ${simulatedHF > 1.5 ? "text-chart-3" : "text-chart-5"}`}>
                    {simulatedHF.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thresholds */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Safe Zone</span>
            <span className="text-foreground">&gt; 2.0</span>
          </div>
          <Progress value={100} className="h-1.5" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Warning Zone</span>
            <span className="text-foreground">1.5 - 2.0</span>
          </div>
          <Progress value={66} className="h-1.5 [&>div]:bg-chart-4" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Danger Zone</span>
            <span className="text-foreground">&lt; 1.5</span>
          </div>
          <Progress value={33} className="h-1.5 [&>div]:bg-destructive" />
        </div>
      </CardContent>
    </Card>
  )
}
