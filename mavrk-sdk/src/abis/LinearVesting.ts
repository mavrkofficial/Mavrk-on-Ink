/**
 * ABI for MavrkLinearVesting contract
 */

export const LINEAR_VESTING_ABI = [
  "function createVestingSchedule(address _tokenAddress, uint256 _tokenAmount, uint256 _vestingOption) external returns (uint256)",
  "function claimVestedTokens(uint256 _vestingId) external",
  "function getClaimableAmount(address _user, uint256 _vestingId) external view returns (uint256)",
  "function getVestingInfo(address _user, uint256 _vestingId) external view returns (address tokenAddress, uint256 totalAmount, uint256 claimedAmount, uint256 claimableAmount, uint256 remainingAmount, uint256 durationDays, uint256 daysElapsed, uint256 daysRemaining, bool fullyWithdrawn)",
  "function getUserVestingIds(address _user) external view returns (uint256[])",
  "function getUserVestingCount(address _user) external view returns (uint256)",
  "function getActiveVestings(address _user, address _tokenAddress) external view returns (uint256[] vestingIds, uint256[] totalAmounts, uint256[] claimedAmounts, uint256[] claimableAmounts, uint256[] endTimes)",
  "event VestingScheduleCreated(address indexed user, uint256 indexed vestingId, address indexed tokenAddress, uint256 totalAmount, uint256 durationDays, uint256 startTime, uint256 endTime)",
  "event TokensClaimed(address indexed user, uint256 indexed vestingId, address indexed tokenAddress, uint256 claimedAmount, uint256 remainingAmount)"
] as const;

