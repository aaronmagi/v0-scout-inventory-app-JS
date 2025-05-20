const path = require("path")

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
    // Add fallbacks for the missing modules with absolute paths
    config.resolve.alias = {
      ...config.resolve.alias,
      "@grafana/ui": path.resolve(__dirname, "./src/shims/grafana-ui.js"),
      "@grafana/data": path.resolve(__dirname, "./src/shims/grafana-data.js"),
      "@grafana/runtime": path.resolve(__dirname, "./src/shims/grafana-runtime.js"),
      "./filter.mjs": path.resolve(__dirname, "./src/shims/filter.js"),
      "./Cascader/optionMappings.mjs": path.resolve(__dirname, "./src/shims/optionMappings.js"),
    }

    return config
  },
}

module.exports = nextConfig
