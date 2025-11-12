# Mavrk SDK - Quick Start

## 📋 What You Have

A complete, production-ready SDK in the `mavrk-sdk/` folder that includes:

✅ Full TypeScript implementation  
✅ Contract wrappers for all Mavrk contracts  
✅ Supabase integration for metadata  
✅ Utility functions (formatting, validation, prices)  
✅ Working examples  
✅ Documentation  
✅ Publishing guides  

## 🚀 Next Steps

### 1. Copy to Your Public Repo

```bash
# Copy the entire mavrk-sdk folder to your public repo
cp -r mavrk-sdk/ /path/to/your/public/repo/

cd /path/to/your/public/repo/mavrk-sdk
```

### 2. Initialize Git (if needed)

```bash
git init
git add .
git commit -m "Initial Mavrk SDK release"
git remote add origin https://github.com/mavrkofficial/Mavrk-on-Ink
git push -u origin main
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the SDK

```bash
npm run build
```

This creates the `dist/` folder with compiled JavaScript.

### 5. Test Locally

```bash
# Link the package locally
npm link

# In a test project
mkdir ../test-mavrk-sdk
cd ../test-mavrk-sdk
npm init -y
npm link @mavrk/sdk
npm install ethers

# Create a test file
cat > test.js << 'EOF'
const { MavrkSDK } = require('@mavrk/sdk');
const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
  const wallet = ethers.Wallet.createRandom().connect(provider);
  const sdk = new MavrkSDK({ signer: wallet });
  console.log('SDK initialized successfully!');
  
  const tokens = await sdk.getAllTokens(5);
  console.log(`Found ${tokens.length} tokens`);
}

main();
EOF

# Run the test
node test.js
```

### 6. Publish to npm

First time only:
```bash
# Create npm account at https://www.npmjs.com/signup
npm login
```

Then publish:
```bash
npm publish --access public
```

🎉 **Your SDK is now live!**

Developers can now install it:
```bash
npm install @mavrk/sdk
```

## 📚 Documentation

- **README.md** - Main documentation (shows on npm)
- **PUBLISHING.md** - How to publish updates
- **DEVELOPMENT.md** - Development workflow
- **examples/** - Working code examples

## 🔧 Updating the SDK

When you make changes:

```bash
# 1. Make your changes
# Edit files in src/

# 2. Build
npm run build

# 3. Update version
npm version patch  # or minor, or major

# 4. Publish
npm publish

# 5. Push to GitHub
git push
git push --tags
```

## 💡 Key Features

### For Developers Using Your SDK

```typescript
import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

const sdk = new MavrkSDK({ signer: wallet });

// Deploy token
const result = await sdk.deployToken({
  name: 'My Token',
  symbol: 'MTK',
  // poolManagerTier defaults to 1
  metadata: {
    logoBase64: 'data:image/png;base64,...',      // Required
    coverPhotoBase64: 'data:image/png;base64,...', // Required
    category: 'Utility',                           // Required
    description: 'My awesome token'
  }
});

// Lock tokens
await sdk.lockTokens({
  tokenAddress: result.tokenAddress,
  amount: ethers.parseEther('1000'),
  durationDays: 30
});

// Query data
const tokens = await sdk.getAllTokens();
const price = await sdk.getTokenPrice(tokenAddress);
const tvl = await sdk.getTotalTVL();
```

## 🌟 What Makes This Special

1. **Plug & Play** - Developers can integrate Mavrk in minutes
2. **Full Featured** - Deploy, lock, vest, query - everything works
3. **Type Safe** - Full TypeScript support
4. **Well Documented** - Examples and guides included
5. **Supabase Ready** - Automatic metadata storage
6. **Production Ready** - Error handling, validation, logging

## 📊 After Publishing

Your SDK will appear on:
- npm: `https://www.npmjs.com/package/@mavrk/sdk`
- GitHub: Your public repo
- Downloads: Track at npm dashboard

You can promote it:
- Tweet about it
- Add to your docs
- Share in Discord/Telegram
- Add "Built with Mavrk SDK" badge for users

## 🆘 Need Help?

See:
- `PUBLISHING.md` for publishing questions
- `DEVELOPMENT.md` for development questions
- `examples/` for code examples

## 📝 Customization

Feel free to:
- Update branding in README
- Add more examples
- Extend functionality
- Add tests
- Improve documentation

The code is yours to modify!

---

**Ready to publish?** See `PUBLISHING.md` for step-by-step instructions.

