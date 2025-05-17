"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// Define the types of tokens in our search query
type TokenType = "field" | "operator" | "value" | "logic" | "orderBy" | "orderDirection"

// Define the structure of a token
interface Token {
  id: string
  type: TokenType
  value: string
}

// Define field types based on the database schema
type FieldType = "text" | "integer" | "float" | "date" | "timestamp" | "uuid" | "jsonb" | "boolean"

interface SearchField {
  name: string
  type: FieldType
  table: string
}

// Define the available fields for search with their types based on the DB schema
const searchFields: SearchField[] = [
  { name: "UUID", type: "uuid", table: "server" },
  { name: "Hostname", type: "text", table: "server" },
  { name: "Vendor", type: "text", table: "server" },
  { name: "Model Number", type: "text", table: "server" },
  { name: "Part Number", type: "text", table: "server" },
  { name: "Serial Number", type: "text", table: "server" },
  { name: "Role", type: "text", table: "server" },
  { name: "Service Tag", type: "text", table: "server" },
  { name: "Vault Path", type: "text", table: "server" },
  { name: "Warranty Expiry Date", type: "date", table: "server" },
  { name: "Support Contract Details", type: "jsonb", table: "server" },
  { name: "Created At", type: "timestamp", table: "server" },
  { name: "Updated At", type: "timestamp", table: "server" },

  { name: "Chassis Name", type: "text", table: "chassis" },

  { name: "Baseboard Model", type: "text", table: "baseboard" },
  { name: "Baseboard Serial Number", type: "text", table: "baseboard" },

  { name: "Storage Type", type: "text", table: "storage" },
  { name: "Storage Capacity", type: "integer", table: "storage" },
  { name: "Storage Interface", type: "text", table: "storage" },

  { name: "Memory Type", type: "text", table: "memory" },
  { name: "Memory Capacity", type: "integer", table: "memory" },
  { name: "Memory Speed", type: "integer", table: "memory" },

  { name: "CPU Frequency", type: "float", table: "cpu" },
  { name: "CPU Cores", type: "integer", table: "cpu" },
  { name: "CPU Instruction Set", type: "text", table: "cpu" },

  { name: "Network MAC Address", type: "text", table: "network_device" },
  { name: "Network Interface Type", type: "text", table: "network_device" },

  { name: "Warranty Component", type: "text", table: "warranty" },
  { name: "Warranty Expiry Date", type: "date", table: "warranty" },

  { name: "Firmware Component", type: "text", table: "firmware" },
  { name: "Firmware Version", type: "text", table: "firmware" },
]

// Define the available operators based on field type
const getOperatorsForFieldType = (fieldType: FieldType) => {
  const commonOperators = [
    { label: "equals", value: "=" },
    { label: "not equals", value: "!=" },
  ]

  const textOperators = [
    ...commonOperators,
    { label: "contains", value: "~" },
    { label: "starts with", value: "^" },
    { label: "ends with", value: "$" },
    { label: "is empty", value: "IS NULL" },
    { label: "is not empty", value: "IS NOT NULL" },
  ]

  const numericOperators = [
    ...commonOperators,
    { label: "greater than", value: ">" },
    { label: "less than", value: "<" },
    { label: "greater than or equal", value: ">=" },
    { label: "less than or equal", value: "<=" },
    { label: "is empty", value: "IS NULL" },
    { label: "is not empty", value: "IS NOT NULL" },
  ]

  const dateOperators = [
    ...commonOperators,
    { label: "after", value: ">" },
    { label: "before", value: "<" },
    { label: "on or after", value: ">=" },
    { label: "on or before", value: "<=" },
    { label: "is empty", value: "IS NULL" },
    { label: "is not empty", value: "IS NOT NULL" },
  ]

  switch (fieldType) {
    case "text":
    case "uuid":
      return textOperators
    case "integer":
    case "float":
      return numericOperators
    case "date":
    case "timestamp":
      return dateOperators
    case "jsonb":
      return [
        { label: "contains key", value: "?" },
        { label: "contains", value: "@>" },
      ]
    case "boolean":
      return [
        { label: "is", value: "=" },
        { label: "is not", value: "!=" },
      ]
    default:
      return commonOperators
  }
}

// Define the logical operators
const logicalOperators = [
  { label: "AND", value: "AND" },
  { label: "OR", value: "OR" },
  { label: "NOT", value: "NOT" },
]

// Define order directions
const orderDirections = [
  { label: "Ascending", value: "ASC" },
  { label: "Descending", value: "DESC" },
]

// Helper function to get placeholder examples based on field type
const getValuePlaceholder = (fieldType: FieldType, operator: string) => {
  if (operator === "IS NULL" || operator === "IS NOT NULL") {
    return ""
  }

  switch (fieldType) {
    case "text":
    case "uuid":
      return operator === "~" ? "search term" : "exact text"
    case "integer":
      return "123"
    case "float":
      return "123.45"
    case "date":
      return "YYYY-MM-DD or -30d"
    case "timestamp":
      return "YYYY-MM-DD HH:MM:SS or -7d"
    case "jsonb":
      return '{"key": "value"}'
    case "boolean":
      return "true or false"
    default:
      return "value"
  }
}

// Helper function to get value examples for date fields
const getDateValueExamples = () => [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "-7d" },
  { label: "Last 30 days", value: "-30d" },
  { label: "Last 90 days", value: "-90d" },
  { label: "Last 6 months", value: "-6M" },
  { label: "Last year", value: "-1y" },
]

interface InteractiveSearchProps {
  onSearch: (query: string) => void
}

export function InteractiveSearch({ onSearch }: InteractiveSearchProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState<
    "field" | "operator" | "value" | "logic" | "orderBy" | "orderDirection"
  >("field")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<SearchField | null>(null)
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null)
  const [selectedOperatorRequiresValue, setSelectedOperatorRequiresValue] = useState(true)
  const [hasOrderBy, setHasOrderBy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus the input when the component mounts or when the step changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentStep])

  // Handle click on the container to focus the input
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsPopoverOpen(true)
  }

  // Handle key press in the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      addToken()
    } else if (e.key === "Backspace" && !inputValue && tokens.length > 0) {
      // Remove the last token when backspace is pressed and input is empty
      removeLastToken()
    } else if (e.key === "Escape") {
      setIsPopoverOpen(false)
    }
  }

  // Add a new token based on the current step
  const addToken = () => {
    if (!inputValue.trim() && currentStep !== "value") return

    // For operators that don't require values (IS NULL, IS NOT NULL), skip the value step
    if (currentStep === "operator" && (inputValue === "is empty" || inputValue === "is not empty")) {
      setSelectedOperatorRequiresValue(false)
    }

    const newToken: Token = {
      id: Date.now().toString(),
      type: currentStep,
      value: inputValue.trim(),
    }

    setTokens([...tokens, newToken])
    setInputValue("")

    // Determine the next step
    if (currentStep === "field") {
      const field = searchFields.find((f) => f.name === inputValue.trim()) || null
      setSelectedField(field)
      setCurrentStep("operator")
      // Force the popover to open for operator selection
      setTimeout(() => setIsPopoverOpen(true), 0)
    } else if (currentStep === "operator") {
      setSelectedOperator(inputValue.trim())
      if (inputValue === "is empty" || inputValue === "is not empty") {
        // Skip value step for operators that don't need values
        setCurrentStep("logic")
      } else {
        setCurrentStep("value")
      }
    } else if (currentStep === "value") {
      setCurrentStep("logic")
      // Force the popover to open for logic selection
      setTimeout(() => setIsPopoverOpen(true), 0)
    } else if (currentStep === "logic") {
      if (inputValue.toLowerCase() === "order by") {
        setCurrentStep("orderBy")
        setHasOrderBy(true)
      } else {
        setCurrentStep("field")
        setSelectedField(null)
        setSelectedOperator(null)
        setSelectedOperatorRequiresValue(true)
      }
      // Force the popover to open for next selection
      setTimeout(() => setIsPopoverOpen(true), 0)
    } else if (currentStep === "orderBy") {
      setCurrentStep("orderDirection")
      // Force the popover to open for order direction selection
      setTimeout(() => setIsPopoverOpen(true), 0)
    } else if (currentStep === "orderDirection") {
      // After order direction, we're done
      setCurrentStep("field")
      setSelectedField(null)
      setSelectedOperator(null)
      setSelectedOperatorRequiresValue(true)
    }
  }

  // Remove the last token
  const removeLastToken = () => {
    if (tokens.length === 0) return

    const lastToken = tokens[tokens.length - 1]
    const newTokens = tokens.slice(0, -1)
    setTokens(newTokens)

    // Adjust the current step based on the removed token
    if (lastToken.type === "orderDirection") {
      setCurrentStep("orderDirection")
    } else if (lastToken.type === "orderBy") {
      setCurrentStep("orderBy")
      setHasOrderBy(false)
    } else if (lastToken.type === "logic") {
      setCurrentStep("logic")
    } else if (lastToken.type === "value") {
      setCurrentStep("value")
      setInputValue(lastToken.value)
    } else if (lastToken.type === "operator") {
      setCurrentStep("operator")
      setInputValue(lastToken.value)
      setSelectedOperator(null)
      setSelectedOperatorRequiresValue(true)
    } else if (lastToken.type === "field") {
      setCurrentStep("field")
      setInputValue(lastToken.value)
      setSelectedField(null)
    }
  }

  // Remove a specific token
  const removeToken = (id: string) => {
    const index = tokens.findIndex((token) => token.id === id)
    if (index === -1) return

    // If we're removing a field, we need to remove the operator and value as well
    if (tokens[index].type === "field") {
      // Find the next field or the end of the tokens
      let nextFieldIndex = tokens.findIndex((token, i) => i > index && token.type === "field")
      if (nextFieldIndex === -1) nextFieldIndex = tokens.length

      // Remove all tokens from the field to the next field or the end
      const newTokens = [...tokens.slice(0, index), ...tokens.slice(nextFieldIndex)]
      setTokens(newTokens)
    } else if (tokens[index].type === "orderBy") {
      // If removing orderBy, also remove orderDirection
      const orderDirIndex = tokens.findIndex((token, i) => i > index && token.type === "orderDirection")
      const newTokens =
        orderDirIndex !== -1
          ? [...tokens.slice(0, index), ...tokens.slice(orderDirIndex + 1)]
          : [...tokens.slice(0, index)]
      setTokens(newTokens)
      setHasOrderBy(false)
    } else {
      // Just remove the single token
      const newTokens = tokens.filter((token) => token.id !== id)
      setTokens(newTokens)
    }

    // Reset the current step if needed
    if (tokens.length === 0) {
      setCurrentStep("field")
      setSelectedField(null)
      setSelectedOperator(null)
      setSelectedOperatorRequiresValue(true)
      setHasOrderBy(false)
    }
  }

  // Handle selection from the popover
  const handleSelect = (value: string) => {
    setInputValue(value)
    setIsPopoverOpen(false)

    // Add the token after selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = value
        addToken()
      }
    }, 0)
  }

  // Get suggestions based on the current step
  const getSuggestions = () => {
    if (currentStep === "field") {
      return searchFields
        .filter((field) => field.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((field) => field.name)
    } else if (currentStep === "operator" && selectedField) {
      return getOperatorsForFieldType(selectedField.type)
        .filter((op) => op.label.toLowerCase().includes(inputValue.toLowerCase()))
        .map((op) => op.label)
    } else if (
      currentStep === "value" &&
      selectedField &&
      (selectedField.type === "date" || selectedField.type === "timestamp")
    ) {
      return getDateValueExamples()
        .filter((ex) => ex.label.toLowerCase().includes(inputValue.toLowerCase()) || ex.value.includes(inputValue))
        .map((ex) => `${ex.value} (${ex.label})`)
    } else if (currentStep === "logic") {
      const suggestions = [...logicalOperators.map((op) => op.label)]
      if (!hasOrderBy) {
        suggestions.push("ORDER BY")
      }
      return suggestions.filter((op) => op.toLowerCase().includes(inputValue.toLowerCase()))
    } else if (currentStep === "orderBy") {
      return searchFields
        .filter((field) => field.name.toLowerCase().includes(inputValue.toLowerCase()))
        .map((field) => field.name)
    } else if (currentStep === "orderDirection") {
      return orderDirections
        .filter((dir) => dir.label.toLowerCase().includes(inputValue.toLowerCase()))
        .map((dir) => dir.label)
    }
    return []
  }

  // Build the search query from tokens in JQL-like format
  const buildSearchQuery = () => {
    let query = ""
    let orderByClause = ""
    let i = 0

    // Process condition tokens
    while (i < tokens.length) {
      if (tokens[i].type === "field") {
        const fieldName = tokens[i].value
        const field = searchFields.find((f) => f.name === fieldName)
        let operator = "="
        let value = ""

        // Look for the operator and value
        if (i + 1 < tokens.length && tokens[i + 1].type === "operator") {
          operator = tokens[i + 1].value
          i++

          // For operators that need values
          if (operator !== "is empty" && operator !== "is not empty") {
            if (i + 1 < tokens.length && tokens[i + 1].type === "value") {
              value = tokens[i + 1].value
              i++
            }
          }
        }

        // Format the query part based on operator
        if (operator === "is empty") {
          query += `${fieldName} IS NULL`
        } else if (operator === "is not empty") {
          query += `${fieldName} IS NOT NULL`
        } else if (operator === "contains" || operator === "~") {
          query += `${fieldName} ~ "${value}"`
        } else if (operator === "starts with" || operator === "^") {
          query += `${fieldName} ^ "${value}"`
        } else if (operator === "ends with" || operator === "$") {
          query += `${fieldName} $ "${value}"`
        } else {
          // Handle different field types
          if (field && (field.type === "text" || field.type === "uuid")) {
            query += `${fieldName} ${operator} "${value}"`
          } else if (field && (field.type === "date" || field.type === "timestamp")) {
            // Handle relative date values
            if (value.includes("(")) {
              value = value.split(" (")[0]
            }
            query += `${fieldName} ${operator} ${value}`
          } else {
            query += `${fieldName} ${operator} ${value}`
          }
        }
      } else if (tokens[i].type === "logic") {
        const logicValue = tokens[i].value.toUpperCase()
        if (logicValue !== "ORDER BY") {
          query += ` ${logicValue} `
        }
      } else if (tokens[i].type === "orderBy") {
        orderByClause = ` ORDER BY ${tokens[i].value}`

        // Look for order direction
        if (i + 1 < tokens.length && tokens[i + 1].type === "orderDirection") {
          const direction = tokens[i + 1].value === "Ascending" ? "ASC" : "DESC"
          orderByClause += ` ${direction}`
          i++
        }
      }
      i++
    }

    return query + orderByClause
  }

  // Handle search button click
  const handleSearch = () => {
    const query = buildSearchQuery()
    onSearch(query)
  }

  // Clear all tokens
  const handleClear = () => {
    setTokens([])
    setInputValue("")
    setCurrentStep("field")
    setSelectedField(null)
    setSelectedOperator(null)
    setSelectedOperatorRequiresValue(true)
    setHasOrderBy(false)
  }

  // Add "Order By" clause
  const handleAddOrderBy = () => {
    if (hasOrderBy) return

    // Add "ORDER BY" as a logic token
    const orderByToken: Token = {
      id: Date.now().toString(),
      type: "logic",
      value: "ORDER BY",
    }

    setTokens([...tokens, orderByToken])
    setCurrentStep("orderBy")
    setHasOrderBy(true)
    setTimeout(() => setIsPopoverOpen(true), 0)
  }

  // Get placeholder text based on current step
  const getPlaceholderText = () => {
    if (currentStep === "field") {
      return "Enter a field name..."
    } else if (currentStep === "operator" && selectedField) {
      return `Enter an operator for ${selectedField.name}...`
    } else if (currentStep === "value" && selectedField && selectedOperator) {
      return `Enter a value (${getValuePlaceholder(selectedField.type, selectedOperator)})...`
    } else if (currentStep === "logic") {
      return "Enter AND, OR, NOT, or ORDER BY..."
    } else if (currentStep === "orderBy") {
      return "Select field to order by..."
    } else if (currentStep === "orderDirection") {
      return "Select order direction (ASC/DESC)..."
    }
    return "Search..."
  }

  // Determine if suggestions should be shown
  const shouldShowSuggestions = () => {
    if (
      currentStep === "value" &&
      !["is empty", "is not empty"].includes(selectedOperator || "") &&
      selectedField &&
      !["date", "timestamp"].includes(selectedField.type)
    ) {
      // Don't show suggestions for value input (except for special operators and date fields)
      return false
    }
    return true
  }

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="flex flex-wrap items-center gap-1 p-2 border rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
        onClick={handleContainerClick}
      >
        {tokens.map((token) => (
          <div
            key={token.id}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-sm
              ${token.type === "field" ? "bg-blue-100 text-blue-800" : ""}
              ${token.type === "operator" ? "bg-purple-100 text-purple-800" : ""}
              ${token.type === "value" ? "bg-green-100 text-green-800" : ""}
              ${token.type === "logic" ? "bg-yellow-100 text-yellow-800" : ""}
              ${token.type === "orderBy" ? "bg-orange-100 text-orange-800" : ""}
              ${token.type === "orderDirection" ? "bg-pink-100 text-pink-800" : ""}
            `}
          >
            <span>{token.value}</span>
            <button type="button" onClick={() => removeToken(token.id)} className="text-gray-500 hover:text-gray-700">
              <X size={14} />
            </button>
          </div>
        ))}

        <div className="relative flex-1 min-w-[200px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsPopoverOpen(true)}
            className="w-full border-none outline-none focus:ring-0 p-1"
            placeholder={getPlaceholderText()}
          />

          {isPopoverOpen && shouldShowSuggestions() && getSuggestions().length > 0 && (
            <div className="absolute z-10 w-[300px] mt-1 bg-white border rounded-md shadow-lg">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {getSuggestions().map((suggestion) => (
                      <CommandItem key={suggestion} onSelect={() => handleSelect(suggestion)}>
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className="text-sm text-gray-500">
          {currentStep === "field" && "Enter a field name"}
          {currentStep === "operator" &&
            selectedField &&
            `Field: ${selectedField.name} (${selectedField.type}) - Enter an operator`}
          {currentStep === "value" &&
            selectedField &&
            selectedOperator &&
            `${selectedField.name} ${selectedOperator} - Enter a value (${selectedField.type})`}
          {currentStep === "logic" && "Enter a logical operator (AND, OR, NOT) or ORDER BY"}
          {currentStep === "orderBy" && "Select a field to order by"}
          {currentStep === "orderDirection" && "Select order direction (Ascending or Descending)"}
        </div>
        <div className="flex gap-2">
          {!hasOrderBy && tokens.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleAddOrderBy}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Add Order By
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {tokens.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded border">
          <div className="text-sm font-medium mb-1">JQL-like Query:</div>
          <div className="font-mono text-sm bg-white p-2 rounded border overflow-x-auto">{buildSearchQuery()}</div>
        </div>
      )}
    </div>
  )
}
