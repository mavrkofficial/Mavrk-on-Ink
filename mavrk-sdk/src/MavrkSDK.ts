/**
 * Main Mavrk SDK class
 */

import { Signer, Provider } from 'ethers';
import { TokenFactory } from './contracts/TokenFactory';
import { TokenLocker } from './contracts/TokenLocker';
import { LinearVesting } from './contracts/LinearVesting';
import {
  MavrkSDKConfig,
  DeployTokenParams,
  DeployTokenResult,
  LockTokensParams,
  VestingParams,
} from './types';
import {
  validateTokenName,
  validateTokenSymbol,
  validateAddress,
  validateAmount,
  validateDuration,
} from './utils/validation';
import { INK_CHAIN_ID } from './constants';

export class MavrkSDK {
  public signer: Signer;
  public provider: Provider;
  public chainId: number;

  // Contract interfaces
  public tokenFactory: TokenFactory;
  public tokenLocker: TokenLocker;
  public linearVesting: LinearVesting;

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
  }

  /**
   * Deploy a new token with automatic liquidity pool creation on selected DEX
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

    if (!validateAddress(params.npm)) {
      throw new Error('Invalid NPM address (npm)');
    }

    // Deploy token (targeting provided NPM/DEX)
    const result = await this.tokenFactory.deployToken(
      params.name,
      params.symbol,
      params.npm
    );

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

    const amountValidation = validateAmount(params.amount);
    if (!amountValidation.valid) {
      throw new Error(amountValidation.error);
    }

    return await this.linearVesting.createVesting(
      params.tokenAddress,
      params.amount,
      params.vestingOption
    );
  }
}

