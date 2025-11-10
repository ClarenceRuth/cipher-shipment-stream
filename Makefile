# Driver Performance FHE Project Makefile

.PHONY: help install clean compile test deploy verify frontend-dev frontend-build lint format

# Default target
help:
	@echo "Available commands:"
	@echo "  install          Install all dependencies"
	@echo "  clean            Clean build artifacts"
	@echo "  compile          Compile smart contracts"
	@echo "  test             Run contract tests"
	@echo "  deploy           Deploy contracts to network"
	@echo "  verify           Verify contracts on Etherscan"
	@echo "  frontend-dev     Start frontend development server"
	@echo "  frontend-build   Build frontend for production"
	@echo "  lint             Run linters"
	@echo "  format           Format code"
	@echo ""

# Installation
install:
	@echo "Installing contract dependencies..."
	npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	npm run clean
	rm -rf frontend/.next
	rm -rf frontend/out

# Contract compilation
compile:
	@echo "Compiling smart contracts..."
	npm run compile

# Testing
test:
	@echo "Running contract tests..."
	npm run test

test-sepolia:
	@echo "Running Sepolia tests..."
	npm run test:sepolia

# Deployment
deploy:
	@echo "Deploying to current network..."
	npx hardhat deploy

deploy-sepolia:
	@echo "Deploying to Sepolia..."
	npx hardhat deploy --network sepolia

# Verification
verify:
	@echo "Verifying contracts..."
	npx hardhat verify

# Frontend development
frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

frontend-build:
	@echo "Building frontend for production..."
	cd frontend && npm run build

# Code quality
lint:
	@echo "Running linters..."
	npm run lint

format:
	@echo "Formatting code..."
	npm run prettier:write

# Combined operations
build-all: compile frontend-build
	@echo "Built contracts and frontend"

test-all: test frontend-test
	@echo "Ran all tests"

# Development workflow
dev: compile
	@echo "Starting development environment..."
	@echo "Run 'make frontend-dev' in another terminal for frontend"

# CI/CD
ci: install lint test compile
	@echo "CI checks passed"

# Utility
contracts-size:
	@echo "Checking contract sizes..."
	npx hardhat size-contracts

gas-report:
	@echo "Generating gas report..."
	REPORT_GAS=true npx hardhat test

# Help for specific networks
deploy-local:
	@echo "Deploying to local network..."
	npx hardhat node &
	sleep 3
	npx hardhat deploy --network localhost

# Frontend testing (placeholder)
frontend-test:
	@echo "Frontend tests not yet implemented"
	cd frontend && npm run build
