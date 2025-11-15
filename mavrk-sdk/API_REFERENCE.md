# Mavrk SDK - API Reference

Complete API documentation for the Mavrk SDK.

## Table of Contents

- [MavrkSDK Class](#mavrksdk-class)
- [Token Deployment](#token-deployment)
- [Token Locking](#token-locking)
- [Vesting](#vesting)
- [Types](#types)


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

Deploy a new ERC-20 token with automatic liquidity pool on a selected UniswapV3-style DEX by providing its NonfungiblePositionManager (NPM) address.

**Parameters:**

```typescript
interface DeployTokenParams {
  name: string;                    // Token name (e.g., "Bitcoin")
  symbol: string;                  // Token symbol (e.g., "BTC")
  npm: string;                     // NPM address for target DEX
}
```

**Returns:**

```typescript
interface DeployTokenResult {
  tokenAddress: string;    // Deployed token contract address
  txHash: string;          // Transaction hash
}
```

**Example:**

```typescript
const result = await mavrk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  npm: '0xNonFungiblePositionManager...'
});

console.log('Token deployed at:', result.tokenAddress);
```

**Throws:** input validation errors or deployment transaction failures

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

Create a linear vesting schedule for tokens using preset durations.

**Parameters:**

```typescript
interface VestingParams {
  tokenAddress: string;      // Token to vest
  amount: bigint;            // Total amount to vest (in wei)
  vestingOption: 1 | 2 | 3 | 4; // 30, 60, 90, 180 days
}
```

**Returns:** Transaction hash (string)

**Example:**

```typescript
const txHash = await mavrk.createVesting({
  tokenAddress: '0x...',
  amount: ethers.parseEther('10000'),
  vestingOption: 3               // 90 days
});
```

---

## Types

Core request/response types are exported from `src/types`.

---

## Advanced Usage

### Accessing Contract Wrappers Directly

For advanced usage, you can access contract wrappers directly:

```typescript
// Access TokenFactory contract
const npmList = await mavrk.tokenFactory.getWhitelistedNPMs();

// Access TokenLocker contract
const locks = await mavrk.tokenLocker.getActiveLocks(userAddress, tokenAddress);

// Access LinearVesting contract
const info = await mavrk.linearVesting.getVestingInfo(userAddress, vestingId);
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
    npm: '0xNonFungiblePositionManager...'
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

