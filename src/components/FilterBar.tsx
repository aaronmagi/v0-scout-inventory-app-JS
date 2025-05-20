"use client"

import type React from "react"
import { useState } from "react"
import { css } from "@emotion/css"
import { InteractiveSearch } from "./InteractiveSearch"

interface FilterBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filterId: string) => void
  selectedFilter: string
}

// Custom useStyles2 hook
const useStyles2 = (fn: any) =>
  fn({
    colors: {
      primary: { text: "#3b82f6" },
      text: { secondary: "#6b7280" },
      background: { primary: "#ffffff", secondary: "#f9fafb" },
      border: { weak: "#e5e7eb" },
    },
  })

// Custom Input component
const Input = ({
  prefix,
  placeholder,
  value,
  onChange,
  className,
}: {
  prefix?: React.ReactNode
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}) => (
  <div className="relative flex-1">
    {prefix && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{prefix}</div>}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${prefix ? "pl-8" : ""} ${className}`}
    />
  </div>
)

// Custom Button component
const Button = ({
  children,
  onClick,
  variant = "primary",
  href,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: string
  href?: string
  disabled?: boolean
  className?: string
}) => {
  const style = {
    padding: "8px 16px",
    backgroundColor: variant === "primary" ? "#3b82f6" : "transparent",
    color: variant === "primary" ? "white" : "#3b82f6",
    border: variant === "primary" ? "none" : "1px solid #3b82f6",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    textDecoration: "none",
    display: "inline-block",
  }

  return href ? (
    <a href={href} style={style as React.CSSProperties} className={className}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} disabled={disabled} style={style} className={className}>
      {children}
    </button>
  )
}

// Custom Select component
const Select = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}: {
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: { value: string }) => void
  placeholder?: string
  className?: string
}) => (
  <select
    value={value}
    onChange={(e) => onChange({ value: e.target.value })}
    className={`p-2 border rounded ${className}`}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

// Custom Modal component
const Modal = ({
  title,
  isOpen,
  onDismiss,
  children,
  className,
}: {
  title: string
  isOpen: boolean
  onDismiss: () => void
  children: React.ReactNode
  className?: string
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onDismiss}>
      <div
        className={`bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FilterBar({ onSearch, onFilterChange, selectedFilter }: FilterBarProps) {
  const styles = useStyles2(getStyles)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)

  const filterOptions = [
    { label: "All Servers", value: "all-servers" },
    { label: "End of Life", value: "end-of-life" },
    { label: "End of Warranty", value: "end-of-warranty" },
    { label: "Manufactured 2022+", value: "manufactured-2022" },
    { label: "Power On", value: "power-on" },
    { label: "Boot Failure", value: "boot-failure" },
    { label: "Firmware Version Check", value: "firmware-version-check" },
    { label: "Password Complexity", value: "password-complexity" },
    { label: "System Lockdown Mode", value: "system-lockdown-mode" },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  const handleFilterChange = (value: { value: string }) => {
    if (value.value) {
      onFilterChange(value.value)
    }
  }

  const handleAdvancedSearch = (query: string) => {
    onSearch(query)
    setIsAdvancedSearchOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input
          prefix={<span>🔍</span>}
          placeholder="Search for servers by name, IP, model..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <Button variant="secondary" onClick={() => setIsAdvancedSearchOpen(true)} className={styles.advancedButton}>
          Advanced Search
        </Button>
      </div>

      <div className={styles.filterContainer}>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          placeholder="Select a filter"
          className={styles.filterSelect}
        />

        <Button
          variant="secondary"
          href={`/a/tmobile-scout-inventory/filters?id=${selectedFilter}`}
          disabled={selectedFilter === "all-servers"}
        >
          Edit Filter
        </Button>

        <Button variant="primary" href="/a/tmobile-scout-inventory/filters/new">
          New Filter
        </Button>
      </div>

      {isAdvancedSearchOpen && (
        <Modal
          title="Advanced Search"
          isOpen={isAdvancedSearchOpen}
          onDismiss={() => setIsAdvancedSearchOpen(false)}
          className={styles.modal}
        >
          <InteractiveSearch onSearch={handleAdvancedSearch} />
        </Modal>
      )}
    </div>
  )
}

const getStyles = (theme: any) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    `,
    searchContainer: css`
      display: flex;
      gap: 8px;
    `,
    searchInput: css`
      flex: 1;
    `,
    advancedButton: css`
      flex-shrink: 0;
    `,
    filterContainer: css`
      display: flex;
      gap: 8px;
      align-items: center;
    `,
    filterSelect: css`
      flex: 1;
    `,
    modal: css`
      width: 800px;
    `,
  }
}
