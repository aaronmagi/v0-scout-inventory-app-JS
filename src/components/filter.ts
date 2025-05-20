// TypeScript version
export const itemToString = (item: any): string => {
  if (!item) return ""

  if (typeof item === "string") return item
  if (typeof item === "number") return String(item)
  if (typeof item === "object") {
    return item.label || item.name || item.title || item.value || JSON.stringify(item)
  }

  return String(item)
}

export const filterItems = (items: any[], inputValue: string, { accessor = itemToString } = {}) => {
  return items.filter((item) =>
    accessor(item)
      .toLowerCase()
      .includes((inputValue || "").toLowerCase()),
  )
}

export const sortItems = (items: any[], { accessor = itemToString } = {}) => {
  return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)))
}

// Default export
export default {
  itemToString,
  filterItems,
  sortItems,
}
