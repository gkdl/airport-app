import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@airport-app/tokens', '@airport-app/types', '@airport-app/utils', '@airport-app/hooks'],
};

export default nextConfig;
