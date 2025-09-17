import React from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { Modal } from 'react-bootstrap';
import { validateDate } from '../../common/Helpers';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { CSVLink } from 'react-csv';

// Global filter component for search
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <span>
    <input
      value={globalFilter || ''}
      onChange={e => setGlobalFilter(e.target.value || undefined)}
      placeholder="Type to search..."
      style={{
        fontSize: '1.1rem',
        marginBottom: '10px',
        padding: '5px',
        borderRadius: '10px',
      }}
    />
  </span>
);

const DynamicTable = ({ data, title, show, onHide, tableType }) => {
  //const history = useHistory();
  const navigate = useNavigate();


  // Check for the nested data structure and handle loading state
  if (!data) {
    return (
      <Modal show={show} onHide={onHide} size="xl" centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  // Handle case when no data is available
  if (!data?.data?.data?.length) {
    return (
      <Modal show={show} onHide={onHide} size="xl" centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center p-4">
            No data available
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  // Columns to exclude
  const excludedColumns = ['admissionStatus', 'category', 'prisonId', 'id'];

  // Header name mapping
  const headerMapping = {
    'fullName': 'Full Name',
    'prisonerNumber': 'Prisoner Number',
    'prisonName': 'Prison Name',
    'firNo': 'FIR No',
    'designation': 'Designation',
    'organization': 'Organization',
    'visitDate': 'Visit Date',
    'exitDate': 'Exit Date',
    'otherRemarks': 'Remarks',
    'insidePrison': 'Inside Prison'
  };

  // Format header name with spaces and custom mapping
  const formatHeaderName = (key) => {
    if (headerMapping[key]) {
      return headerMapping[key];
    }
    // For any other headers, capitalize first letter and add spaces before capital letters
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Format cell value based on type
  const formatCellValue = (value, key) => {
    if (value === null || value === undefined) return '-';

    // Check if the key is a date field and the value is a valid date
    if (['visitDate', 'exitDate', 'dateOfBirth', 'joiningDate', 'retirementDate'].includes(key)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return validateDate(value);
      } else {
        return '-';
      }
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return value;
  };

  const columns = React.useMemo(() => {
    // Add the numbered column first
    const cols = [{
      Header: 'No',
      id: 'index',
      Cell: ({ row }) => row.index + 1
    }];

    // Add the rest of the columns
    const dataCols = Object.keys(data.data.data[0])
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        Header: formatHeaderName(key),
        accessor: key,
        Cell: ({ value }) => formatCellValue(value, key)
      }));

    cols.push(...dataCols);

    // Add the actions column at the end
    cols.push({
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => {
        const id = row.original.id;
        return (
          <button
            className="btn btn-primary justify-items-center"
            onClick={() => {
              if (id !== null) {
                const url = tableType === 'employee'
                  ? `/admin/administration/employee-details/${id}`
                  : `/admin/prisoner/prisoner-details/${id}`;
                  navigate(url,{
                    state: {
                      ignoreRedirect: true,
                      dashboard: true
                    }
                  });
              } else {
                console.error('ID not found for row:', row);
              }
            }}
          >
            View Details
          </button>
        );
      }
    });

    return cols;
  }, [data, tableType, navigate]);

  const tableData = React.useMemo(() => data.data.data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page, // Instead of using 'rows', we'll use 'page'
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0 } // Start on the first page
    },
    useGlobalFilter, // Use global filter for search
    useSortBy, // Use sorting
    usePagination // Use pagination
  );

  // Format data for CSV export
  const formatDataForCSV = () => {
    if (!data?.data?.data?.length) return [];
    
    return data.data.data.map((row, index) => {
      const formattedRow = { "No": index + 1 };
      
      Object.keys(row)
        .filter(key => !excludedColumns.includes(key) && key !== 'actions')
        .forEach(key => {
          formattedRow[formatHeaderName(key)] = formatCellValue(row[key], key);
        });
        
      return formattedRow;
    });
  };
  
  // Get CSV headers
  const getCSVHeaders = () => {
    if (!columns.length) return [];
    
    return columns
      .filter(col => col.id !== 'actions' && col.accessor !== 'actions') // Thoroughly exclude actions column
      .map(col => ({ label: col.Header, key: col.Header }));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {title} {data?.data?.totalNumber > 0 ? `(${data.data.totalNumber})` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="dynamic-table">
          <div className="d-flex justify-content-between mb-3">
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            
            {data?.data?.data?.length > 0 && (
              <CSVLink 
                data={formatDataForCSV()} 
                headers={getCSVHeaders()}
                filename={`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`}
                className="btn btn-success"
              >
                <i className="icon-file label-icon align-middle fs-16 me-2"></i> Export CSV
              </CSVLink>
            )}
          </div>
          
          <table {...getTableProps()} className="table table-striped table-bordered">
            <thead className="bg-light">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="text-center table-cell-wrap justify-content-center">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pagination-buttons">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
            </div>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DynamicTable; 