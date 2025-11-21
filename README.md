# 🚛 Driver Performance Evaluation System

> A privacy-preserving blockchain application for secure driver performance evaluation using Fully Homomorphic Encryption (FHE)

[![License: BSD-3-Clause-Clear](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![FHEVM](https://img.shields.io/badge/FHEVM-Zama-green)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue)](https://soliditylang.org/)

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🔧 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📖 Usage Guide](#-usage-guide)
- [🔒 Security](#-security)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [📊 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## 🚀 Overview

The Driver Performance Evaluation System is a cutting-edge decentralized application that leverages Fully Homomorphic Encryption (FHE) to evaluate driver performance while maintaining complete privacy of sensitive operational data. Built on Zama's FHEVM, this system enables secure computation on encrypted data without ever decrypting it.

### 🎯 Problem Solved

Traditional driver performance systems require exposing sensitive business data to evaluation algorithms. This system solves this fundamental privacy issue by performing all computations on encrypted data, ensuring that driver performance metrics remain confidential throughout the entire evaluation process.

### 💡 Core Innovation

- **Zero-Knowledge Evaluation**: Performance assessment happens on encrypted data
- **Privacy by Design**: No decryption required for computation
- **Blockchain Security**: Decentralized trust with cryptographic guarantees
- **Scalable Architecture**: Support for batch operations and real-time analytics

## ✨ Key Features

### 🔐 Privacy & Security
- **Fully Homomorphic Encryption**: All computations on encrypted data
- **Zero-Knowledge Proofs**: Verify computations without revealing data
- **Access Control**: Multi-signature governance for critical operations
- **Input Validation**: Comprehensive sanitization and bounds checking

### 🚀 Performance & Scalability
- **Batch Operations**: Efficient processing of multiple drivers simultaneously
- **Gas Optimization**: Caching and pre-computed constants for reduced costs
- **Dynamic Thresholds**: AI-powered automatic threshold adjustments
- **Real-time Analytics**: Live performance monitoring and visualization

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Real-time Updates**: Live status indicators and progress tracking
- **Intuitive Interface**: Streamlined UX for driver registration and monitoring
- **Multi-language Support**: Internationalization ready

### 🛠️ Developer Experience
- **Type Safety**: Full TypeScript integration with generated contract bindings
- **Comprehensive Testing**: 100% test coverage with automated CI/CD
- **Modular Architecture**: Clean separation of concerns and reusable components
- **Extensive Documentation**: Detailed API docs and usage examples

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   FHEVM         │
│   (React)       │◄──►│   Contracts     │◄──►│   Network       │
│                 │    │   (Solidity)    │    │   (Zama)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wallet        │    │   Encrypted     │    │   Relayer       │
│   Integration   │    │   Operations    │    │   Network       │
│   (Wagmi)       │    │   (FHE)         │    │   (Decentralized)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🏛️ Smart Contracts

#### `DriverPerformance.sol`
The main contract implementing FHE-based driver evaluation logic.

**Key Components:**
- **Access Control**: Multi-signature administration system
- **FHE Operations**: Encrypted arithmetic and comparison operations
- **Performance Metrics**: Automated threshold adjustment algorithms
- **Batch Processing**: Gas-optimized bulk operations
- **Event Logging**: Comprehensive audit trail with timestamps

#### Contract Functions
- `registerDriver()` - Register individual drivers
- `batchRegisterDrivers()` - Bulk driver registration
- `submitOrderCount()` - Submit encrypted order completion data
- `evaluatePerformance()` - Perform encrypted performance evaluation
- `batchEvaluatePerformance()` - Bulk performance assessment

### 🎨 Frontend Architecture

#### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks with Wagmi for Web3
- **UI Components**: Custom component library with accessibility

#### Key Components
- `DriverRegistration` - Secure driver onboarding
- `SubmitOrderCount` - Encrypted order submission interface
- `FHEVMIntegration` - FHE status monitoring and controls
- `PerformanceAnalytics` - Real-time data visualization
- `TransactionHistory` - Comprehensive audit trail

## 🔧 Installation

### Prerequisites

Before installing, ensure you have the following:

- **Node.js**: `>= 20.0.0`
- **npm**: `>= 7.0.0`
- **Git**: For cloning the repository
- **Hardhat**: Ethereum development environment (installed automatically)

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Stable internet for blockchain interactions

### Quick Install

```bash
# Clone the repository
git clone https://github.com/ClarenceRuth/cipher-shipment-stream.git
cd cipher-shipment-stream/pro28

# Install all dependencies (recommended)
make install

# Or install manually
npm install
cd frontend && npm install && cd ..
```

## 🚀 Quick Start

### One-Command Setup

```bash
# Complete setup, test, and deployment
make setup-all
```

### Manual Setup Steps

1. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Configure your settings
# Required: INFURA_API_KEY, PRIVATE_KEY, etc.
```

2. **Contract Development**
```bash
# Compile contracts
npm run compile

# Run comprehensive tests
npm run test

# Generate TypeScript bindings
npm run typechain
```

3. **Local Development**
```bash
# Start local FHEVM node
npm run node

# Deploy contracts locally
npm run deploy:localhost

# Start frontend development server
cd frontend && npm run dev
```

4. **Production Deployment**
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Build frontend for production
cd frontend && npm run build
```

## 📖 Usage Guide

### 🏃‍♂️ Driver Workflow

1. **Registration**: Connect wallet and register as a driver
2. **Order Submission**: Submit encrypted order completion counts
3. **Performance Evaluation**: View privacy-preserving performance results
4. **Analytics**: Monitor performance trends and statistics

### 👨‍💼 Administrator Workflow

1. **System Setup**: Configure thresholds and system parameters
2. **Batch Operations**: Register multiple drivers simultaneously
3. **Monitoring**: Track system performance and analytics
4. **Maintenance**: Update thresholds and manage administrators

### 🔧 Developer Workflow

1. **Contract Development**: Write and test smart contracts
2. **Frontend Integration**: Build user interfaces with Web3 integration
3. **Testing**: Run comprehensive test suites
4. **Deployment**: Deploy to various networks with automated scripts

## 🔒 Security

### 🛡️ Security Features

- **FHE Encryption**: All sensitive data encrypted end-to-end
- **Access Control**: Multi-signature requirements for critical operations
- **Input Validation**: Comprehensive sanitization and bounds checking
- **Audit Trail**: Complete transaction history with timestamps
- **Gas Limits**: Protection against economic attacks

### 🔍 Security Considerations

- **Private Key Management**: Never commit private keys to version control
- **Network Security**: Always verify contract addresses on mainnet
- **Input Sanitization**: All user inputs are validated and sanitized
- **Access Patterns**: Least privilege access for all operations
- **Upgrade Safety**: Timelock mechanisms for critical updates

### 🚨 Known Limitations

- FHE operations require relayer infrastructure
- Gas costs higher than traditional smart contracts
- Limited to supported FHE operations (arithmetic, comparisons)
- Requires specialized hardware for optimal performance

## 🧪 Testing

### Test Coverage

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests

# Gas usage analysis
npm run test:gas
```

### Test Structure

```
test/
├── unit/           # Unit tests for individual functions
├── integration/    # Cross-contract interaction tests
├── security/       # Security-focused test scenarios
└── fuzzing/        # Property-based testing
```

### Continuous Integration

Automated testing runs on every PR with:
- 100% code coverage requirement
- Gas usage regression detection
- Security vulnerability scanning
- Performance benchmarking

## 🚢 Deployment

### Network Support

- **Local Development**: Hardhat Network
- **Test Networks**: Sepolia, Mumbai, Fuji
- **Main Networks**: Ethereum Mainnet, Polygon, Avalanche

### Deployment Scripts

```bash
# Local deployment
npm run deploy:localhost

# Testnet deployment
npm run deploy:sepolia
npm run deploy:mumbai

# Mainnet deployment (requires confirmation)
npm run deploy:mainnet
```

### Environment Variables

```bash
# Required for deployment
INFURA_API_KEY=your_infura_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key

# Optional
RELAYER_URL=https://relayer.zama.ai
```

## 📊 API Reference

### Smart Contract API

#### Core Functions

```solidity
// Driver Management
function registerDriver(address driver) external
function batchRegisterDrivers(address[] calldata drivers) external onlyOwner
function deregisterDriver(address driver) external

// Performance Operations
function submitOrderCount(address driver, externalEuint32 encryptedOrderCount, bytes inputProof) external
function evaluatePerformance(address driver) external returns (ebool)
function batchEvaluatePerformance(address[] calldata drivers) external returns (ebool[])

// Administration
function setTargetThreshold(uint32 newThreshold) external onlyOwner
function addAdministrator(address newAdmin) external onlyOwner
function pause() external onlyOwner
function unpause() external onlyOwner
```

#### View Functions

```solidity
function getDriverOrderCount(address driver) external view returns (euint32)
function getPerformanceResult(address driver) external view returns (ebool)
function isDriverRegistered(address driver) external view returns (bool)
function getRegisteredDriverCount() external view returns (uint256)
function getPerformanceMetrics() external view returns (uint256, uint256, uint256)
```

### Frontend API

#### Component Props

```typescript
interface DriverRegistrationProps {
  contractAddress: `0x${string}`;
}

interface SubmitOrderCountProps {
  contractAddress: `0x${string}`;
  userAddress?: string;
}
```

#### Hook Usage

```typescript
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

// Contract interaction example
const { writeContract } = useWriteContract();
const result = useReadContract({
  address: contractAddress,
  abi: DriverPerformanceABI,
  functionName: 'getRegisteredDriverCount'
});
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/cipher-shipment-stream.git
cd cipher-shipment-stream/pro28

# Install dependencies
make install

# Create feature branch
git checkout -b feature/your-feature-name
```

### Code Standards

- **Solidity**: Follow official style guide and use Slither for security analysis
- **TypeScript**: Strict mode enabled, comprehensive type coverage
- **Testing**: 100% coverage required, integration tests for all features
- **Documentation**: All public functions documented with NatSpec

### Pull Request Process

1. Create feature branch from `main`
2. Write comprehensive tests
3. Ensure all tests pass
4. Update documentation
5. Submit PR with detailed description
6. Code review and approval required

## 📝 License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- **FHEVM**: BSD-3-Clause (Zama)
- **Wagmi**: MIT
- **Next.js**: MIT
- **Tailwind CSS**: MIT

## 🙏 Acknowledgments

### Core Technologies
- **[Zama FHEVM](https://docs.zama.ai/fhevm)**: Privacy-preserving smart contract platform
- **[Wagmi](https://wagmi.sh/)**: React hooks for Ethereum
- **[Next.js](https://nextjs.org/)**: React framework for production
- **[Hardhat](https://hardhat.org/)**: Ethereum development environment

### Inspiration & Research
- Academic research on Fully Homomorphic Encryption
- Privacy-preserving computation frameworks
- Decentralized identity and credential systems
- Zero-knowledge proof applications

### Community
- Ethereum developer community
- Zama FHEVM ecosystem
- Open-source contributors and reviewers

## 🎬 Demo Video

Watch our comprehensive demonstration video showcasing the full workflow of the Driver Performance Evaluation System:

### 📹 [View Demo Video](./logistics.mp4)

**Video Contents:**
- Complete system walkthrough from driver registration to performance evaluation
- Live demonstration of FHE encryption and privacy-preserving computations
- Real-time analytics dashboard with performance visualizations
- Mobile-responsive interface testing across different devices
- Security features demonstration with encrypted data handling
- Batch operations and administrative controls overview

**Duration:** ~5 minutes  
**Format:** MP4 (H.264)  
**Resolution:** 1920x1080 (Full HD)

---

<div align="center">

**Built with ❤️ using FHEVM by Zama**

*Privacy-preserving blockchain applications for the future*

[🌐 Live Demo](https://logistics-five-roan.vercel.app/) • [📖 Documentation](https://docs.zama.ai/) • [💬 Discord](https://discord.gg/zama)

</div>
