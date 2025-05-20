// Mock implementation of @grafana/data
const Data = {
  // Add any data-related functions or types used
  SelectableValue: class {},
  GrafanaTheme2: class {},

  // Add any other data-related functions or types
  createTheme: () => ({
    colors: {
      primary: { text: "#3b82f6", transparent: "rgba(59, 130, 246, 0.1)" },
      secondary: { text: "#6b7280", transparent: "rgba(107, 114, 128, 0.1)" },
      success: { text: "#10b981", transparent: "rgba(16, 185, 129, 0.1)" },
      warning: { text: "#f59e0b", transparent: "rgba(245, 158, 11, 0.1)" },
      error: { text: "#ef4444", transparent: "rgba(239, 68, 68, 0.1)" },
      info: { text: "#3b82f6", transparent: "rgba(59, 130, 246, 0.1)" },
      text: { primary: "#111827", secondary: "#6b7280" },
      background: { primary: "#ffffff", secondary: "#f9fafb" },
      border: { weak: "#e5e7eb", medium: "#d1d5db", strong: "#9ca3af" },
    },
    shadows: {
      z1: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    typography: {
      size: {
        sm: "0.875rem",
      },
    },
  }),
}

// Export both as named exports and as default
module.exports = Data
module.exports.default = Data
