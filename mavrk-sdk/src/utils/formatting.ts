/**
 * Formatting utilities
 */

/**
 * Format an address to shortened form (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format USD value
 */
export function formatUSD(value: number): string {
  return `$${formatNumber(value, 2)}`;
}

/**
 * Format token amount from wei
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  
  const decimalPart = remainder.toString().padStart(decimals, '0').slice(0, displayDecimals);
  
  return `${whole}.${decimalPart}`;
}

/**
 * Parse token amount to wei
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [whole, decimal = '0'] = amount.split('.');
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedDecimal);
}

