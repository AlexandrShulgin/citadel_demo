# Frontend: Base mainnet — адреса и вызовы из Next.js

Сеть: **Base mainnet**, chainId **8453**.  
RPC: `https://mainnet.base.org` или свой (e.g. Alchemy/Infura).

---

## Адреса Base mainnet

| Контракт / токен | Адрес |
|------------------|--------|
| **VaultFactory** | `0xf2eDceafD96FE3987Ff04AE2a2717a558ce746Cf` |
| **CitadelVault** (implementation) | `0xCb33732565140147A9d6fA2CA67E9C5175164560` |
| **RiskEngine** | `0x5943214090934B593442e8f26714A2bB64554d10` |
| **Migrator** | `0x145A55F9978c96DBCcf9f3B28229Cb1c992316a5` |
| **ProtectionModule** | `0x2fd3e55ebcB18E778F3d935F0310a2675DE7b067` |
| **RebalanceModule** | `0x55D2a97F62b6e7Cf8045b2d0586f4d2f101AB0Ed` |
| **LoopModule** | `0x3878DD797cfdDa00c255c38C2bC1fDD1EC93687A` |
| **FlashLeverageModule** | `0x98c549265F178eB30D92F7Cb05DDcf8135FCaF24` |
| **DeleverageModule** | `0xC8D7e6F1c60a5a83E66137BF8BA5BD4325CC6cb9` |
| **Aave Pool** | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` |
| **Aave PoolDataProvider** | `0x2D8a3C5677189723c4cB8873cfC9CC8976DEe40E` |
| **Aave Oracle** | `0xB56c2f0b653B2e0b10c9B928c8580ac5df2C267c` |
| **WETH** | `0x4200000000000000000000000000000000000006` |
| **USDC** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| **Swap Router** (Uniswap V3) | `0x2626664c2603336E57B271c5C0b26F421741e481` |

Константы для свопов: `poolFee` = 3000 (0.3%), slippage в базисных пунктах (100 = 1%).

---

## Подключение в Next.js

- Используй **wagmi + viem** или **ethers v6**.
- Добавь сеть Base (chainId 8453) в конфиг провайдера.
- Подключение кошелька даёт `address` и `signer` (или эквивалент для отправки транзакций).
- ABI: после `npx hardhat compile` в этом репо — `artifacts/contracts/CitadelVault.sol/CitadelVault.json` (поле `abi`) и аналогично для `VaultFactory.sol`. Если фронт в монорепе — можно использовать typechain из `typechain-types/`.

---

## VaultFactory

Контракт: адрес из таблицы выше. Вызовы от имени пользователя (owner фабрики или любой для read).

### Запись (нужен signer)

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `createVault(warningHF, targetHF)` | `uint256`, `uint256` (в wei, 1e18 = 1.0) | Создать новый vault. Пример: `warningHF = 1.2e18`, `targetHF = 1.5e18`. |
| `setVaultCreationPaused(paused)` | `bool` | Вкл/выкл создание vault. Только owner фабрики. |
| `transferOwnership(newOwner)` | `address` | Начать смену владельца фабрики. |
| `acceptOwnership()` | — | Принять владение (вызывает новый owner). |
| `cancelOwnershipTransfer()` | — | Отменить смену владельца. Только текущий owner. |

### Чтение (view)

| Функция | Возврат | Описание |
|--------|---------|----------|
| `getVaultsByOwner(owner)` | `address[]` | Список адресов vault'ов пользователя. |
| `owner()` | `address` | Текущий владелец фабрики. |
| `pendingOwner()` | `address` | Ожидающий владелец (если есть transfer). |
| `vaultCreationPaused()` | `bool` | Приостановлено ли создание vault. |
| `implementation()` | `address` | Адрес implementation CitadelVault. |
| `protocolFeeBps()` | `uint256` | Протокольная комиссия в bps (200 = 2%). |
| `treasury()` | `address` | Адрес казны для комиссий. |

---

## CitadelVault

Контракт **каждого сейфа** — адрес возвращается из `getVaultsByOwner` или из события `VaultCreated`. Вызовы записи — от `owner` vault'а (или модуля, где разрешено).

### Позиция и базовые операции

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `deposit(asset, amount)` | `address`, `uint256` | Внести залог. Owner должен сделать `approve(vault, amount)` на токене `asset`. |
| `withdraw(asset, amount)` | `address`, `uint256` | Снять залог; токены приходят на `msg.sender` (owner). Нельзя, если HF упадёт ниже `warningHF`. |
| `borrow(asset, amount)` | `address`, `uint256` | Взять займ; токены приходят на owner. |
| `repay(asset, amount)` | `address`, `uint256` | Погасить долг. Owner: `approve(vault, amount)` на токене долга, затем вызов. |

### Мониторинг здоровья и ребаланса

| Функция | Аргументы | Возврат | Описание |
|--------|-----------|---------|----------|
| `getHealthFactor()` | — | `uint256` | Текущий HF. 1e18 = 1.0. Если долга нет — часто `type(uint256).max`. |
| `needsProtection()` | — | `bool` | `true`, если HF &gt; 0 и HF &lt; warningHF (пора вызывать protection). |
| `getRepayAmountForTargetHF(debtAsset)` | `address` | `uint256` | Сколько погасить в `debtAsset`, чтобы HF стал равен targetHF. |
| `getCollateralAmountForTargetHF(collateralAsset)` | `address` | `uint256` | Сколько добавить коллатерала, чтобы HF стал targetHF. |

### Автолупинг и левередж (views для UI и модулей)

| Функция | Аргументы | Возврат | Описание |
|--------|-----------|---------|----------|
| `getMaxLoopBorrow(borrowAsset, minHFAfter)` | `address`, `uint256` (1e18) | `uint256` | Макс. займ на один шаг лупа при заданном минимальном HF после шага. |
| `getLoopStepBorrowAmount(borrowAsset, minHFAfter, slippageBps)` | `address`, `uint256`, `uint256` | `uint256` | Макс. займ на один шаг autoLoop (без свопа). |
| `getLoopStepWithSwapBorrowAmount(borrowAsset, minHFAfter, slippageBps)` | `address`, `uint256`, `uint256` | `uint256` | Макс. займ на один шаг autoLoopWithSwap. |
| `getFlashLeverageAmount(borrowAsset, collateralAsset, minHFAfter)` | `address`, `address`, `uint256` | `uint256` | Макс. сумма флеш-займа для FlashLeverage (в единицах borrowAsset). |

### Защита (protection)

| Функция | Аргументы | Возврат | Описание |
|--------|-----------|---------|----------|
| `getProtectionAmounts(debtAsset, collateralAsset)` | `address`, `address` | `(repayAmount, totalWithdraw, rewardAmount)` | Для soft protection без свопа: сколько погасить, сколько вывести коллатерала, награда защитнику. |
| `getProtectionWithSwapAmounts(debtAsset, collateralAsset)` | `address`, `address` | `(repayAmount, collateralToSell)` | Для protection со свопом. |

### Состояние позиции

| Функция | Аргументы | Возврат | Описание |
|--------|-----------|---------|----------|
| `getSupplyBalance(collateralAsset)` | `address` | `uint256` | Текущий залог по коллатералу (баланс aToken). |

### Настройки vault (только owner)

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `setSwapRouter(router)` | `address` | Роутер для свопов (нужен для модулей со свопом). |
| `setAllowedModule(module, allowed)` | `address`, `bool` | Разрешить/запретить вызов модуля через `executeFromModule`. |
| `setWarningHF(_warningHF)` | `uint256` (1e18) | Порог HF ниже которого доступна protection. |
| `setTargetHF(_targetHF)` | `uint256` (1e18) | Целевой HF после ребаланса/защиты. |
| `setRewardBps(_rewardBps)` | `uint256` | Bps награды за protection (макс 1000 = 10%). |
| `setProtocolFeeBps(_protocolFeeBps)` | `uint256` | Bps протокольной комиссии (макс 2000 = 20%). |
| `setTreasury(_treasury)` | `address` | Адрес казны. |
| `setMigrator(_migrator)` | `address` | Адрес мигратора (для executeMigrationBorrow). |
| `setLoopFeeBps(_loopFeeBps)` | `uint256` | Bps комиссии за шаг лупа (макс 200 = 2%). |
| `setRebalanceBuffer(_rebalanceBuffer)` | `uint256` (1e18) | Буфер ребаланса: ребаланс разрешён при HF &lt; targetHF - buffer. |

### Вызов модулей (автолуп, ребаланс, защита, флеш-левередж, деливередж)

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `executeFromModule(moduleAddress, data)` | `address`, `bytes` | Единая точка входа для модулей. `data` кодируется по формату модуля (см. ниже). Вызывает только owner. |

### Пауза и экстренные действия

| Функция | Описание |
|--------|----------|
| `pause()` | Остановить deposit/borrow/repay и executeFromModule. Только owner. |
| `unpause()` | Снять паузу. Только owner. |
| `sweepToken(token, to, amount)` | Забрать любой ERC20 с баланса vault (не из Aave) на адрес `to`. Только owner. |

### Владение vault

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `transferOwnership(newOwner)` | `address` | Начать смену владельца vault. |
| `acceptOwnership()` | — | Принять владение (вызывает новый owner). |
| `cancelOwnershipTransfer()` | — | Отменить смену. Только текущий owner. |
| `owner()` | — | Текущий владелец. |
| `pendingOwner()` | — | Ожидающий владелец. |

### Только для модулей (фронт не вызывает)

- `borrowToSelf`, `supplyBalance`, `depositFromModule`, `sendToModule` — вызываются контрактами модулей.
- `executeMigrationBorrow(asset, amount, to)` — только адрес, установленный в `setMigrator`.

### Остальные view/state для UI

- `warningHF`, `targetHF`, `rebalanceBuffer` — uint256 (1e18).
- `rewardBps`, `protocolFeeBps`, `loopFeeBps` — uint256 (bps).
- `treasury`, `swapRouter` — address.
- `allowedModules(address)` — bool.
- `paused()` — bool.
- `pool()`, `oracle()` — адреса Aave (если нужны для отображения).

---

## Модули и формат `data` для `executeFromModule(moduleAddress, data)`

Вызов всегда: `vault.executeFromModule(moduleAddress, data)`. Кодирование `data` — через `abi.encode` или эквивалент (ethers: `ethers.AbiCoder.defaultAbiCoder().encode(...)`).

### LoopModule

- **autoLoop** (без свопа):  
  `data = abi.encode(uint8(0), borrowAsset, maxLoops, slippageBps, minHFAfter)`  
  Типы: `uint8`, `address`, `uint8` (1–10), `uint256` (e.g. 100 = 1%), `uint256` (1e18, e.g. 1.4e18).
- **autoLoopWithSwap**:  
  `data = abi.encode(uint8(1), borrowAsset, collateralAsset, maxLoops, slippageBps, minHFAfter, poolFee)`  
  Дополнительно: `collateralAsset` (address), `poolFee` (uint24, e.g. 3000).

### ProtectionModule

- **No swap** (owner заранее отправляет токены долга на модуль):  
  `data = abi.encode(uint8(0), debtAsset, collateralAsset)`  
  Перед вызовом: `debtToken.transfer(ProtectionModule, repayAmount)` и approve при необходимости.
- **With swap**:  
  `data = abi.encode(uint8(1), debtAsset, collateralAsset, slippageBps, poolFee)`  
  Типы: `uint8(1)`, `address`, `address`, `uint256`, `uint24`.

### RebalanceModule

- **Repay**: токены долга должны быть на балансе модуля.  
  `data = abi.encode(uint8(0), debtAsset, amount)`  
  Перед вызовом: перевести debt токены на RebalanceModule.
- **Supply**: коллатерал на модуле.  
  `data = abi.encode(uint8(1), collateralAsset, amount)`  
  Перед вызовом: перевести коллатерал на RebalanceModule.

### FlashLeverageModule

Один формат:  
`data = abi.encode(borrowAsset, collateralAsset, amount, minHFAfter, slippageBps, poolFee)`  
Типы: `address`, `address`, `uint256`, `uint256` (1e18), `uint256` (bps), `uint24`.  
Требуется: `vault.setSwapRouter(...)` и модуль разрешён.

### DeleverageModule

`data = abi.encode(debtAsset, collateralAsset, repayAmount, collateralAmountToWithdraw, poolFee, slippageBps)`  
Типы: `address`, `address`, `uint256`, `uint256`, `uint24`, `uint256`.  
Для полного вывода коллатерала: `collateralAmountToWithdraw = type(uint256).max`.  
Требуется: swap router установлен, модуль разрешён.

---

## Типичные сценарии

1. **Подключение и выбор vault**  
   Подключить кошелёк → вызвать `VaultFactory.getVaultsByOwner(userAddress)` → взять нужный адрес vault (например первый).

2. **Отображение позиции**  
   Вызвать `vault.getHealthFactor()`, `vault.getSupplyBalance(collateralAsset)` (e.g. WETH). Долг можно получить через Aave (variable debt token для vault) или из своих view, если появятся.

3. **Депозит**  
   `token.approve(vaultAddress, amount)` → `vault.deposit(asset, amount)`.

4. **Займ**  
   `vault.borrow(asset, amount)` — токены приходят на owner.

5. **Погашение**  
   `debtToken.approve(vaultAddress, amount)` → `vault.repay(debtAsset, amount)`.

6. **Вызов модуля**  
   Собрать `data` по формату выше (ethers: `ethers.AbiCoder.defaultAbiCoder().encode(...)`) → `vault.executeFromModule(moduleAddress, data)`. При необходимости заранее перевести токены на модуль и выставить swap router / allowed module.

7. **Первый раз настроить vault для модулей**  
   `vault.setSwapRouter(SWAP_ROUTER_ADDRESS)` → для каждого нужного модуля `vault.setAllowedModule(moduleAddress, true)`.

---

Источник адресов: `deployments/base.json` (последний проверенный деплой). Константы WETH/USDC/Swap Router — из скриптов репо.
