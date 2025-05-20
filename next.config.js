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
      // Grafana mocks
      "@grafana/ui": path.resolve(__dirname, "./src/shims/grafana-ui.js"),
      "@grafana/data": path.resolve(__dirname, "./src/shims/grafana-data.js"),
      "@grafana/runtime": path.resolve(__dirname, "./src/shims/grafana-runtime.js"),

      // Filter and Cascader mocks
      "./filter.mjs": path.resolve(__dirname, "./src/shims/filter.js"),
      "./Cascader/optionMappings.mjs": path.resolve(__dirname, "./src/shims/optionMappings.js"),

      // rc-picker mock
      "rc-picker/lib/generate/moment": path.resolve(__dirname, "./src/shims/rc-picker/lib/generate/moment.js"),

      // Add any other problematic imports here
    }

    // Add fallback for any other missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    return config
  },
}

module.exports = nextConfig
