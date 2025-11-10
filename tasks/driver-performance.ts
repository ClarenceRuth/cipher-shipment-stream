import { task } from "hardhat/config";
import { DriverPerformance } from "../types/contracts/DriverPerformance";

task("driver:register", "Register a driver")
  .addParam("address", "Driver address to register")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress,
      signer
    ) as DriverPerformance;

    console.log(`Registering driver: ${taskArgs.address}`);

    const tx = await driverPerformance.registerDriver(taskArgs.address);
    await tx.wait();

    console.log(`Driver ${taskArgs.address} registered successfully`);
  });

task("driver:batch-register", "Batch register multiple drivers")
  .addVariadicPositionalParam("addresses", "Driver addresses to register")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress,
      signer
    ) as DriverPerformance;

    console.log(`Batch registering ${taskArgs.addresses.length} drivers`);

    const tx = await driverPerformance.batchRegisterDrivers(taskArgs.addresses);
    await tx.wait();

    console.log("Batch registration completed successfully");
  });

task("driver:set-threshold", "Set performance threshold")
  .addParam("threshold", "New threshold value")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress,
      signer
    ) as DriverPerformance;

    console.log(`Setting threshold to: ${taskArgs.threshold}`);

    const tx = await driverPerformance.setTargetThreshold(taskArgs.threshold);
    await tx.wait();

    console.log("Threshold updated successfully");
  });

task("driver:list", "List all registered drivers")
  .addOptionalParam("offset", "Pagination offset", "0")
  .addOptionalParam("limit", "Pagination limit", "50")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress
    ) as DriverPerformance;

    const count = await driverPerformance.getRegisteredDriverCount();
    console.log(`Total registered drivers: ${count}`);

    const offset = parseInt(taskArgs.offset);
    const limit = parseInt(taskArgs.limit);

    const drivers = await driverPerformance.getRegisteredDrivers(offset, limit);
    console.log("Registered drivers:");
    drivers.forEach((address, index) => {
      console.log(`${offset + index + 1}. ${address}`);
    });
  });

task("driver:pause", "Pause contract operations")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress,
      signer
    ) as DriverPerformance;

    console.log("Pausing contract...");

    const tx = await driverPerformance.pause();
    await tx.wait();

    console.log("Contract paused successfully");
  });

task("driver:unpause", "Resume contract operations")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable not set");
    }

    const driverPerformance = await ethers.getContractAt(
      "DriverPerformance",
      contractAddress,
      signer
    ) as DriverPerformance;

    console.log("Unpausing contract...");

    const tx = await driverPerformance.unpause();
    await tx.wait();

    console.log("Contract unpaused successfully");
  });
