import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/providers/web3-provider"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Citadel Protocol - AAVE V3 Liquidation Protection",
  description:
    "Professional DeFi dashboard for monitoring and protecting your AAVE V3 positions from liquidation with real-time health factor tracking",
  generator: "v0.app",
  icons: {
    icon: "/citadel.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
        <Toaster theme="dark" position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
