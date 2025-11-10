import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying DriverPerformance contract...");

  // Default threshold can be configured via environment
  const defaultThreshold = process.env.CONTRACT_THRESHOLD
    ? parseInt(process.env.CONTRACT_THRESHOLD)
    : 100;

  const deployment = await deploy("DriverPerformance", {
    from: deployer,
    args: [defaultThreshold],
    log: true,
    autoMine: true,
  });

  console.log(`DriverPerformance deployed at: ${deployment.address}`);

  // Verify contract on Etherscan if on mainnet/sepolia and API key is provided
  if (hre.network.name === "sepolia" || hre.network.name === "mainnet") {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (etherscanApiKey) {
      console.log("Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: deployment.address,
          constructorArguments: [defaultThreshold],
        });
        console.log("Contract verified successfully!");
      } catch (error) {
        console.log("Contract verification failed:", error);
      }
    } else {
      console.log("ETHERSCAN_API_KEY not provided, skipping verification");
    }
  }
};

export default func;
func.tags = ["DriverPerformance", "core"];
