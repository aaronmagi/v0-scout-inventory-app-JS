// Mock implementation of optionMappings.mjs
const OptionMappings = {
  onLoadDataCascader: (node, index, loadData) => {
    if (loadData && node.children && node.children.length === 0) {
      return loadData(node)
    }
    return Promise.resolve()
  },
  flattenOptions: (options = []) => {
    return options.reduce((acc, option) => {
      acc.push(option)
      if (option.children) {
        acc.push(...OptionMappings.flattenOptions(option.children))
      }
      return acc
    }, [])
  },
}

module.exports = OptionMappings
