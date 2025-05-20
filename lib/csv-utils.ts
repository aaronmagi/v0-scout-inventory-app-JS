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

/**
 * Converts an array of server objects to CSV format with all nested data
 * @param servers Array of server objects to convert
 * @returns CSV formatted string with headers
 */
export function serversToCSV(servers: any[]): string {
  if (!servers || !Array.isArray(servers) || servers.length === 0) {
    return ""
  }

  try {
    // Flatten each server object
    const flattenedServers = servers.map((server) => flattenObject(server))

    // Get all possible keys from all flattened server objects
    const allHeaders = new Set<string>()
    flattenedServers.forEach((server) => {
      Object.keys(server).forEach((key) => allHeaders.add(key))
    })

    // Convert headers to array and sort for consistent output
    const headers = Array.from(allHeaders).sort()

    // Create CSV header row
    const headerRow = headers.map(escapeCSV).join(",")

    // Create CSV data rows
    const rows = flattenedServers.map((server) => {
      return headers
        .map((header) => {
          return escapeCSV(server[header] || "")
        })
        .join(",")
    })

    // Combine header and data rows
    return `${headerRow}\n${rows.join("\n")}`
  } catch (error) {
    console.error("Error generating CSV:", error)
    return ""
  }
}

/**
 * Triggers a download of a CSV file in the browser
 * @param csvContent CSV content as a string
 * @param filename Name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  try {
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"

    // Add the link to the DOM, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading CSV:", error)
  }
}
