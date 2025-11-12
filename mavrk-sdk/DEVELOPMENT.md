# Development Guide

## Setup

### Prerequisites

- Node.js >= 18
- npm or yarn
- TypeScript knowledge
- Ethers.js v6 experience

### Installation

```bash
# Clone the repository
git clone https://github.com/mavrkofficial/Mavrk-on-Ink
cd mavrk-sdk

# Install dependencies
npm install

# Build the project
npm run build
```

## Project Structure

```
mavrk-sdk/
├── src/
│   ├── contracts/          # Smart contract wrappers
│   │   ├── TokenFactory.ts
│   │   ├── TokenLocker.ts
│   │   ├── LinearVesting.ts
│   │   └── MavrkLens.ts
│   ├── data/              # Supabase integration
│   │   └── SupabaseClient.ts
│   ├── utils/             # Utility functions
│   │   ├── formatting.ts
│   │   ├── prices.ts
│   │   └── validation.ts
│   ├── abis/              # Contract ABIs
│   ├── types/             # TypeScript types
│   ├── constants.ts       # Constants and addresses
│   ├── MavrkSDK.ts       # Main SDK class
│   └── index.ts          # Exports
├── examples/              # Usage examples
├── dist/                 # Compiled JavaScript (gitignored)
└── package.json
```

## Development Workflow

### 1. Make Changes

Edit TypeScript files in `src/`

### 2. Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/`

### 3. Test Locally

```bash
# Link package locally
npm link

# In your test project
npm link @mavrk/sdk
```

### 4. Run Examples

```bash
# Edit examples to include your private key
cd examples
npx ts-node deploy-token.ts
```

## Adding New Features

### Adding a New Contract Wrapper

1. Create ABI file in `src/abis/NewContract.ts`
2. Create wrapper in `src/contracts/NewContract.ts`
3. Add to SDK class in `src/MavrkSDK.ts`
4. Export from `src/index.ts`

Example:

```typescript
// src/contracts/NewContract.ts
import { Contract, Signer } from 'ethers';
import { NEW_CONTRACT_ABI } from '../abis/NewContract';

export class NewContract {
  private contract: Contract;

  constructor(signer: Signer) {
    this.contract = new Contract(
      'CONTRACT_ADDRESS',
      NEW_CONTRACT_ABI,
      signer
    );
  }

  async someMethod() {
    return await this.contract.someMethod();
  }
}
```

### Adding New Utility Functions

Add to appropriate file in `src/utils/`

```typescript
// src/utils/myUtils.ts
export function newUtility() {
  // implementation
}
```

Export from `src/index.ts`:

```typescript
export * from './utils/myUtils';
```

## Testing

Currently manual testing via examples. To add automated tests:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create test files:

```typescript
// src/__tests__/MavrkSDK.test.ts
import { MavrkSDK } from '../MavrkSDK';

describe('MavrkSDK', () => {
  test('should initialize correctly', () => {
    // test implementation
  });
});
```

## Code Style

- Use TypeScript strict mode
- Follow existing code conventions
- Add JSDoc comments for public APIs
- Use meaningful variable names
- Keep functions focused and small

## Common Tasks

### Update Contract Addresses

Edit `src/constants.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY: '0x...',
  // ... other addresses
};
```

### Update ABIs

After contract changes, update ABI files in `src/abis/`

### Add New Chain Support

1. Add chain config to `constants.ts`
2. Update SDK constructor to handle new chain
3. Add chain-specific logic where needed

## Debugging

### Enable Debug Logs

```typescript
// In your code
console.log('Debug info:', data);
```

### Test with Local RPC

```typescript
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
```

### Inspect Transactions

```typescript
const tx = await contract.someMethod();
console.log('Transaction:', tx);
const receipt = await tx.wait();
console.log('Receipt:', receipt);
```

## Before Publishing

1. ✅ Build successfully: `npm run build`
2. ✅ No TypeScript errors
3. ✅ Test examples work
4. ✅ Update version in `package.json`
5. ✅ Update `README.md` if needed
6. ✅ Commit all changes
7. ✅ Create git tag: `git tag v1.0.0`

## Resources

- [Ethers.js v6 Docs](https://docs.ethers.org/v6/)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm Publishing](https://docs.npmjs.com/cli/v9/commands/npm-publish)

## Getting Help

- GitHub Issues: https://github.com/mavrkofficial/Mavrk-on-Ink/issues
- Discord: (your discord link)
- Twitter: [@mavrkofficial](https://twitter.com/mavrkofficial)

