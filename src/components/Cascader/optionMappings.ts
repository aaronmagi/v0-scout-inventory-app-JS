// TypeScript version
export const onLoadDataCascader = (node: any, index: number, loadData: any) => {
  if (loadData && node.children && node.children.length === 0) {
    return loadData(node)
  }
  return Promise.resolve()
}

export const flattenOptions = (options: any[] = []) => {
  return options.reduce((acc: any[], option) => {
    acc.push(option)
    if (option.children) {
      acc.push(...flattenOptions(option.children))
    }
    return acc
  }, [])
}

// Default export
export default {
  onLoadDataCascader,
  flattenOptions,
}
