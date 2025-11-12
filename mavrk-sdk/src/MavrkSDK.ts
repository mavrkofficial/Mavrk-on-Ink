/**
 * Main Mavrk SDK class
 */

import { Signer, Provider } from 'ethers';
import { TokenFactory } from './contracts/TokenFactory';
import { TokenLocker } from './contracts/TokenLocker';
import { LinearVesting } from './contracts/LinearVesting';
import { MavrkLens } from './contracts/MavrkLens';
import { TokenDataManager } from './data/SupabaseClient';
import { getTokenPrice } from './utils/prices';
import {
  MavrkSDKConfig,
  DeployTokenParams,
  DeployTokenResult,
  LockTokensParams,
  VestingParams,
  Token,
  TVLData,
} from './types';
import {
  validateTokenName,
  validateTokenSymbol,
  validatePoolManagerTier,
  validateAddress,
  validateAmount,
  validateDuration,
} from './utils/validation';
import { INK_CHAIN_ID, SUPABASE_CONFIG } from './constants';

export class MavrkSDK {
  public signer: Signer;
  public provider: Provider;
  public chainId: number;

  // Contract interfaces
  public tokenFactory: TokenFactory;
  public tokenLocker: TokenLocker;
  public linearVesting: LinearVesting;
  public mavrkLens: MavrkLens;

  // Data layer
  public tokenData: TokenDataManager;

  constructor(config: MavrkSDKConfig) {
    this.signer = config.signer;
    this.provider = this.signer.provider!;
    
    if (!this.provider) {
      throw new Error('Signer must have a provider attached');
    }

    this.chainId = config.chainId || INK_CHAIN_ID;

    // Initialize contract wrappers
    this.tokenFactory = new TokenFactory(this.signer);
    this.tokenLocker = new TokenLocker(this.signer);
    this.linearVesting = new LinearVesting(this.signer);
    this.mavrkLens = new MavrkLens(this.provider);

    // Initialize data layer
    const supabaseUrl = config.supabaseUrl || SUPABASE_CONFIG.URL;
    const supabaseKey = config.supabaseKey || SUPABASE_CONFIG.ANON_KEY;
    this.tokenData = new TokenDataManager(supabaseUrl, supabaseKey);
  }

  /**
   * Deploy a new token with automatic liquidity pool creation
   * and metadata storage
   */
  async deployToken(params: DeployTokenParams): Promise<DeployTokenResult> {
    // Validate inputs
    const nameValidation = validateTokenName(params.name);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error);
    }

    const symbolValidation = validateTokenSymbol(params.symbol);
    if (!symbolValidation.valid) {
      throw new Error(symbolValidation.error);
    }

    // Validate required metadata fields
    if (!params.metadata.logoBase64) {
      throw new Error('Logo is required (metadata.logoBase64)');
    }
    if (!params.metadata.coverPhotoBase64) {
      throw new Error('Cover photo is required (metadata.coverPhotoBase64)');
    }
    if (!params.metadata.category) {
      throw new Error('Category is required (metadata.category)');
    }

    // Default to tier 1 if not specified
    const poolManagerTier = params.poolManagerTier ?? 1;

    const tierValidation = validatePoolManagerTier(poolManagerTier);
    if (!tierValidation.valid) {
      throw new Error(tierValidation.error);
    }

    // Deploy token
    const result = await this.tokenFactory.deployToken(
      params.name,
      params.symbol,
      poolManagerTier
    );

    // Save metadata (required)
    try {
      const deployerAddress = await this.signer.getAddress();
      await this.tokenData.saveToken(
        result.tokenAddress,
        params.name,
        params.symbol,
        params.metadata,
        deployerAddress,
        poolManagerTier
      );
    } catch (error) {
      console.warn('Failed to save token metadata:', error);
      // Don't throw - token is already deployed
    }

    return result;
  }

  /**
   * Lock tokens for a specified duration
   */
  async lockTokens(params: LockTokensParams): Promise<string> {
    // Validate inputs
    if (!validateAddress(params.tokenAddress)) {
      throw new Error('Invalid token address');
    }

    const amountValidation = validateAmount(params.amount);
    if (!amountValidation.valid) {
      throw new Error(amountValidation.error);
    }

    const durationValidation = validateDuration(params.durationDays);
    if (!durationValidation.valid) {
      throw new Error(durationValidation.error);
    }

    return await this.tokenLocker.lock(
      params.tokenAddress,
      params.amount,
      params.durationDays
    );
  }

  /**
   * Create a linear vesting schedule
   */
  async createVesting(params: VestingParams): Promise<string> {
    // Validate inputs
    if (!validateAddress(params.tokenAddress)) {
      throw new Error('Invalid token address');
    }
    if (!validateAddress(params.beneficiary)) {
      throw new Error('Invalid beneficiary address');
    }

    const amountValidation = validateAmount(params.amount);
    if (!amountValidation.valid) {
      throw new Error(amountValidation.error);
    }

    return await this.linearVesting.createVesting(params);
  }

  /**
   * Get token information from Supabase
   */
  async getToken(address: string): Promise<Token> {
    if (!validateAddress(address)) {
      throw new Error('Invalid token address');
    }
    return await this.tokenData.getToken(address);
  }

  /**
   * Get all tokens
   */
  async getAllTokens(limit?: number): Promise<Token[]> {
    return await this.tokenData.getAllTokens(limit);
  }

  /**
   * Search tokens by name or symbol
   */
  async searchTokens(query: string): Promise<Token[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }
    return await this.tokenData.searchTokens(query);
  }

  /**
   * Get tokens deployed by a specific address
   */
  async getTokensByDeployer(deployerAddress: string): Promise<Token[]> {
    if (!validateAddress(deployerAddress)) {
      throw new Error('Invalid deployer address');
    }
    return await this.tokenData.getTokensByDeployer(deployerAddress);
  }

  /**
   * Get token price in USD
   */
  async getTokenPrice(tokenAddress: string): Promise<number | null> {
    if (!validateAddress(tokenAddress)) {
      throw new Error('Invalid token address');
    }
    return await getTokenPrice(tokenAddress, this.chainId);
  }

  /**
   * Get liquidity locker TVL
   */
  async getLiquidityLockerTVL(): Promise<TVLData> {
    return await this.mavrkLens.getLiquidityLockerTVL();
  }

  /**
   * Get total platform TVL (liquidity locker only for now)
   */
  async getTotalTVL(): Promise<number> {
    const liquidityTVL = await this.getLiquidityLockerTVL();
    return liquidityTVL.totalValueUSD;
  }
}

