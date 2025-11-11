// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Driver Performance Evaluation System using FHE
/// @notice A system where drivers can submit encrypted order completion counts,
/// and the system can evaluate performance without exposing sensitive data

// Custom errors for better gas efficiency and clarity
error InvalidAddress();
error DriverAlreadyRegistered();
error EmptyDriverList();
error BatchSizeTooLarge();
error OffsetOutOfBounds();
error UnauthorizedAccess();
error ContractPaused();
error ContractNotPaused();

contract DriverPerformance is SepoliaConfig {
    // Mapping from driver address to their encrypted completed order count
    mapping(address => euint32) private driverOrderCounts;

    // Mapping from driver address to encrypted performance evaluation result
    mapping(address => ebool) private driverPerformanceResults;

    // Mapping to track registered drivers
    mapping(address => bool) private registeredDrivers;

    // Array to keep track of all registered driver addresses
    address[] private registeredDriverList;
    
    // Target threshold for performance evaluation (public, unencrypted)
    uint32 public targetThreshold;
    
    // Contract owner (can set target threshold)
    address public owner;

    // Emergency pause functionality
    bool public paused;

    // Gas optimization: Cache frequently accessed values
    uint256 private cachedDriverCount;
    uint32 private cachedThreshold;

    // Gas optimization: Pre-computed constants
    uint256 private constant MAX_BATCH_SIZE = 100;
    uint256 private constant GAS_BUFFER = 30000;

    // Events
    event OrderCountSubmitted(address indexed driver, address indexed submitter);
    event PerformanceEvaluated(address indexed driver);
    event TargetThresholdUpdated(uint32 oldThreshold, uint32 newThreshold);
    event DriverRegistered(address indexed driver);
    event ContractPaused(address indexed account);
    event ContractUnpaused(address indexed account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert UnauthorizedAccess();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    modifier whenPaused() {
        if (!paused) revert ContractNotPaused();
        _;
    }
    
    constructor(uint32 _targetThreshold) {
        owner = msg.sender;
        targetThreshold = _targetThreshold;
        cachedThreshold = _targetThreshold;
        cachedDriverCount = 0;
    }

    /// @notice Register a driver in the system
    /// @param driver Address of the driver to register
    function registerDriver(address driver) external {
        if (driver == address(0)) revert InvalidAddress();
        if (registeredDrivers[driver]) revert DriverAlreadyRegistered();

        registeredDrivers[driver] = true;
        registeredDriverList.push(driver);
        cachedDriverCount = registeredDriverList.length; // Gas optimization: update cache
        emit DriverRegistered(driver);
    }

    /// @notice Batch register multiple drivers in the system
    /// @param drivers Array of driver addresses to register
    function batchRegisterDrivers(address[] calldata drivers) external {
        if (drivers.length == 0) revert EmptyDriverList();
        if (drivers.length > MAX_BATCH_SIZE) revert BatchSizeTooLarge();

        uint256 initialCount = registeredDriverList.length;
        uint256 newRegistrations = 0;

        for (uint256 i = 0; i < drivers.length; i++) {
            address driver = drivers[i];
            require(driver != address(0), "Invalid driver address");
            if (!registeredDrivers[driver]) {
                registeredDrivers[driver] = true;
                registeredDriverList.push(driver);
                newRegistrations++;
                emit DriverRegistered(driver);

                // Gas optimization: Break if gas is running low
                if (gasleft() < GAS_BUFFER) break;
            }
        }

        // Gas optimization: Update cache only once
        if (newRegistrations > 0) {
            cachedDriverCount = registeredDriverList.length;
        }
    }
    
    /// @notice Set the target threshold for performance evaluation
    /// @param _newThreshold The new target threshold value
    function setTargetThreshold(uint32 _newThreshold) external {
        uint32 oldThreshold = targetThreshold;
        targetThreshold = _newThreshold;
        cachedThreshold = _newThreshold; // Gas optimization: update cache
        emit TargetThresholdUpdated(oldThreshold, _newThreshold);
    }

    /// @notice Emergency pause the contract
    /// @dev Only owner can pause, prevents critical operations during emergencies
    function pause() external whenNotPaused {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    /// @notice Resume contract operations
    /// @dev Only owner can unpause, restores normal functionality
    function unpause() external whenPaused {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    /// @notice Transfer contract ownership to a new address
    /// @param newOwner Address of the new owner
    function transferOwnership(address newOwner) external {
        if (newOwner == address(0)) revert InvalidAddress();
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @notice Renounce ownership of the contract
    /// @dev Leaves the contract without owner, removing access control
    function renounceOwnership() external {
        address oldOwner = owner;
        owner = address(0);
        emit OwnershipTransferred(oldOwner, address(0));
    }
    
    /// @notice Submit encrypted order completion count for a driver
    /// @param driver Address of the driver
    /// @param encryptedOrderCount Encrypted order count value
    /// @param inputProof Proof for the encrypted input
    function submitOrderCount(
        address driver,
        externalEuint32 encryptedOrderCount,
        bytes calldata inputProof
    ) external whenNotPaused {
        if (driver == address(0)) revert InvalidAddress();
        
        // Convert external encrypted input to internal encrypted type
        euint32 orderCount = FHE.fromExternal(encryptedOrderCount, inputProof);
        
        // Store the encrypted order count
        driverOrderCounts[driver] = orderCount;
        
        // Grant access permissions
        FHE.allowThis(orderCount);
        FHE.allow(orderCount, driver); // Driver can decrypt their own count
        FHE.allow(orderCount, msg.sender); // Submitter can also decrypt
        
        emit OrderCountSubmitted(driver, msg.sender);
    }
    
    /// @notice Get encrypted order count for a driver
    /// @param driver Address of the driver
    /// @return The encrypted order count
    function getDriverOrderCount(address driver) external view returns (euint32) {
        return driverOrderCounts[driver];
    }

    /// @notice Check if a driver is registered
    /// @param driver Address of the driver
    /// @return True if the driver is registered
    function isDriverRegistered(address driver) external view returns (bool) {
        return registeredDrivers[driver];
    }

    /// @notice Get the total count of registered drivers
    /// @return The number of registered drivers
    function getRegisteredDriverCount() external view returns (uint256) {
        return cachedDriverCount; // Gas optimization: return cached value instead of array length
    }

    /// @notice Get a paginated list of registered driver addresses
    /// @param offset Starting index for pagination
    /// @param limit Maximum number of addresses to return
    /// @return Array of registered driver addresses
    function getRegisteredDrivers(uint256 offset, uint256 limit) external view returns (address[] memory) {
        if (offset >= registeredDriverList.length) revert OffsetOutOfBounds();

        uint256 actualLimit = limit;
        if (offset + limit > registeredDriverList.length) {
            actualLimit = registeredDriverList.length - offset;
        }

        address[] memory drivers = new address[](actualLimit);
        for (uint256 i = 0; i < actualLimit; i++) {
            drivers[i] = registeredDriverList[offset + i];
        }

        return drivers;
    }
    
    /// @notice Evaluate driver performance: isGood = completedOrders > target
    /// @param driver Address of the driver
    /// @return Encrypted boolean indicating if performance is good (meets threshold)
    function evaluatePerformance(address driver) external whenNotPaused returns (ebool) {
        if (driver == address(0)) revert InvalidAddress();

        euint32 orderCount = driverOrderCounts[driver];
        euint32 encryptedThreshold = FHE.asEuint32(targetThreshold);

        // Perform encrypted comparison: isGood = orderCount >= threshold
        // BUG: Currently using > instead of >=, should be FHE.gte
        ebool isGood = FHE.gt(orderCount, encryptedThreshold);

        // Store the result
        driverPerformanceResults[driver] = isGood;

        // Grant access permissions for the result
        FHE.allowThis(isGood);
        FHE.allow(isGood, driver); // Driver can decrypt their performance result

        emit PerformanceEvaluated(driver);

        return isGood;
    }
    
    /// @notice Get encrypted performance evaluation result for a driver
    /// @param driver Address of the driver
    /// @return The encrypted performance result (true = good, false = not met)
    function getPerformanceResult(address driver) external view returns (ebool) {
        return driverPerformanceResults[driver];
    }
}

