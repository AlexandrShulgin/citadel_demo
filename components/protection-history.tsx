"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"

export function ProtectionHistory() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "success" | "pending">("all")

  const history = [
    {
      date: "2024-01-14 18:42",
      action: "Auto-Protection Triggered",
      asset: "ETH",
      amount: "$4,250",
      status: "Success",
      saved: "$850",
      details: "Flash loan executed, debt reduced by 5%, health factor restored to safe zone",
      gasUsed: "$12.50",
      txHash: "0x7d8f...4a9c",
    },
    {
      date: "2024-01-12 09:15",
      action: "Collateral Added",
      asset: "WBTC",
      amount: "$2,100",
      status: "Success",
      saved: "$420",
      details: "User manually added collateral to improve position health",
      gasUsed: "$8.20",
      txHash: "0x3f1b...8e2d",
    },
    {
      date: "2024-01-10 14:30",
      action: "Auto-Protection Triggered",
      asset: "ETH",
      amount: "$3,800",
      status: "Success",
      saved: "$760",
      details: "Automated intervention prevented liquidation during market volatility",
      gasUsed: "$15.80",
      txHash: "0x9c4e...1f7a",
    },
    {
      date: "2024-01-08 22:18",
      action: "Debt Reduced",
      asset: "USDC",
      amount: "$5,000",
      status: "Success",
      saved: "$1,000",
      details: "Partial debt repayment via protocol surplus",
      gasUsed: "$6.40",
      txHash: "0x5b2a...3d8f",
    },
  ]

  const filteredHistory = filter === "all" ? history : history.filter((item) => item.status.toLowerCase() === filter)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Protection History
            </CardTitle>
            <CardDescription>Recent protection actions and saved liquidations</CardDescription>
          </div>
          <div className="flex gap-2">
            {(["all", "success", "pending"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "ghost"}
                className={filter === f ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date & Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Saved</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item, index) => (
                <>
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                  >
                    <TableCell className="font-mono text-xs">{item.date}</TableCell>
                    <TableCell className="text-sm font-medium">{item.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {item.asset}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-chart-3/20 text-chart-3 hover:bg-chart-3/30">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-chart-3">+{item.saved}</TableCell>
                    <TableCell>
                      {expandedRow === index ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRow === index && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30">
                        <div className="p-4 space-y-2 text-sm">
                          <p className="text-foreground">{item.details}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>
                              Gas Used: <span className="text-foreground font-medium">{item.gasUsed}</span>
                            </span>
                            <span>
                              TX: <span className="text-primary font-mono">{item.txHash}</span>
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Equity Saved (All Time)</span>
            <span className="text-2xl font-bold text-chart-3">
              +$
              {filteredHistory.reduce((sum, item) => sum + Number(item.saved.replace(/[$,]/g, "")), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
