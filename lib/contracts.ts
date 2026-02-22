// Адреса контрактов Base mainnet (chainId 8453)
export const ADDRESSES = {
  VaultFactory: "0xf2eDceafD96FE3987Ff04AE2a2717a558ce746Cf" as `0x${string}`,
  CitadelVault: "0xCb33732565140147A9d6fA2CA67E9C5175164560" as `0x${string}`,
  RiskEngine: "0x5943214090934B593442e8f26714A2bB64554d10" as `0x${string}`,
  Migrator: "0x145A55F9978c96DBCcf9f3B28229Cb1c992316a5" as `0x${string}`,
  ProtectionModule: "0x2fd3e55ebcB18E778F3d935F0310a2675DE7b067" as `0x${string}`,
  RebalanceModule: "0x55D2a97F62b6e7Cf8045b2d0586f4d2f101AB0Ed" as `0x${string}`,
  LoopModule: "0x3878DD797cfdDa00c255c38C2bC1fDD1EC93687A" as `0x${string}`,
  FlashLeverageModule: "0x98c549265F178eB30D92F7Cb05DDcf8135FCaF24" as `0x${string}`,
  DeleverageModule: "0xC8D7e6F1c60a5a83E66137BF8BA5BD4325CC6cb9" as `0x${string}`,
  AavePool: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as `0x${string}`,
  AavePoolDataProvider: "0x2D8a3C5677189723c4cB8873cfC9CC8976DEe40E" as `0x${string}`,
  AaveOracle: "0xB56c2f0b653B2e0b10c9B928c8580ac5df2C267c" as `0x${string}`,
  WETH: "0x4200000000000000000000000000000000000006" as `0x${string}`,  // underlying (для approve + deposit)
  aWETH: "0x24e6e0795b3c7c71D965fCc4f371803d1c1DcA1E" as `0x${string}`, // aToken (для getSupplyBalance)
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,  // underlying (для approve + repay)
  aUSDC: "0x59dca05b6c26dbd64b5381374aAaC5CD05644C28" as `0x${string}`, // aToken (для getSupplyBalance)
  SwapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481" as `0x${string}`,
} as const

// Параметры свопов
export const SWAP_POOL_FEE = 3000 // 0.3%

// ABI VaultFactory — только нужные функции
export const VAULT_FACTORY_ABI = [
  {
    name: "createVault",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "warningHF", type: "uint256" },
      { name: "targetHF", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getVaultsByOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "vaultCreationPaused",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "protocolFeeBps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "treasury",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const

// ABI CitadelVault — функции для UI
export const CITADEL_VAULT_ABI = [
  // Базовые операции
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "borrow",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "repay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  // Мониторинг
  {
    name: "getHealthFactor",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "needsProtection",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getRepayAmountForTargetHF",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "debtAsset", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getCollateralAmountForTargetHF",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "collateralAsset", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Состояние позиции
  {
    name: "getSupplyBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "collateralAsset", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Луп/левередж
  {
    name: "getMaxLoopBorrow",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "borrowAsset", type: "address" },
      { name: "minHFAfter", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getFlashLeverageAmount",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "borrowAsset", type: "address" },
      { name: "collateralAsset", type: "address" },
      { name: "minHFAfter", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Настройки vault
  {
    name: "setSwapRouter",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "router", type: "address" }],
    outputs: [],
  },
  {
    name: "setAllowedModule",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "module", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "setWarningHF",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_warningHF", type: "uint256" }],
    outputs: [],
  },
  {
    name: "setTargetHF",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_targetHF", type: "uint256" }],
    outputs: [],
  },
  // executeFromModule
  {
    name: "executeFromModule",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "moduleAddress", type: "address" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
  // Пауза
  {
    name: "pause",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "unpause",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "paused",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  // view-состояние
  {
    name: "warningHF",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "targetHF",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "rewardBps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  // Владение
  {
    name: "transferOwnership",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
  },
  {
    name: "acceptOwnership",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const

// ABI ERC20 — approve + balanceOf
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const

// ABI Aave V3 Pool — getUserAccountData даёт полную сводку позиции в USD (8 decimals)
export const AAVE_POOL_ABI = [
  {
    name: "getUserAccountData",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalCollateralBase", type: "uint256" },
      { name: "totalDebtBase", type: "uint256" },
      { name: "availableBorrowsBase", type: "uint256" },
      { name: "currentLiquidationThreshold", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
  },
] as const

// ABI Aave V3 Pool Data Provider
// getUserReserveData(underlying, user) → currentATokenBalance, currentVariableDebt, ...
export const AAVE_POOL_DATA_PROVIDER_ABI = [
  {
    name: "getUserReserveData",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "asset", type: "address" },       // underlying token (WETH, USDC)
      { name: "user", type: "address" },         // адрес vault
    ],
    outputs: [
      { name: "currentATokenBalance", type: "uint256" },   // ← баланс collateral
      { name: "currentStableDebt", type: "uint256" },
      { name: "currentVariableDebt", type: "uint256" },    // ← баланс долга
      { name: "principalStableDebt", type: "uint256" },
      { name: "scaledVariableDebt", type: "uint256" },
      { name: "stableRate", type: "uint256" },
      { name: "liquidityRate", type: "uint256" },
      { name: "stableRateLastUpdated", type: "uint40" },
      { name: "usageAsCollateralEnabled", type: "bool" },
    ],
  },
] as const
