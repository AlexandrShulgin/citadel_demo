"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, Plus, Minus, Shield } from "lucide-react"

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
    },
  ])

  const addCollateral = (index: number, amount: number) => {
    setPositions((prev) => {
      const newPositions = [...prev]
      newPositions[index].collateral += amount
      newPositions[index].collateralUSD += amount * (newPositions[index].collateralUSD / newPositions[index].collateral)
      newPositions[index].ltv = (newPositions[index].debt / newPositions[index].collateralUSD) * 100
      return newPositions
    })
  }

  const reduceDebt = (index: number, amount: number) => {
    setPositions((prev) => {
      const newPositions = [...prev]
      newPositions[index].debt = Math.max(0, newPositions[index].debt - amount)
      newPositions[index].ltv = (newPositions[index].debt / newPositions[index].collateralUSD) * 100
      return newPositions
    })
  }

  const updateMinHealthFactor = (index: number, value: number) => {
    setPositions((prev) => {
      const newPositions = [...prev]
      newPositions[index].minHealthFactor = value
      return newPositions
    })
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Position Overview</CardTitle>
        <CardDescription>Your protected AAVE V3 positions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-secondary/50 p-4 transition-all hover:bg-secondary/70 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{position.asset}</h3>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
                      Protected
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Collateral Position</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${position.isPositive ? "text-chart-3" : "text-chart-5"}`}
                >
                  {position.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>
                    {position.change > 0 ? "+" : ""}
                    {position.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Collateral</p>
                  <p className="text-sm font-medium text-foreground">
                    {position.collateral.toFixed(2)} {position.asset}
                  </p>
                  <p className="text-xs text-primary">${position.collateralUSD.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Debt</p>
                  <p className="text-sm font-medium text-foreground">
                    {position.debt.toLocaleString()} {position.debtAsset}
                  </p>
                  <p className="text-xs text-muted-foreground">${position.debt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LTV Ratio</p>
                  <p className={`text-sm font-medium ${position.ltv > 70 ? "text-chart-5" : "text-chart-3"}`}>
                    {position.ltv.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">of max 80%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={`text-sm font-medium ${position.ltv > 70 ? "text-chart-4" : "text-chart-3"}`}>
                    {position.ltv > 70 ? "Monitor" : "Healthy"}
                  </p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-medium text-foreground">Protection Threshold</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Minimum Health Factor</span>
                    <span className="font-bold text-primary">{position.minHealthFactor.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[position.minHealthFactor]}
                    onValueChange={(value) => updateMinHealthFactor(index, value[0])}
                    min={1.1}
                    max={2.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>1.1</span>
                    <span>2.5</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Smart contract will automatically protect your position when health factor drops below{" "}
                    <span className="text-primary font-medium">{position.minHealthFactor.toFixed(1)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-chart-3/30 text-chart-3 hover:bg-chart-3/10 bg-transparent"
                  onClick={() => addCollateral(index, 0.5)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Collateral
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                  onClick={() => reduceDebt(index, 1000)}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Reduce Debt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
