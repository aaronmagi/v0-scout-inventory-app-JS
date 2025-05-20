/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // Add a fallback for the missing modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@grafana/ui': require.resolve('./src/shims/grafana-ui.ts'),
      './filter.mjs': require.resolve('./src/components/filter.js'),
      './Cascader/optionMappings.mjs': require.resolve('./src/components/Cascader/optionMappings.js')
    };
    
    return config;
  },
};

export default nextConfig;
