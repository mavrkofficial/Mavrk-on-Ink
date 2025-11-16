## Technical Documentations and Implementations

This document provides a consolidated, high-level overview of the on-chain smart contracts and the TypeScript SDK included in this repository. It is intended for developers, integrators, and auditors who need to understand the core architecture and available interfaces.

Reference: `https://github.com/mavrkofficial/Mavrk-on-Ink`


### Smart Contracts

Location: `Smart Contracts/`

- Mavrk Token Factory (`Smart Contracts/Mavrk Token Factory/`)
  - `contracts/MavrkTokenFactory.sol`: Factory responsible for deploying ERC-20 tokens and initializing Uniswap V3–style liquidity pools. Supports selecting a target DEX via a NonfungiblePositionManager (NPM) address and associates creators for fee distribution/follow‑ups.
  - `contracts/MavrkTokenStandard.sol`: Standard ERC‑20 token implementation used by the factory for new deployments. Designed to be ERC‑2771 compatible when used in the Mavrk environment (gasless in the app; normal EOA flow for the SDK).
  - `contracts/interfaces/IMavrkInterfaces.sol`: Interfaces used across the factory and other components (NPM/DEX selectors, creator tracking, etc.).
  - `@openzepplin/contracts/...`: Context/ERC2771 utilities bundled with the factory folder.

- Mavrk Token Locker (`Smart Contracts/Mavrk Token Locker/`)
  - `contracts/MavrkTokenLocker.sol`: Time‑lock contract that allows locking arbitrary ERC‑20 tokens for a specified duration (days). Multiple locks per user per token, with withdrawals enabled after expiry.
  - `@openzeppelin/...`: Standard OpenZeppelin modules (IERC20, SafeERC20, ReentrancyGuard, IERC165) used for safety and compatibility.

- Mavrk LP Locker (`Smart Contracts/Mavrk LP Locker/`)
  - `MavrkLocker.sol`: Permanently locks Uniswap V3 position NFTs and manages fee collection/splitting. Intended to enforce platform‑level security and fee routing (e.g., 75% platform / 25% creator).
  - `ABI/`: ABI artifacts for integration tooling.

- Reservoir (Relay) UniswapV3 Contracts (`Smart Contracts/Reservoir (Relay) UniswapV3 Contracts/`)
  - Canonical Uniswap V3 components adapted/organized for Ink L2 integrations:
    - `UniswapV3Factory/UniswapV3Factory.sol`
    - `UniswapV3Pool/UniswapV3Pool.sol`
    - `NonFungiblePositionManager/NonFungiblePositionManager.sol`
    - `SwapRouter02/SwapRouter02.sol`
  - Documentation:
    - `[RFC] Deploy Uniswap V3 on Ink.md`
    - `Official Uniswap v3 Deployments List.md`

Key responsibilities across contracts:
- Token creation (factory + token standard)
- Initial liquidity creation on a selected Uniswap V3–style DEX by NPM
- LP position custody and fee distribution (LP Locker)
- Token time‑locks (Token Locker)


### Mavrk SDK (TypeScript)

Location: `mavrk-sdk/`

Purpose: A focused TypeScript SDK enabling developers to integrate with the Mavrk protocol on Ink L2. It exposes a simple, type‑safe API for token deployment, token locking, and linear vesting. The SDK is designed for direct on‑chain usage (i.e., users pay gas), while preserving parity with the contracts used in the main app.

Primary docs:
- `README.md`: Feature overview, installation, quick start, and contract addresses
- `API_REFERENCE.md`: Detailed API signatures and usage
- `QUICK_START.md`: Step‑by‑step setup, build, and publish guidance
- `examples/`: Working examples (`deploy-token.ts`, `lock-tokens.ts`)

Core structure:
- `src/MavrkSDK.ts`: Main class that coordinates validation and contract wrappers.
- `src/index.ts`: SDK export surface (class, types, constants, utils, wrappers).
- `src/constants.ts`: Chain ID, RPCs, explorer URL, and deployed contract addresses:
  - `TOKEN_FACTORY`: `0xD827F74E292060D4B495b7b82d6f2470C59ce89d`
  - `TOKEN_LOCKER`: `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA`
  - `LINEAR_VESTING`: `0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c`
  - `WETH`: `0x4200000000000000000000000000000000000006`
- `src/contracts/`: Ethers.js‑based wrappers around on‑chain contracts:
  - `TokenFactory.ts`
    - `deployToken(name, symbol, npm) -> { tokenAddress, txHash }`
    - Helper views: `getWhitelistedNPMs()`, `isNPMWhitelisted(npm)`, `getV3FactoryForNPM(npm)`, `getNFTCreator(tokenId)`, `getCreatorNFTs(creator)`
  - `TokenLocker.ts`
    - `lock(tokenAddress, amount, durationDays) -> txHash`
    - Withdrawals: `withdraw(lockId)`, `withdrawAll(tokenAddress)`
    - Views: `getActiveLocks(user, token)`, `getLockInfo(user, lockId)`
  - `LinearVesting.ts`
    - `createVesting(tokenAddress, amount, vestingOption) -> txHash` (options: 1=30d, 2=60d, 3=90d, 4=180d)
    - Claims and views: `claim(vestingId)`, `getVestingInfo(user, vestingId)`, `getClaimableAmount(user, vestingId)`
- `src/abis/`: ABIs for `TokenFactory`, `TokenLocker`, `LinearVesting`, and a minimal `ERC20`.
- `src/utils/`:
  - `validation.ts`: Input validation (addresses, amounts, durations, token metadata)
  - `formatting.ts`: Helpers for amounts/addresses/log presentation
- `src/types/`: Request/response and config types used across the SDK.
- `widget/mavrk-widget.ts`: Embed information for the Mavrk Launch Widget (iframe parameters and notes).

Key flows (SDK):
- Deploy Token
  1. Validate name/symbol and NPM address.
  2. Call `TokenFactory.newMavrkToken(name, symbol, npm)`.
  3. Parse `TokenDeployed` event to return `tokenAddress` and `txHash`.
- Lock Tokens
  1. Validate token address, amount (wei), and duration (days).
  2. Ensure ERC‑20 allowance for `TOKEN_LOCKER`; approve if needed.
  3. Call `MavrkTokenLocker.newTokenLock(token, amount, durationDays)`.
- Create Linear Vesting
  1. Validate token address and amount.
  2. Ensure ERC‑20 allowance for `LINEAR_VESTING`; approve if needed.
  3. Call `LinearVesting.createVestingSchedule(token, amount, option)`.

Notable considerations:
- The SDK does not use gas sponsorship; transactions are signed and paid by the provided signer.
- All methods throw on validation/transaction failure—wrap calls in `try/catch`.
- Chain defaults: Ink L2 (`chainId=57073`). RPC defaults: `https://rpc-gel.inkonchain.com`.


### Example Usage (from SDK)

Deploy and lock in TypeScript (abridged; see `mavrk-sdk/README.md` and `examples/` for full samples):

```typescript
import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

const mavrk = new MavrkSDK({ signer: wallet, chainId: 57073 });

const { tokenAddress } = await mavrk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  npm: '0xNonFungiblePositionManager...' // target DEX NPM
});

await mavrk.lockTokens({
  tokenAddress,
  amount: ethers.parseEther('1000'),
  durationDays: 30
});
```


### Related Links

- GitHub repository: `https://github.com/mavrkofficial/Mavrk-on-Ink`
- Ink Explorer: `https://explorer.inkonchain.com`
- Website: `https://mavrk.ink`


