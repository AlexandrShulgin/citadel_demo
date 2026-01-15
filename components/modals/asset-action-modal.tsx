"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { Check } from "lucide-react"
import styles from "./asset-action-modal.module.css"

interface Asset {
  icon?: string
  name: string
  balance?: string
  available?: string
  usdValue?: string
  apy: string
  canBeCollateral?: boolean
}

interface AssetActionModalProps {
  type: "supply" | "borrow"
}

export function AssetActionModal({ type }: AssetActionModalProps) {
  const supplyAssets: Asset[] = [
    { name: "ETH", balance: "0.0019517", apy: "2.05 %", canBeCollateral: true },
    { name: "WBTC", balance: "0.0000111", apy: "0.03 %", canBeCollateral: true },
    { name: "USDC", balance: "0.3000000", apy: "2.66 %", canBeCollateral: true },
    { name: "WETH", balance: "0", apy: "2.05 %", canBeCollateral: true },
    { name: "weETH", balance: "0", apy: "<0.01 %", canBeCollateral: true },
  ]

  const borrowAssets: Asset[] = [
    { name: "ETH", available: "0.0000180", usdValue: "$0.06", apy: "2.36 %" },
    { name: "USDC", available: "0.0597590", usdValue: "$0.06", apy: "4.11 %" },
    { name: "WBTC", available: "0.0000006", usdValue: "$0.06", apy: "0.82 %" },
    { name: "wstETH", available: "0.0000147", usdValue: "$0.06", apy: "0.01 %" },
    { name: "USDT", available: "0.0597490", usdValue: "$0.06", apy: "4.11 %" },
  ]

  const assets = type === "supply" ? supplyAssets : borrowAssets

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader className={styles.headerRow}>
            <TableRow>
              <TableHead className={styles.tableHead}>Asset to {type}</TableHead>
              <TableHead className={styles.tableHead}>{type === "supply" ? "Wallet balance" : "Available"}</TableHead>
              <TableHead className={styles.tableHead}>APY</TableHead>
              {type === "supply" && <TableHead className={styles.tableHead} style={{ textAlign: "center" }}>Can be collateral</TableHead>}
              <TableHead className={styles.tableHead}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={index} className={styles.row}>
                <TableCell className={styles.assetCell}>
                  <Badge variant="outline" className={styles.assetBadge}>
                    {asset.name}
                  </Badge>
                </TableCell>
                <TableCell className={styles.valueCell}>
                  {type === "supply" ? (
                    <span className={asset.balance === "0" ? styles.zeroValue : ""}>{asset.balance}</span>
                  ) : (
                    <div className={styles.availableContainer}>
                      <span>{asset.available}</span>
                      <span className={styles.usdValue}>{asset.usdValue}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className={styles.apyCell}>
                  <span className={asset.apy.startsWith("<") ? styles.zeroValue : ""}>{asset.apy}</span>
                </TableCell>
                {type === "supply" && (
                  <TableCell className={styles.collateralCell}>
                    {asset.canBeCollateral && <Check className={styles.checkIcon} size={16} />}
                  </TableCell>
                )}
                <TableCell className={styles.actionCell}>
                  <div className={styles.actions}>
                    <Button size="sm" className={styles.actionButton}>
                      {type === "supply" ? "Supply" : "Borrow"}
                    </Button>
                    {type === "borrow" && (
                      <Button size="sm" variant="outline" className={styles.detailsButton}>
                        Details
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
