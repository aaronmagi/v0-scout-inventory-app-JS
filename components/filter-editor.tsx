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
import { getFilterById, type FilterRule } from "@/lib/data"
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
  const [activeCategory, setActiveCategory] = useState("all-fields")
  const [redfishResource, setRedfishResource] = useState("")
  const [filterRules, setFilterRules] = useState<FilterRule[]>([])
  const [sqlQuery, setSqlQuery] = useState("")

  const [showPhaseTwo, setShowPhaseTwo] = useState(false)
  const [phaseTwoFeature, setPhaseTwoFeature] = useState("Save Options")

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
        } else {
          // Handle case where filter is not found
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
    }
  }, [filterId, router, toast])

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

  const handleSaveFilter = () => {
    // Validate filter name
    if (!filterName.trim()) {
      toast({
        title: "Filter name required",
        description: "Please enter a name for this filter",
        variant: "destructive",
      })
      return
    }

    // Create filter object
    const filter = {
      id: filterId || `filter-${Date.now()}`,
      name: filterName,
      description: filterDescription,
      isPublic: shareWith === "all-users",
      rules: filterRules,
      query: sqlQuery,
      redfishResource: redfishResource,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, you would save this to a database
    console.log("Saving filter:", filter)

    toast({
      title: "Filter saved",
      description: `Filter "${filterName}" has been saved successfully.`,
    })

    router.push("/")
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

  const handlePhaseTwo = (feature: string) => {
    setPhaseTwoFeature(feature)
    setShowPhaseTwo(true)
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

              <Button variant="outline" className="w-full py-2 border-dashed" onClick={handleAddRule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Filter Rule
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-bold mb-2">Filter Preview</h3>
              <div className="text-sm text-gray-500 mb-3">
                This filter will return approximately {Math.floor(Math.random() * 100) + 20} servers
              </div>
              {filterRules.map((rule, index) => (
                <div key={rule.id} className="mb-1">
                  <strong>{rule.field}</strong> {rule.operator} {rule.value}
                  {index < filterRules.length - 1 && ` ${rule.logic}`}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-3">Advanced Filter Rules</h3>

              <div className="mb-3">
                <label className="block font-bold mb-2">Group Rules</label>
                <Select defaultValue="match-all">
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match-all">Match ALL of the following</SelectItem>
                    <SelectItem value="match-any">Match ANY of the following</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border p-4 rounded mb-4">
                {filterRules.slice(0, Math.ceil(filterRules.length / 2)).map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2 mb-3 bg-gray-50 p-3 rounded border">
                    <Select value={rule.field}>
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

                    <Select value={rule.operator}>
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

                    <Input value={rule.value} className="flex-1" />

                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" className="w-full py-2 border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule to Group
                </Button>
              </div>

              <div className="mb-3">
                <Select defaultValue="match-any">
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match-all">Match ALL of the following</SelectItem>
                    <SelectItem value="match-any">Match ANY of the following</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border p-4 rounded mb-4">
                {filterRules.slice(Math.ceil(filterRules.length / 2)).map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2 mb-3 bg-gray-50 p-3 rounded border">
                    <Select value={rule.field}>
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

                    <Select value={rule.operator}>
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

                    <Input value={rule.value} className="flex-1" />

                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" className="w-full py-2 border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule to Group
                </Button>
              </div>

              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule Group
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-bold mb-2">Filter Preview</h3>
              <div className="text-sm text-gray-500 mb-3">
                This filter will return approximately {Math.floor(Math.random() * 50) + 10} servers
              </div>
              <div className="mb-1">
                ({" "}
                {filterRules.slice(0, Math.ceil(filterRules.length / 2)).map((rule, i) => (
                  <span key={rule.id}>
                    {rule.field} {rule.operator} {rule.value}
                    {i < Math.ceil(filterRules.length / 2) - 1 && ` ${rule.logic} `}
                  </span>
                ))}{" "}
                )
              </div>
              {filterRules.length > 1 && <div className="mb-1">AND</div>}
              {filterRules.length > 1 && (
                <div className="mb-1">
                  ({" "}
                  {filterRules.slice(Math.ceil(filterRules.length / 2)).map((rule, i) => (
                    <span key={rule.id}>
                      {rule.field} {rule.operator} {rule.value}
                      {i < filterRules.slice(Math.ceil(filterRules.length / 2)).length - 1 && ` ${rule.logic} `}
                    </span>
                  ))}{" "}
                  )
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
          {fields.map((field) => (
            <div key={field} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {field}
            </div>
          ))}
        </div>
      </div>
      <PhaseTwoModal isOpen={showPhaseTwo} onClose={() => setShowPhaseTwo(false)} featureName={phaseTwoFeature} />
    </div>
  )
}
