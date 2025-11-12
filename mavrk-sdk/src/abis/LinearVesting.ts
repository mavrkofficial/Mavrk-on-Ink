/**
 * ABI for MavrkLinearVesting contract
 */

export const LINEAR_VESTING_ABI = [
  "function createVestingSchedule(address _beneficiary, address _token, uint256 _amount, uint256 _startTime, uint256 _cliffDuration, uint256 _vestingDuration) external",
  "function release(address _token) external",
  "function getVestingSchedule(address _beneficiary, address _token) external view returns (tuple(uint256 totalAmount, uint256 released, uint256 startTime, uint256 cliffDuration, uint256 vestingDuration, bool revoked))",
  "function computeReleasableAmount(address _beneficiary, address _token) external view returns (uint256)",
  "event VestingScheduleCreated(address indexed beneficiary, address indexed token, uint256 amount, uint256 startTime, uint256 duration)",
  "event TokensReleased(address indexed beneficiary, address indexed token, uint256 amount)"
] as const;

