# Mavrk SDK

Official TypeScript SDK for integrating with [Mavrk.ink](https://mavrk.ink) - The premier token launchpad on Ink L2.

[![npm version](https://img.shields.io/npm/v/@mavrk/sdk.svg)](https://www.npmjs.com/package/@mavrk/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✅ **Token Deployment** - Deploy ERC-20 tokens with automatic liquidity pools  
✅ **Token Locking** - Time-lock tokens for custom durations  
✅ **Vesting Schedules** - Create linear vesting schedules  
✅ **Data Integration** - Store and retrieve token metadata from Supabase  
✅ **Price Queries** - Get real-time token prices via Relay Protocol  
✅ **TVL Queries** - Query total value locked across the platform  
✅ **Type Safety** - Full TypeScript support with detailed types  

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

// Deploy a token (poolManagerTier defaults to 1)
const result = await mavrk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  metadata: {
    logoBase64: 'data:image/png;base64,...',      // Required
    coverPhotoBase64: 'data:image/png;base64,...', // Required
    category: 'Utility',                           // Required
    description: 'My awesome token',
    website: 'https://mytoken.com',
    twitter: 'mytoken'
  }
});

console.log('Token deployed:', result.tokenAddress);
console.log('Pool created:', result.poolAddress);

// Get token data
const token = await mavrk.getToken(result.tokenAddress);
console.log('Token info:', token);

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
  rpcUrl?: string;                 // Custom RPC URL
  supabaseUrl?: string;            // Custom Supabase URL
  supabaseKey?: string;            // Custom Supabase key
}

const mavrk = new MavrkSDK(config);
```

### Deploy Token

```typescript
interface DeployTokenParams {
  name: string;                    // Token name
  symbol: string;                  // Token symbol
  poolManagerTier?: 1 | 2 | 3;   // Optional: 1 ETH (default), 2 ETH, or 3 ETH liquidity
  metadata: {                      // Required metadata object
    logoBase64: string;            // Required - Base64 image data
    coverPhotoBase64: string;      // Required - Base64 image data
    category: string;              // Required - Token category
    description?: string;          // Optional
    website?: string;              // Optional
    twitter?: string;              // Optional
    telegram?: string;             // Optional
    discord?: string;              // Optional
  };
}

const result = await mavrk.deployToken(params);
// Returns: { tokenAddress, poolAddress, nftTokenId, txHash }
```

### Query Token Data

```typescript
// Get single token
const token = await mavrk.getToken('0x...');

// Get all tokens
const allTokens = await mavrk.getAllTokens();

// Search tokens
const results = await mavrk.searchTokens('bitcoin');

// Get token price (USD)
const price = await mavrk.getTokenPrice('0x...');
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
  beneficiary: string;             // Who receives the tokens
  amount: bigint;                  // Total amount to vest
  startTime: number;               // Unix timestamp
  cliffDuration: number;           // Cliff period in seconds
  vestingDuration: number;         // Total vesting period in seconds
}

const txHash = await mavrk.createVesting(params);
```

### Query TVL

```typescript
// Get liquidity locker TVL
const liquidityTVL = await mavrk.getLiquidityLockerTVL();

// Get token locks TVL
const locksTVL = await mavrk.getTokenLocksTVL();

// Get vested tokens TVL
const vestingTVL = await mavrk.getVestedTokensTVL();

// Get total platform TVL
const totalTVL = await mavrk.getTotalTVL();
```

## Contract Addresses (Ink L2)

| Contract | Address |
|----------|---------|
| MavrkTokenFactory | `0xD827F74E292060D4B495b7b82d6f2470C59ce89d` |
| MavrkTokenLocker | `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA` |
| MavrkLinearVesting | `0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c` |
| MavrkLens | `0x89C17fEBb23d78802c85B541275a5689aec5852D` |
| MavrkSwapRouter | `0x255a501d300647134b8569Ff2772Fbdf5564a32b` |

## Important Notes

### Required Fields
- **Logo & Cover Photo**: All tokens must include a logo and cover photo (base64 encoded)
- **Category**: Token category is required for better discoverability
- **Pool Manager Tier**: Defaults to 1 (1 ETH liquidity) if not specified

### Gas Fees
- **You pay gas**: Unlike mavrk.ink's gasless deployment, SDK users pay their own gas fees
- **Why?** Gas sponsorship is specific to mavrk.ink domain via Gelato integration
- **Contracts work the same**: All functionality is identical, just without meta-transactions

### Supabase Access
- SDK uses public read-only Supabase instance by default
- Token metadata is automatically saved when deploying
- Custom Supabase instances can be configured

## Examples

See the `/examples` directory for complete working examples:

- `deploy-token.ts` - Deploy a token with metadata
- `lock-tokens.ts` - Lock tokens for a duration
- `create-vesting.ts` - Set up a vesting schedule
- `query-data.ts` - Query token and TVL data
- `custom-config.ts` - Advanced configuration

## Network Support

Currently supports **Ink L2** (Chain ID: 57073)

- RPC: `https://rpc-gel.inkonchain.com`
- Explorer: `https://explorer.inkonchain.com`

## Links

- Website: [https://mavrk.ink](https://mavrk.ink)
- Documentation: [https://docs.mavrk.ink](https://docs.mavrk.ink)
- Twitter: [@mavrkofficial](https://twitter.com/mavrkofficial)
- Telegram: [t.me/mavrkofficialannouncements](https://t.me/mavrkofficialannouncements)
- GitHub: [github.com/mavrkofficial](https://github.com/mavrkofficial)

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/mavrkofficial/Mavrk-on-Ink/issues).

## License

MIT © Mavrk

