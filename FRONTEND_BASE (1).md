# Frontend: Base mainnet — адреса и вызовы из Next.js

Сеть: **Base mainnet**, chainId **8453**.  
RPC: `https://mainnet.base.org` или свой (e.g. Alchemy/Infura).

---

## Адреса Base mainnet

| Контракт / токен | Адрес | Статус V3.1 |
|------------------|--------|-----------|
| **CitadelRegistry** | `0xc2BFb17D19836772912D041162a67D387803d044` | **[NEW] Центр настроек V3.1.1** |
| **VaultFactory** | `0x53cBDf5bab5102fA95C1CA34E4Ffba82Bd813332` | [V3.1] Платный деплой |
| **CitadelVault** (impl) | `0x9252D83cE68A1F85aCd5cA5E4f1274fD5D8c4004` | **[V3.1] Тотальная монетизация** |
| **RiskEngine** | `0x5943214090934B593442e8f26714A2bB64554d10` | Оставляем (ОК) |
| **Migrator** | `0x145A55F9978c96DBCcf9f3B28229Cb1c992316a5` | Оставляем (ОК) |
| **ProtectionModule** | `0x78164038B939A60a72ddda733c6A65008F25204c` | **[V2.2] Доходность киперов** |
| **RebalanceModule** | `0x55D2a97F62b6e7Cf8045b2d0586f4d2f101AB0Ed` | Оставляем (ОК) |
| **LoopModule** | `0x3878DD797cfdDa00c255c38C2bC1fDD1EC93687A` | Оставляем (ОК) |
| **FlashLeverageModule** | `0x98c549265F178eB30D92F7Cb05DDcf8135FCaF24` | Оставляем (ОК) |
| **DeleverageModule** | `0xC8D7e6F1c60a5a83E66137BF8BA5BD4325CC6cb9` | Оставляем (ОК) |
| **Aave Pool** | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` | Берутся из Registry |
| **Aave Oracle** | `0x2Cc0Fc26eD4563A5ce5e8bdcfe1A2878676Ae156` | Берутся из Registry |
| **WETH** | `0x4200000000000000000000000000000000000006` | — |
| **USDC** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | — |
| **Swap Router** (Uniswap V3) | `0x2626664c2603336E57B271c5C0b26F421741e481` | — |

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
| `createVault(warningHF, targetHF)` | `uint256`, `uint256` | Создать новый vault. Пример: `1.2e18`. **NB**: Требует оплаты `deploymentFee` (0.001 ETH). |
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
| `registry()` | `address` | **[V2]** Адрес CitadelRegistry. |

---

## CitadelRegistry (Центр настроек V2)

Управляется владельцем (owner). Хранит глобальные адреса оракула, пула и казны.

| Функция (view) | Возврат | Описание |
|--------|---------|----------|
| `oracle()` | `address` | Актуальный адрес оракула Aave. |
| `pool()` | `address` | Адрес пула Aave V3. |
| `protocolFeeBps()` | `uint256` | Комиссия протокола со **всех** операций объема (100 = 1%). |
| `deploymentFee()` | `uint256` | Стоимость создания сейфа в ETH (например, 1e15 = 0.001 ETH). |
| `treasury()` | `address` | Куда уходят все комиссии. |

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

### Настройка Авто-защиты (V2.1)

Флаг `autoProtectionEnabled` позволяет сторонним адресам («защитникам» или киперам) вызывать `executeFromModule` для функций лечения (`ProtectionModule`), когда ваш сейф находится в зоне риска (`needsProtection() == true`). По умолчанию он **выключен**, и только владелец может инициировать лечение.

| Функция | Описание |
| :--- | :--- |
| `autoProtectionEnabled()` | **[view]** Возвращает текущий статус (true/false). |
| `setAutoProtectionEnabled(bool enabled)` | **[write]** Включить или выключить авто-защиту. Только владелец. |

#### Почему это важно?
Если вы хотите, чтобы протокол Citadel автоматически лечил ваш сейф через нашу систему киперов (или любого стороннего бота), этот флаг должен быть **true**. Если вы предпочитаете управлять риском вручную — оставьте **false**.

#### Тотальная Монетизация (V3+)
В версии 3.1 введена комиссия **1% (100 BPS)** на любое движение капитала через функции сейфа:
- `deposit`
- `withdraw`
- `borrow`
- `repay`
- Все операции модулей (`depositFromModule`, `sendToModule`).

Комиссия автоматически вычитается из суммы операции и отправляется в `treasury`. При расчётах на фронтенде следует учитывать, что на баланс позиции (или кошелька) попадает сумма за вычетом 1%.

---

> [!IMPORTANT]
> **Архитектура V2:** Сейфы больше не хранят в себе адреса `oracle`, `pool`, `treasury` и `protocolFeeBps`. Все эти данные подтягиваются автоматически из **CitadelRegistry**. Это позволяет обновлять тот же оракул для всех сейфов разом в одном месте.

### Вызов модулей (автолуп, ребаланс, защита, флеш-левередж, деливередж)

| Функция | Аргументы | Описание |
|--------|-----------|----------|
| `executeFromModule(moduleAddress, data)` | `address`, `bytes` | Единая точка входа для модулей. `data` кодируется по формату модуля (см. ниже). Вызывает owner или сторонний кипер (если `autoProtectionEnabled = true`). |

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
- `autoProtectionEnabled` — bool. **[V2.1]**
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
