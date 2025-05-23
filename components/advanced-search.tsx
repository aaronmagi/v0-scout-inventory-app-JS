"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

interface SearchRule {
  id: string
  field: string
  operator: string
  value: string
  logic?: "AND" | "OR"
}

interface AdvancedSearchProps {
  onSearch: (filteredServers: any[], rules: SearchRule[]) => void
  servers: any[]
}

export function AdvancedSearch({ onSearch, servers }: AdvancedSearchProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchRules, setSearchRules] = useState<SearchRule[]>([])
  const [filteredFields, setFilteredFields] = useState<Array<{ display: string; value: string }>>([])

  // Define fields by category with display names and actual field paths - EXACTLY like filter-editor
  const fieldsByCategory: Record<string, Array<{ display: string; value: string }>> = {
    overview: [
      { display: "System Name", value: "name" },
      { display: "IP Address", value: "ipAddress" },
      { display: "Identifier", value: "identifier" },
      { display: "Model", value: "model" },
      { display: "Type", value: "type" },
      { display: "Status", value: "status" },
      { display: "Managed State", value: "managedState" },
      { display: "Management Controller", value: "managementController" },
      { display: "Lifecycle Status", value: "lifecycleStatus" },
      { display: "Warranty End Date", value: "warrantyEndDate" },
      { display: "Manufacture Date", value: "manufactureDate" },
      { display: "Purchase Date", value: "purchaseDate" },
      { display: "Managed by Server", value: "managedByServer" },
      { display: "Mapped Application", value: "mappedApplicationService" },
      { display: "Managed by Group", value: "managedByGroup" },
    ],
    processors: [
      { display: "Processor Model", value: "processors.model" },
      { display: "Processor Manufacturer", value: "processors.manufacturer" },
      { display: "Processor Cores", value: "processors.cores" },
      { display: "Processor Threads", value: "processors.threads" },
      { display: "Processor Speed", value: "processors.speed" },
      { display: "Processor Status", value: "processors.status" },
    ],
    memory: [
      { display: "Memory Capacity", value: "memory.capacity" },
      { display: "Memory Manufacturer", value: "memory.manufacturer" },
      { display: "Memory Type", value: "memory.type" },
      { display: "Memory Speed", value: "memory.speed" },
      { display: "Memory Status", value: "memory.status" },
    ],
    storage: [
      { display: "Storage Type", value: "storage.type" },
      { display: "Storage Model", value: "storage.model" },
      { display: "Storage Capacity", value: "storage.capacity" },
      { display: "Storage Protocol", value: "storage.protocol" },
      { display: "Storage Status", value: "storage.status" },
    ],
    network: [
      { display: "MAC Address", value: "network.macAddress" },
      { display: "Network Type", value: "network.type" },
      { display: "Network Speed", value: "network.speed" },
      { display: "Network Status", value: "network.status" },
    ],
    power: [
      { display: "Power State", value: "powerState" },
      { display: "Boot Status", value: "bootStatus" },
      { display: "PSU Capacity", value: "power.capacity" },
      { display: "PSU Status", value: "power.status" },
      { display: "PSU Efficiency", value: "power.efficiency" },
    ],
    system: [
      { display: "Firmware Version", value: "firmwareVersion" },
      { display: "Firmware Verification Enabled", value: "firmwareVerificationEnabled" },
      { display: "Operating System", value: "system.operatingSystem" },
      { display: "OS Version", value: "system.osVersion" },
      { display: "Uptime", value: "system.uptime" },
      { display: "Lockdown Mode", value: "lockdownMode" },
    ],
  }

  // Map common field name variations to our new structure
  const fieldMappings: Record<string, string> = {
    "System Name": "name",
    Name: "name",
    "IP Address": "ipAddress",
    IPAddress: "ipAddress",
    Identifier: "identifier",
    Model: "model",
    Type: "type",
    Status: "status",
    "Managed State": "managedState",
    "Management Controller": "managementController",
    "Lifecycle Status": "lifecycleStatus",
    "Lifecycle Stage Status": "lifecycleStatus",
    "Warranty End Date": "warrantyEndDate",
    "Warranty Info": "warrantyEndDate",
    "Manufacture Date": "manufactureDate",
    "Purchase Date": "purchaseDate",
    "Power State": "powerState",
    "Boot Status": "bootStatus",
    "Firmware Version": "firmwareVersion",
    FirmwareVerificationEnabled: "firmwareVerificationEnabled",
    RequireRecoverySetPrivilege: "requireRecoverySetPrivilege",
    PasswordPolicyMinLength: "passwordPolicyMinLength",
    CertificateIsSelfSigned: "certificateIsSelfSigned",
    CertificateIssuer: "certificateIssuer",
    "System.ServerSettings.LockdownMode": "lockdownMode",
    AccountName: "accountName",
    AccountEnabled: "accountEnabled",
    "Storage Interface": "storage.protocol",
  }

  // Combine all fields for the "all" category
  const allFields = Object.values(fieldsByCategory).flat()

  // Function to evaluate filter rules against server data
  const evaluateFilter = (server: any, rules: SearchRule[]): boolean => {
    if (rules.length === 0) return true

    let result = true
    let currentLogic = "AND"

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]

      // Map the field to the correct property path if needed
      let fieldPath = rule.field
      if (fieldMappings[fieldPath]) {
        fieldPath = fieldMappings[fieldPath]
      }

      const fieldValue = getFieldValue(server, fieldPath, rule)
      const ruleResult = evaluateRule(fieldValue, rule.operator, rule.value)

      if (i === 0) {
        result = ruleResult
      } else {
        if (currentLogic === "AND") {
          result = result && ruleResult
        } else if (currentLogic === "OR") {
          result = result || ruleResult
        }
      }

      if (i < rules.length - 1) {
        currentLogic = rule.logic
      }
    }

    return result
  }

  // Helper function to get field value from server object
  const getFieldValue = (server: any, fieldPath: string, rule?: SearchRule): any => {
    // Special case for "warrantyEndDate" field when checking for expired warranties
    if (fieldPath === "warrantyEndDate") {
      if (server.warrantyEndDate) {
        const today = new Date()
        const sixMonthsFromNow = new Date()
        sixMonthsFromNow.setMonth(today.getMonth() + 6)
        const warrantyDate = new Date(server.warrantyEndDate)

        // For "expired" check
        if (rule && rule.value.toLowerCase() === "expired") {
          return warrantyDate < today
        }

        // For date comparison with "less than" operator
        if (rule && (rule.operator === "less than" || rule.operator === "less than or equal")) {
          return server.warrantyEndDate
        }
      }
    }

    const parts = fieldPath.split(".")
    let value: any = server

    for (const part of parts) {
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          value = value.find((item) => item && item[part] !== undefined)?.[part]
        } else {
          value = value[part]
        }
      } else {
        return undefined
      }
    }

    return value
  }

  // Helper function to evaluate a single rule
  const evaluateRule = (fieldValue: any, operator: string, ruleValue: string): boolean => {
    if (fieldValue === undefined || fieldValue === null) {
      return operator === "is null"
    }

    // Special handling for date comparisons
    if (
      operator === "less than" ||
      operator === "less than or equal" ||
      operator === "greater than" ||
      operator === "greater than or equal"
    ) {
      if (isDateString(String(fieldValue)) && isDateString(ruleValue)) {
        const fieldDate = new Date(fieldValue)
        const ruleDate = new Date(ruleValue)

        switch (operator) {
          case "less than":
            return fieldDate < ruleDate
          case "less than or equal":
            return fieldDate <= ruleDate
          case "greater than":
            return fieldDate > ruleDate
          case "greater than or equal":
            return fieldDate >= ruleDate
        }
      }

      return operator === "less than"
        ? Number(fieldValue) < Number(ruleValue)
        : operator === "less than or equal"
          ? Number(fieldValue) <= Number(ruleValue)
          : operator === "greater than"
            ? Number(fieldValue) > Number(ruleValue)
            : Number(fieldValue) >= Number(ruleValue)
    }

    const stringValue = String(fieldValue).toLowerCase()
    const ruleValueLower = ruleValue.toLowerCase()

    switch (operator) {
      case "equals":
        return stringValue === ruleValueLower
      case "contains":
        return stringValue.includes(ruleValueLower)
      case "starts with":
        return stringValue.startsWith(ruleValueLower)
      case "ends with":
        return stringValue.endsWith(ruleValueLower)
      case "is null":
        return fieldValue === null || fieldValue === undefined
      case "is not null":
        return fieldValue !== null && fieldValue !== undefined
      default:
        return false
    }
  }

  // Helper function to check if a string is a valid date
  const isDateString = (str: string): boolean => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const date = new Date(str)
      return !isNaN(date.getTime())
    }
    return false
  }

  // Helper function to find the display name for a field value
  const getFieldDisplay = (fieldValue: string): string => {
    for (const category in fieldsByCategory) {
      const field = fieldsByCategory[category].find((f) => f.value === fieldValue)
      if (field) return field.display
    }
    return fieldValue
  }

  // Update filtered fields when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredFields(allFields)
    } else {
      setFilteredFields(fieldsByCategory[activeCategory] || [])
    }
  }, [activeCategory])

  // Load saved search from localStorage on component mount
  useEffect(() => {
    const savedSearch = localStorage.getItem("advancedSearch")
    if (savedSearch) {
      try {
        const parsed = JSON.parse(savedSearch)
        setSearchRules(parsed.rules || [])
        setActiveCategory(parsed.category || "all")
        if (parsed.rules && parsed.rules.length > 0) {
          executeSearch(parsed.rules)
        }
      } catch (error) {
        console.error("Error loading saved search:", error)
      }
    }
  }, [])

  // Save search to localStorage whenever rules change
  useEffect(() => {
    if (searchRules.length > 0) {
      localStorage.setItem(
        "advancedSearch",
        JSON.stringify({
          rules: searchRules,
          category: activeCategory,
        }),
      )
    }
  }, [searchRules, activeCategory])

  const handleAddRule = () => {
    setSearchRules([
      ...searchRules,
      {
        id: Date.now().toString(),
        field: filteredFields[0]?.value || "name",
        operator: "equals",
        value: "",
        logic: searchRules.length > 0 ? "AND" : undefined,
      },
    ])
  }

  const handleRemoveRule = (id: string) => {
    setSearchRules(searchRules.filter((rule) => rule.id !== id))
  }

  const handleRuleChange = (id: string, field: keyof SearchRule, value: string) => {
    setSearchRules(searchRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const executeSearch = (rules: SearchRule[] = searchRules) => {
    if (rules.length === 0) {
      onSearch(servers, [])
      return
    }

    try {
      const results = servers.filter((server) => evaluateFilter(server, rules))
      onSearch(results, rules)
    } catch (error) {
      console.error("Error evaluating filter:", error)
      onSearch([], [])
    }
  }

  const clearSearch = () => {
    setSearchRules([])
    localStorage.removeItem("advancedSearch")
    onSearch(servers, [])
  }

  const operators = [
    "equals",
    "contains",
    "starts with",
    "ends with",
    "greater than",
    "less than",
    "greater than or equal",
    "less than or equal",
    "is null",
    "is not null",
  ]

  const logicOperators = ["AND", "OR"]

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-3">Advanced Search</h3>

        {/* Category buttons - exactly like filter editor */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant={activeCategory === "all" ? "default" : "outline"} onClick={() => setActiveCategory("all")}>
            All Fields
          </Button>
          <Button
            variant={activeCategory === "overview" ? "default" : "outline"}
            onClick={() => setActiveCategory("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeCategory === "processors" ? "default" : "outline"}
            onClick={() => setActiveCategory("processors")}
          >
            Processors
          </Button>
          <Button
            variant={activeCategory === "memory" ? "default" : "outline"}
            onClick={() => setActiveCategory("memory")}
          >
            Memory
          </Button>
          <Button
            variant={activeCategory === "storage" ? "default" : "outline"}
            onClick={() => setActiveCategory("storage")}
          >
            Storage
          </Button>
          <Button
            variant={activeCategory === "network" ? "default" : "outline"}
            onClick={() => setActiveCategory("network")}
          >
            Network
          </Button>
          <Button
            variant={activeCategory === "power" ? "default" : "outline"}
            onClick={() => setActiveCategory("power")}
          >
            Power
          </Button>
          <Button
            variant={activeCategory === "system" ? "default" : "outline"}
            onClick={() => setActiveCategory("system")}
          >
            System
          </Button>
        </div>

        {/* Search Rules */}
        <div className="mb-4">
          <h4 className="text-md font-bold mb-3">Search Rules</h4>

          {searchRules.map((rule, index) => (
            <div key={rule.id} className="flex items-center gap-2 mb-3 bg-gray-50 p-3 rounded border">
              <Select value={rule.field} onValueChange={(value) => handleRuleChange(rule.id, "field", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue>{getFieldDisplay(rule.field)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={rule.operator} onValueChange={(value) => handleRuleChange(rule.id, "operator", value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={rule.value}
                onChange={(e) => handleRuleChange(rule.id, "value", e.target.value)}
                className="flex-1"
                placeholder="Enter value..."
              />

              {index < searchRules.length - 1 && (
                <Select value={rule.logic} onValueChange={(value) => handleRuleChange(rule.id, "logic", value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {logicOperators.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRule(rule.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full py-2 border-dashed" onClick={handleAddRule}>
            <Plus className="h-4 w-4 mr-2" />
            Add Search Rule
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={clearSearch}>
            Clear
          </Button>
          <Button onClick={() => executeSearch()}>Search</Button>
        </div>
      </div>
    </div>
  )
}
