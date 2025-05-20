// Mock implementation of filter.mjs
const Filter = {
  itemToString: (item) => {
    if (!item) return ""
    if (typeof item === "string") return item
    if (typeof item === "number") return String(item)
    if (typeof item === "object") {
      return item.label || item.name || item.title || item.value || JSON.stringify(item)
    }
    return String(item)
  },
  filterItems: (items, inputValue, { accessor } = {}) => {
    return items.filter((item) => true)
  },
  sortItems: (items, { accessor } = {}) => {
    return [...items]
  },
}

module.exports = Filter
