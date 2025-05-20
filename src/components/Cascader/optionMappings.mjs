// Add the missing export for Cascader
export const onLoadDataCascader = (node, index, loadData) => {
  // Basic implementation for Grafana UI Cascader
  if (loadData && node.children && node.children.length === 0) {
    return loadData(node);
  }
  return Promise.resolve();
};

// Export other common Cascader option mappings that might be needed
export const flattenOptions = (options = []) => {
  return options.reduce((acc, option) => {
    acc.push(option);
    if (option.children) {
      acc.push(...flattenOptions(option.children));
    }
    return acc;
  }, []);
};
