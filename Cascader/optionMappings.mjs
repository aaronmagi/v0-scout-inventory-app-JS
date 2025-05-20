// Re-export from our mock
import { onLoadDataCascader, Cascader } from '../src/grafana-ui-mock';

export { onLoadDataCascader };
export const flattenOptions = Cascader.flattenOptions;

// Export everything as default as well
export default {
  onLoadDataCascader,
  flattenOptions
};
