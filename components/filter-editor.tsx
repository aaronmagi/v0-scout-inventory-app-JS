"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getFilterById, type FilterRule, type Server, serverData } from "@/lib/data"
import { PhaseTwoModal } from "@/components/phase-two-modal"

interface FilterEditorProps {
  filterId?: string
}

export function FilterEditor({ filterId }: FilterEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!filterId

  const [filterName, setFilterName] = useState("")
  const [filterDescription, setFilterDescription] = useState("")
  const [shareWith, setShareWith] = useState("all-users")
  const [activeTab, setActiveTab] = useState("basic")
  const [activeCategory, setActiveCategory] = useState("all")
  const [redfishResource, setRedfishResource] = useState("")
  const [filterRules, setFilterRules] = useState<FilterRule[]>([])
  const [sqlQuery, setSqlQuery] = useState("")
  const [filteredFields, setFilteredFields] = useState<Array<{ display: string; value: string }>>([])
  const [previewResults, setPreviewResults] = useState<Server[]>([])

  const [showPhaseTwo, setShowPhaseTwo] = useState(false)
  const [phaseTwoFeature, setPhaseTwoFeature] = useState("Save Options")

  // Define fields by category with display names and actual field paths
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
    "Storage Interface": "storage.protocol", // Map old field name to new field name
  }

  // Helper function to find the display name for a field value
  const getFieldDisplay = (fieldValue: string): string => {
    for (const category in fieldsByCategory) {
      const field = fieldsByCategory[category].find((f) => f.value === fieldValue)
      if (field) return field.display
    }
    return fieldValue // Return the value itself if no display name is found
  }

  // Combine all fields for the "all" category
  const allFields = Object.values(fieldsByCategory).flat()

  // Function to evaluate filter rules against server data
  const evaluateFilter = (server: Server, rules: FilterRule[]): boolean => {
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
  const getFieldValue = (server: Server, fieldPath: string, rule?: FilterRule): any => {
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
          // Return the actual date string for proper comparison in evaluateRule
          return server.warrantyEndDate
        }
      }
    }

    const parts = fieldPath.split(".")
    let value: any = server

    for (const part of parts) {
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          // For arrays, check if any item has the property
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

      // For numeric comparisons
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
    // Check for YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const date = new Date(str)
      return !isNaN(date.getTime())
    }
    return false
  }

  // Update preview when rules change
  useEffect(() => {
    if (filterRules.length > 0) {
      try {
        const results = serverData.filter((server) => evaluateFilter(server, filterRules))
        setPreviewResults(results)
      } catch (error) {
        console.error("Error evaluating filter:", error)
        setPreviewResults([])
      }
    } else {
      setPreviewResults(serverData)
    }
  }, [filterRules])

  // Load filter data if editing
  useEffect(() => {
    if (filterId) {
      try {
        const filter = getFilterById(filterId)
        if (filter) {
          setFilterName(filter.name)
          setFilterDescription(filter.description || "")
          setShareWith(filter.isPublic ? "all-users" : "only-me")
          if (filter.redfishResource) {
            setRedfishResource(filter.redfishResource)
          }
          if (filter.rules && filter.rules.length > 0) {
            // Map old field names to new field structure
            const updatedRules = filter.rules.map((rule) => {
              // Map field name if needed
              let fieldValue = rule.field
              if (fieldMappings[fieldValue]) {
                fieldValue = fieldMappings[fieldValue]
              }

              return {
                ...rule,
                field: fieldValue,
              }
            })

            setFilterRules(updatedRules)
          } else {
            setFilterRules([
              {
                id: "1",
                field: "name",
                operator: "equals",
                value: "",
                logic: "AND",
              },
            ])
          }
          if (filter.query) {
            setSqlQuery(filter.query)
          }
        } else {
          toast({
            title: "Filter not found",
            description: `Could not find filter with ID ${filterId}`,
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error loading filter:", error)
        toast({
          title: "Error loading filter",
          description: "There was an error loading the filter data",
          variant: "destructive",
        })
        router.push("/")
      }
    } else {
      setFilterRules([
        {
          id: "1",
          field: "name",
          operator: "equals",
          value: "",
          logic: "AND",
        },
      ])
    }
  }, [filterId, router, toast])

  // Update filtered fields when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredFields(allFields)
    } else {
      setFilteredFields(fieldsByCategory[activeCategory] || [])
    }
  }, [activeCategory])

  const handleAddRule = () => {
    setFilterRules([
      ...filterRules,
      {
        id: Date.now().toString(),
        field: filteredFields[0]?.value || "name",
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

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      toast({
        title: "Filter name required",
        description: "Please enter a name for this filter",
        variant: "destructive",
      })
      return
    }

    try {
      const filterData = {
        id: filterId || `filter-${Date.now()}`,
        name: filterName,
        description: filterDescription,
        isPublic: shareWith === "all-users",
        rules: filterRules,
        query: sqlQuery,
        redfishResource: redfishResource,
        createdBy: "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: "Custom Filters",
      }

      // In a real app, this would be an API call
      const response = await fetch(`/api/filters${filterId ? `/${filterId}` : ""}`, {
        method: filterId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filterData),
      })

      if (response.ok) {
        toast({
          title: "Filter saved",
          description: `Filter "${filterName}" has been saved successfully.`,
        })
        router.push("/")
      } else {
        throw new Error("Failed to save filter")
      }
    } catch (error) {
      console.error("Error saving filter:", error)
      toast({
        title: "Error saving filter",
        description: "There was an error saving the filter",
        variant: "destructive",
      })
    }
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

  const handlePhaseTwo = (feature: string) => {
    setPhaseTwoFeature(feature)
    setShowPhaseTwo(true)
  }

  // Generate SQL query from rules
  const generateSQLFromRules = () => {
    if (filterRules.length === 0) return "SELECT * FROM servers;"

    const conditions = filterRules.map((rule, index) => {
      const field = rule.field.replace(/\./g, "_")
      let condition = ""

      switch (rule.operator) {
        case "equals":
          condition = `${field} = '${rule.value}'`
          break
        case "contains":
          condition = `${field} LIKE '%${rule.value}%'`
          break
        case "starts with":
          condition = `${field} LIKE '${rule.value}%'`
          break
        case "ends with":
          condition = `${field} LIKE '%${rule.value}'`
          break
        case "greater than":
          condition = `${field} > ${rule.value}`
          break
        case "less than":
          condition = `${field} < ${rule.value}`
          break
        case "greater than or equal":
          condition = `${field} >= ${rule.value}`
          break
        case "less than or equal":
          condition = `${field} <= ${rule.value}`
          break
        case "is null":
          condition = `${field} IS NULL`
          break
        case "is not null":
          condition = `${field} IS NOT NULL`
          break
        default:
          condition = `${field} = '${rule.value}'`
      }

      if (index === 0) {
        return condition
      } else {
        return `  ${rule.logic} ${condition}`
      }
    })

    return `SELECT *\nFROM servers\nWHERE\n  ${conditions.join("\n")}\nORDER BY name;`
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Filter Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <Button onClick={handleSaveFilter}>Save Filter</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block font-bold mb-1">Filter Name</label>
          <Input
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter a name for this filter"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1">Description</label>
          <Textarea
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            placeholder="Enter a description (optional)"
            rows={2}
          />
        </div>

        {redfishResource && (
          <div className="mb-4">
            <label className="block font-bold mb-1">Redfish Resource</label>
            <Input
              value={redfishResource}
              onChange={(e) => setRedfishResource(e.target.value)}
              placeholder="Enter Redfish resource path"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block font-bold mb-1">Share with</label>
          <Select value={shareWith} onValueChange={setShareWith}>
            <SelectTrigger>
              <SelectValue placeholder="Select who can see this filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="only-me">Only me</SelectItem>
              <SelectItem value="all-users">All users</SelectItem>
              <SelectItem value="specific-users">Specific users or groups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="sql">SQL Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                onClick={() => setActiveCategory("all")}
              >
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

            <div className="mb-4">
              <h3 className="text-lg font-bold mb-3">Filter Rules</h3>

              {filterRules.map((rule, index) => (
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

                  {index < filterRules.length - 1 && (
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
                Add Filter Rule
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-bold mb-2">Filter Preview</h3>
              <div className="text-sm text-gray-500 mb-3">This filter will return {previewResults.length} servers</div>
              {filterRules.length > 0 && (
                <div className="mb-3">
                  {filterRules.map((rule, index) => (
                    <div key={rule.id} className="mb-1">
                      <strong>{getFieldDisplay(rule.field)}</strong> {rule.operator} "{rule.value}"
                      {index < filterRules.length - 1 && ` ${rule.logic}`}
                    </div>
                  ))}
                </div>
              )}
              {previewResults.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Sample Results:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {previewResults.slice(0, 5).map((server) => (
                      <div key={server.id} className="text-sm py-1 border-b border-gray-200 last:border-b-0">
                        {server.name} ({server.ipAddress}) - {server.status}
                      </div>
                    ))}
                    {previewResults.length > 5 && (
                      <div className="text-sm text-gray-500 mt-1">...and {previewResults.length - 5} more servers</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sql" className="mt-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-3">SQL Query Editor</h3>
              <Textarea
                className="font-mono mb-3"
                rows={8}
                value={sqlQuery || generateSQLFromRules()}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
              />
              <div className="flex gap-2">
                <Button variant="outline">Validate Query</Button>
                <Button>Test Query</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-3 pb-2 border-b">Save Options - Phase 2</h3>

        <div className="mb-4">
          <label className="block font-bold mb-1">Filter Type</label>
          <Select defaultValue="dynamic" onValueChange={() => handlePhaseTwo("Filter Type")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dynamic">Dynamic Query Filter</SelectItem>
              <SelectItem value="static">Static Filter (snapshot of current results)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1">Add to Custom Group</label>
          <Select defaultValue="none" onValueChange={() => handlePhaseTwo("Custom Group")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="performance">Performance Filters</SelectItem>
              <SelectItem value="security">Security Compliance</SelectItem>
              <SelectItem value="eol">EOL Management</SelectItem>
              <SelectItem value="create-new">+ Create New Group</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1">Schedule Auto-refresh</label>
          <Select defaultValue="manual" onValueChange={() => handlePhaseTwo("Auto-refresh")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual refresh only</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 justify-end">
          {isEditing && (
            <Button variant="destructive" onClick={() => handlePhaseTwo("Delete Filter")}>
              Delete Filter
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button onClick={handleSaveFilter}>Save Filter</Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600 mb-6">
        <h3 className="font-bold mb-2">Available Fields</h3>
        <p className="mb-2">The following fields can be used in your filter criteria:</p>
        <div className="flex flex-wrap gap-2">
          {filteredFields.map((field) => (
            <div key={field.value} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {field.display}
            </div>
          ))}
        </div>
      </div>
      <PhaseTwoModal isOpen={showPhaseTwo} onClose={() => setShowPhaseTwo(false)} featureName={phaseTwoFeature} />
    </div>
  )
}
