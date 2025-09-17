import React, { useEffect, useState } from 'react';
import { getData } from "../../../services/request";
import { dashApi } from "./DashboardApis";
import { PrisonWiseStatsChart } from '../../charts/PrisonWiseStatsChart';
import { CountryWiseStatsChart } from '../../charts/CountryWiseStatsChart';
import { AgeWiseCategoryChart } from '../../charts/AgeWiseCategoryChart';
import { PrisonerGenderWiseStatsNew } from '../../charts/PrisonerGenderWiseStatsNew';
import { DiseasesBarChart } from '../../charts/DiseasesBarChart';
import { MedicinePastExpiryChart } from '../../charts/MedicinePastExpiryChart';
import { MedicineChart } from '../../charts/MedicineChart';
import { EmployeesDepartmentChart } from '../../charts/EmployeesDepartmentChart';
import { EmployeesAttendanceChart } from '../../charts/EmployeesAttendanceChart';
import { EmployeeWiseIssuanceChart } from '../../charts/EmployeeWiseIssuanceChart';
import { MostIssuedItemsChart } from '../../charts/MostIssuedItemsChart';
import { VisitorTrendChart } from '../../charts/VisitorTrendChart';
import { BarrackCapacity } from '../../charts/BarrackCapacity';
import { OverCrowdedBarracks } from '../../charts/OverCrowdedBarracks';
import { HearingChart } from '../../charts/HearingChart';
import { UpComingHearingChart } from '../../charts/UpComingHearingChart';
import AllTimeBarrackDetails from './components/AllTimeBarrackDetails';
import MedicineCards from './components/MedicineCards';
import InventoryCards from './components/InventoryCards';
import EmployeesCards from './components/EmployeesCards';
import AllTimeGuests from './components/AllTimeGuests';
import AllTime from './components/AllTime';
import DailyCount from './components/DailyCount';
import TodaysVisitors from './components/TodaysVisitors';
import PrisonerHearing from './components/PrisonerHearing';
import MedicineUsed from './components/MedicineUsed';
import BasicStats from './components/BasicStats';
import OutBarrackDetails from '../../charts/OutBarrackDetails';
import HighProfileChart from '../../charts/HighProfileChart';
import LegalAssistanceChart from '../../charts/LegalAssistanceChart';
import { UtiChart } from '../../charts/UtiChart';
import { EmployeePieChart } from '../../charts/EmployeePieChart';
import { EmployeesGenderChart } from '../../charts/EmployeesGenderChart';
import { HospitalChart } from '../../charts/HospitalChart';
import { GenderChart } from '../../charts/GenderChart';
import { PrisonerTypeChart } from '../../charts/PrisonerTypeChart';
import { DoughutChart } from '../../Demo/components/DoughutChart';
import { TotalCoU } from '../../charts/TotalCoU';
import DynamicTable from '../../common/DynamicTable';

const IGDIGDashboard = () => {
  const [allIgPrisonWiseStats, setAllIgPrisonWiseStats] = useState("");
  const [countryWise, setCountryWise] = useState("");
  const [prisonerAgeCategoryWiseStats, setPrisonerAgeCategoryWiseStats] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");
  const [prevalentDisease, setPrevalentDisease] = useState("");
  const [medicineDashboardStats, setMedicineDashboardStats] = useState("");
  const [employeesDepartmentStats, setEmployeesDepartmentStats] = useState("");
  const [empAttendanceAndLeave, setEmpAttendanceAndLeave] = useState("");
  const [employeeInventoryStats, setEmployeeInventoryStats] = useState("");
  const [mostIssuedItemsStats, setMostIssuedItemsStats] = useState("");
  const [barrackStats, setBarrackStats] = useState("");
  const [visitorStats, setVisitorStats] = useState("");
  const [hearingStats, setHearingStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [hospitalStats, setHospitalStats] = useState("");
  const [employeeStats, setEmployeeStats] = useState("");
  const [guestStats, setGuestStats] = useState("");
  const [inventoryStats, setInventoryStats] = useState("");
  const [speacialStats, setSpeacialStats] = useState("");
  const [employeesGenderStats, setEmployeesGenderStats] = useState("");
  const [prisonerTypes, setPrisonerTypes] = useState("");
  const [tableData, setTableData] = useState(null);
  console.log(tableData, 'table data');
  const [tableTitle, setTableTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tableType, setTableType] = useState('');
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
      endpoint: dashApi.allIgPrisonWiseStats,
      setter: setAllIgPrisonWiseStats,
    },
    {
      condition: true,
      endpoint: dashApi.countryWise,
      setter: setCountryWise,
    },
    {
      condition: true,
      endpoint: dashApi.prisonerAgeCategoryWiseStats,
      setter: setPrisonerAgeCategoryWiseStats,
    },
    {
      condition: true,
      endpoint: dashApi.prisonerStats,
      setter: setPrisonerStats,
    },
    {
      condition: true,
      endpoint: dashApi.prevalentDisease,
      setter: setPrevalentDisease,
    },
    {
      condition: true,
      endpoint: dashApi.medicineDashboardStats,
      setter: setMedicineDashboardStats,
    },
    {
      condition: true,
      endpoint: dashApi.employeesDepartmentStats,
      setter: setEmployeesDepartmentStats,
    },
    {
      condition: true,
      endpoint: dashApi.empAttendanceAndLeave,
      setter: setEmpAttendanceAndLeave,
    },
    {
      condition: true,
      endpoint: dashApi.employeeInventoryStats,
      setter: setEmployeeInventoryStats,
    },
    {
      condition: true,
      endpoint: dashApi.mostIssuedItemsStats,
      setter: setMostIssuedItemsStats,
    },
    {
      condition: true,
      endpoint: dashApi.barrackCappacity,
      setter: setBarrackStats,
    },
    {
      condition: true,
      endpoint: dashApi.visitorStats,
      setter: setVisitorStats,
    },
    {
      condition: true,
      endpoint: dashApi.hearingStats,
      setter: setHearingStats,
    },
    {
      condition: true,
      endpoint: dashApi.outOfBarrackDetails,
      setter: setOutOfBDetails,
    },
    {
      condition: true,
      endpoint: dashApi.hospitalStats,
      setter: setHospitalStats,
    },
    {
      condition: true,
      endpoint: dashApi.employeeStats,
      setter: setEmployeeStats,
    },
    {
      condition: true,
      endpoint: dashApi.guestStats,
      setter: setGuestStats,
    },
    {
      condition: true,
      endpoint: dashApi.inventoryStats,
      setter: setInventoryStats,
    },
    {
      condition: true,
      endpoint: dashApi.speacialStats,
      setter: setSpeacialStats,
    },
    {
      condition: true,
      endpoint: dashApi.employeesGenderStats,
      setter: setEmployeesGenderStats,
    },
    {
      condition: true,
      endpoint: dashApi.prisonerTypes,
      setter: setPrisonerTypes,
    }
  ];

  const handleCardClick = async (type, params) => {
    try {
      let endpoint;
      let title;
      let tableType;
      
      setTableData(null);
      setTableTitle('Loading...');
      setShowModal(true);
      
      switch(type) {
        case 'prisoners':
          endpoint = dashApi.prisonerDetailedStats(params.category, params.admissionStatus);
          title = params.category === 1 ? 'Under Trial Prisoners' : 
                  params.category === 2 ? 'Convicted Prisoners' : 
                  'Total Prisoners';
          tableType = 'prisoner';
          break;

        case 'hospital':
          endpoint = dashApi.hospitalDetailedStats(params.type, params.duration);
          title = params.type === 1 ? 'OPD Patients' : 
                  params.type === 2 ? 'IPD Patients' : 
                  params.type === 3 ? 'Outside Hospital Patients' : 
                  'Hospital Details';
          tableType = 'prisoner';
          break;

        case 'barrack':
          endpoint = dashApi.barrackDetailedStats(params.allocated);
          title = params.allocated === 1 ? 'Allocated Prisoners' : 
                  params.allocated === 2 ? 'Unallocated Prisoners' : 
                  'Total Prisoners in Prison';
          tableType = 'prisoner';
          break;

        case 'hearing':
          endpoint = dashApi.hearingDetailedStats(params.duration);
          title = params.duration === 1 ? 'Yesterday\'s Hearings' :
                  params.duration === 2 ? 'Today\'s Hearings' :
                  params.duration === 3 ? 'Tomorrow\'s Hearings' :
                  'Hearing Details';
          tableType = 'prisoner';
          break;

        case 'employee':
          endpoint = dashApi.employeeDetailedStats(params.duration);
          title = params.duration === 1 ? 'New Employees This Month' :
                  params.duration === 2 ? 'New Employees This Year' :
                  params.duration === 3 ? 'Total Attendance Today' :
                  params.duration === 4 ? 'Total Inside' :
                  params.duration === 5 ? 'Total Outside' :
                  params.duration === 6 ? 'Total On Leave Today' :
                  params.duration === 7 ? 'Total Applied For Leaves Today' :
                  params.duration === 8 ? 'Total Leaves Approved Today' :
                  params.duration === 9 ? 'Total Leaves Declined Today' :
                  params.duration === 10 ? 'Total Leaves Cancelled Today' :
                  params.duration === 11 ? 'Total On Leave This Month' :
                  'Employee Details';
          tableType = 'employee';
          break;

        case 'guest':
          endpoint = dashApi.guestDetailedStats(params.duration);
          title = params.duration === 1 ? 'Today\'s Guests' :
                  params.duration === 2 ? 'This Week\'s Guests' :
                  params.duration === 3 ? 'This Month\'s Guests' :
                  'Guest Details';
          tableType = 'guest';
          break;

        default:
          console.log('Unknown card type:', type);
          return;
      }
      
      const response = await getData(endpoint);
      console.log('API Response:', response);
      if (response?.success) {
        setTableData(response.result);
        setTableTitle(title);
        setTableType(tableType);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
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
      <div className="col-lg-9 col-sm-12 col-md-12">
            <div className="db-card-container">
              <div className="db-card-body">
                <BasicStats handleCardClick={handleCardClick} barrackStats={barrackStats}  prisonerStats={prisonerStats} outOfBDetails={outOfBDetails}  />
                  <AllTimeBarrackDetails
                  handleCardClick={handleCardClick}
                  barrackStats={barrackStats}
                  outOfBDetails={outOfBDetails}
                  ig={true}
                  />
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <MedicineCards medicine={medicineDashboardStats} handleCardClick={handleCardClick} />
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <InventoryCards stats={inventoryStats} />
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <EmployeesCards  employeeStats={employeeStats} handleCardClick={handleCardClick}/>
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <AllTimeGuests handleCardClick={handleCardClick} daily={guestStats} />
              </div>
            </div>
            <div className="db-card-container">
              <div className="db-card-body">
                <AllTime handleCardClick={handleCardClick} hospitalStats={hospitalStats}/>
              </div>
            </div>
            <div className="db-card-container">
              <div className="db-card-body">
                <DailyCount handleCardClick={handleCardClick} hospitalStats={hospitalStats}/>
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                  <TodaysVisitors  visitorStats={visitorStats} />
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <PrisonerHearing handleCardClick={handleCardClick} hearingStats={hearingStats}/>
              </div>
            </div>

            <div className="db-card-container">
              <div className="db-card-body">
                <MedicineUsed counts={medicineDashboardStats} />
              </div>
            </div>
            <div className="col-lg-12 col-sm-12 col-md-12">
      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Prisons Wise Stats Chart
              </h4>
              <PrisonWiseStatsChart stats={allIgPrisonWiseStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Country Wise Stats
              </h4>
              <CountryWiseStatsChart countryWise={countryWise} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Age Wise Stats
              </h4>
              <AgeWiseCategoryChart prisonerAgeCategoryWiseStats={prisonerAgeCategoryWiseStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Prisoner Gender Wise Stats
              </h4>
              <PrisonerGenderWiseStatsNew prisonerStats={prisonerStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                10 Most Prevalent Diseases in the Prison
              </h4>
              <DiseasesBarChart counter={prevalentDisease} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Number of Days after expiry by Medicine Stock
              </h4>
              <MedicinePastExpiryChart counter={medicineDashboardStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Number of Days before expiry by Medicine Stock
              </h4>
              <MedicineChart counter={medicineDashboardStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Employees By Department
              </h4>
              <EmployeesDepartmentChart employeesDepartmentStats={employeesDepartmentStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Employees Attendance and Leave Stats
              </h4>
              <EmployeesAttendanceChart empAttendanceAndLeave={empAttendanceAndLeave} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Employees Wise Issuance Chart
              </h4>
              <EmployeeWiseIssuanceChart counter={employeeInventoryStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Most Issued Items Chart
              </h4>
              <MostIssuedItemsChart counter={mostIssuedItemsStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Visitor Trend Analysis
              </h4>
              <VisitorTrendChart visitorStats={visitorStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Barrack Capacity Analysis
              </h4>
              <BarrackCapacity barrackStats={barrackStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Over Crowded Barracks Analysis
              </h4>
              <OverCrowdedBarracks barrackStats={barrackStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-animate mt-5 animation-fade-grids">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <h4 className="third-heading db-heading">
                Hearing Analysis
              </h4>
              <HearingChart hearingStats={hearingStats} />
            </div>
          </div>
        </div>
      </div>

        <div className="card card-animate mt-5 animation-fade-grids">
            <div className="card-body">
            <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                <h4 className="third-heading db-heading">
                    Upcoming Hearings (Court Wise) Analysis
                </h4>
                <UpComingHearingChart hearing={hearingStats} />
                </div>
            </div>
            </div>
        </div>
      </div>
        </div>
     
      <div className="col-lg-3 col-md-12 mt-2">
            <div className="card card-animate animation-fade-grids" >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Out of Prison Details </h4>
                    <OutBarrackDetails outOfBDetails={outOfBDetails} />
                  </div>
                </div>
              </div>
            </div>
        

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">
                      High Profile Prisoner Stats{" "}
                    </h4>
                    <HighProfileChart speacialStats={speacialStats}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">
                      Legal Assistance Prisoner Stats{" "}
                    </h4>
                    <LegalAssistanceChart speacialStats={speacialStats} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Total UTP/CONVICT </h4>
                    <UtiChart prisonerStats={prisonerStats} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate animation-fade-grids">
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

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">
                      Gender Wise Employees Stats{" "}
                    </h4>
                    <EmployeesGenderChart employeesGenderStats={employeesGenderStats} />
                  </div>
                </div>
              </div>
            </div>
          
            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Prison Hospital Stats </h4>
                    <HospitalChart hospitalStats={hospitalStats} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">
                      Gender Wise Prisoner Stats{" "}
                    </h4>
                    <GenderChart speacialStats={speacialStats} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Type Wise Prisoner Stats </h4>
                    <PrisonerTypeChart prisonerTypes={prisonerTypes} />
                  </div>
                </div>
              </div>
            </div>  

            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Hearings </h4>
                    <DoughutChart total={hearingStats} />
                  </div>
                </div>
              </div>
            </div>
        
            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Total UTP And Convicted </h4>
                    <TotalCoU prisonerStats={prisonerStats} />
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    {tableData && (
        <DynamicTable 
          data={tableData} 
          title={tableTitle}
          show={showModal}
          onHide={handleCloseModal}
          tableType={tableType}
        />
      )}
    </>
  );
};

export default IGDIGDashboard; 