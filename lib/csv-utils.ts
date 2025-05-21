import type { Server } from "@/lib/data"

/**
 * Flattens a nested object into a single-level object with dot notation for keys
 */
export function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const flattened: Record<string, string> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      // Skip null or undefined values
      if (value === null || value === undefined) {
        continue
      }

      // Handle arrays specially
      if (Array.isArray(value)) {
        // For arrays of objects, flatten each object and add index to key
        if (value.length > 0 && typeof value[0] === "object") {
          value.forEach((item, index) => {
            const flatItem = flattenObject(item, `${newKey}[${index}]`)
            Object.assign(flattened, flatItem)
          })
        } else {
          // For arrays of primitives, join with commas
          flattened[newKey] = value.join(", ")
        }
      }
      // Recursively flatten nested objects
      else if (typeof value === "object" && Object.keys(value).length > 0) {
        const flatObject = flattenObject(value, newKey)
        Object.assign(flattened, flatObject)
      }
      // Handle primitive values
      else {
        flattened[newKey] = String(value)
      }
    }
  }

  return flattened
}

/**
 * Converts an array of server objects to CSV format
 */
export function serversToCSV(servers: Server[]): string {
  if (!servers || servers.length === 0) {
    return ""
  }

  // Flatten all servers to get all possible headers
  const flattenedServers = servers.map((server) => flattenObject(server))

  // Get all unique headers from all servers
  const allHeaders = new Set<string>()
  flattenedServers.forEach((server) => {
    Object.keys(server).forEach((key) => allHeaders.add(key))
  })

  // Convert headers to array and sort for consistent output
  const headers = Array.from(allHeaders).sort()

  // Create CSV header row
  const headerRow = headers
    .map((header) => {
      // Format header for better readability
      const formattedHeader = header
        .replace(/\./g, " > ") // Replace dots with ' > '
        .replace(/\[(\d+)\]/g, " $1") // Replace [0] with ' 0'
      return `"${formattedHeader}"`
    })
    .join(",")

  // Create data rows
  const dataRows = flattenedServers
    .map((server) => {
      return headers
        .map((header) => {
          const value = server[header] || ""
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`
        })
        .join(",")
    })
    .join("\n")

  // Combine header and data rows
  return `${headerRow}\n${dataRows}`
}

/**
 * Triggers a CSV download in the browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
