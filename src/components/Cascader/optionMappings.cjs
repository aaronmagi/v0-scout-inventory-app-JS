// CommonJS version
const onLoadDataCascader = (node, index, loadData) => {
  if (loadData && node.children && node.children.length === 0) {
    return loadData(node);
  }
  return Promise.resolve();
};

const flattenOptions = (options = []) => {
  return options.reduce((acc, option) => {
    acc.push(option);
    if (option.children) {
      acc.push(...flattenOptions(option.children));
    }
    return acc;
  }, []);
};

module.exports = {
  onLoadDataCascader,
  flattenOptions
};
