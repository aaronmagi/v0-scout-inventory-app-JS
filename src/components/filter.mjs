// Add the missing itemToString export
export const itemToString = (item) => {
  if (!item) return '';
  
  // Handle different item formats
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (typeof item === 'object') {
    // Try common properties used for display in Grafana UI
    return item.label || item.name || item.title || item.value || JSON.stringify(item);
  }
  
  return String(item);
};

// Export other common filter functions that might be needed
export const filterItems = (items, inputValue, { accessor = itemToString } = {}) => {
  return items.filter(item => 
    accessor(item).toLowerCase().includes((inputValue || '').toLowerCase())
  );
};

export const sortItems = (items, { accessor = itemToString } = {}) => {
  return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)));
};
