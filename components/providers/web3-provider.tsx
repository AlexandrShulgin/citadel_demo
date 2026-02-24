"use client"

import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@/lib/wagmi-config"
import { ReactNode, useState } from "react"
import { ConnectKitProvider } from "connectkit"

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="dark"
          customTheme={{
            "--ck-font-family": "var(--font-sans)",
            "--ck-border-radius": "12px",
            "--ck-body-background": "hsl(196 76% 5%)",
            "--ck-body-background-secondary": "hsl(197 66% 7%)",
            "--ck-overlay-background": "rgba(3, 17, 22, 0.8)",
            "--ck-overlay-backdrop-filter": "blur(4px)",
            "--ck-primary-button-color": "hsl(221 100% 60%)",
            "--ck-primary-button-background": "transparent",
            "--ck-primary-button-hover-background": "hsl(221 100% 60% / 0.1)",
            "--ck-primary-button-border-radius": "12px",
            "--ck-primary-button-box-shadow": "inset 0 0 0 1px hsl(221 100% 60%)",
            "--ck-secondary-button-color": "hsl(0 0% 100%)",
            "--ck-secondary-button-background": "transparent",
            "--ck-secondary-button-hover-background": "hsl(191 15% 33% / 0.2)",
            "--ck-secondary-button-border-radius": "12px",
            "--ck-secondary-button-box-shadow": "inset 0 0 0 1px hsl(191 15% 33%)",
            "--ck-focus-color": "hsl(221 100% 60%)",
            "--ck-body-color": "hsl(0 0% 100%)",
            "--ck-body-color-muted": "hsl(148 17% 85%)",
            "--ck-border-color": "hsl(191 15% 33%)",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
