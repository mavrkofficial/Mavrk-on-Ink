// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MavrkLocker
 * @dev Main locker contract for Mavrk Token Factory
 * Handles LP token locking, fee collection, and distribution
 * visit us at https://mavrk.ink
 */

interface INonfungiblePositionManager {
    struct CollectParams {
        uint256 tokenId;
        address recipient;
        uint128 amount0Max;
        uint128 amount1Max;
    }

    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function collect(CollectParams calldata params) external payable returns (uint256 amount0, uint256 amount1);
    function positions(uint256 tokenId) external view returns (
        uint96 nonce,
        address operator,
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity,
        uint256 feeGrowthInside0LastX128,
        uint256 feeGrowthInside1LastX128,
        uint128 tokensOwed0,
        uint128 tokensOwed1
    );
}

interface IMavrkTokenFactory {
    function getNFTCreator(uint256 tokenId) external view returns (address);
}

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
}

// Lightweight reentrancy guard
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract MavrkLocker is ReentrancyGuard {
    INonfungiblePositionManager public immutable npm;
    IMavrkTokenFactory public factory; // Changed from immutable to allow updates

    // Addresses
    address public constant MAVRK_MAIN_DEPLOYER = 0xa7597ded779806314544CBDabd1f38DE290677A2;
    address public constant WETH = 0x4200000000000000000000000000000000000006;

    // Configurable fee wallets (40/40/20 split)
    address public mavrkFeesWallet = 0x5B4230b8F8D0dA9307cb995801d886189a31EEA7;
    address public inkFeesWallet = 0xcAa9Ed1A2f41F8D2d34e08b430f2ac01D13ab6fd;

    // Fee split expressed in basis points (40/40/20 split)
    uint256 public mavrkSplitBps = 4000; // 40% (configurable)
    uint256 public inkSplitBps = 4000; // 40% (configurable)
    uint256 public creatorSplitBps = 2000; // 20% (configurable)

    // Emergency withdrawal control
    bool public emergencyWithdrawRenounced = false;

    mapping(uint256 => bool) public lockedLPs;
    mapping(uint256 => address) public lpLockers;
    uint256[] public lpTokenIds;

    // Events
    event LPTokenLocked(uint256 indexed tokenId, address indexed locker);
    event FeesCollected(uint256 indexed tokenId, uint256 amount0, uint256 amount1);
    event FeeDistributed(uint256 indexed tokenId, address recipient, uint256 amount, string distributionType);
    event FeesWalletUpdated(string walletType, address oldWallet, address newWallet);
    event NFTWithdrawn(uint256 indexed tokenId, address indexed recipient);
    event CreatorSplitUpdated(uint256 oldBps, uint256 newBps);
    event MavrkSplitUpdated(uint256 oldBps, uint256 newBps);
    event InkSplitUpdated(uint256 oldBps, uint256 newBps);
    event EmergencyWithdrawRenounced(address indexed renouncer, uint256 timestamp);
    event FactoryUpdated(address indexed oldFactory, address indexed newFactory);

    // Modifiers
    modifier onlyMainDeployer() {
        require(msg.sender == MAVRK_MAIN_DEPLOYER, "Only main deployer can call this function");
        _;
    }

    modifier onlyFeeWallet() {
        require(msg.sender == mavrkFeesWallet || msg.sender == inkFeesWallet, "Only fee wallets can call");
        _;
    }

    modifier onlyCreator(uint256 tokenId) {
        address creator = factory.getNFTCreator(tokenId);
        require(msg.sender == creator, "Only token creator can call this function");
        _;
    }

    constructor(address _npm, address _factory) {
        require(_npm != address(0), "Invalid NPM address");
        require(_factory != address(0), "Invalid factory address");
        npm = INonfungiblePositionManager(_npm);
        factory = IMavrkTokenFactory(_factory);
    }

    function lockLP(uint256 tokenId) external {
        require(!lockedLPs[tokenId], "LP already locked");
        npm.safeTransferFrom(msg.sender, address(this), tokenId);
        require(npm.ownerOf(tokenId) == address(this), "Transfer failed");
        lockedLPs[tokenId] = true;
        lpTokenIds.push(tokenId);
        lpLockers[tokenId] = msg.sender;
        emit LPTokenLocked(tokenId, msg.sender);
    }

    function lock(uint256 tokenId) external {
        require(!lockedLPs[tokenId], "Already locked");
        require(npm.ownerOf(tokenId) == address(this), "Not owned by contract");
        lockedLPs[tokenId] = true;
        lpTokenIds.push(tokenId);
        lpLockers[tokenId] = msg.sender;
        emit LPTokenLocked(tokenId, msg.sender);
    }

    // Fee wallets can collect fees for any NFT
    function collectFees(uint256 tokenId) external onlyFeeWallet nonReentrant {
        _collectAndDistributeFees(tokenId);
    }

    // Creators can collect fees for their own NFT
    function collectFeesAsCreator(uint256 tokenId) external onlyCreator(tokenId) nonReentrant {
        _collectAndDistributeFees(tokenId);
    }

    // Note: batch collection removed per requirements

    // Internal function to collect and distribute fees
    function _collectAndDistributeFees(uint256 tokenId) internal {
        require(lockedLPs[tokenId], "LP not locked");
        
        // Collect fees to this contract first
        INonfungiblePositionManager.CollectParams memory params = INonfungiblePositionManager.CollectParams({
            tokenId: tokenId,
            recipient: address(this),
            amount0Max: type(uint128).max,
            amount1Max: type(uint128).max
        });
        
        (uint256 amount0, uint256 amount1) = npm.collect(params);
        emit FeesCollected(tokenId, amount0, amount1);

        // Fetch position tokens to map amounts to token addresses
        (, , address token0, address token1, , , , , , , , ) = npm.positions(tokenId);

        if (amount0 > 0) {
            _distributeToken(tokenId, token0, amount0);
        }
        
        if (amount1 > 0) {
            _distributeToken(tokenId, token1, amount1);
        }
    }

    // Internal function to distribute fees for a specific ERC20 token
    function _distributeToken(uint256 tokenId, address token, uint256 amount) internal {
        // Calculate and distribute Mavrk fees
        uint256 mavrkAmount = (amount * mavrkSplitBps) / 10000;
        if (mavrkAmount > 0) {
            IERC20(token).transfer(mavrkFeesWallet, mavrkAmount);
            emit FeeDistributed(tokenId, mavrkFeesWallet, mavrkAmount, "MAVRK_FEES");
        }
        
        // Calculate and distribute Ink fees
        uint256 inkAmount = (amount * inkSplitBps) / 10000;
        if (inkAmount > 0) {
            IERC20(token).transfer(inkFeesWallet, inkAmount);
            emit FeeDistributed(tokenId, inkFeesWallet, inkAmount, "INK_FEES");
        }
        
        // Calculate and distribute creator fees (20%) - includes rounding dust
        uint256 creatorAmount = amount - mavrkAmount - inkAmount;
        if (creatorAmount > 0) {
            address creator = factory.getNFTCreator(tokenId);
            if (creator != address(0)) {
                IERC20(token).transfer(creator, creatorAmount);
                emit FeeDistributed(tokenId, creator, creatorAmount, "CREATOR_FEES");
            } else {
                // If no creator, send to Mavrk wallet
                IERC20(token).transfer(mavrkFeesWallet, creatorAmount);
                emit FeeDistributed(tokenId, mavrkFeesWallet, creatorAmount, "MAVRK_FEES");
            }
        }
    }

    // Admin: update fee wallets (only main deployer)
    function updateMavrkFeesWallet(address newWallet) external onlyMainDeployer {
        require(newWallet != address(0), "Invalid address");
        address old = mavrkFeesWallet;
        mavrkFeesWallet = newWallet;
        emit FeesWalletUpdated("MAVRK", old, newWallet);
    }

    function updateInkFeesWallet(address newWallet) external onlyMainDeployer {
        require(newWallet != address(0), "Invalid address");
        address old = inkFeesWallet;
        inkFeesWallet = newWallet;
        emit FeesWalletUpdated("INK", old, newWallet);
    }

    function updateCreatorSplit(uint256 newBps) external onlyMainDeployer {
        require(newBps <= 10000, "BPS cannot exceed 10000");
        require(mavrkSplitBps + inkSplitBps + newBps <= 10000, "Total split exceeds 100%");
        uint256 old = creatorSplitBps;
        creatorSplitBps = newBps;
        emit CreatorSplitUpdated(old, newBps);
    }

    function updateMavrkSplit(uint256 newBps) external onlyMainDeployer {
        require(newBps <= 10000, "BPS cannot exceed 10000");
        require(newBps + inkSplitBps + creatorSplitBps <= 10000, "Total split exceeds 100%");
        uint256 old = mavrkSplitBps;
        mavrkSplitBps = newBps;
        emit MavrkSplitUpdated(old, newBps);
    }

    function updateInkSplit(uint256 newBps) external onlyMainDeployer {
        require(newBps <= 10000, "BPS cannot exceed 10000");
        require(mavrkSplitBps + newBps + creatorSplitBps <= 10000, "Total split exceeds 100%");
        uint256 old = inkSplitBps;
        inkSplitBps = newBps;
        emit InkSplitUpdated(old, newBps);
    }

    // Update factory contract address (only main deployer)
    function updateFactory(address newFactory) external onlyMainDeployer {
        require(newFactory != address(0), "Invalid factory address");
        address oldFactory = address(factory);
        factory = IMavrkTokenFactory(newFactory);
        emit FactoryUpdated(oldFactory, newFactory);
    }

    // Renounce emergency NFT withdrawal capability (permanent, cannot be undone)
    function renounceEmergencyWithdraw() external onlyMainDeployer {
        require(!emergencyWithdrawRenounced, "Already renounced");
        emergencyWithdrawRenounced = true;
        emit EmergencyWithdrawRenounced(msg.sender, block.timestamp);
    }

    // View functions
    function getLockedLPCount() external view returns (uint256) {
        return lpTokenIds.length;
    }

    function getLockedLPs() external view returns (uint256[] memory) {
        return lpTokenIds;
    }

    function getLocker(uint256 tokenId) external view returns (address) {
        return lpLockers[tokenId];
    }

    function getTotalPercentage() external view returns (uint256) {
        return mavrkSplitBps + inkSplitBps + creatorSplitBps;
    }

    function getFeeDistribution() external view returns (uint256 mavrkBps, uint256 inkBps, uint256 creatorBps) {
        return (mavrkSplitBps, inkSplitBps, creatorSplitBps);
    }
    
    function getCreatorSplit() external view returns (uint256) {
        return creatorSplitBps;
    }

    function getMavrkSplit() external view returns (uint256) {
        return mavrkSplitBps;
    }

    function getInkSplit() external view returns (uint256) {
        return inkSplitBps;
    }

    function isEmergencyWithdrawRenounced() external view returns (bool) {
        return emergencyWithdrawRenounced;
    }

    function getFactory() external view returns (address) {
        return address(factory);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // Emergency function to withdraw any stuck ETH
    function emergencyWithdraw() external onlyMainDeployer nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(MAVRK_MAIN_DEPLOYER).transfer(balance);
    }

    // Emergency function to withdraw NFT from locker (safety feature for testing)
    function emergencyWithdrawNFT(uint256 tokenId) external onlyMainDeployer nonReentrant {
        require(!emergencyWithdrawRenounced, "Emergency withdrawal has been renounced");
        require(lockedLPs[tokenId], "NFT not locked in this contract");
        require(npm.ownerOf(tokenId) == address(this), "Contract does not own this NFT");
        
        // Remove from locked state
        lockedLPs[tokenId] = false;
        
        // Remove from lpTokenIds array
        for (uint256 i = 0; i < lpTokenIds.length; i++) {
            if (lpTokenIds[i] == tokenId) {
                lpTokenIds[i] = lpTokenIds[lpTokenIds.length - 1];
                lpTokenIds.pop();
                break;
            }
        }
        
        // Transfer NFT back to main deployer
        npm.safeTransferFrom(address(this), MAVRK_MAIN_DEPLOYER, tokenId);
        
        emit NFTWithdrawn(tokenId, MAVRK_MAIN_DEPLOYER);
    }

    // Note: batch emergency withdraw removed per requirements
}
