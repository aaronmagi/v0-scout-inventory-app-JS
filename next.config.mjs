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
    // Add a fallback for the missing modules using path strings instead of require.resolve
    config.resolve.alias = {
      ...config.resolve.alias,
      '@grafana/ui': './src/shims/grafana-ui.ts',
      './filter.mjs': './src/components/filter.js',
      './Cascader/optionMappings.mjs': './src/components/Cascader/optionMappings.js'
    };
    
    return config;
  },
};

export default nextConfig;
