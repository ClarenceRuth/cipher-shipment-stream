import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the DriverPerformance contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the DriverPerformance contract
 *
 *   npx hardhat --network localhost task:submit-order-count --driver <address> --count 15
 *   npx hardhat --network localhost task:evaluate-performance --driver <address>
 *   npx hardhat --network localhost task:decrypt-performance --driver <address>
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the DriverPerformance contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the DriverPerformance contract
 *
 *   npx hardhat --network sepolia task:submit-order-count --driver <address> --count 15
 *   npx hardhat --network sepolia task:evaluate-performance --driver <address>
 *   npx hardhat --network sepolia task:decrypt-performance --driver <address>
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the DriverPerformance address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const driverPerformance = await deployments.get("DriverPerformance");

  console.log("DriverPerformance address is " + driverPerformance.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:submit-order-count --driver <address> --count 15
 *   - npx hardhat --network sepolia task:submit-order-count --driver <address> --count 15
 */
task("task:submit-order-count", "Submits encrypted order count for a driver")
  .addOptionalParam("address", "Optionally specify the DriverPerformance contract address")
  .addParam("driver", "The driver address")
  .addParam("count", "The order count value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const count = parseInt(taskArguments.count);
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Argument --count must be a non-negative integer`);
    }

    await fhevm.initializeCLIApi();

    const DriverPerformanceDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("DriverPerformance");
    console.log(`DriverPerformance: ${DriverPerformanceDeployment.address}`);

    const signers = await ethers.getSigners();
    const driverAddress = taskArguments.driver || signers[0].address;

    const driverPerformanceContract = await ethers.getContractAt("DriverPerformance", DriverPerformanceDeployment.address);

    // Encrypt the order count
    const encryptedOrderCount = await fhevm
      .createEncryptedInput(DriverPerformanceDeployment.address, driverAddress)
      .add32(count)
      .encrypt();

    const tx = await driverPerformanceContract
      .connect(signers[0])
      .submitOrderCount(driverAddress, encryptedOrderCount.handles[0], encryptedOrderCount.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    console.log(`DriverPerformance submitOrderCount(${count}) for driver ${driverAddress} succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:evaluate-performance --driver <address>
 *   - npx hardhat --network sepolia task:evaluate-performance --driver <address>
 */
task("task:evaluate-performance", "Evaluates driver performance")
  .addOptionalParam("address", "Optionally specify the DriverPerformance contract address")
  .addParam("driver", "The driver address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const DriverPerformanceDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("DriverPerformance");
    console.log(`DriverPerformance: ${DriverPerformanceDeployment.address}`);

    const signers = await ethers.getSigners();
    const driverAddress = taskArguments.driver || signers[0].address;

    const driverPerformanceContract = await ethers.getContractAt("DriverPerformance", DriverPerformanceDeployment.address);

    const tx = await driverPerformanceContract
      .connect(signers[0])
      .evaluatePerformance(driverAddress);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    console.log(`DriverPerformance evaluatePerformance() for driver ${driverAddress} succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-performance --driver <address>
 *   - npx hardhat --network sepolia task:decrypt-performance --driver <address>
 */
task("task:decrypt-performance", "Decrypts driver performance result")
  .addOptionalParam("address", "Optionally specify the DriverPerformance contract address")
  .addParam("driver", "The driver address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const DriverPerformanceDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("DriverPerformance");
    console.log(`DriverPerformance: ${DriverPerformanceDeployment.address}`);

    const signers = await ethers.getSigners();
    const driverAddress = taskArguments.driver || signers[0].address;

    const driverPerformanceContract = await ethers.getContractAt("DriverPerformance", DriverPerformanceDeployment.address);

    const encryptedResult = await driverPerformanceContract.getPerformanceResult(driverAddress);
    if (encryptedResult === ethers.ZeroHash) {
      console.log(`No performance result found for driver ${driverAddress}`);
      return;
    }

    const clearResult = await fhevm.userDecryptEbool(
      encryptedResult,
      DriverPerformanceDeployment.address,
      signers[0],
    );

    const performanceStatus = clearResult ? "Good (Meets threshold)" : "Not Met (Below threshold)";
    console.log(`Encrypted result: ${encryptedResult}`);
    console.log(`Clear result: ${clearResult}`);
    console.log(`Performance: ${performanceStatus}`);
  });

