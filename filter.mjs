// Re-export from our mock
import { itemToString, Filter } from './src/grafana-ui-mock';

export { itemToString };
export const filterItems = Filter.filterItems;
export const sortItems = Filter.sortItems;

// Export everything as default as well
export default {
  itemToString,
  filterItems,
  sortItems
};
