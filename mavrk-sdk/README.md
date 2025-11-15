# Mavrk SDK

Official TypeScript SDK for integrating with [Mavrk.ink](https://mavrk.ink) - The premier token launchpad on Ink L2.

[![npm version](https://img.shields.io/npm/v/@mavrk/sdk.svg)](https://www.npmjs.com/package/@mavrk/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Token Deployment - Deploy ERC-20 tokens with automatic liquidity pools (choose DEX via NPM)  
- Token Locking - Time-lock tokens for custom durations  
- Vesting Schedules - Create linear vesting schedules  
- Type Safety - Full TypeScript support with detailed types  

## Installation

```bash
npm install @mavrk/sdk ethers
```

Or with yarn:

```bash
yarn add @mavrk/sdk ethers
```

## Quick Start

```typescript
import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

// Initialize your wallet
const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create SDK instance
const mavrk = new MavrkSDK({
  signer: wallet,
  chainId: 57073 // Ink L2
});

// Deploy a token on a chosen DEX by providing its NPM address
const result = await mavrk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  npm: '0xNonFungiblePositionManager...' // target DEX NPM address
});

console.log('Token deployed:', result.tokenAddress);

// Lock tokens
await mavrk.lockTokens({
  tokenAddress: result.tokenAddress,
  amount: ethers.parseEther('1000'),
  durationDays: 30
});
```

## Documentation

### Initialization

```typescript
interface MavrkSDKConfig {
  signer: ethers.Signer;          // Your wallet signer
  chainId?: number;                // Default: 57073 (Ink L2)
  rpcUrl?: string;                 // Custom RPC URL (optional)
}

const mavrk = new MavrkSDK(config);
```

### Deploy Token

```typescript
interface DeployTokenParams {
  name: string;                    // Token name
  symbol: string;                  // Token symbol
  npm: string;                     // NonfungiblePositionManager address for chosen DEX
}

const result = await mavrk.deployToken(params);
// Returns: { tokenAddress, txHash }
```

### Lock Tokens

```typescript
interface LockTokensParams {
  tokenAddress: string;
  amount: bigint;                  // Amount in wei
  durationDays: number;            // Lock duration in days
}

const txHash = await mavrk.lockTokens(params);
```

### Create Vesting Schedule

```typescript
interface VestingParams {
  tokenAddress: string;
  amount: bigint;                  // Total amount to vest
  vestingOption: 1 | 2 | 3 | 4;    // Preset options: 30, 60, 90, 180 days
}

const txHash = await mavrk.createVesting(params);
```

## Contract Addresses (Ink L2)

| Contract | Address |
|----------|---------|
| MavrkTokenFactory | `0xD827F74E292060D4B495b7b82d6f2470C59ce89d` |
| MavrkTokenLocker | `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA` |
| MavrkLinearVesting | `0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c` |

## Important Notes

### Gas Fees
- **You pay gas**: Unlike mavrk.ink's gasless deployment, SDK users pay their own gas fees
- **Why?** Gas sponsorship is specific to mavrk.ink domain via Gelato integration
- **Contracts work the same**: All functionality is identical, just without meta-transactions

## Examples

See the `/examples` directory for complete working examples:

- `deploy-token.ts` - Deploy a token with NPM selection
- `lock-tokens.ts` - Lock tokens for a duration

## Project Docs

- Changelog: see `CHANGELOG.md` for recent changes
- Contributing: see `CONTRIBUTING.md` for guidelines
- Publishing: see `PUBLISHING.md` (maintainers only)

## Network Support

Currently supports **Ink L2** (Chain ID: 57073)

- RPC: `https://rpc-gel.inkonchain.com`
- Explorer: `https://explorer.inkonchain.com`

## Links

- Website: [https://mavrk.ink](https://mavrk.ink)
- Documentation: [https://mavrk.ink/docs](https://mavrk.ink/docs)
- Twitter: [@mavrkofficial](https://twitter.com/mavrkofficial)
- Telegram: [t.me/mavrkofficialannouncements](https://t.me/mavrkofficialannouncements)
- GitHub: [github.com/mavrkofficial/Mavrk-on_Ink](https://github.com/mavrkofficial/Mavrk-on-Ink)

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/mavrkofficial/Mavrk-on-Ink/issues).

## License

MIT © Mavrk

