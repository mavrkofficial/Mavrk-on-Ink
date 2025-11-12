/**
 * Example: Deploy a token with metadata
 */

import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

async function main() {
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY_HERE', provider);

  // Initialize SDK
  const mavrk = new MavrkSDK({
    signer: wallet,
    chainId: 57073, // Ink L2
  });

  console.log('🚀 Deploying token with Mavrk SDK...');
  console.log(`👤 Deployer: ${await wallet.getAddress()}`);

  // Deploy token
  const result = await mavrk.deployToken({
    name: 'My SDK Token',
    symbol: 'SDK',
    // poolManagerTier defaults to 1 (1 ETH liquidity)
    metadata: {
      // Required fields
      logoBase64: 'data:image/png;base64,...', // Replace with actual base64 image
      coverPhotoBase64: 'data:image/png;base64,...', // Replace with actual base64 image
      category: 'Utility',
      // Optional fields
      description: 'Token deployed using the Mavrk SDK',
      website: 'https://example.com',
      twitter: 'mytoken',
      telegram: 'mytoken',
    },
  });

  console.log('\n✅ Token deployed successfully!');
  console.log(`📍 Token address: ${result.tokenAddress}`);
  console.log(`🔗 Transaction: ${result.txHash}`);
  console.log(`🔍 View on explorer: https://explorer.inkonchain.com/tx/${result.txHash}`);

  // Fetch token data
  console.log('\n📊 Fetching token data...');
  const tokenData = await mavrk.getToken(result.tokenAddress);
  console.log('Token info:', tokenData);

  // Get token price (may be null if not enough liquidity yet)
  const price = await mavrk.getTokenPrice(result.tokenAddress);
  if (price) {
    console.log(`💰 Token price: $${price.toFixed(6)}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

