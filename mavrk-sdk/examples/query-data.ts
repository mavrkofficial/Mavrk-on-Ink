/**
 * Example: Query token data and TVL
 */

import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

async function main() {
  // Setup (read-only, no private key needed)
  const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
  const wallet = ethers.Wallet.createRandom().connect(provider);

  const mavrk = new MavrkSDK({ signer: wallet });

  // Get all tokens
  console.log('📊 Fetching all tokens...');
  const tokens = await mavrk.getAllTokens(10);
  console.log(`Found ${tokens.length} tokens:\n`);

  tokens.forEach((token, index) => {
    console.log(`${index + 1}. ${token.name} (${token.symbol})`);
    console.log(`   Address: ${token.contract_address}`);
    console.log(`   Deployer: ${token.deployer_address}`);
    console.log(`   Category: ${token.category}`);
    console.log('');
  });

  // Search for specific token
  console.log('🔍 Searching for "bitcoin" tokens...');
  const searchResults = await mavrk.searchTokens('bitcoin');
  console.log(`Found ${searchResults.length} results\n`);

  // Get platform TVL
  console.log('💰 Fetching platform TVL...');
  const tvl = await mavrk.getTotalTVL();
  console.log(`Total Value Locked: $${tvl.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}\n`);

  // Get detailed liquidity locker TVL
  const liquidityTVL = await mavrk.getLiquidityLockerTVL();
  console.log('🏊 Liquidity Locker TVL:');
  console.log(`  Value: $${liquidityTVL.totalValueUSD.toFixed(2)}`);
  console.log(`  Positions: ${liquidityTVL.positionCount}`);

  // Get token price
  if (tokens.length > 0) {
    const firstToken = tokens[0];
    console.log(`\n💵 Checking price for ${firstToken.symbol}...`);
    const price = await mavrk.getTokenPrice(firstToken.contract_address);
    if (price) {
      console.log(`  Price: $${price.toFixed(6)}`);
    } else {
      console.log('  Price not available');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

