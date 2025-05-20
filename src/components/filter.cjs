// CommonJS version
const itemToString = (item) => {
  if (!item) return '';
  
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (typeof item === 'object') {
    return item.label || item.name || item.title || item.value || JSON.stringify(item);
  }
  
  return String(item);
};

const filterItems = (items, inputValue, { accessor = itemToString } = {}) => {
  return items.filter(item => 
    accessor(item).toLowerCase().includes((inputValue || '').toLowerCase())
  );
};

const sortItems = (items, { accessor = itemToString } = {}) => {
  return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)));
};

module.exports = {
  itemToString,
  filterItems,
  sortItems
};
