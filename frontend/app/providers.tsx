'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { sepolia, hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Use a valid WalletConnect Project ID or skip WalletConnect
// Get your free project ID from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Create config with minimal connectors to avoid remote config issues
let connectors;
if (projectId && projectId !== 'placeholder-id') {
  const { connectors: defaultConnectors } = getDefaultWallets({
    appName: 'Logistics Encryption System',
    projectId,
  });
  connectors = defaultConnectors;
} else {
  // Use injected connector only when no valid project ID
  connectors = [injected()];
}

const config = createConfig({
  chains: [sepolia, hardhat],
  connectors,
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
