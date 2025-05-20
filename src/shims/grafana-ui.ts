// This file provides shims for @grafana/ui components and utilities

// Export the specific functions mentioned in the error messages
export const onLoadDataCascader = (node: any, index: number, loadData: any) => {
  if (loadData && node.children && node.children.length === 0) {
    return loadData(node)
  }
  return Promise.resolve()
}

export const itemToString = (item: any): string => {
  if (!item) return ""

  if (typeof item === "string") return item
  if (typeof item === "number") return String(item)
  if (typeof item === "object") {
    return item.label || item.name || item.title || item.value || JSON.stringify(item)
  }

  return String(item)
}

// Mock other common Grafana UI components that might be used
export const Button = (props: any) => null
export const Input = (props: any) => null
export const Select = (props: any) => null
export const Modal = (props: any) => null
export const LoadingPlaceholder = (props: any) => null
export const Table = (props: any) => null
export const Pagination = (props: any) => null
export const Icon = (props: any) => null
export const useStyles2 = (fn: any) => ({})

// Export everything as a default export as well
export default {
  onLoadDataCascader,
  itemToString,
  Button,
  Input,
  Select,
  Modal,
  LoadingPlaceholder,
  Table,
  Pagination,
  Icon,
  useStyles2,
}
