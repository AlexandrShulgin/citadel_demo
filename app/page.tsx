"use client"

import { Shield, TrendingUp, Settings, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HealthFactorGauge } from "@/components/health-factor-gauge"
import { PositionOverview } from "@/components/position-overview"
import { ProtectionHistory } from "@/components/protection-history"
import { HealthFactorChart } from "@/components/health-factor-chart"
import { useState, useEffect } from "react"

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 border border-primary shadow-lg shadow-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Citadel Protocol</h1>
                <p className="text-sm text-primary font-medium">AAVE V3 Liquidation Protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 border-chart-3/50 text-chart-3 bg-chart-3/10">
                <Activity className="h-3 w-3 animate-pulse-glow" />
                <span className="font-medium">Live</span>
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className="border-border hover:bg-primary/10 hover:border-primary/50 bg-transparent"
              >
                <Settings className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alert Banner */}
        <div className="mb-6 rounded-lg border border-primary/50 bg-primary/5 p-4 shadow-lg shadow-primary/5">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Protection Active</h3>
              <p className="text-sm text-muted-foreground">
                Your position is being monitored in real-time. Automatic protection will trigger if health factor drops
                below 1.5
              </p>
            </div>
          </div>
        </div>

        {/* Protocol Stats */}
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value Locked</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${(tvl / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-chart-3 font-medium">+12.5% this week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assets Under Protection</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${(assetsProtected / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-chart-3 font-medium">+8.2% this week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Vaults</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{vaults}</div>
              <p className="text-xs text-muted-foreground">Monitoring 24/7</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Health Factor Gauge */}
          <div className="lg:col-span-1">
            <HealthFactorGauge />
          </div>

          {/* Position Overview */}
          <div className="lg:col-span-2">
            <PositionOverview />
          </div>
        </div>

        {/* Health Factor Chart */}
        <div className="mt-6">
          <HealthFactorChart />
        </div>

        {/* Protection History */}
        <div className="mt-6">
          <ProtectionHistory />
        </div>
      </main>
    </div>
  )
}
