// This file provides mock implementations for Grafana UI components and utilities
// that might be causing import errors

// Mock for Cascader components and utilities
export const Cascader = {
  // Common Cascader props and methods
  onLoadDataCascader: (node: any, index: number, loadData: any) => {
    if (loadData && node.children && node.children.length === 0) {
      return loadData(node)
    }
    return Promise.resolve()
  },
  flattenOptions: (options: any[] = []) => {
    return options.reduce((acc: any[], option) => {
      acc.push(option)
      if (option.children) {
        acc.push(...Cascader.flattenOptions(option.children))
      }
      return acc
    }, [])
  },
}

// Mock for filter utilities
export const Filter = {
  itemToString: (item: any) => {
    if (!item) return ""

    if (typeof item === "string") return item
    if (typeof item === "number") return String(item)
    if (typeof item === "object") {
      return item.label || item.name || item.title || item.value || JSON.stringify(item)
    }

    return String(item)
  },
  filterItems: (items: any[], inputValue: string, { accessor = Filter.itemToString } = {}) => {
    return items.filter((item) =>
      accessor(item)
        .toLowerCase()
        .includes((inputValue || "").toLowerCase()),
    )
  },
  sortItems: (items: any[], { accessor = Filter.itemToString } = {}) => {
    return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)))
  },
}

// Export individual functions to match the import patterns in the error messages
export const { onLoadDataCascader } = Cascader
export const { itemToString } = Filter

// Export everything as a default export as well
export default {
  Cascader,
  Filter,
  onLoadDataCascader,
  itemToString,
}
