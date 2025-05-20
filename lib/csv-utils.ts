/**
 * Safely converts a value to string, handling undefined and null values
 * @param value The value to convert to string
 * @returns String representation of the value or empty string if undefined/null
 */
function safeToString(value: any): string {
  if (value === undefined || value === null) {
    return ""
  }
  return String(value)
}

/**
 * Flattens a nested object structure into a single-level object
 * @param obj The object to flatten
 * @param prefix Prefix for the flattened keys
 * @returns A flattened object
 */
function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const flattened: Record<string, string> = {}

  // Handle null or undefined
  if (obj === null || obj === undefined) {
    return flattened
  }

  // Handle arrays by converting them to comma-separated strings
  if (Array.isArray(obj)) {
    // For arrays of objects, flatten each object and join with semicolons
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
      const arrayOfFlattenedObjects = obj.map((item) => {
        const flatItem = flattenObject(item)
        return Object.entries(flatItem)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      })
      flattened[prefix.slice(0, -1)] = arrayOfFlattenedObjects.join("; ")
    } else {
      // For simple arrays, join with commas
      flattened[prefix.slice(0, -1)] = obj.filter((item) => item !== null && item !== undefined).join(", ")
    }
    return flattened
  }

  // Handle objects by recursively flattening them
  if (typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      const newPrefix = prefix ? `${prefix}${key}.` : `${key}.`

      if (value === null || value === undefined) {
        flattened[newPrefix.slice(0, -1)] = ""
      } else if (typeof value === "object") {
        Object.assign(flattened, flattenObject(value, newPrefix))
      } else {
        flattened[newPrefix.slice(0, -1)] = safeToString(value)
      }
    })
    return flattened
  }

  // Handle primitive values
  flattened[prefix.slice(0, -1)] = safeToString(obj)
  return flattened
}

/**
 * Escapes a value for CSV format
 * @param value The value to escape
 * @returns Escaped value
 */
function escapeCSV(value: string): string {
  if (!value) return ""

  // If the value contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// Function to convert server data to CSV format
export function serversToCSV(servers: any[]): string {
  if (!servers || servers.length === 0) {
    return ""
  }

  // Get all unique keys from all server objects
  const allKeys = new Set<string>()
  servers.forEach((server) => {
    Object.keys(server).forEach((key) => allKeys.add(key))
  })

  // Convert Set to Array and sort alphabetically
  const headers = Array.from(allKeys).sort()

  // Create CSV header row
  let csv = headers.join(",") + "\n"

  // Add data rows
  servers.forEach((server) => {
    const row = headers.map((header) => {
      const value = server[header]

      // Handle different data types
      if (value === undefined || value === null) {
        return ""
      } else if (typeof value === "string") {
        // Escape quotes and wrap in quotes if contains comma, quote or newline
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      } else if (typeof value === "boolean") {
        return value ? "true" : "false"
      } else if (value instanceof Date) {
        return value.toISOString()
      } else {
        return String(value)
      }
    })

    csv += row.join(",") + "\n"
  })

  return csv
}

// Function to trigger CSV download in the browser
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a blob with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  // Add to document, click to download, then remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
