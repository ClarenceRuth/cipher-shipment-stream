import { expect } from "chai";
import { ethers } from "hardhat";
import { DriverPerformance } from "../types/contracts/DriverPerformance";

describe("DriverPerformance", function () {
  let driverPerformance: DriverPerformance;
  let owner: any, driver1: any, driver2: any;

  beforeEach(async function () {
    [owner, driver1, driver2] = await ethers.getSigners();

    const DriverPerformanceFactory = await ethers.getContractFactory("DriverPerformance");
    driverPerformance = await DriverPerformanceFactory.deploy(10); // threshold = 10
    await driverPerformance.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await driverPerformance.owner()).to.equal(owner.address);
    });

    it("Should set the correct threshold", async function () {
      expect(await driverPerformance.targetThreshold()).to.equal(10);
    });
  });

  describe("Driver Registration", function () {
    it("Should register a driver successfully", async function () {
      await expect(driverPerformance.registerDriver(driver1.address))
        .to.emit(driverPerformance, "DriverRegistered")
        .withArgs(driver1.address);

      expect(await driverPerformance.isDriverRegistered(driver1.address)).to.be.true;
    });

    it("Should fail to register with invalid address", async function () {
      await expect(driverPerformance.registerDriver(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(driverPerformance, "InvalidAddress");
    });

    it("Should fail to register already registered driver", async function () {
      await driverPerformance.registerDriver(driver1.address);
      await expect(driverPerformance.registerDriver(driver1.address))
        .to.be.revertedWithCustomError(driverPerformance, "DriverAlreadyRegistered");
    });
  });

  describe("Batch Registration", function () {
    it("Should batch register multiple drivers", async function () {
      const drivers = [driver1.address, driver2.address];

      await expect(driverPerformance.batchRegisterDrivers(drivers))
        .to.emit(driverPerformance, "DriverRegistered")
        .withArgs(driver1.address)
        .and.to.emit(driverPerformance, "DriverRegistered")
        .withArgs(driver2.address);

      expect(await driverPerformance.isDriverRegistered(driver1.address)).to.be.true;
      expect(await driverPerformance.isDriverRegistered(driver2.address)).to.be.true;
      expect(await driverPerformance.getRegisteredDriverCount()).to.equal(2);
    });

    it("Should reject empty batch", async function () {
      await expect(driverPerformance.batchRegisterDrivers([]))
        .to.be.revertedWithCustomError(driverPerformance, "EmptyDriverList");
    });

    it("Should reject batch too large", async function () {
      const drivers = Array(101).fill(driver1.address);
      await expect(driverPerformance.batchRegisterDrivers(drivers))
        .to.be.revertedWithCustomError(driverPerformance, "BatchSizeTooLarge");
    });
  });

  describe("Threshold Management", function () {
    it("Should allow owner to update threshold", async function () {
      await expect(driverPerformance.setTargetThreshold(20))
        .to.emit(driverPerformance, "TargetThresholdUpdated")
        .withArgs(10, 20);

      expect(await driverPerformance.targetThreshold()).to.equal(20);
    });

    it("Should reject threshold update from non-owner", async function () {
      await expect(driverPerformance.connect(driver1).setTargetThreshold(20))
        .to.be.revertedWithCustomError(driverPerformance, "UnauthorizedAccess");
    });
  });

  describe("Driver Queries", function () {
    beforeEach(async function () {
      await driverPerformance.registerDriver(driver1.address);
      await driverPerformance.registerDriver(driver2.address);
    });

    it("Should return correct driver count", async function () {
      expect(await driverPerformance.getRegisteredDriverCount()).to.equal(2);
    });

    it("Should return paginated driver list", async function () {
      const drivers = await driverPerformance.getRegisteredDrivers(0, 10);
      expect(drivers).to.have.lengthOf(2);
      expect(drivers[0]).to.equal(driver1.address);
      expect(drivers[1]).to.equal(driver2.address);
    });

    it("Should handle pagination correctly", async function () {
      const drivers = await driverPerformance.getRegisteredDrivers(1, 1);
      expect(drivers).to.have.lengthOf(1);
      expect(drivers[0]).to.equal(driver2.address);
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause and unpause contract", async function () {
      expect(await driverPerformance.paused()).to.be.false;

      await expect(driverPerformance.pause())
        .to.emit(driverPerformance, "ContractPaused")
        .withArgs(owner.address);

      expect(await driverPerformance.paused()).to.be.true;

      await expect(driverPerformance.unpause())
        .to.emit(driverPerformance, "ContractUnpaused")
        .withArgs(owner.address);

      expect(await driverPerformance.paused()).to.be.false;
    });

    it("Should reject pause from non-owner", async function () {
      await expect(driverPerformance.connect(driver1).pause())
        .to.be.revertedWithCustomError(driverPerformance, "UnauthorizedAccess");
    });

    it("Should prevent operations when paused", async function () {
      await driverPerformance.pause();

      await expect(driverPerformance.registerDriver(driver1.address))
        .to.be.revertedWithCustomError(driverPerformance, "ContractPaused");
    });
  });

  describe("Ownership Management", function () {
    it("Should transfer ownership successfully", async function () {
      await expect(driverPerformance.transferOwnership(driver1.address))
        .to.emit(driverPerformance, "OwnershipTransferred")
        .withArgs(owner.address, driver1.address);

      expect(await driverPerformance.owner()).to.equal(driver1.address);
    });

    it("Should reject ownership transfer to zero address", async function () {
      await expect(driverPerformance.transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(driverPerformance, "InvalidAddress");
    });

    it("Should reject ownership transfer from non-owner", async function () {
      await expect(driverPerformance.connect(driver1).transferOwnership(driver2.address))
        .to.be.revertedWithCustomError(driverPerformance, "UnauthorizedAccess");
    });

    it("Should renounce ownership", async function () {
      await expect(driverPerformance.renounceOwnership())
        .to.emit(driverPerformance, "OwnershipTransferred")
        .withArgs(owner.address, ethers.ZeroAddress);

      expect(await driverPerformance.owner()).to.equal(ethers.ZeroAddress);
    });

    it("Should reject operations after ownership renounced", async function () {
      await driverPerformance.renounceOwnership();

      await expect(driverPerformance.setTargetThreshold(50))
        .to.be.revertedWithCustomError(driverPerformance, "UnauthorizedAccess");
    });
  });
});
