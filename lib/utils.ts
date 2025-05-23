import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Formats a date string into a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Format the date as MM/DD/YYYY
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
