# Mavrk SDK - API Reference

Complete API documentation for the Mavrk SDK.

## Table of Contents

- [MavrkSDK Class](#mavrksdk-class)
- [Token Deployment](#token-deployment)
- [Token Locking](#token-locking)
- [Vesting](#vesting)
- [Data Queries](#data-queries)
- [Price Queries](#price-queries)
- [TVL Queries](#tvl-queries)
- [Types](#types)
- [Utilities](#utilities)

---

## MavrkSDK Class

### Constructor

```typescript
new MavrkSDK(config: MavrkSDKConfig)
```

Creates a new instance of the Mavrk SDK.

**Parameters:**
- `config.signer` (Signer) - **Required** - Ethers.js signer for transactions
- `config.chainId` (number) - Optional - Chain ID (default: 57073 for Ink L2)
- `config.rpcUrl` (string) - Optional - Custom RPC URL
- `config.supabaseUrl` (string) - Optional - Custom Supabase URL
- `config.supabaseKey` (string) - Optional - Custom Supabase key

**Example:**
```typescript
import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
const wallet = new ethers.Wallet('PRIVATE_KEY', provider);

const mavrk = new MavrkSDK({
  signer: wallet,
  chainId: 57073
});
```

---

## Token Deployment

### deployToken()

```typescript
async deployToken(params: DeployTokenParams): Promise<DeployTokenResult>
```

Deploy a new ERC-20 token with automatic Uniswap V3 liquidity pool.

**Parameters:**

```typescript
interface DeployTokenParams {
  name: string;                    // Token name (e.g., "Bitcoin")
  symbol: string;                  // Token symbol (e.g., "BTC")
  poolManagerTier?: 1 | 2 | 3;   // Optional: 1 ETH (default), 2 ETH, or 3 ETH liquidity
  metadata: {
    logoBase64: string;            // Required - Base64 encoded image
    coverPhotoBase64: string;      // Required - Base64 encoded image
    category: string;              // Required - Token category
    description?: string;          // Optional - Token description
    website?: string;              // Optional - Project website
    twitter?: string;              // Optional - Twitter handle
    telegram?: string;             // Optional - Telegram link
    discord?: string;              // Optional - Discord link
  };
}
```

**Returns:**

```typescript
interface DeployTokenResult {
  tokenAddress: string;    // Deployed token contract address
  poolAddress?: string;    // Uniswap V3 pool address
  nftTokenId?: string;     // Position NFT token ID
  txHash: string;          // Transaction hash
}
```

**Example:**

```typescript
const result = await mavrk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  metadata: {
    logoBase64: 'data:image/png;base64,...',
    coverPhotoBase64: 'data:image/png;base64,...',
    category: 'DeFi',
    description: 'A revolutionary DeFi token',
    website: 'https://mytoken.com',
    twitter: 'mytoken'
  }
});

console.log('Token deployed at:', result.tokenAddress);
```

**Throws:**
- Error if name is invalid (empty or too long)
- Error if symbol is invalid
- Error if required metadata fields are missing
- Error if deployment transaction fails

---

## Token Locking

### lockTokens()

```typescript
async lockTokens(params: LockTokensParams): Promise<string>
```

Lock tokens for a specified duration.

**Parameters:**

```typescript
interface LockTokensParams {
  tokenAddress: string;    // Address of token to lock
  amount: bigint;          // Amount in wei (use ethers.parseEther())
  durationDays: number;    // Lock duration in days
}
```

**Returns:** Transaction hash (string)

**Example:**

```typescript
const txHash = await mavrk.lockTokens({
  tokenAddress: '0x...',
  amount: ethers.parseEther('1000'),  // Lock 1000 tokens
  durationDays: 30                     // Lock for 30 days
});

console.log('Tokens locked:', txHash);
```

**Throws:**
- Error if token address is invalid
- Error if amount is zero or negative
- Error if duration is less than 1 day

---

## Vesting

### createVesting()

```typescript
async createVesting(params: VestingParams): Promise<string>
```

Create a linear vesting schedule for tokens.

**Parameters:**

```typescript
interface VestingParams {
  tokenAddress: string;      // Token to vest
  beneficiary: string;       // Who receives the vested tokens
  amount: bigint;            // Total amount to vest (in wei)
  startTime: number;         // Unix timestamp when vesting starts
  cliffDuration: number;     // Cliff period in seconds
  vestingDuration: number;   // Total vesting period in seconds
}
```

**Returns:** Transaction hash (string)

**Example:**

```typescript
const now = Math.floor(Date.now() / 1000);
const oneMonth = 30 * 24 * 60 * 60;  // 30 days in seconds
const oneYear = 365 * 24 * 60 * 60;  // 365 days in seconds

const txHash = await mavrk.createVesting({
  tokenAddress: '0x...',
  beneficiary: '0x...',
  amount: ethers.parseEther('10000'),
  startTime: now,
  cliffDuration: oneMonth,      // 1 month cliff
  vestingDuration: oneYear      // 1 year total vesting
});
```

---

## Data Queries

### getToken()

```typescript
async getToken(address: string): Promise<Token>
```

Get token information by contract address.

**Returns:**

```typescript
interface Token {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  category?: string;
  logo_url?: string;
  cover_photo_url?: string;
  contract_address: string;
  network: string;
  pool_address?: string;
  nft_token_id?: string;
  deployer_address: string;
  pool_manager_tier: number;
  created_at: string;
}
```

**Example:**

```typescript
const token = await mavrk.getToken('0x...');
console.log(token.name, token.symbol);
```

---

### getAllTokens()

```typescript
async getAllTokens(limit?: number): Promise<Token[]>
```

Get all tokens, ordered by creation date (newest first).

**Parameters:**
- `limit` (number) - Optional - Max number of tokens to return (default: 100)

**Example:**

```typescript
const tokens = await mavrk.getAllTokens(10);  // Get 10 most recent tokens
```

---

### searchTokens()

```typescript
async searchTokens(query: string): Promise<Token[]>
```

Search tokens by name or symbol.

**Example:**

```typescript
const results = await mavrk.searchTokens('bitcoin');
```

---

### getTokensByDeployer()

```typescript
async getTokensByDeployer(deployerAddress: string): Promise<Token[]>
```

Get all tokens deployed by a specific address.

**Example:**

```typescript
const myTokens = await mavrk.getTokensByDeployer('0x...');
```

---

## Price Queries

### getTokenPrice()

```typescript
async getTokenPrice(tokenAddress: string): Promise<number | null>
```

Get token price in USD via Relay Protocol.

**Returns:** Price in USD or null if not available

**Example:**

```typescript
const price = await mavrk.getTokenPrice('0x...');
if (price) {
  console.log(`Price: $${price.toFixed(6)}`);
}
```

---

## TVL Queries

### getLiquidityLockerTVL()

```typescript
async getLiquidityLockerTVL(): Promise<TVLData>
```

Get Total Value Locked in liquidity locker.

**Returns:**

```typescript
interface TVLData {
  totalValueUSD: number;
  positionCount: number;
}
```

**Example:**

```typescript
const tvl = await mavrk.getLiquidityLockerTVL();
console.log(`TVL: $${tvl.totalValueUSD}`);
console.log(`Positions: ${tvl.positionCount}`);
```

---

### getTotalTVL()

```typescript
async getTotalTVL(): Promise<number>
```

Get total platform TVL in USD.

**Example:**

```typescript
const totalTVL = await mavrk.getTotalTVL();
console.log(`Total TVL: $${totalTVL.toLocaleString()}`);
```

---

## Types

### Token Categories

```typescript
type TokenCategory = 
  | 'Meme'
  | 'DeFi'
  | 'Utility'
  | 'Gaming & Metaverse'
  | 'SoFi'
  | 'Creator Coins'
  | 'AI & Tech'
  | 'DAO'
  | 'Experimental/Art';
```

---

## Utilities

The SDK exports several utility functions:

### Formatting

```typescript
import { formatTokenAmount, formatUSD } from '@mavrk/sdk';

const formatted = formatTokenAmount(ethers.parseEther('1234.56'), 18);
// "1,234.56"

const usd = formatUSD(1234.56);
// "$1,234.56"
```

### Validation

```typescript
import { validateAddress, validateAmount } from '@mavrk/sdk';

const isValid = validateAddress('0x...');
const amountCheck = validateAmount(ethers.parseEther('100'));
```

---

## Advanced Usage

### Accessing Contract Wrappers Directly

For advanced usage, you can access contract wrappers directly:

```typescript
// Access TokenFactory contract
const poolManager = await mavrk.tokenFactory.getPoolManager(1);

// Access TokenLocker contract
const locks = await mavrk.tokenLocker.getUserLocks(userAddress, tokenAddress);

// Access LinearVesting contract
const schedule = await mavrk.linearVesting.getVestingSchedule(scheduleId);

// Access MavrkLens contract (read-only)
const tvl = await mavrk.mavrkLens.getLiquidityLockerTVL();
```

### Custom Supabase Configuration

```typescript
const mavrk = new MavrkSDK({
  signer: wallet,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key'
});
```

---

## Error Handling

All SDK methods throw errors on failure. Always wrap calls in try-catch:

```typescript
try {
  const result = await mavrk.deployToken({
    name: 'My Token',
    symbol: 'MTK',
    metadata: { /* ... */ }
  });
  console.log('Success:', result);
} catch (error) {
  console.error('Deployment failed:', error.message);
}
```

---

## Support

- GitHub: https://github.com/mavrkofficial/Mavrk-on-Ink
- Documentation: https://docs.mavrk.ink
- Twitter: [@mavrkofficial](https://twitter.com/mavrkofficial)

