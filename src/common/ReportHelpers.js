/**
 * Determines if a column belongs to a modal based on its type
 */
const isModalColumn = (column) => {
  return column.type === 'List`1';
};

/**
 * Processes nested columns to flatten the structure
 */
const processNestedColumns = (column, parentKey = '') => {
  const columns = [];
  
  if (column.children && column.children.length > 0) {
    column.children.forEach(child => {
      const fullKey = parentKey ? `${parentKey}.${child.key}` : child.key;
      columns.push({
        id: fullKey,
        name: child.displayName,
        type: child.type,
        propertyName: child.propertyName
      });
      
      if (child.children && child.children.length > 0) {
        columns.push(...processNestedColumns(child, fullKey));
      }
    });
  }
  
  return columns;
};

/**
 * Processes columns that should be displayed in modals
 */
const processModalColumns = (column) => {
  return {
    key: column.key,
    displayName: column.displayName,
    propertyName: column.propertyName,
    columns: column.children?.map(child => ({
      id: child.key,
      name: child.displayName,
      type: child.type,
      propertyName: child.propertyName
    })) || []
  };
};

/**
 * Creates grid columns configuration for release report
 */
export const createGridColumns = (apiResponse) => {
  const columns = apiResponse.result.data.columns;
  const mainColumns = [];
  const modalConfigs = [];

  columns.forEach(col => {
    if (col.type === 'List`1') {
      modalConfigs.push({
        key: col.key,
        displayName: col.displayName,
        columns: col.children || []
      });
    } else {
      mainColumns.push({
        id: col.key,
        name: col.displayName,
        type: col.type
      });
    }
  });

  return {
    mainColumns,
    modalConfigs
  };
};

/**
 * Creates grid columns configuration for master report
 */
export const createMasterGridColumns = (apiResponse) => {
  const columns = apiResponse.result.data.columns;
  const mainColumns = [];
  const modalConfigs = [];

  columns.filter(col => col.visible).forEach(col => {
    if (isModalColumn(col)) {
      modalConfigs.push(processModalColumns(col));
    } else if (col.children && col.children.length > 0) {
      // Handle nested columns
      mainColumns.push({
        id: col.key,
        name: col.displayName,
        type: col.type,
        propertyName: col.propertyName
      });
      mainColumns.push(...processNestedColumns(col, col.key));
    } else {
      mainColumns.push({
        id: col.key,
        name: col.displayName,
        type: col.type,
        propertyName: col.propertyName
      });
    }
  });

  return {
    mainColumns,
    modalConfigs
  };
};

/**
 * Extracts value from nested object using dot notation
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : '-', 
    obj
  );
};

export const booleanOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" }
];


export const mapIdsToLabels = (ids, options) => {
  if (!Array.isArray(ids)) {
    ids = [ids]; // Convert single value to array
  }
  return options.filter((option) => ids.includes(option.value));
};
