import { http, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { metaMask, coinbaseWallet, walletConnect, injected } from "wagmi/connectors"

// WalletConnect ProjectId — замените на реальный с cloud.walletconnect.com
const WC_PROJECT_ID = "b56e18d08d3a1238601b0f2e3cf71f11"

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: "Citadel Protocol" }),
    walletConnect({ projectId: WC_PROJECT_ID }),
  ],
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/iDUYwwzWmOhPxY9GJEVtE"),
  },
})
