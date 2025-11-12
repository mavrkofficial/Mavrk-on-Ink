/**
 * ABI for MavrkLens contract
 */

export const MAVRK_LENS_ABI = [
  "function lockerTVL(bool isLiquidity) external view returns (tuple(address token, uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1, uint256 valueUSD)[])",
  "function vestingSchedulesByToken(address _token) external view returns (tuple(address beneficiary, uint256 totalAmount, uint256 released, uint256 startTime, uint256 cliffDuration, uint256 vestingDuration, bool revoked)[])",
  "function tokenLocksByToken(address _token) external view returns (tuple(address user, uint256 amount, uint256 lockTime, uint256 unlockTime, bool withdrawn)[])"
] as const;

