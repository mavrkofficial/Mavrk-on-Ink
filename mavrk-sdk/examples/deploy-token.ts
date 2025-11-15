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
  console.log(`Deployer: ${await wallet.getAddress()}`);

  // Deploy token
  const result = await mavrk.deployToken({
    name: 'My SDK Token',
    symbol: 'SDK',
    npm: '0xNonFungiblePositionManager...' // Replace with target DEX NPM address
  });

  console.log('\nToken deployed successfully!');
  console.log(`Token address: ${result.tokenAddress}`);
  console.log(`Transaction: ${result.txHash}`);
  console.log(`View on explorer: https://explorer.inkonchain.com/tx/${result.txHash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

