// Change 1764244453314
// Enhanced component functionality
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy with target threshold of 10 orders
  const deployedDriverPerformance = await deploy("DriverPerformance", {
    from: deployer,
    args: [10], // targetThreshold = 10
    log: true,
  });

  console.log(`DriverPerformance contract: `, deployedDriverPerformance.address);
};
export default func;
func.id = "deploy_driverPerformance"; // id required to prevent reexecution
func.tags = ["DriverPerformance"];

