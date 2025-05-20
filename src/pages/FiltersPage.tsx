"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getBackendSrv } from "@grafana/runtime"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"
import { API_BASE_URL } from "../constants"

// Custom components instead of Grafana UI
const LoadingPlaceholder = ({ text }: { text: string }) => (
  <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>{text || "Loading..."}</div>
)

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: string
  size?: string
  icon?: string
}) => (
  <button
    onClick={onClick}
    style={{
      padding: size === "sm" ? "4px 8px" : "8px 16px",
      backgroundColor: variant === "primary" ? "#3b82f6" : "transparent",
      color: variant === "primary" ? "white" : "#3b82f6",
      border: variant === "primary" ? "none" : "1px solid #3b82f6",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    {icon && <span style={{ marginRight: "4px" }}>⚙️</span>}
    {children}
  </button>
)

const Input = ({
  value,
  onChange,
  placeholder,
  width,
}: {
  value: string
  onChange: (e: any) => void
  placeholder?: string
  width?: number
}) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      padding: "8px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      width: width ? `${width}px` : "100%",
    }}
  />
)

const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: {
  value: string
  onChange: (e: any) => void
  placeholder?: string
  rows?: number
  className?: string
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    style={{
      padding: "8px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      width: "100%",
      fontFamily: className?.includes("monospace") ? "monospace" : "inherit",
    }}
  />
)

const Select = ({
  value,
  onChange,
  options = [],
  placeholder,
  width,
}: {
  value: string
  onChange: (v: { value: string }) => void
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  width?: number
}) => (
  <select
    value={value}
    onChange={(e) => onChange({ value: e.target.value })}
    style={{
      padding: "8px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      width: width ? `${width}px` : "100%",
    }}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

// Custom useStyles2 hook
const useStyles2 = (fn: any) =>
  fn({
    colors: {
      primary: { text: "#3b82f6" },
      text: { secondary: "#6b7280" },
      background: { primary: "#ffffff", secondary: "#f9fafb" },
      border: { weak: "#e5e7eb" },
    },
    shadows: { z1: "0 1px 3px rgba(0, 0, 0, 0.1)" },
  })

interface FilterRule {
  id: string
  field: string
  operator: string
  value: string
  logic: string
}

interface Filter {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  query: string
  redfishResource?: string
  rules?: FilterRule[]
  category?: string
}

export function FiltersPage() {
  const styles = useStyles2(getStyles)
  const [filter, setFilter] = useState<Filter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [filterName, setFilterName] = useState("")
  const [filterDescription, setFilterDescription] = useState("")
  const [shareWith, setShareWith] = useState("all-users")
  const [redfishResource, setRedfishResource] = useState("")
  const [filterRules, setFilterRules] = useState<FilterRule[]>([])
  const [sqlQuery, setSqlQuery] = useState("")

  // Get filter ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const filterId = urlParams.get("id")
  const isNewFilter = !filterId || filterId === "new"

  useEffect(() => {
    if (isNewFilter) {
      // Set default values for new filter
      setFilterName("")
      setFilterDescription("")
      setShareWith("all-users")
      setRedfishResource("")
      setFilterRules([
        {
          id: "1",
          field: "Model Name",
          operator: "equals",
          value: "",
          logic: "AND",
        },
      ])
      setSqlQuery("")
      setIsLoading(false)
    } else if (filterId) {
      fetchFilterDetails(filterId)
    } else {
      setError("Filter ID is missing from the URL")
      setIsLoading(false)
    }
  }, [filterId, isNewFilter])

  const fetchFilterDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would use the backend API
      // For now, we'll simulate the API call
      const response = await getBackendSrv().get(`${API_BASE_URL}/filters/${id}`)

      setFilter(response)
      setFilterName(response.name)
      setFilterDescription(response.description)
      setShareWith(response.isPublic ? "all-users" : "only-me")
      if (response.redfishResource) {
        setRedfishResource(response.redfishResource)
      }
      if (response.rules && response.rules.length > 0) {
        setFilterRules(response.rules)
      } else {
        // Default rules if none exist
        setFilterRules([
          {
            id: "1",
            field: "Model Name",
            operator: "equals",
            value: "",
            logic: "AND",
          },
        ])
      }
      if (response.query) {
        setSqlQuery(response.query)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching filter details:", err)
      setError("Failed to fetch filter details. Please try again later.")
      setIsLoading(false)
    }
  }

  const handleSaveFilter = async () => {
    // In a real implementation, this would save to the backend API
    // For now, we'll just simulate the API call
    try {
      const filterData = {
        id: filter?.id,
        name: filterName,
        description: filterDescription,
        isPublic: shareWith === "all-users",
        redfishResource,
        rules: filterRules,
        query: sqlQuery,
      }

      if (isNewFilter) {
        await getBackendSrv().post(`${API_BASE_URL}/filters`, filterData)
      } else {
        await getBackendSrv().put(`${API_BASE_URL}/filters/${filterId}`, filterData)
      }

      // Navigate back to the main page
      window.location.href = "/a/tmobile-scout-inventory"
    } catch (err) {
      console.error("Error saving filter:", err)
      setError("Failed to save filter. Please try again later.")
    }
  }

  const handleAddRule = () => {
    setFilterRules([
      ...filterRules,
      {
        id: Date.now().toString(),
        field: "Model Name",
        operator: "equals",
        value: "",
        logic: "AND",
      },
    ])
  }

  const handleRemoveRule = (id: string) => {
    setFilterRules(filterRules.filter((rule) => rule.id !== id))
  }

  const handleRuleChange = (id: string, field: keyof FilterRule, value: string) => {
    setFilterRules(filterRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  if (isLoading) {
    return <LoadingPlaceholder text="Loading filter details..." />
  }

  if (error && !isNewFilter) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error</h3>
        <p>{error}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  // Sample field options - in a real implementation, these would come from your API
  const fields = [
    "Model Name",
    "Manufacturer",
    "Max Speed (MHz)",
    "Core Count",
    "Thread Count",
    "Capacity (MiB)",
    "Type",
    "Speed (MHz)",
    "Device Name",
    "Model",
    "Capacity",
    "Firmware Version",
    "Interface Name",
    "MAC Address",
    "Speed (Mbps)",
    "PSU Name",
    "Serial Number",
    "Hostname (Name)",
    "Location",
  ]

  const operators = [
    "equals",
    "greater than",
    "less than",
    "greater than or equal",
    "less than or equal",
    "contains",
    "starts with",
    "ends with",
    "is null",
    "is not null",
  ]

  const logicOperators = ["AND", "OR"]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isNewFilter ? "New Filter" : "Edit Filter"}</h1>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveFilter}>
            Save Filter
          </Button>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Filter Name</label>
          <Input
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter a name for this filter"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <TextArea
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            placeholder="Enter a description (optional)"
            rows={2}
          />
        </div>

        {redfishResource && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Redfish Resource</label>
            <Input
              value={redfishResource}
              onChange={(e) => setRedfishResource(e.target.value)}
              placeholder="Enter Redfish resource path"
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Share with</label>
          <Select
            value={shareWith}
            onChange={(v) => v.value && setShareWith(v.value)}
            options={[
              { label: "Only me", value: "only-me" },
              { label: "All users", value: "all-users" },
              { label: "Specific users or groups", value: "specific-users" },
            ]}
          />
        </div>

        {/* Custom tabs implementation */}
        <div className="flex border-b border-gray-200 mb-4">
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "basic" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "advanced" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "sql" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("sql")}
          >
            SQL Editor
          </div>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "basic" && (
            <div>
              <div className={styles.categoryButtons}>
                <Button variant="secondary">All Fields</Button>
                <Button variant="secondary">Hardware</Button>
                <Button variant="secondary">Network</Button>
                <Button variant="secondary">System Info</Button>
                <Button variant="secondary">Management</Button>
                <Button variant="secondary">Status</Button>
              </div>

              <h3 className={styles.sectionTitle}>Filter Rules</h3>

              {filterRules.map((rule, index) => (
                <div key={rule.id} className={styles.ruleRow}>
                  <Select
                    value={rule.field}
                    onChange={(v) => v.value && handleRuleChange(rule.id, "field", v.value)}
                    options={fields.map((field) => ({ label: field, value: field }))}
                    width={20}
                  />

                  <Select
                    value={rule.operator}
                    onChange={(v) => v.value && handleRuleChange(rule.id, "operator", v.value)}
                    options={operators.map((op) => ({ label: op, value: op }))}
                    width={20}
                  />

                  <Input
                    value={rule.value}
                    onChange={(e) => handleRuleChange(rule.id, "value", e.target.value)}
                    placeholder="Value"
                    width={20}
                  />

                  {index < filterRules.length - 1 && (
                    <Select
                      value={rule.logic}
                      onChange={(v) => v.value && handleRuleChange(rule.id, "logic", v.value)}
                      options={logicOperators.map((op) => ({ label: op, value: op }))}
                      width={10}
                    />
                  )}

                  <Button variant="secondary" size="sm" onClick={() => handleRemoveRule(rule.id)}>
                    🗑️
                  </Button>
                </div>
              ))}

              <Button variant="secondary" onClick={handleAddRule} className={styles.addRuleButton}>
                Add Filter Rule
              </Button>

              <div className={styles.previewContainer}>
                <h3 className={styles.previewTitle}>Filter Preview</h3>
                <div className={styles.previewText}>
                  This filter will return approximately {Math.floor(Math.random() * 100) + 20} servers
                </div>
                {filterRules.map((rule, index) => (
                  <div key={rule.id} className={styles.previewRule}>
                    <strong>{rule.field}</strong> {rule.operator} {rule.value}
                    {index < filterRules.length - 1 && ` ${rule.logic}`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div>
              <p>Advanced filter options would be implemented here.</p>
            </div>
          )}

          {activeTab === "sql" && (
            <div>
              <h3 className={styles.sectionTitle}>SQL Query Editor</h3>
              <TextArea
                value={
                  sqlQuery ||
                  `SELECT *
FROM servers
WHERE 
  ${filterRules
    .map((rule, i) => {
      const condition = `${rule.field.replace(/\./g, "_").toLowerCase()} ${rule.operator.replace(/ /g, "_")} '${rule.value}'`
      return i === 0 ? condition : `  ${rule.logic} ${condition}`
    })
    .join("\n")}
ORDER BY hostname;`
                }
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={8}
                className="monospace"
              />
              <div className={styles.sqlButtons}>
                <Button variant="secondary">Validate Query</Button>
                <Button variant="primary">Test Query</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      padding: 16px;
      height: 100%;
    `,
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    `,
    headerActions: css`
      display: flex;
      gap: 8px;
    `,
    formContainer: css`
      background-color: ${theme.colors.background.primary};
      border-radius: 4px;
      box-shadow: ${theme.shadows.z1};
      padding: 16px;
    `,
    formGroup: css`
      margin-bottom: 16px;
    `,
    label: css`
      display: block;
      font-weight: 500;
      margin-bottom: 4px;
    `,
    tabContent: css`
      padding: 16px 0;
    `,
    categoryButtons: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    `,
    sectionTitle: css`
      margin-top: 0;
      margin-bottom: 16px;
    `,
    ruleRow: css`
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px;
      background-color: ${theme.colors.background.secondary};
      border-radius: 4px;
    `,
    addRuleButton: css`
      width: 100%;
      margin-bottom: 16px;
    `,
    previewContainer: css`
      background-color: ${theme.colors.background.secondary};
      padding: 16px;
      border-radius: 4px;
    `,
    previewTitle: css`
      font-weight: 500;
      margin-bottom: 8px;
    `,
    previewText: css`
      color: ${theme.colors.text.secondary};
      margin-bottom: 12px;
    `,
    previewRule: css`
      margin-bottom: 4px;
    `,
    sqlEditor: css`
      font-family: monospace;
    `,
    sqlButtons: css`
      display: flex;
      gap: 8px;
      margin-top: 8px;
    `,
    errorContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;
    `,
  }
}
