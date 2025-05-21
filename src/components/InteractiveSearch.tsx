"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useStyles2, Input, Button, Icon } from "@grafana/ui"
import { css } from "@emotion/css"
import type { GrafanaTheme2 } from "@grafana/data"

interface InteractiveSearchProps {
  onSearch: (query: string) => void
}

type TokenType = "field" | "operator" | "value" | "logic" | "orderBy" | "orderDirection"

interface Token {
  id: string
  type: TokenType
  value: string
}

export function InteractiveSearch({ onSearch }: InteractiveSearchProps) {
  const styles = useStyles2(getStyles)
  const [tokens, setTokens] = useState<Token[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState<TokenType>("field")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample field options - in a real implementation, these would come from your API
  const fieldOptions = [
    "Hostname",
    "IP Address",
    "Model",
    "Serial Number",
    "Vendor",
    "Core Count",
    "Memory Capacity",
    "Storage Capacity",
    "Firmware Version",
    "Warranty Expiry Date",
    "Power State",
    "Boot Status",
  ]

  const operatorOptions = [
    "equals",
    "not equals",
    "contains",
    "starts with",
    "ends with",
    "greater than",
    "less than",
    "is empty",
    "is not empty",
  ]

  const logicOptions = ["AND", "OR", "NOT", "ORDER BY"]

  useEffect(() => {
    updateSuggestions()
  }, [currentStep, inputValue])

  const updateSuggestions = () => {
    let filteredSuggestions: string[] = []

    switch (currentStep) {
      case "field":
        filteredSuggestions = fieldOptions.filter((field) => field.toLowerCase().includes(inputValue.toLowerCase()))
        break
      case "operator":
        filteredSuggestions = operatorOptions.filter((op) => op.toLowerCase().includes(inputValue.toLowerCase()))
        break
      case "logic":
        filteredSuggestions = logicOptions.filter((logic) => logic.toLowerCase().includes(inputValue.toLowerCase()))
        break
      case "orderBy":
        filteredSuggestions = fieldOptions.filter((field) => field.toLowerCase().includes(inputValue.toLowerCase()))
        break
      case "orderDirection":
        filteredSuggestions = ["Ascending", "Descending"].filter((dir) =>
          dir.toLowerCase().includes(inputValue.toLowerCase()),
        )
        break
      default:
        filteredSuggestions = []
    }

    setSuggestions(filteredSuggestions)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      addToken()
    } else if (e.key === "Backspace" && !inputValue && tokens.length > 0) {
      removeLastToken()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const addToken = () => {
    if (!inputValue.trim() && currentStep !== "value") return

    const newToken: Token = {
      id: Date.now().toString(),
      type: currentStep,
      value: inputValue.trim(),
    }

    setTokens([...tokens, newToken])
    setInputValue("")

    // Determine the next step
    if (currentStep === "field") {
      setCurrentStep("operator")
    } else if (currentStep === "operator") {
      if (inputValue === "is empty" || inputValue === "is not empty") {
        setCurrentStep("logic")
      } else {
        setCurrentStep("value")
      }
    } else if (currentStep === "value") {
      setCurrentStep("logic")
    } else if (currentStep === "logic") {
      if (inputValue.toUpperCase() === "ORDER BY") {
        setCurrentStep("orderBy")
      } else {
        setCurrentStep("field")
      }
    } else if (currentStep === "orderBy") {
      setCurrentStep("orderDirection")
    } else if (currentStep === "orderDirection") {
      setCurrentStep("field")
    }
  }

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
    } else if (lastToken.type === "logic") {
      setCurrentStep("logic")
    } else if (lastToken.type === "value") {
      setCurrentStep("value")
      setInputValue(lastToken.value)
    } else if (lastToken.type === "operator") {
      setCurrentStep("operator")
      setInputValue(lastToken.value)
    } else if (lastToken.type === "field") {
      setCurrentStep("field")
      setInputValue(lastToken.value)
    }
  }

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
    } else {
      // Just remove the single token
      const newTokens = tokens.filter((token) => token.id !== id)
      setTokens(newTokens)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    addToken()
  }

  const buildSearchQuery = () => {
    let query = ""
    let orderByClause = ""
    let i = 0

    // Process condition tokens
    while (i < tokens.length) {
      if (tokens[i].type === "field") {
        const fieldName = tokens[i].value
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
        } else if (operator === "contains") {
          query += `${fieldName} ~ "${value}"`
        } else if (operator === "starts with") {
          query += `${fieldName} ^ "${value}"`
        } else if (operator === "ends with") {
          query += `${fieldName} $ "${value}"`
        } else {
          query += `${fieldName} ${operator} "${value}"`
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

  const handleSearch = () => {
    const query = buildSearchQuery()
    onSearch(query)
  }

  const handleClear = () => {
    setTokens([])
    setInputValue("")
    setCurrentStep("field")
  }

  const getPlaceholderText = () => {
    switch (currentStep) {
      case "field":
        return "Enter a field name..."
      case "operator":
        return "Enter an operator..."
      case "value":
        return "Enter a value..."
      case "logic":
        return "Enter AND, OR, NOT, or ORDER BY..."
      case "orderBy":
        return "Select field to order by..."
      case "orderDirection":
        return "Select order direction (ASC/DESC)..."
      default:
        return "Search..."
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer} onClick={() => inputRef.current?.focus()}>
        {tokens.map((token) => (
          <div key={token.id} className={`${styles.token} ${styles[token.type]}`}>
            <span>{token.value}</span>
            <button type="button" onClick={() => removeToken(token.id)} className={styles.removeToken}>
              <Icon name="times" />
            </button>
          </div>
        ))}

        <div className={styles.inputWrapper}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={getPlaceholderText()}
            className={styles.input}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <div key={suggestion} className={styles.suggestion} onClick={() => selectSuggestion(suggestion)}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.helpText}>
        {currentStep === "field" && "Enter a field name"}
        {currentStep === "operator" && "Enter an operator"}
        {currentStep === "value" && "Enter a value"}
        {currentStep === "logic" && "Enter a logical operator (AND, OR, NOT) or ORDER BY"}
        {currentStep === "orderBy" && "Select a field to order by"}
        {currentStep === "orderDirection" && "Select order direction (Ascending or Descending)"}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          <Icon name="search" /> Search
        </Button>
      </div>

      {tokens.length > 0 && (
        <div className={styles.queryPreview}>
          <div className={styles.queryLabel}>JQL-like Query:</div>
          <div className={styles.queryText}>{buildSearchQuery()}</div>
        </div>
      )}
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      gap: 16px;
    `,
    inputContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px;
      border: 1px solid ${theme.colors.border.medium};
      border-radius: 4px;
      background-color: ${theme.colors.background.primary};
      min-height: 40px;
      cursor: text;
    `,
    token: css`
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    `,
    field: css`
      background-color: ${theme.colors.primary.transparent};
      color: ${theme.colors.primary.text};
    `,
    operator: css`
      background-color: ${theme.colors.secondary.transparent};
      color: ${theme.colors.secondary.text};
    `,
    value: css`
      background-color: ${theme.colors.success.transparent};
      color: ${theme.colors.success.text};
    `,
    logic: css`
      background-color: ${theme.colors.warning.transparent};
      color: ${theme.colors.warning.text};
    `,
    orderBy: css`
      background-color: ${theme.colors.error.transparent};
      color: ${theme.colors.error.text};
    `,
    orderDirection: css`
      background-color: ${theme.colors.info.transparent};
      color: ${theme.colors.info.text};
    `,
    removeToken: css`
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    `,
    inputWrapper: css`
      position: relative;
      flex: 1;
      min-width: 200px;
    `,
    input: css`
      width: 100%;
      border: none;
      background: transparent;
      &:focus {
        box-shadow: none;
      }
    `,
    suggestions: css`
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      background-color: ${theme.colors.background.primary};
      border: 1px solid ${theme.colors.border.medium};
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `,
    suggestion: css`
      padding: 8px 12px;
      cursor: pointer;
      &:hover {
        background-color: ${theme.colors.background.secondary};
      }
    `,
    helpText: css`
      font-size: 12px;
      color: ${theme.colors.text.secondary};
    `,
    actions: css`
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    `,
    queryPreview: css`
      background-color: ${theme.colors.background.secondary};
      padding: 12px;
      border-radius: 4px;
    `,
    queryLabel: css`
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 4px;
    `,
    queryText: css`
      font-family: monospace;
      background-color: ${theme.colors.background.primary};
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
    `,
  }
}
