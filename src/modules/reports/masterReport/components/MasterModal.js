import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import NestedModal from './NestedModal';
import { renderCellValue } from '../../../../common/helpers/renderHelpers';
import MasterReportVisibilityManager from '../../../../common/components/MasterReportVisibilityManager';
import Print from '../../../../components/admin/search/Print';
import DescriptionModal from '../../../../common/DescriptionModal';

const MasterModal = ({ show, onHide, prisoner, config, title }) => {
  const [data, setData] = useState([]);
  const [showNestedModal, setShowNestedModal] = useState(false);
  const [selectedNestedData, setSelectedNestedData] = useState(null);
  const [selectedNestedConfig, setSelectedNestedConfig] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (prisoner && config?.key) {
      const modalData = prisoner[config.key] || [];
      setData(modalData);
      
      // Filter visible columns if config has columns
      if (config.columns) {
        const filterVisibleColumns = (columns) => {
          return columns.filter(col => {
            if (!col.visible) return false;
            if (col.children && col.children.length > 0) {
              col.children = filterVisibleColumns(col.children);
              return col.children.length > 0;
            }
            return true;
          });
        };
        
        const visibleColumns = filterVisibleColumns(config.columns);
        config.columns = visibleColumns;
      }
      
      // Initialize with all columns visible
      setVisibleColumns(config.columns || []);
    }
  }, [prisoner, config]);

  const handleShowDescModal = (description, title) => {
    if (!description) return;
    
    const formattedDescription = (
      <span style={{ padding: "0.5rem" }}>
        {description}
      </span>
    );
    
    setModalContent(formattedDescription);
    setModalTitle(title);
    setShowDescModal(true);
  };

  const renderCellWithTruncation = (value, type, key, fieldName) => {
    // Image keywords from renderHelpers.js
    const imageKeywords = ['pic', 'profile', 'img', 'image', 'doc', 'photo'];
    
    // Check if this is a string and not an image field
    if (type === 'String' && 
        typeof value === 'string' && 
        value.length > 40 && 
        !imageKeywords.some(keyword => key.toLowerCase().includes(keyword)) &&
        !imageKeywords.some(keyword => (value.toLowerCase().includes(keyword)))) {
      return (
        <div>
          {value.substring(0, 40)}... 
          <span 
            className="text-primary" 
            style={{cursor: 'pointer', textDecoration: 'underline'}}
            onClick={() => handleShowDescModal(value, fieldName || key)}
          >
            (View All)
          </span>
        </div>
      );
    }
    
    // For other types, use the regular renderCellValue function
    return renderCellValue(value, type, key);
  };

  const renderTableHeader = (columns) => {
    if (!columns) return null;

    const parentColumns = columns.filter(col => 
      col.children && 
      col.children.length > 0 && 
      col.type !== 'List`1' &&
      !col.children.some(childCol => childCol.type === 'List`1')
    );
    
    const basicColumns = columns.filter(col => !col.children || col.children.length === 0);
    const listColumns = columns.filter(col => col.type === 'List`1');

    return (
      <thead>
        <tr>
        {basicColumns.length > 0 && (
            <th 
              colSpan={basicColumns.length}
              className="text-center bg-primary text-white"
            >
              Basic Information
            </th>
          )}
          {parentColumns.map(parent => (
            <th 
              key={parent.key}
              colSpan={parent.children.length}
              className="text-center bg-primary text-white"
            >
              {parent.displayName}
            </th>
          ))}
          {listColumns.length > 0 && (
            <th 
              colSpan={listColumns.length}
              className="text-center bg-primary text-white"
            >
              More Information
            </th>
          )}
        </tr>
        <tr>
          {parentColumns.map(parent => 
            parent.children.map(child => (
              <th key={child.key} className="text-center bg-light">
                {child.displayName}
              </th>
            ))
          )}
          {basicColumns.map(col => (
            <th key={col.key} className="text-center bg-light">
              {col.displayName}
            </th>
          ))}
          {listColumns.map(col => (
            <th key={col.key} className="text-center bg-light">
              {col.displayName}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = (columns) => {
    if (!columns || !data || !data.length) return null;

    // Filter out null values from data
    const validData = data.filter(item => item !== null);
    
    if (validData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center">
              No data available
            </td>
          </tr>
        </tbody>
      );
    }

    const parentColumns = columns.filter(col => 
      col.children && 
      col.children.length > 0 && 
      col.type !== 'List`1' &&
      !col.children.some(childCol => childCol.type === 'List`1')
    );
    
    const basicColumns = columns.filter(col => !col.children || col.children.length === 0);
    const listColumns = columns.filter(col => col.type === 'List`1');

    return (
      <tbody>
        {validData.map((row, rowIndex) => (
          <tr key={rowIndex}>
                {basicColumns?.map(col => {
              const value = row[col?.key] ?? null;
              return (
                <td key={`${rowIndex}-${col?.key}`} className="text-center">
                  {renderCellWithTruncation(value, col?.type, col?.key, col?.displayName)}
                </td>
              );
            })}
            {parentColumns.map(parent => 
              parent.children.map(child => {
                const value = row[parent.key]?.[child.key] ?? null;
                return (
                  <td key={`${rowIndex}-${child.key}`} className="text-center">
                    {renderCellWithTruncation(value, child.type, child.key, child.displayName)}
                  </td>
                );
              })
            )}
            
        
            {listColumns?.map(col => {
              const nestedData = row[col?.key] || [];
              return (
                <td key={`${rowIndex}-${col?.key}`} className="text-center align-middle">
                  <button
                    role="button"
                    className={`btn btn-sm ${nestedData?.length > 0 ? 'btn-primary' : 'btn-warning'} mx-auto px-3 d-block`}
                    onClick={() => {
                      if (nestedData?.length > 0) {
                        setSelectedNestedData(row);
                        setSelectedNestedConfig({
                          key: col?.key,
                          columns: col?.children || [],
                          displayName: col?.displayName
                        });
                        setShowNestedModal(true);
                      }
                    }}
                    disabled={!nestedData?.length}
                  >
                    <b className="fs-5">{nestedData?.length || 0}</b>
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xxl">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-card-scroll'>
          {config?.columns && (
            <>
                <MasterReportVisibilityManager
                  columns={config.columns}
                  reportType="modalReport"
                  setVisibleColumns={setVisibleColumns}
                />
            </>
          )}
          {visibleColumns.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered">
                {renderTableHeader(visibleColumns)}
                {renderTableBody(visibleColumns)}
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <NestedModal 
        show={showNestedModal}
        onHide={() => {
          setShowNestedModal(false);
          setSelectedNestedData(null);
          setSelectedNestedConfig(null);
        }}
        data={selectedNestedData}
        config={selectedNestedConfig}
      />
      
      <DescriptionModal 
        show={showDescModal} 
        handleClose={() => setShowDescModal(false)} 
        description={modalContent} 
        title={modalTitle}
      />
    </>
  );
};

export default MasterModal; 