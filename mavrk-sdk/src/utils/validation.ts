/**
 * Input validation utilities
 */

import { isAddress } from 'ethers';

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Validate token name
 */
export function validateTokenName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Token name cannot be empty' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Token name must be 50 characters or less' };
  }
  return { valid: true };
}

/**
 * Validate token symbol
 */
export function validateTokenSymbol(symbol: string): { valid: boolean; error?: string } {
  if (!symbol || symbol.trim().length === 0) {
    return { valid: false, error: 'Token symbol cannot be empty' };
  }
  if (symbol.length > 10) {
    return { valid: false, error: 'Token symbol must be 10 characters or less' };
  }
  if (!/^[A-Z0-9]+$/i.test(symbol)) {
    return { valid: false, error: 'Token symbol must contain only letters and numbers' };
  }
  return { valid: true };
}

/**
 * Validate pool manager tier
 */
export function validatePoolManagerTier(tier: number): { valid: boolean; error?: string } {
  if (![1, 2, 3].includes(tier)) {
    return { valid: false, error: 'Pool manager tier must be 1, 2, or 3' };
  }
  return { valid: true };
}

/**
 * Validate URL
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: true }; // Optional field
  
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate positive amount
 */
export function validateAmount(amount: bigint): { valid: boolean; error?: string } {
  if (amount <= 0n) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  return { valid: true };
}

/**
 * Validate duration in days
 */
export function validateDuration(days: number): { valid: boolean; error?: string } {
  if (days <= 0) {
    return { valid: false, error: 'Duration must be greater than zero' };
  }
  if (days > 3650) { // ~10 years
    return { valid: false, error: 'Duration cannot exceed 10 years' };
  }
  return { valid: true };
}

