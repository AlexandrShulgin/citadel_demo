import { getDefaultConfig } from "connectkit"
import { http, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { metaMask, coinbaseWallet, walletConnect, injected } from "wagmi/connectors"

// WalletConnect ProjectId — замените на реальный с cloud.walletconnect.com
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ""

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [base],
    transports: {
      // RPC URL for each chain
      [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    },

    // Required API Keys
    walletConnectProjectId: WC_PROJECT_ID,

    // Required App Info
    appName: "Citadel Protocol",

    // Optional App Info
    appDescription: "Citadel Protocol",
    appUrl: "https://citadel.family",
    appIcon: "https://citadel.family/newIcon.png",
  }),
)
