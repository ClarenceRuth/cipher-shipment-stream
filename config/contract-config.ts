export interface ContractConfig {
  name: string;
  threshold: number;
  networks: {
    [key: string]: {
      address?: string;
      chainId: number;
      rpcUrl: string;
      blockExplorer?: string;
    };
  };
}

export const contractConfig: ContractConfig = {
  name: "DriverPerformance",
  threshold: parseInt(process.env.CONTRACT_THRESHOLD || "100"),
  networks: {
    hardhat: {
      chainId: 31337,
      rpcUrl: "http://127.0.0.1:8545",
    },
    sepolia: {
      chainId: 11155111,
      rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      blockExplorer: "https://sepolia.etherscan.io",
    },
    mainnet: {
      chainId: 1,
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      blockExplorer: "https://etherscan.io",
    },
  },
};

export default contractConfig;
