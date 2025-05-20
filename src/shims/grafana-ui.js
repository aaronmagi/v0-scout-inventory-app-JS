// Simplified mock implementation of @grafana/ui
// Instead of using React.createElement, we'll use simple function components

// Simple mock components that return null or basic HTML
const Button = () => null
const Input = () => null
const Select = () => null
const Modal = () => null
const LoadingPlaceholder = () => null
const Table = () => null
const Pagination = () => null
const Icon = () => null
const FieldSet = () => null
const Field = () => null
const TextArea = () => null
const Alert = () => null
const Tab = () => null
const TabsBar = () => null

// Simple mock for useStyles2
const useStyles2 = (stylesFactory) => {
  return stylesFactory({
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
  })
}

// Export all components as named exports
module.exports = {
  Button,
  Input,
  Select,
  Modal,
  LoadingPlaceholder,
  Table,
  Pagination,
  Icon,
  useStyles2,
  FieldSet,
  Field,
  TextArea,
  Alert,
  TabsBar,
  Tab,
  // Add any other components used in the app
  components: {
    DatePicker: () => null,
    TimePicker: () => null,
    TimeRangePicker: () => null,
  },
}

// Also export as default for compatibility
module.exports.default = module.exports
