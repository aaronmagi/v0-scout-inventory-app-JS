"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash } from "lucide-react"

interface InteractiveSearchProps {
  onSearch: (query: string) => void
}

interface Condition {
  field: string
  operator: string
  value: string
}

export function InteractiveSearch({ onSearch }: InteractiveSearchProps) {
  const [conditions, setConditions] = useState<Condition[]>([{ field: "name", operator: "contains", value: "" }])
  const [logicalOperator, setLogicalOperator] = useState<string>("AND")

  const fields = [
    { value: "name", label: "Name" },
    { value: "ipAddress", label: "IP Address" },
    { value: "model", label: "Model" },
    { value: "identifier", label: "Identifier" },
    { value: "generation", label: "Generation" },
    { value: "managementController", label: "Management Controller" },
    { value: "type", label: "Type" },
    { value: "status", label: "Status" },
    { value: "managedState", label: "Managed State" },
  ]

  const operators = [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts With" },
    { value: "endsWith", label: "Ends With" },
    { value: "greaterThan", label: "Greater Than" },
    { value: "lessThan", label: "Less Than" },
  ]

  const addCondition = () => {
    setConditions([...conditions, { field: "name", operator: "contains", value: "" }])
  }

  const removeCondition = (index: number) => {
    const newConditions = [...conditions]
    newConditions.splice(index, 1)
    setConditions(newConditions)
  }

  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setConditions(newConditions)
  }

  const buildQuery = () => {
    if (conditions.length === 0) return ""

    const conditionStrings = conditions.map((condition) => {
      const { field, operator, value } = condition

      switch (operator) {
        case "equals":
          return `${field} = "${value}"`
        case "contains":
          return `${field} CONTAINS "${value}"`
        case "startsWith":
          return `${field} STARTS WITH "${value}"`
        case "endsWith":
          return `${field} ENDS WITH "${value}"`
        case "greaterThan":
          return `${field} > "${value}"`
        case "lessThan":
          return `${field} < "${value}"`
        default:
          return `${field} = "${value}"`
      }
    })

    return conditionStrings.join(` ${logicalOperator} `)
  }

  const handleSearch = () => {
    const query = buildQuery()
    onSearch(query)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Join conditions with:</span>
        <Select value={logicalOperator} onValueChange={setLogicalOperator}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="AND" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {conditions.map((condition, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select value={condition.field} onValueChange={(value) => updateCondition(index, "field", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={condition.operator} onValueChange={(value) => updateCondition(index, "operator", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((operator) => (
                <SelectItem key={operator.value} value={operator.value}>
                  {operator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={condition.value}
            onChange={(e) => updateCondition(index, "value", e.target.value)}
            placeholder="Value"
            className="flex-1"
          />

          <Button variant="ghost" size="icon" onClick={() => removeCondition(index)} disabled={conditions.length === 1}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="flex justify-between">
        <Button variant="outline" onClick={addCondition} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Condition
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}
