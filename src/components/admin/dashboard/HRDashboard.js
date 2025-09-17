import React, { useEffect, useState } from "react";
import { getData } from "../../../services/request";
import EmployeesCards from "./components/EmployeesCards";
import { EmployeePieChart } from "../../charts/EmployeePieChart";
import { EmployeesGenderChart } from "../../charts/EmployeesGenderChart";
import { EmployeesDepartmentChart } from "../../charts/EmployeesDepartmentChart";
import { EmployeesAttendanceChart } from "../../charts/EmployeesAttendanceChart";
import { dashApi } from "./DashboardApis";
import DynamicTable from "../../common/DynamicTable";

const HRDashboard = (props) => {
  const [employeesGenderStats, setEmployeesGenderStats] = useState("");
  const [employeeStats, setEmployeeStats] = useState("");
  const [empAttendanceAndLeave, setEmpAttendanceAndLeave] = useState("");
  const [employeesDepartmentStats, setEmployeesDepartmentStats] = useState("");
  
  // Add new states for the dynamic table
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [tableTitle, setTableTitle] = useState("");
  const [tableType, setTableType] = useState("");

  useEffect(() => {
    loadApi();
  }, []);

  const fetchNewData = async (apiEndpoint) => {
    try {
      const response = await getData(apiEndpoint);
      if (response?.success) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.log(`Error in dashboard API ${apiEndpoint}:`, error);
      return null;
    }
  };

  const loadApi = async () => {
    try {
      const apiPromises = apiConfigurations.map(async (config) => {
        if (config.condition) {
          try {
            const apiData = await fetchNewData(config.endpoint);
            if (apiData) {
              config.setter(apiData);
            }
          } catch (error) {
            console.log(`Error in dashboard API ${config.endpoint}:`, error);
          }
        }
      });

      await Promise.all(apiPromises);
    } catch (error) {
      console.log("error in dashboard::: ", error);
    }
  };

  const apiConfigurations = [
    {
      condition: true,
      endpoint: dashApi.employeeStats,
      setter: setEmployeeStats,
    },
    {
      condition: true,
      endpoint: dashApi.employeesGenderStats,
      setter: setEmployeesGenderStats,
    },
    {
      condition: true,
      endpoint: dashApi.empAttendanceAndLeave,
      setter: setEmpAttendanceAndLeave,
    },
    {
      condition: true,
      endpoint: dashApi.employeesDepartmentStats,
      setter: setEmployeesDepartmentStats,
    },
  ];

  const handleCardClick = async (type, params) => {
    try {
      let endpoint;
      let title;
      
      setTableData(null);
      setTableTitle('Loading...');
      setShowModal(true);

      endpoint = dashApi.employeeDetailedStats(params.duration);
      title = params.duration === 1 ? 'New Employees This Month' :
              params.duration === 2 ? 'New Employees This Year' :
              params.duration === 3 ? 'Total Attendance Today' :
              params.duration === 4 ? 'Total Inside Prison' :
              params.duration === 5 ? 'Total Outside Prison' :
              params.duration === 6 ? 'Total On Leave Today' :
              params.duration === 7 ? 'Total Applied For Leaves Today' :
              params.duration === 8 ? 'Total Leaves Approved Today' :
              params.duration === 9 ? 'Total Leaves Declined Today' :
              params.duration === 10 ? 'Total Leaves Cancelled Today' :
              params.duration === 11 ? 'Total On Leave This Month' :
              'Employee Details';

      const response = await getData(endpoint);
      if (response?.success) {
        setTableData(response.result);
        setTableTitle(title);
        setTableType('employee');
      } else {
        console.error('API response not successful:', response);
        setTableData({ data: { data: [] } });
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData({ data: { data: [] } });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTableData(null);
    setTableTitle('');
  };

  return (
    <>
      <div className="row">
        <div className="col-md-9 col-sm-12">
          <div className="db-card-container">
            <div className="db-card-body">
              <EmployeesCards 
                employeeStats={employeeStats} 
                handleCardClick={handleCardClick}  // Pass the click handler
              />
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">
                    Employees Attendance and Leave Stats{" "}
                  </h4>
                  <EmployeesAttendanceChart
                    empAttendanceAndLeave={empAttendanceAndLeave}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">
                    Employees By Deparment
                  </h4>
                  <EmployeesDepartmentChart
                    employeesDepartmentStats={employeesDepartmentStats}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 mt-2">
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">
                    Total Employees Inside and Outside Prison{" "}
                  </h4>
                  <EmployeePieChart employeeStats={employeeStats} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">
                    Gender Wise Employees Stats{" "}
                  </h4>
                  <EmployeesGenderChart
                    employeesGenderStats={employeesGenderStats}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the DynamicTable component */}
      {showModal && (
        <DynamicTable
          data={tableData}
          title={tableTitle}
          show={showModal}
          onHide={handleCloseModal}
          type={tableType}
        />
      )}
    </>
  );
};

export default HRDashboard;
