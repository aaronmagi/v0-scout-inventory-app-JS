"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, X, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getFilterById, type FilterRule } from "@/lib/data"

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
  const [activeCategory, setActiveCategory] = useState("all-fields")
  const [redfishResource, setRedfishResource] = useState("")
  const [filterRules, setFilterRules] = useState<FilterRule[]>([])
  const [sqlQuery, setSqlQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load filter data if editing
  useEffect(() => {
    const loadFilter = async () => {
      if (filterId) {
        try {
          // Try to fetch from API first
          const response = await fetch(`/api/filters/${filterId}`)

          if (response.ok) {
            const filter = await response.json()
            populateFilterData(filter)
          } else {
            // Fallback to local data
            const filter = getFilterById(filterId)
            if (filter) {
              populateFilterData(filter)
            } else {
              toast({
                title: "Error",
                description: "Filter not found",
                variant: "destructive",
              })
            }
          }
        } catch (error) {
          console.error("Error loading filter:", error)
          // Fallback to local data
          const filter = getFilterById(filterId)
          if (filter) {
            populateFilterData(filter)
          } else {
            toast({
              title: "Error",
              description: "Failed to load filter",
              variant: "destructive",
            })
          }
        }
      } else {
        // Default values for new filter
        setFilterRules([
          {
            id: "1",
            field: "Model Name",
            operator: "equals",
            value: "",
            logic: "AND",
          },
        ])
        setIsLoading(false)
      }
    }

    loadFilter()
  }, [filterId, toast])

  const populateFilterData = (filter: any) => {
    setFilterName(filter.name)
    setFilterDescription(filter.description)
    setShareWith(filter.isPublic ? "all-users" : "only-me")
    if (filter.redfishResource) {
      setRedfishResource(filter.redfishResource)
    }
    if (filter.rules && filter.rules.length > 0) {
      setFilterRules(filter.rules)
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
    if (filter.query) {
      setSqlQuery(filter.query)
    }
    setIsLoading(false)
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

  const handleSaveFilter = async () => {
    try {
      const filterData = {
        name: filterName,
        description: filterDescription,
        isPublic: shareWith === "all-users",
        redfishResource,
        rules: filterRules,
        query: sqlQuery,
      }

      if (isEditing) {
        await fetch(`/api/filters/${filterId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterData),
        })
      } else {
        await fetch("/api/filters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterData),
        })
      }

      toast({
        title: "Filter saved",
        description: `Filter "${filterName}" has been saved successfully.`,
      })
      router.push("/")
    } catch (error) {
      console.error("Error saving filter:", error)
      toast({
        title: "Error",
        description: "Failed to save filter. Please try again.",
        variant: "destructive",
      })
    }
  }

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
    "Purchase Date",
    "Shipped Date",
    "Warranty Info",
    "Model ID",
    "Lifecycle Stage Status",
    "Managed by (Server)",
    "Mapped Application Service",
    "Managed By Group",
    "Most Recent Discovery (Redfish)",
    "Most Recent Discovery (ServiceNow)",
    "FirmwareVerificationEnabled",
    "RequireRecoverySetPrivilege",
    "Roles",
    "PasswordPolicyMinLength",
    "PasswordPolicyRequiresLowercase",
    "PasswordPolicyRequiresUppercase",
    "PasswordPolicyRequiresNumbers",
    "PasswordPolicyRequiresSymbols",
    "CertificateIsSelfSigned",
    "CertificateIssuer",
    "IPAddress",
    "InsightRemoteSupportEnabled",
    "IloFederationEnabled",
    "IPMIEnabled",
    "System.ServerSettings.LockdownMode",
    "AccountName",
    "AccountEnabled",
    "Power State",
    "Boot Status",
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

  if (isLoading) {
    return <div className="p-4">Loading filter details...</div>
  }

  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Filter" : "Create New Filter"}</h1>
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
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="sql">SQL Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={activeCategory === "all-fields" ? "default" : "outline"}
                onClick={() => setActiveCategory("all-fields")}
              >
                All Fields
              </Button>
              <Button
                variant={activeCategory === "hardware" ? "default" : "outline"}
                onClick={() => setActiveCategory("hardware")}
              >
                Hardware
              </Button>
              <Button
                variant={activeCategory === "network" ? "default" : "outline"}
                onClick={() => setActiveCategory("network")}
              >
                Network
              </Button>
              <Button
                variant={activeCategory === "system-info" ? "default" : "outline"}
                onClick={() => setActiveCategory("system-info")}
              >
                System Info
              </Button>
              <Button
                variant={activeCategory === "management" ? "default" : "outline"}
                onClick={() => setActiveCategory("management")}
              >
                Management
              </Button>
              <Button
                variant={activeCategory === "status" ? "default" : "outline"}
                onClick={() => setActiveCategory("status")}
              >
                Status
              </Button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold mb-3">Filter Rules</h3>

              {filterRules.map((rule, index) => (
                <div key={rule.id} className="flex items-center gap-2 mb-3 bg-gray-50 p-3 rounded border">
                  <Select value={rule.field} onValueChange={(value) => handleRuleChange(rule.id, "field", value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
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

              <Button variant="outline" onClick={handleAddRule} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <div className="p-4 bg-gray-50 rounded border">
              <p className="text-gray-500 mb-4">
                Advanced filtering options allow you to create more complex queries using a visual query builder.
              </p>
              <p className="text-gray-500">This feature is not implemented in the demo.</p>
            </div>
          </TabsContent>

          <TabsContent value="sql" className="mt-4">
            <div className="mb-4">
              <label className="block font-bold mb-1">SQL Query</label>
              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL query"
                rows={8}
                className="font-mono"
              />
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              <p className="text-gray-500">
                Enter a SQL query to filter servers. This query will be executed against the server database.
              </p>
              <p className="text-gray-500 mt-2">
                Example: <code>SELECT * FROM servers WHERE model LIKE '%PowerEdge%'</code>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
