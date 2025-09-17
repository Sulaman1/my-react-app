import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import swal from "sweetalert";
import { RiRefreshLine } from "react-icons/ri";
import { FaChartBar } from "react-icons/fa";
import generateReport from "../../assets/images/1.svg";
import ProfilePic from "../../assets/images/users/1.jpg";
import { baseImageUrl, postData } from "../../services/request";
import { handleResetReport } from "../../common/ResetReport";
import DescriptionModal from "../../common/DescriptionModal";
import MasterModal from "../../modules/reports/masterReport/components/MasterModal";
import MasterReportVisibilityManager from "../../common/components/MasterReportVisibilityManager";
import ReportStats from "../../modules/reports/components/ReportStats";
import ScrollButtons from "../../common/ScrollButtons";
import TabNavigation from "../../modules/reports/components/TabNavigation";
import { PayloadFtn } from "../../modules/reports/helper/Payload";
import { cleanReportsPayload, validateDate } from "../../common/Helpers";
import MasterReportPrisonStatsChart from "./MasterReportPrisonStatsChart";


const BaseReportComponent = ({
  reportName,
  apiEndpoint,
  statsEndpoint,
  excelExportEndpoint,
  defaultFormPayload = {},
  preservedFieldsOnReset = {},
  tabConfig,
  renderTabContent,
  imageKeywords = ["photo", "image", "picture"],
  defaultColumns = [],
  defaultVisibleColumns = [],
  excelFileName = "report",
}) => {
  // Common state
  const [formPayload, setFormPayload] = useState({ ...PayloadFtn, ...defaultFormPayload });
  const [entries, setEntries] = useState([]);
  const [columns, setColumns] = useState(defaultColumns);
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [shouldRemount, setShouldRemount] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [reportStats, setReportStats] = useState(null);
  const [showChart, setShowChart] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setShouldRemount(true);
  }, [refreshKey]);

  useEffect(() => {
    // Initialize with prison ID from session
    const rawData = sessionStorage.getItem("user");
    const prisonId = JSON.parse(rawData)?.employee?.prisons.map(
      (e) => e.prisonId
    );
    
    if (prisonId) {
      setFormPayload((prevPayload) => ({
        ...prevPayload,
        prisonerBasicInfo: {
          ...prevPayload.prisonerBasicInfo,
          prisonId: prisonId,
        },
      }));
    }

    return () => {
      setFormPayload(PayloadFtn);
    };
  }, []);

  const handleFormPayloadChange = (newData) => {
    setFormPayload((prevPayload) => ({
      ...prevPayload,
      ...newData,
    }));
  };

  const handleShowDescModal = (content, title) => {
    setModalContent(content);
    setModalTitle(title);
    setShowDescModal(true);
  };

  const handleGenerateReport = async (e, page = 1) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Clean the payload before sending
      const cleanedPayload = cleanReportsPayload(formPayload);
      
      // Prepare report payload using the cleaned data
      const reportPayload = {
        ...cleanedPayload,
        maxResults: pageSize, // Use maxResults instead of pageSize
        pageNumber: page,
      };
      
      // Prepare stats payload
      const statsPayload = cleanReportsPayload(formPayload);

      // Make API call to the report endpoint
      const response = await postData(apiEndpoint, reportPayload);
      
      if (response && response.success) {
        // Handle response data structure as in original MasterReport
        if (!response.result.data.data || response.result.data.data.length === 0) {
          if (page === 1) {
            swal({
              title: "No Data Found",
              text: "No records match your search criteria",
              icon: "warning",
              button: "OK",
            });
            setEntries([]);
            setColumns([]);
          } else {
            setCurrentPage(prev => prev - 1);
            swal({
              title: "End of Results",
              text: "No more records to display",
              icon: "info",
              button: "OK",
            });
          }
          return;
        }

        swal({
            title: "Success",
            text: `${reportName} report generated successfully`,
            icon: "success",
            timer: 1500,
            buttons: false
          });
        // Filter visible columns
        const filterVisibleColumns = (columns) => {
          return columns.filter((col) => {
            if (!col.visible) return false;
            if (col.children && col.children.length > 0) {
              col.children = filterVisibleColumns(col.children);
              return col.children.length > 0;
            }
            return true;
          });
        };

        const visibleCols = filterVisibleColumns(response.result.data.columns);
        setColumns(visibleCols);
        setVisibleColumns(visibleCols);
        setEntries(response.result.data.data);
        setTotalRecords(response.result.data.totalCount || 0);
        setCurrentPage(page);
        
        // Get report stats if endpoint provided
        if (statsEndpoint) {
          try {
            const statsResponse = await postData(statsEndpoint, statsPayload, false);
            if (statsResponse && statsResponse.result?.isSuccessful) {
              setReportStats(statsResponse.result.data);
            } else {
              setReportStats(null);
            }
          } catch (statsError) {
            console.error("Error fetching stats:", statsError);
          }
        }
        
       
      } else {
        swal({
          title: "Error",
          text: response.error?.message || `Failed to generate ${reportName} report`,
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      swal({
        title: "Error",
        text: error.message || `Error generating ${reportName} report`,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareExcelPayload = () => {
    // Get only visible columns from the visibleColumns state
    const filterVisibleColumns = (columns) => {
      return columns.map(col => {
        const columnData = {
          key: col.key,
          displayName: col.displayName,
          propertyName: col.propertyName,
          visible: true,
          type: col.type
        };

        if (col.children?.length > 0) {
          columnData.children = col.children.map(child => ({
            key: child.key,
            displayName: child.displayName,
            propertyName: child.propertyName,
            visible: true,
            type: child.type
          }));
        }

        return columnData;
      });
    };
    
    const params = {
      ...cleanReportsPayload(formPayload),
      maxResults: pageSize,
      pageNumber: currentPage
    };

    return {
      params,
      columns: filterVisibleColumns(visibleColumns)
    };
  };

  const handleExcelExport = async () => {
    if (!visibleColumns.length) {
      swal({
        title: "No Data",
        text: "No data available to export",
        icon: "warning",
        button: "OK",
      });
      return;
    }
    
    setIsExporting(true);
    try {
      const payload = prepareExcelPayload();
      
      // Make the request
      const response = await postData(excelExportEndpoint, payload);

      if (!response.success) {
        throw new Error('Export failed');
      }

      // Convert base64 to blob
      const base64Response = response.result;
      const binaryString = window.atob(base64Response);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${excelFileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      swal({
        title: "Success",
        text: `${reportName} data exported successfully`,
        icon: "success",
        timer: 1500,
        buttons: false
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      swal({
        title: "Error",
        text: `Failed to export ${reportName} data`,
        icon: "error"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    const rawData = sessionStorage.getItem("user");
    const prisonId = JSON.parse(rawData)?.employee?.prisons.map(
      (e) => e.prisonId
    );

    handleResetReport({
      setFormPayload,
      setShouldRemount,
      setRefreshKey,
      setActiveTab,
      preservedFields: {
        ...preservedFieldsOnReset,
        prisonerBasicInfo: {
          prisonId,
          ...(preservedFieldsOnReset?.prisonerBasicInfo || {})
        }
      }
    });
  };

  const renderCellValue = (value, type, key, fieldName) => {
    switch (type) {
      case "String":
      case "RomanUrdu":
        if (
          typeof value === "string" &&
          imageKeywords.some((keyword) => value.toLowerCase().includes(keyword))
        ) {
          return (
            <img
              src={value !== "" ? `${baseImageUrl}${value}` : ProfilePic}
              alt="Profile"
              className="rounded-circle"
              width="96"
              height="96"
              onError={(e) => {
                e.target.src = ProfilePic;
              }}
            />
          );
        }
        
        // Add truncation for long text
        if (typeof value === "string" && value.length > 40) {
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
        
        // Check if the value is a date string
        if (typeof value === "string" && (key.toLowerCase().includes('date') || fieldName?.toLowerCase().includes('date'))) {
          const formattedDate = validateDate(value);
          return formattedDate || value || "-";
        }
        
        return value || "-";
      case "Int32":
      case "Int64":
        return value || "-";
      case "Decimal":
        return value ? value.toFixed(2) : "-";
      case "Array":
        if (Array.isArray(value)) {
          return value.length > 0 ? `${value.length} items` : "-";
        }
        return "-";
      default:
        if (Array.isArray(value)) {
          return value.length > 0 ? `${value.length} items` : "-";
        }
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }
        return value?.toString() || "-";
    }
  };

  const renderTableHeader = (columns) => {
    const parentColumns = columns.filter(
      (col) =>
        col.children &&
        col.children.length > 0 &&
        col.type !== "List`1" &&
        !col.children.some((childCol) => childCol.type === "List`1")
    );

    const basicColumns = columns.filter(
      (col) => !col.children || col.children.length === 0
    );
    const listColumns = columns.filter((col) => col.type === "List`1");

    return (
      <thead className="sticky-header">
        <tr>
          <th rowSpan="2" className="text-center bg-light" style={{ width: '50px' }}>
            No.
          </th>
          {parentColumns.map(
            (parent) =>
              parent.children &&
              parent.children.length > 0 && (
                <th
                  key={parent.key}
                  colSpan={parent.children.length}
                  className="text-center bg-primary text-white"
                >
                  {parent.displayName}
                </th>
              )
          )}
          {basicColumns.length > 0 && (
            <th
              colSpan={basicColumns.length}
              className="text-center bg-primary text-white"
            >
              Basic Information
            </th>
          )}
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
          {parentColumns.map((parent) =>
            parent.children.map((child) => (
              <th key={child.key} className="text-center bg-light">
                {child.displayName}
              </th>
            ))
          )}
          {basicColumns.map((col) => (
            <th key={col.key} className="text-center bg-light">
              {col.displayName}
            </th>
          ))}
          {listColumns.map((col) => (
            <th key={col.key} className="text-center bg-light">
              {col.displayName}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = (data, columns) => {
    const parentColumns = columns.filter(
      (col) =>
        col.children &&
        col.children.length > 0 &&
        col.type !== "List`1" &&
        !col.children.some((childCol) => childCol.type === "List`1")
    );

    const basicColumns = columns.filter(
      (col) => !col.children || col.children.length === 0
    );
    const listColumns = columns.filter((col) => col.type === "List`1");

    return (
      <tbody className="fixed-table">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{ height: "60px" }}>
            <td className="text-center align-middle">
              {rowIndex + 1}
            </td>
            {parentColumns.map((parent) =>
              parent.children.map((child) => {
                const value = row[parent.key]?.[child.key] ?? null;
                return (
                  <td key={`${rowIndex}-${child.key}`} className="text-center align-middle">
                    {renderCellValue(value, child.type, child.key, child.displayName)}
                  </td>
                );
              })
            )}
            {basicColumns.map((col) => (
              <td key={`${rowIndex}-${col.key}`} className="text-center">
                {renderCellValue(row[col.key], col.type, col.key, col.displayName)}
              </td>
            ))}
            {listColumns.map((col) => {
              const nestedData = row[col.key] || [];
              return (
                <td
                  key={`${rowIndex}-${col.key}`}
                  className="text-center align-middle"
                >
                  <button
                    role="button"
                    className={`btn btn-sm ${
                      nestedData?.length > 0 ? "btn-primary" : "btn-warning"
                    } mx-auto px-3 d-block `}
                    onClick={() => {
                      setSelectedPrisoner(row);
                      setSelectedConfig({
                        key: col.key,
                        columns: col.children || [],
                        displayName: col.displayName,
                      });
                      setShowModal(true);
                    }}
                  >
                    <b className="fs-5">{nestedData.length}</b>
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    // Use the totalPrisoner count from stats if available, otherwise use totalRecords
    const totalItems = reportStats?.data?.[0]?.totalPrisoner || totalRecords;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Calculate visible page range
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if end page is at max
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
    
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3 py-3">
        <div>
          <span className="me-2">
            Showing {entries.length} of {totalItems} records
          </span>
        </div>
        
        <div className="d-flex gap-2 align-items-center">
          <button 
            className="btn btn-sm btn-outline-primary tooltip-master-report waves-effect waves-light p-2" 
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(1);
              handleGenerateReport(null, 1);
            }}
          >
            <i className="fas fa-angle-double-left"></i>
            <span>First Page</span>
          </button>
          
          <button 
            className="btn btn-sm btn-outline-primary tooltip-master-report waves-effect waves-light p-2" 
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => prev - 1);
              handleGenerateReport(null, currentPage - 1);
            }}
          >
            <i className="fas fa-angle-left"></i>
            <span>Previous Page</span>
          </button>
          
          {pageNumbers.map(page => (
            <button
              key={page}
              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                if (page !== currentPage) {
                  setCurrentPage(page);
                  handleGenerateReport(null, page);
                }
              }}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="btn btn-sm btn-outline-primary tooltip-master-report waves-effect waves-light p-2" 
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => prev + 1);
              handleGenerateReport(null, currentPage + 1);
            }}
          >
            <i className="fas fa-angle-right"></i>
            <span>Next Page</span>
          </button>
          
          <button 
            className="btn btn-sm btn-outline-primary tooltip-master-report waves-effect waves-light p-2" 
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(totalPages);
              handleGenerateReport(null, totalPages);
            }}
          >
            <i className="fas fa-angle-double-right"></i>
            <span>Last Page</span>
          </button>
        </div>

        <div className="d-flex align-items-center">
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          
          <div className="d-flex align-items-center">
            <Form.Control
              type="number"
              className="form-control-sm"
              style={{ width: "60px" }}
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value) || '';
                setCurrentPage(page);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handleGenerateReport(null, page);
                  }
                }
              }}
            />
            <button
              className="btn btn-sm btn-primary ms-1 py-1 px-3 rounded-lg"
              onClick={() => {
                const page = parseInt(currentPage);
                if (page >= 1 && page <= totalPages) {
                  handleGenerateReport(null, page);
                }
              }}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    );
  };

  return shouldRemount ? (
    <div className={`master-report`} key={refreshKey}>
      <form onSubmit={handleGenerateReport}>
        <div className="master-card">
          <div className="master-card-header">
            <h2 className="master-card-title">{reportName} Report</h2>
            <div className="d-flex justify-content-end gap-2 mb-3">
              <button
                type="button"
                className="master-reset-btn"
                onClick={handleReset}
                disabled={loading}
              >
                <div className="d-flex align-items-center gap-2">
                  <RiRefreshLine className="fs-16" />
                  <span>Reset Report</span>
                </div>
              </button>
              <div className="d-flex align-items-center gap-2">
                <select 
                  className="form-select form-select-md" 
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[10, 50, 100, 200, 500].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className={`master-generate-btn ${(loading || (reportName === "Daily Darban Report" && formPayload?.prisonerAdvancedInfo?.darbanEntryDate?.start === "" && formPayload?.prisonerAdvancedInfo?.darbanEntryDate?.end === "")) ? "master-report-disabled-btn" : ""}`}
                disabled={loading || (reportName === "Daily Darban Report" && formPayload?.prisonerAdvancedInfo?.darbanEntryDate?.start === "" && formPayload?.prisonerAdvancedInfo?.darbanEntryDate?.end === "")}
              >
                <img
                  src={generateReport}
                  alt=""
                  className="generate-report-icon"
                />
                Generate Report
              </button>
            </div>
          </div>

          <div className="master-card-body">
            <TabNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              customTabs={tabConfig}
            />

            <div className="master-tab-content">
              {renderTabContent(activeTab, formPayload, handleFormPayloadChange, setFormPayload)}
            </div>
          </div>
        </div>
      </form>

      {entries?.length > 0 ? (
        <div className="master-table-container">
          {reportStats && <ReportStats stats={reportStats} />}
          
          {/* Add chart toggle button */}
          {reportStats && (
            <div className="d-flex justify-content-start mb-3">
              <button
                type="button"
                className={`btn ${showChart ? 'btn-success' : 'btn-primary'} btn-sm`}
                onClick={() => setShowChart(!showChart)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaChartBar />
                {showChart ? 'Hide Chart' : 'Show Statistics Chart'}
              </button>
            </div>
          )}
          
          {/* Conditionally render the chart */}
          {reportStats && showChart && (
            <div className="card mb-4">
              <div className="card-body">
                <MasterReportPrisonStatsChart reportStats={reportStats} />
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-start flex-column align-items-start mb-3">
            <MasterReportVisibilityManager
              columns={columns}
              reportType={reportName.toLowerCase().replace(/\s+/g, '_')}
              setVisibleColumns={setVisibleColumns}
            />
            {visibleColumns.length > 0 && (
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExcelExport}
                  disabled={isExporting}
                  style={{width: '190%', height: 'max-content', alignSelf: 'center'}}   
                >
                  <i className="icon-file label-icon align-middle fs-16 me-2"></i>
                  Export All to Excel
                </button>
              </div>
            )}
          </div>

          {visibleColumns.length > 0 && (
            <div className="col">
              <div className="wrapper">
                <ScrollButtons scrollContainerRef={scrollContainerRef} />
                <div className="card scrollable-container custom-card animation-fade-grids ">
                  <div className="card-body">
                    <div
                      className="table-responsive max-height-60"
                      ref={scrollContainerRef}
                    >
                      <table className="table table-bordered">
                        {renderTableHeader(visibleColumns)}
                        {renderTableBody(entries, visibleColumns)}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {renderPagination()}
        </div>
      ) : null}

      <MasterModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPrisoner(null);
          setSelectedConfig(null);
        }}
        prisoner={selectedPrisoner}
        config={selectedConfig}
        title={selectedConfig?.displayName}
      />
      
      <DescriptionModal 
        show={showDescModal} 
        handleClose={() => setShowDescModal(false)} 
        description={modalContent} 
        title={modalTitle}
      />
    </div>
  ) : null;
};

export default BaseReportComponent;