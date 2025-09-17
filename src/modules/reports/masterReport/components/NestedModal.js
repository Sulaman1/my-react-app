import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { renderCellValue } from '../../../../common/helpers/renderHelpers';
import MasterReportVisibilityManager from '../../../../common/components/MasterReportVisibilityManager';
import Print from '../../../../components/admin/search/Print';
import DescriptionModal from '../../../../common/DescriptionModal';

const NestedModal = ({ show, onHide, data, config }) => {
  const [modalData, setModalData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  
  // Use useMemo to process the config
  const processedConfig = useMemo(() => {
    if (!config) return null;
    
    const processColumns = (columns) => {
      return columns.filter(col => {
        // Filter out invisible columns
        if (!col.visible) return false;
        if (col.children && col.children.length > 0) {
          col.children = processColumns(col.children);
          return col.children.length > 0;
        }
        return true;
      });
    };
    
    return {
      ...config,
      columns: config.columns ? processColumns([...config.columns]) : []
    };
  }, [config]);
  
  useEffect(() => {
    if (data && processedConfig?.key) {
      const nestedData = data[processedConfig.key] || [];
      setModalData(nestedData);
      
      // Initialize with all columns visible
      if (processedConfig.columns && processedConfig.columns.length > 0) {
        setVisibleColumns(processedConfig.columns);
        
      }
    }
  }, [data, processedConfig]);
  

  const renderHeader = () => (
    <div className="nested-header bg-primary text-white p-2 mb-3 rounded">
      <h5 className="mb-0 text-white">{processedConfig?.displayName}</h5>
    </div>
  );

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

  const renderNestedListData = (row, rowIndex) => {
    if (!visibleColumns || visibleColumns.length === 0) return null;

    return (
      <div className="nested-data-container" key={`nested-${rowIndex}`}>
        {renderHeader()}
        
        <table className="table table-bordered table-sm mb-4">
          <thead>
            <tr>
              {visibleColumns
                .filter(col => col.type !== 'List`1')
                .map(col => (
                  <th key={col.key} className="text-center bg-light">
                    {col.displayName}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {visibleColumns
                .filter(col => col.type !== 'List`1')
                .map(col => (
                  <td key={col.key} className="text-center">
                    {renderCellWithTruncation(row[col.key], col.type, col.key, col.displayName)}
                  </td>
                ))}
            </tr>
          </tbody>
        </table>

        {visibleColumns
          .filter(col => col.type === 'List`1')
          .map(nestedConfig => (
            <div key={nestedConfig.key} className="nested-table-container mt-3 ms-4">
              <h6 className="text-black mb-2">{nestedConfig.displayName}</h6>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    {nestedConfig.children.map(col => (
                      <th key={col.key} className="text-center text-black bg-light">
                        {col.displayName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(row[nestedConfig.key] || []).length > 0 ? (
                    (row[nestedConfig.key] || []).map((nestedRow, index) => (
                      <tr key={index}>
                        {nestedConfig.children.map(col => (
                          <td key={col.key} className="text-center">
                            {renderCellWithTruncation(nestedRow[col.key], col.type, col.key, col.displayName)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={nestedConfig.children.length} className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xxl">
        <Modal.Header closeButton>
          <Modal.Title>{processedConfig?.displayName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-card-scroll'>
          {processedConfig?.columns && processedConfig.columns.length > 0 && (
            <>
              <MasterReportVisibilityManager
                columns={processedConfig.columns}
                reportType="nestedModalReport"
                setVisibleColumns={setVisibleColumns}
              />
              {/* <Print 
                data={csvData} 
                headers={csvHeaders} 
                filename={`${processedConfig?.displayName || 'Report'}.csv`}
              /> */}
            </>
          )}
          {visibleColumns.length > 0 && (
            <div className="table-responsive">
              {modalData.map((row, index) => renderNestedListData(row, index))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
      
      <DescriptionModal 
        show={showDescModal} 
        handleClose={() => setShowDescModal(false)} 
        description={modalContent} 
        title={modalTitle}
      />
    </>
  );
};

export default NestedModal; 