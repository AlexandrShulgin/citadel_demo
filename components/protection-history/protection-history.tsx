"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Badge } from "@/components/ui/badge/badge"
import { Button } from "@/components/ui/button/button"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import styles from "./protection-history.module.css"

export function ProtectionHistory() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "success" | "pending">("all")

  const history = [
    {
      date: "2026-01-14 18:42",
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
      date: "2026-01-10 14:30",
      action: "Auto-Protection Triggered",
      asset: "ETH",
      amount: "$3,800",
      status: "Success",
      saved: "$760",
      details: "Automated intervention prevented liquidation during market volatility",
      gasUsed: "$15.80",
      txHash: "0x9c4e...1f7a",
    },
  ]

  const filteredHistory = filter === "all" ? history : history.filter((item) => item.status.toLowerCase() === filter)

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.headerWrapper}>
          <div>
            <CardTitle className={styles.title}>
              <Shield className={styles.shieldIcon} />
              Protection History
            </CardTitle>
            <CardDescription>Recent protection actions and saved liquidations</CardDescription>
          </div>
          <div className={styles.filterWrapper}>
            {(["all", "success", "pending"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "ghost"}
                className={filter === f ? styles.activeFilter : ""}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader className={styles.headerRow}>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Saved</TableHead>
                <TableHead style={{ width: '50px' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item, index) => (
                <div key={index} style={{ display: 'contents' }}>
                  <TableRow
                    className={styles.row}
                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                  >
                    <TableCell className={styles.cellDate}>{item.date}</TableCell>
                    <TableCell className={styles.cellAction}>{item.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={styles.assetBadge}>
                        {item.asset}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.cellAmount}>{item.amount}</TableCell>
                    <TableCell>
                      <Badge className={styles.statusBadge}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className={styles.cellSaved}>+{item.saved}</TableCell>
                    <TableCell>
                      {expandedRow === index ? (
                        <ChevronUp className={styles.chevronIcon} />
                      ) : (
                        <ChevronDown className={styles.chevronIcon} />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRow === index && (
                    <TableRow>
                      <TableCell colSpan={7} className={styles.expandedRow}>
                        <div className={styles.detailsWrapper}>
                          <p className={styles.detailsText}>{item.details}</p>
                          <div className={styles.detailsMeta}>
                            <span>
                              Gas Used: <span className={styles.metaValue}>{item.gasUsed}</span>
                            </span>
                            <span>
                              TX: <span className={styles.txHash}>{item.txHash}</span>
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </div>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className={styles.equityBox}>
          <div className={styles.equityRow}>
            <span className={styles.equityLabel}>Total Equity Saved (All Time)</span>
            <span className={styles.equityValue}>
              +$
              {filteredHistory.reduce((sum, item) => sum + Number(item.saved.replace(/[$,]/g, "")), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
