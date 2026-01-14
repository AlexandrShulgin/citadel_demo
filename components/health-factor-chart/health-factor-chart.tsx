"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Button } from "@/components/ui/button/button"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts"
import { Clock } from "lucide-react"
import styles from "./health-factor-chart.module.css"

export function HealthFactorChart() {
  const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d">("24h")
  const [data, setData] = useState([
    { time: "00:00", value: 2.1 },
    { time: "04:00", value: 2.3 },
    { time: "08:00", value: 2.4 },
    { time: "12:00", value: 2.2 },
    { time: "16:00", value: 2.5 },
    { time: "20:00", value: 2.34 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev]
        const lastValue = newData[newData.length - 1].value
        const change = (Math.random() - 0.5) * 0.1
        const newValue = Math.max(1.0, Math.min(3.0, lastValue + change))

        newData.shift()
        const now = new Date()
        newData.push({
          time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
          value: newValue,
        })

        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.headerWrapper}>
          <div>
            <CardTitle className={styles.title}>
              Health Factor History
              <Clock className={styles.clockIcon} />
            </CardTitle>
            <CardDescription>Real-time monitoring</CardDescription>
          </div>
          <div className={styles.timeframeContainer}>
            {(["1h", "24h", "7d"] as const).map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? "default" : "ghost"}
                className={timeframe === tf ? styles.activeButton : ""}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 3]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <ReferenceLine
                y={1.5}
                stroke="hsl(var(--chart-5))"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: "Danger Threshold",
                  fill: "hsl(var(--chart-5))",
                  fontSize: 12,
                  position: "right",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                fill="url(#colorValue)"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
