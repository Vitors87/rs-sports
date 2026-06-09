import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@rs-sports/shared-types', '@rs-sports/config'],
  eslint: { ignoreDuringBuilds: true },
};

export default config;
