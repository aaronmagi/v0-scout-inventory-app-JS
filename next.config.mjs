/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore Grafana modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@grafana/data': false,
      '@grafana/runtime': false,
      '@grafana/ui': false,
      '@emotion/css': false
    };
    
    return config;
  },
}

export default nextConfig
