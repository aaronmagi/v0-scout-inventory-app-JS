// Enhanced mock implementation of @grafana/ui
const React = require("react")

// Create a more functional mock for the Tab component
const Tab = ({ label, active, onChangeTab, children }) => {
  return React.createElement(
    "div",
    {
      className: `tab ${active ? "active" : ""}`,
      onClick: onChangeTab,
      style: {
        padding: "8px 16px",
        cursor: "pointer",
        borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
        fontWeight: active ? "bold" : "normal",
        display: "inline-block",
      },
    },
    label || children,
  )
}

// Create a more functional mock for the TabsBar component
const TabsBar = ({ children }) => {
  return React.createElement(
    "div",
    {
      className: "tabs-bar",
      style: {
        display: "flex",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "16px",
      },
    },
    children,
  )
}

// Create a more functional mock for the Table component
const Table = ({ data, columns, renderCell, className }) => {
  return React.createElement("table", { className: className || "table" }, [
    React.createElement(
      "thead",
      { key: "thead" },
      React.createElement(
        "tr",
        {},
        columns.map((column, i) => React.createElement("th", { key: i }, column.header)),
      ),
    ),
    React.createElement(
      "tbody",
      { key: "tbody" },
      data.map((row, i) =>
        React.createElement(
          "tr",
          { key: i },
          columns.map((column, j) =>
            React.createElement("td", { key: j }, renderCell ? renderCell(row, column) : row[column.id]),
          ),
        ),
      ),
    ),
  ])
}

// Create a more functional mock for the Pagination component
const Pagination = ({ currentPage, numberOfPages, onNavigate }) => {
  const pages = []
  for (let i = 1; i <= numberOfPages; i++) {
    pages.push(
      React.createElement(
        "button",
        {
          key: i,
          onClick: () => onNavigate(i),
          style: {
            padding: "4px 8px",
            margin: "0 2px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            backgroundColor: currentPage === i ? "#3b82f6" : "transparent",
            color: currentPage === i ? "white" : "inherit",
            cursor: "pointer",
          },
        },
        i.toString(),
      ),
    )
  }

  return React.createElement("div", { className: "pagination" }, pages)
}

// Create a more functional mock for the LoadingPlaceholder component
const LoadingPlaceholder = ({ text }) => {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "#6b7280",
      },
    },
    text || "Loading...",
  )
}

// Create a more functional mock for the Button component
const Button = ({ variant, onClick, disabled, children, className, icon }) => {
  return React.createElement(
    "button",
    {
      onClick,
      disabled,
      className: className || `btn btn-${variant || "primary"}`,
      style: {
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        backgroundColor: variant === "primary" ? "#3b82f6" : "transparent",
        color: variant === "primary" ? "white" : "#3b82f6",
        border: variant === "primary" ? "none" : "1px solid #3b82f6",
      },
    },
    [icon && React.createElement("span", { key: "icon", className: `icon icon-${icon}` }), children],
  )
}

// Create a more functional mock for the Input component
const Input = ({ value, onChange, placeholder, className }) => {
  return React.createElement("input", {
    value,
    onChange,
    placeholder,
    className: className || "input",
    style: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #e5e7eb",
      width: "100%",
    },
  })
}

// Create a more functional mock for the Select component
const Select = ({ options, value, onChange, placeholder, className }) => {
  return React.createElement(
    "select",
    {
      value,
      onChange: (e) => onChange({ value: e.target.value }),
      className: className || "select",
      style: {
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid #e5e7eb",
        width: "100%",
      },
    },
    [
      placeholder && React.createElement("option", { key: "placeholder", value: "" }, placeholder),
      ...(options || []).map((option, i) =>
        React.createElement("option", { key: i, value: option.value }, option.label),
      ),
    ],
  )
}

// Create a CSS-in-JS utility function
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

// Create a Modal component
const Modal = ({ title, isOpen, onDismiss, children, className }) => {
  if (!isOpen) return null
  return React.createElement(
    "div",
    {
      className: className || "modal",
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "header",
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            },
          },
          [
            React.createElement("h2", { key: "title" }, title),
            React.createElement(
              "button",
              {
                key: "close",
                onClick: onDismiss,
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                },
              },
              "×",
            ),
          ],
        ),
        React.createElement("div", { key: "content" }, children),
      ],
    ),
  )
}

// Create a FieldSet component
const FieldSet = ({ label, children }) => {
  return React.createElement(
    "fieldset",
    {
      style: {
        border: "1px solid #e5e7eb",
        borderRadius: "4px",
        padding: "16px",
        marginBottom: "16px",
      },
    },
    [React.createElement("legend", { key: "legend" }, label), children],
  )
}

// Create a Field component
const Field = ({ label, description, children }) => {
  return React.createElement(
    "div",
    {
      style: {
        marginBottom: "16px",
      },
    },
    [
      React.createElement("label", { key: "label", style: { display: "block", marginBottom: "4px" } }, label),
      description &&
        React.createElement(
          "div",
          { key: "description", style: { fontSize: "0.875rem", color: "#6b7280", marginBottom: "4px" } },
          description,
        ),
      children,
    ],
  )
}

// Create a TextArea component
const TextArea = ({ value, onChange, placeholder, rows, className }) => {
  return React.createElement("textarea", {
    value,
    onChange,
    placeholder,
    rows,
    className: className || "textarea",
    style: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #e5e7eb",
      width: "100%",
      fontFamily: "inherit",
    },
  })
}

// Create an Alert component
const Alert = ({ title, severity, children }) => {
  const colors = {
    success: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
    error: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
    warning: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    info: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  }

  const color = colors[severity || "info"]

  return React.createElement(
    "div",
    {
      style: {
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        color: color.text,
        padding: "12px 16px",
        borderRadius: "4px",
        marginBottom: "16px",
      },
    },
    [
      title && React.createElement("div", { key: "title", style: { fontWeight: "bold", marginBottom: "4px" } }, title),
      children,
    ],
  )
}

// Create an Icon component
const Icon = ({ name }) => React.createElement("span", { className: `icon icon-${name}` }, name)

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
}

// Also export as default for compatibility
module.exports.default = module.exports
