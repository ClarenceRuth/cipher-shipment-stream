# Driver Performance Evaluation System

A decentralized application that evaluates driver performance using Fully Homomorphic Encryption (FHE) on the FHEVM network.

## Features

- **Privacy-Preserving Evaluation**: Driver performance data remains encrypted throughout the evaluation process
- **Secure Order Tracking**: Encrypted order completion counts with configurable thresholds
- **Batch Operations**: Efficient batch registration and management of multiple drivers
- **Decentralized Architecture**: Built on Ethereum-compatible FHEVM for enhanced privacy

## Architecture

### Smart Contracts
- `DriverPerformance.sol`: Main contract handling encrypted driver evaluations
- FHE operations using Zama's FHEVM library
- Encrypted comparison logic for performance assessment

### Frontend (Coming Soon)
- React-based user interface
- Web3 wallet integration
- Real-time encrypted data visualization

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 7.0.0
- Hardhat for contract development

### Quick Start

Using Makefile (recommended):
```bash
git clone <repository-url>
cd pro28
make install    # Install all dependencies
make compile    # Compile contracts
make test       # Run tests
make deploy     # Deploy to local network
make frontend-dev  # Start frontend (in another terminal)
```

### Manual Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pro28
```

2. Install dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

3. Set up environment variables
```bash
cp .env.example .env  # Configure your environment
```

4. Compile contracts
```bash
npm run compile
```

5. Run tests
```bash
npm run test
```

### Deployment

Deploy to local network:
```bash
make deploy-local
```

Deploy to Sepolia testnet:
```bash
make deploy-sepolia
```

### Frontend Development

Start development server:
```bash
make frontend-dev
```

Build for production:
```bash
make frontend-build
```

## Usage

### Contract Functions

#### Driver Registration
```solidity
registerDriver(address driver)
batchRegisterDrivers(address[] drivers) // Owner only
```

#### Order Submission
```solidity
submitOrderCount(address driver, externalEuint32 encryptedOrderCount, bytes inputProof)
```

#### Performance Evaluation
```solidity
evaluatePerformance(address driver) returns (ebool)
```

## Security Considerations

- All sensitive data remains encrypted using FHE
- Contract owner controls batch operations
- Input validation prevents invalid data submissions
- Access control ensures authorized operations only

## License

BSD-3-Clause-Clear
