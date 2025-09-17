import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import InputWidget from '../../droppables/InputWidget';

const MasterReportVisibilityManager = ({ 
  columns,
  reportType,
  setVisibleColumns,
}) => {
  // Create separate visibility states for different contexts
  const [masterVisibilityState, setMasterVisibilityState] = useState({});
  const [modalVisibilityState, setModalVisibilityState] = useState({});
  const [nestedModalVisibilityState, setNestedModalVisibilityState] = useState({});
  const [groupedColumns, setGroupedColumns] = useState({
    parentColumns: [],
    basicColumns: [],
    listColumns: []
  });
  const [showManager, setShowManager] = useState(false);

  // Get the appropriate visibility state based on context
  const getVisibilityState = () => {
    switch(reportType) {
      case 'modalReport':
        return [modalVisibilityState, setModalVisibilityState];
      case 'nestedModalReport':
        return [nestedModalVisibilityState, setNestedModalVisibilityState];
      default:
        return [masterVisibilityState, setMasterVisibilityState];
    }
  };

  useEffect(() => {
    if (columns.length > 0) {
      const parentColumns = columns.filter(col => 
        col.children && 
        col.children.length > 0 && 
        col.type !== 'List`1' &&
        !col.children.some(childCol => childCol.type === 'List`1')
      );
      
      const basicColumns = columns.filter(col => !col.children || col.children.length === 0);
      const listColumns = columns.filter(col => col.type === 'List`1');

      setGroupedColumns({
        parentColumns,
        basicColumns,
        listColumns
      });

      // Initialize all columns as visible for the current context
      const initialState = {};
      
      parentColumns.forEach(parent => {
        parent.children.forEach(child => {
          initialState[`${parent.key}-${child.key}`] = true;
        });
      });

      basicColumns.forEach(col => {
        initialState[col.key] = true;
      });

      listColumns.forEach(col => {
        initialState[col.key] = true;
      });

      // Set the state for the appropriate context
      switch(reportType) {
        case 'modalReport':
          setModalVisibilityState(initialState);
          break;
        case 'nestedModalReport':
          setNestedModalVisibilityState(initialState);
          break;
        default:
          setMasterVisibilityState(initialState);
      }

      // Set initial visible columns
      const initialVisibleCols = [
        ...parentColumns.map(parent => ({
          ...parent,
          children: [...parent.children]
        })),
        ...basicColumns,
        ...listColumns
      ];
      
      setVisibleColumns(initialVisibleCols);
    }
  }, [columns, reportType]);

  const updateVisibleColumns = (state) => {
    const visibleCols = [];

    groupedColumns.parentColumns.forEach(parent => {
      const visibleChildren = parent.children.filter(child => 
        state[`${parent.key}-${child.key}`]
      );
      
      if (visibleChildren.length > 0) {
        visibleCols.push({
          ...parent,
          children: visibleChildren
        });
      }
    });

    groupedColumns.basicColumns.forEach(col => {
      if (state[col.key]) {
        visibleCols.push(col);
      }
    });

    groupedColumns.listColumns.forEach(col => {
      if (state[col.key]) {
        visibleCols.push(col);
      }
    });

    setVisibleColumns(visibleCols);
  };

  const handleSelectAll = (checked) => {
    const [visibilityState, setVisibilityState] = getVisibilityState();
    const newVisibilityState = { ...visibilityState };
    
    Object.keys(newVisibilityState).forEach(key => {
      newVisibilityState[key] = checked;
    });

    setVisibilityState(newVisibilityState);
    if (checked) {
      const visibleCols = [
        ...groupedColumns.parentColumns.map(parent => ({
          ...parent,
          children: [...parent.children]
        })),
        ...groupedColumns.basicColumns,
        ...groupedColumns.listColumns
      ];
      setVisibleColumns(visibleCols);
    } else {
      setVisibleColumns([]);
    }
  };

  const handleSectionChange = (section, selectedOptions) => {
    const [visibilityState, setVisibilityState] = getVisibilityState();
    const newState = { ...visibilityState };
    
    if (section.key) {
      // For parent columns
      section.children.forEach(child => {
        newState[`${section.key}-${child.key}`] = false;
      });
    } else {
      // For basic and list columns
      section.children.forEach(col => {
        newState[col.key] = false;
      });
    }

    if (selectedOptions) {
      selectedOptions.forEach(option => {
        newState[option.value] = true;
      });
    }

    setVisibilityState(newState);
    updateVisibleColumns(newState);
  };

  const handleSectionSelectAll = (section, checked) => {
    const [visibilityState, setVisibilityState] = getVisibilityState();
    const newState = { ...visibilityState };
    
    if (section.key) {
      // For parent columns
      section.children.forEach(child => {
        newState[`${section.key}-${child.key}`] = checked;
      });
    } else {
      // For basic and list columns
      section.children.forEach(col => {
        newState[col.key] = checked;
      });
    }
    
    setVisibilityState(newState);
    updateVisibleColumns(newState);
  };

  return (
    <div className="mb-4">
      <button 
        className="btn btn-primary mb-2"
        onClick={() => setShowManager(!showManager)}
      >
        <i className={`fas fa-${showManager ? 'eye-slash' : 'eye'} me-2`}></i>
        {showManager ? 'Hide Column Manager' : 'Show Column Manager'}
      </button>

      <div className={`visibility-manager ${showManager ? 'show' : ''}`}>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-light border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-primary">Manage Table Columns</h5>
            <div className="d-flex gap-2">
              <input
                type="checkbox"
                className="form-check-input cursor-pointer"
                id="select-all"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={Object.values(getVisibilityState()[0]).every(v => v)}
              />
              <label className="form-label">
                Select All
              </label>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="row">
              {groupedColumns.parentColumns.map((parent) => (
                <div key={parent.key} className="col-md-4 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-2 cursor-pointer"
                      checked={parent.children.every(child => 
                        getVisibilityState()[0][`${parent.key}-${child.key}`]
                      )}
                      onChange={(e) => handleSectionSelectAll(parent, e.target.checked)}
                    />
                    <label className="form-label mb-0">{parent.displayName}</label>
                  </div>
                  <InputWidget
                    type="multiSelect"
                    isMulti={true}
                    options={parent.children.map(child => ({
                      value: `${parent.key}-${child.key}`,
                      label: child.displayName
                    }))}
                    defaultValue={parent.children
                      .filter(child => getVisibilityState()[0][`${parent.key}-${child.key}`])
                      .map(child => ({
                        value: `${parent.key}-${child.key}`,
                        label: child.displayName
                      }))}
                    setValue={(selected) => handleSectionChange(parent, selected)}
                  />
                </div>
              ))}

              {groupedColumns.basicColumns.length > 0 && (
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-2 cursor-pointer"
                      checked={groupedColumns.basicColumns.every(col => 
                        getVisibilityState()[0][col.key]
                      )}
                      onChange={(e) => handleSectionSelectAll(
                        { children: groupedColumns.basicColumns }, 
                        e.target.checked
                      )}
                    />
                    <label className="form-label mb-0">Basic Information</label>
                  </div>
                  <InputWidget
                    type="multiSelect"
                    isMulti={true}
                    options={groupedColumns.basicColumns.map(col => ({
                      value: col.key,
                      label: col.displayName
                    }))}
                    defaultValue={groupedColumns.basicColumns
                      .filter(col => getVisibilityState()[0][col.key])
                      .map(col => ({
                        value: col.key,
                        label: col.displayName
                      }))}
                    setValue={(selected) => handleSectionChange({ children: groupedColumns.basicColumns }, selected)}
                  />
                </div>
              )}

              {groupedColumns.listColumns.length > 0 && (
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-2 cursor-pointer"
                      checked={groupedColumns.listColumns.every(col => 
                        getVisibilityState()[0][col.key]
                      )}
                      onChange={(e) => handleSectionSelectAll(
                        { children: groupedColumns.listColumns }, 
                        e.target.checked
                      )}
                    />
                    <label className="form-label mb-0">More Information</label>
                  </div>
                  <InputWidget
                    type="multiSelect"
                    isMulti={true}
                    options={groupedColumns.listColumns.map(col => ({
                      value: col.key,
                      label: col.displayName
                    }))}
                    defaultValue={groupedColumns.listColumns
                      .filter(col => getVisibilityState()[0][col.key])
                      .map(col => ({
                        value: col.key,
                        label: col.displayName
                      }))}
                    setValue={(selected) => handleSectionChange({ children: groupedColumns.listColumns }, selected)}
                  />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default MasterReportVisibilityManager;