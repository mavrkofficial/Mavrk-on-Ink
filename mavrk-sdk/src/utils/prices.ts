/**
 * Token price utilities using Relay Protocol
 */

import { RELAY_API_URL } from '../constants';

/**
 * Get token price in USD from Relay Protocol
 * @param tokenAddress - Token contract address
 * @param chainId - Chain ID (default: 57073 for Ink)
 * @returns Price in USD or null if not found
 */
export async function getTokenPrice(
  tokenAddress: string,
  chainId: number = 57073
): Promise<number | null> {
  try {
    const url = `${RELAY_API_URL}/currencies/v1?address=${tokenAddress}&chainId=${chainId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();

    if (data && Array.isArray(data) && data[0] && data[0].currencyPriceUsd) {
      return parseFloat(data[0].currencyPriceUsd);
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return null;
  }
}

/**
 * Get prices for multiple tokens
 */
export async function getTokenPrices(
  tokenAddresses: string[],
  chainId: number = 57073
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  await Promise.all(
    tokenAddresses.map(async (address) => {
      const price = await getTokenPrice(address, chainId);
      if (price !== null) {
        prices.set(address.toLowerCase(), price);
      }
    })
  );

  return prices;
}

