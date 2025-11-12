/**
 * TokenFactory contract wrapper
 */

import { Contract, Signer, TransactionResponse } from 'ethers';
import { TOKEN_FACTORY_ABI } from '../abis/TokenFactory';
import { CONTRACT_ADDRESSES } from '../constants';
import { DeployTokenResult } from '../types';

export class TokenFactory {
  private contract: Contract;

  constructor(signer: Signer) {
    this.contract = new Contract(
      CONTRACT_ADDRESSES.TOKEN_FACTORY,
      TOKEN_FACTORY_ABI,
      signer
    );
  }

  /**
   * Deploy a new Mavrk token with automatic liquidity pool
   * @param name - Token name
   * @param symbol - Token symbol
   * @param poolManagerTier - 1 (1 ETH), 2 (2 ETH), or 3 (3 ETH) liquidity
   * @returns Deployment result with token address and transaction hash
   */
  async deployToken(
    name: string,
    symbol: string,
    poolManagerTier: 1 | 2 | 3
  ): Promise<DeployTokenResult> {
    try {
      console.log(`🚀 Deploying token: ${name} (${symbol})`);
      console.log(`💧 Liquidity tier: ${poolManagerTier} ETH`);

      // Send transaction
      const tx: TransactionResponse = await this.contract.newMavrkToken(
        name,
        symbol,
        poolManagerTier
      );

      console.log(`⏳ Transaction sent: ${tx.hash}`);
      console.log(`⏳ Waiting for confirmation...`);

      // Wait for receipt
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error('Transaction failed - no receipt');
      }

      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

      // Parse TokenDeployed event
      let tokenAddress: string | undefined;
      
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data
          });
          
          if (parsed && parsed.name === 'TokenDeployed') {
            tokenAddress = parsed.args[0];
            console.log(`✅ Token deployed at: ${tokenAddress}`);
            break;
          }
        } catch (e) {
          // Skip logs that don't match our ABI
          continue;
        }
      }

      if (!tokenAddress) {
        throw new Error('Could not find TokenDeployed event in transaction logs');
      }

      return {
        tokenAddress,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('❌ Deployment failed:', error);
      throw new Error(`Token deployment failed: ${error.message}`);
    }
  }

  /**
   * Get pool manager address for a specific tier
   */
  async getPoolManager(tier: 1 | 2 | 3): Promise<string> {
    return await this.contract.poolManagers(tier);
  }

  /**
   * Get creator address for an NFT token ID
   */
  async getNFTCreator(tokenId: bigint): Promise<string> {
    return await this.contract.nftCreators(tokenId);
  }

  /**
   * Get all NFT token IDs owned by a creator
   */
  async getCreatorNFTs(creator: string): Promise<bigint[]> {
    return await this.contract.creatorNFTs(creator);
  }
}

