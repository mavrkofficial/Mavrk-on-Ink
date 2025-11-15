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
   * Deploy a new Mavrk token with automatic liquidity pool on a chosen DEX
   * @param name - Token name
   * @param symbol - Token symbol
   * @param npm - NonfungiblePositionManager address (selects the target DEX)
   * @returns Deployment result with token address and transaction hash
   */
  async deployToken(
    name: string,
    symbol: string,
    npm: string
  ): Promise<DeployTokenResult> {
    try {
      console.log(`🚀 Deploying token: ${name} (${symbol})`);
      console.log(`🔁 Using NPM (DEX): ${npm}`);

      // Send transaction
      const tx: TransactionResponse = await this.contract.newMavrkToken(
        name,
        symbol,
        npm
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

  // -------- Views --------
  async getWhitelistedNPMs(): Promise<string[]> {
    return await this.contract.getWhitelistedNPMs();
  }

  async isNPMWhitelisted(npm: string): Promise<boolean> {
    return await this.contract.isNPMWhitelisted(npm);
  }

  async getV3FactoryForNPM(npm: string): Promise<string> {
    return await this.contract.getV3FactoryForNPM(npm);
  }

  /**
   * Get creator address for an NFT token ID
   */
  async getNFTCreator(tokenId: bigint): Promise<string> {
    return await this.contract.getNFTCreator(tokenId);
  }

  /**
   * Get all NFT token IDs owned by a creator
   */
  async getCreatorNFTs(creator: string): Promise<bigint[]> {
    return await this.contract.getCreatorNFTs(creator);
  }
}

