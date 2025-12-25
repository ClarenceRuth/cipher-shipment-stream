import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['app', 'components', 'utils'],
    // Ignore root eslint config to avoid prettier dependency issue
    ignoreDuringBuilds: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || '31337',
  },
  webpack: (config) => {
    // Fallback for certain Node.js modules that might be used by web3 libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Ignore React Native modules that are not needed in web environment
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    // Ignore optional dependencies
    config.externals = config.externals || [];
    config.externals.push({
      'pino-pretty': 'commonjs pino-pretty',
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
