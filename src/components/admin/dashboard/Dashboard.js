import React, { useEffect, useState } from "react";
import { getData } from "../../../services/request";
//import { useHistory } from "react-router-dom";
import AllTime from "./components/AllTime";
import BasicStats from "./components/BasicStats";
import DailyCount from "./components/DailyCount";
import PrisonerHearing from "./components/PrisonerHearing";
import { HospitalChart } from "../../charts/HospitalChart";
import { UtiChart } from "../../charts/UtiChart";
import OutBarrackDetails  from "../../charts/OutBarrackDetails";
import { DoughutChart } from "../../Demo/components/DoughutChart";
import { PolarAreaChart } from "../../Demo/components/PolarAreaChart";
import TodaysVisitors from "./components/TodaysVisitors";
import { HearingChart } from "../../charts/HearingChart";
//import Diseases from "./components/Diseases";
import { useSelector, useDispatch } from "react-redux";
import { GenderChart } from "../../charts/GenderChart";
import { PrisonerTypeChart } from "../../charts/PrisonerTypeChart";
import { ActWiseChart } from "../../charts/ActWiseChart";
import { BarrackCapacity } from "../../charts/BarrackCapacity";
import  HighProfileChart from "../../charts/HighProfileChart";
import LegalAssistanceChart  from "../../charts/LegalAssistanceChart";
import { UpComingHearingChart } from "../../charts/UpComingHearingChart";
import { PrisonerStatsChart } from "../../charts/PrisonerStatsChart";
import AllTimeBarrackDetails from "./components/AllTimeBarrackDetails";
import { DiseasesBarChart } from "../../charts/DiseasesBarChart";
import { MedicineChart } from "../../charts/MedicineChart";
import MedicineUsed from "./components/MedicineUsed";
import { PrisonWiseStatsChart } from "../../charts/PrisonWiseStatsChart";
import { PrisonStatsChartsNew } from "../../charts/PrisonStatsChartsNew";
import { TotalCoU } from "../../charts/TotalCoU";
import { VisitorTrendChart } from "../../charts/VisitorTrendChart";
import AllTimeGuests from "./components/AllTimeGuests";
import EmployeesCards from "./components/EmployeesCards";
import { EmployeePieChart } from "../../charts/EmployeePieChart";
import { EmployeesGenderChart } from "../../charts/EmployeesGenderChart";
import { EmployeesAttendanceChart } from "../../charts/EmployeesAttendanceChart";
import { EmployeesDepartmentChart } from "../../charts/EmployeesDepartmentChart";
import MedicineCards from "./components/MedicineCards";
import { CountryWiseStatsChart } from "../../charts/CountryWiseStatsChart";
import InventoryCards from "./components/InventoryCards";
import { EmployeeWiseIssuanceChart } from "../../charts/EmployeeWiseIssuanceChart";
import { MostIssuedItemsChart } from "../../charts/MostIssuedItemsChart";
import { OverCrowdedBarracks } from "../../charts/OverCrowdedBarracks";
import UpdatePassowrd from "./UpdatePassowrd";
import { AgeWiseCategoryChart } from "../../charts/AgeWiseCategoryChart";
import { dashApi, DurationType, PrisonerCategory } from './DashboardApis';
import { MedicinePastExpiryChart } from "../../charts/MedicinePastExpiryChart";
import swal from "sweetalert";
import { resetRoleChanged } from '../../../store/roleSlice';
import { PrisonerGenderWiseStatsNew } from "../../charts/PrisonerGenderWiseStatsNew";
import DynamicTable from '../../common/DynamicTable';

const AdminDashboard = (props) => {
  const dispatch = useDispatch();
  const userMeta = useSelector((state) => state.user);
  const { roleChanged } = useSelector((state) => state.role);
  const isAdmin = userMeta?.role === "Super Admin";
  const isUTP = userMeta?.role === "Prison UTP Branch";
  const isCo = userMeta?.role === "Prison Circle Office";
  const isDarban = userMeta?.role === "Darban";
  const isHospital = userMeta?.role === "Prison Hospital";
  const isCourt = userMeta?.role === "Court Production Branch";
  const isMedicine = userMeta?.role === "Prison Medicine Store";
  const isConvict = userMeta?.role === "Prison Convict Branch";
  const isVisitor = userMeta?.role === "Visitor Branch";
  const isHR = userMeta?.role === "HR Branch";
  const isSP = userMeta?.role === "Prison Superintendent";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isDIG = userMeta?.role === "DIG Prisons";
  const isNormalAdmin = userMeta?.role === "Admin";
  const isInventory = userMeta?.role === "Inventory Branch";
  const isDSP = userMeta?.role === "Prison DSP";
  //const history = useHistory();
  const [prisonerStats, setPrisonerStats] = useState("");
  const [hospitalStats, setHospitalStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [hearingStats, setHearingStats] = useState("");
  const [speacialStats, setSpeacialStats] = useState("");
  const [actWiseStats, setActWiseStats] = useState("");
  const [visitorStats, setvisitorStats] = useState("");
  const [countryWise, setCountryWise] = useState("");
  const [prisonerTypes, setPrisonerTypes] = useState("");
  const [medicineStore, setMedicineStore] = useState("");
  const [barrackStats, setBarrackStats] = useState("");
  const [employeeStats, setEmployeeStats] = useState("");
  const [employeesGenderStats, setEmployeesGenderStats] = useState("");
  const [empAttendanceAndLeave, setEmpAttendanceAndLeave] = useState("");
  const [employeesDepartmentStats, setEmployeesDepartmentStats] = useState("");
  const [prisonerAgeCategoryWiseStats, setPrisonerAgeCategoryWiseStats] = useState("");
  const [medicineDashboardStats, setMedicineDashboardStats] = useState("");
  const [mostIssuedItemsStats, setMostIssuedItemsStats] = useState("");
  const [guestStats, setGuestStats] = useState("");
  const [prevalentDisease, setprevalentDisease] = useState("");
  const [employeeInventoryStats, setEmployeeInventoryStats] = useState("");
  const [allIgPrisonWiseStats, setAllIgPrisonWiseStats] = useState("");
  const [inventoryStats, setInventoryStats] = useState("");
  const [tableData, setTableData] = useState(null);
  const [tableTitle, setTableTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tableType, setTableType] = useState('');
  
  useEffect(() => {
    loadApi();
  }, []);
  
  useEffect(() => {
    if (roleChanged) {
      loadApi();
      dispatch(resetRoleChanged());
    }
  }, [roleChanged, dispatch]);
  
  const fetchNewData = async (apiEndpoint) => {
    try {
      if (typeof apiEndpoint === "string") {
        if (!apiEndpoint.includes("pmis-bl")) {
          // ensure we don't double up on slashes
          const prefix = "https://pmis-bl:4502/api";
          // remove leading slash from apiEndpoint if it exists
          apiEndpoint = prefix + (apiEndpoint.startsWith("/") ? apiEndpoint : `/${apiEndpoint}`);
        }
      } else {
        console.error("apiEndpoint is not a string");
      }
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
      const apiPromises = apiConfigurations.map(async config => {
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
      console.log('error in dashboard::: ', error);
    }
  };
  

  const apiConfigurations = [
    {
      condition: isDSP|| isHospital || isAdmin || isUTP || isCo || isConvict || isCourt || isVisitor || isDarban || isSP || isNormalAdmin || isIG || isDIG || isMedicine,
      endpoint: dashApi.prisonerStats,
      setter: setPrisonerStats,
    },
    {
      condition: isDSP|| isAdmin || isCo  || isIG || isDIG || isDarban || isNormalAdmin || isSP,
      endpoint: dashApi.outOfBarrackDetails,
      setter: setOutOfBDetails,
    },
    {
      condition: isMedicine || isAdmin,
      endpoint: dashApi.medicineStore,
      setter: setMedicineStore,
    },
    {
      condition: isHospital || isAdmin || isCo || isMedicine ,
      endpoint: dashApi.hospitalStats,
      setter: setHospitalStats,
    },
    {
      condition: isVisitor || isCo || isAdmin || isDarban ,
      endpoint: dashApi.visitorStats,
      setter: setvisitorStats,
    },
    {
      condition: true, 
      endpoint: dashApi.hearingStats,
      setter: setHearingStats,
    },
    {
      condition: isConvict ||isAdmin ||isUTP ||isDarban ||isMedicine ||isCo ||isIG ||isDIG,
      endpoint: dashApi.speacialStats,
      setter: setSpeacialStats,
    },
    {
      condition: isAdmin || isCo || isUTP || isConvict  || isIG || isDIG, 
      endpoint: dashApi.actWiseStats,
      setter: setActWiseStats,
    },
    {
      condition: isAdmin || isCo || isUTP || isConvict ,
      endpoint: dashApi.countryWise,
      setter: setCountryWise,
    },
    {
      condition: isAdmin || isConvict || isUTP  || isIG || isDIG,
      endpoint: dashApi.prisonerTypes,
      setter: setPrisonerTypes,
    },
    {
      condition: isDSP|| isAdmin || isCo || isSP  || isNormalAdmin || isDarban,
      endpoint: dashApi.barrackCappacity,
      setter: setBarrackStats,
    },
    {
      condition: isAdmin || isHR || isNormalAdmin ,
      endpoint: dashApi.employeeStats,
      setter: setEmployeeStats,
    },
    {
      condition: isAdmin || isHR  || isNormalAdmin || isIG || isDIG,
      endpoint: dashApi.employeesGenderStats,
      setter: setEmployeesGenderStats,
    },
    {
      condition: isAdmin || isHR || isNormalAdmin ,
      endpoint: dashApi.empAttendanceAndLeave,
      setter: setEmpAttendanceAndLeave,
    },
    {
      condition: isAdmin || isHR || isNormalAdmin ,
      endpoint: dashApi.employeesDepartmentStats,
      setter: setEmployeesDepartmentStats,
    },
    {
      condition: isAdmin || isCo || isUTP || isConvict , 
      endpoint: dashApi.prisonerAgeCategoryWiseStats,
      setter: setPrisonerAgeCategoryWiseStats,
    },
    {
      condition: isAdmin || isMedicine  || isHospital,
      endpoint: dashApi.medicineDashboardStats,
      setter: setMedicineDashboardStats,
    },
    {
      condition: isAdmin || isDarban ,
      endpoint: dashApi.guestStats,
      setter: setGuestStats,
    },
    {
      condition: isAdmin || isInventory ,
      endpoint: dashApi.mostIssuedItemsStats,
      setter: setMostIssuedItemsStats,
    },
    {
      condition: isAdmin || isMedicine || isHospital ,
      endpoint: dashApi.prevalentDisease,
      setter: setprevalentDisease,
    },
    {
      condition: isAdmin || isInventory ,
      endpoint: dashApi.employeeInventoryStats,
      setter: setEmployeeInventoryStats,
    },
    {
      condition: isAdmin  || isIG || isDIG,
      endpoint: dashApi.allIgPrisonWiseStats,
      setter: setAllIgPrisonWiseStats,
    },
    {
      condition: isAdmin  || isInventory,
      endpoint: dashApi.inventoryStats,
      setter: setInventoryStats,
    },
  ];
  
  const handleCardClick = async (type, params) => {
    try {
      let endpoint;
      let title;
      let tableType;
      
      // Show loading state
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
      if (response?.success) {
        setTableData(response.result);
        setTableTitle(title);
        setTableType(tableType);
      } else {
        console.error('API response not successful:', response);
        setTableData({ data: { data: [] } }); // Empty data state
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData({ data: { data: [] } }); // Empty data state
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTableData(null);
    setTableTitle('');
  };

  return (
    <>
      <UpdatePassowrd />
      <div className="row">
        <div className="col-lg-9 col-sm-12 col-md-12">
          {((isAdmin ||isUTP ||isCo ||isConvict ||isCourt ||isVisitor ||isDarban ||isSP ||isIG ||isDIG || isDSP) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <BasicStats  handleCardClick={handleCardClick} barrackStats={barrackStats}  prisonerStats={prisonerStats} outOfBDetails={outOfBDetails}  normalAdmin={isNormalAdmin} />
                {((isAdmin || isCo || isSP || isDSP ) && (
                  <AllTimeBarrackDetails
                  handleCardClick={handleCardClick}
                  barrackStats={barrackStats}
                  outOfBDetails={outOfBDetails}
                    ig={
                     isCo || isSP || isAdmin || isNormalAdmin
                    }
                  />
                )) ||
                  null}
              </div>
            </div>
          )) ||
            null}

          {((isMedicine  || isAdmin) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <MedicineCards medicine={medicineDashboardStats} />
              </div>
            </div>
          )) ||
            null}

          {((isInventory  || isAdmin) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <InventoryCards stats={inventoryStats} />
              </div>
            </div>
          )) ||
            null}

          {((isHR  || isAdmin || isNormalAdmin) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <EmployeesCards handleCardClick={handleCardClick} employeeStats={employeeStats} />
              </div>
            </div>
          )) ||
            null}
          {((isAdmin || isDarban ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <AllTimeGuests daily={guestStats} handleCardClick={handleCardClick}/>
              </div>
            </div>
          )) ||
            null}

          {((isHospital || isAdmin || isCo || isMedicine ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <AllTime hospitalStats={hospitalStats} handleCardClick={handleCardClick}/>
              </div>
            </div>
          )) ||
            null}

          {((isHospital || isAdmin || isCo || isMedicine ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <DailyCount hospitalStats={hospitalStats} handleCardClick={handleCardClick}/>
              </div>
            </div>
          )) ||
            null}

          {((isVisitor || isCo || isAdmin ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <TodaysVisitors  visitorStats={visitorStats} />
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isCourt || isCo ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <PrisonerHearing hearingStats={hearingStats} handleCardClick={handleCardClick}/>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isMedicine || isHospital ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <MedicineUsed counts={medicineDashboardStats} />
              </div>
            </div>
          )) ||
            null}

            {/* will make this dynamic later */}
          {/* {((isHospital || isAdmin || isMedicine ) && (
            <div className="db-card-container">
              <div className="db-card-body">
                <Diseases daily={counts} />
              </div>
            </div>
          )) ||
            null} */}

          {((isIG || isDIG || isAdmin) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Prisons Wise Stats Chart{" "}
                    </h4>
                    <PrisonWiseStatsChart stats={allIgPrisonWiseStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isCo || isVisitor ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Visitor Trend Stats
                    </h4>
                    <VisitorTrendChart visitorStats={visitorStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isHR || isNormalAdmin ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Employees Attendance and Leave Stats{" "}
                    </h4>
                    <EmployeesAttendanceChart  empAttendanceAndLeave={empAttendanceAndLeave} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isHR || isNormalAdmin ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Employees By Deparment
                    </h4>
                    <EmployeesDepartmentChart employeesDepartmentStats={employeesDepartmentStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isInventory ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Employees Wise Issuance Chart{" "}
                    </h4>
                    <EmployeeWiseIssuanceChart counter={employeeInventoryStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isInventory ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Most Issued Items Chart{" "}
                    </h4>
                    <MostIssuedItemsChart counter={mostIssuedItemsStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isCo || isDarban  || isSP || isDSP) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Barrack Capacity{" "}
                    </h4>
                    <BarrackCapacity barrackStats={barrackStats} />      
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

            {(( isDarban) && (
            <div className="card card-animate animation-fade-grids" >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">Out of Prison Details </h4>
                    <OutBarrackDetails outOfBDetails={outOfBDetails}  />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isCo || isSP || isDSP ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Over Crowded Barracks
                    </h4>
                    <OverCrowdedBarracks  barrackStats={barrackStats}/>
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isCo || isUTP || isConvict || isIG || isDIG) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Act Wise Crime Analysis{" "}
                    </h4>
                    <PrisonStatsChartsNew actWiseStats={actWiseStats}/>
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {(isIG || isDIG) && (
            <> 
              <div className="card card-animate mt-5 animation-fade-grids">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <h4 className="third-heading db-heading">Total UTP/CONVICT </h4>
                      <UtiChart prisonerStats={prisonerStats} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-animate mt-5 animation-fade-grids">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <h4 className="third-heading db-heading">
                        Gender Wise Employees Stats{" "}
                      </h4>
                      <EmployeesGenderChart employeesGenderStats={employeesGenderStats} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        

          {((isAdmin || isCo || isUTP || isConvict ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Country Wise Stats{" "}
                    </h4>
                    <CountryWiseStatsChart countryWise={countryWise} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
          {((isAdmin || isCo || isUTP || isConvict ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Age Wise Stats{" "}
                    </h4>
                    <AgeWiseCategoryChart prisonerAgeCategoryWiseStats={prisonerAgeCategoryWiseStats} />

                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isCourt || isAdmin ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Next Seven Days Hearings{" "}
                    </h4>
                    <HearingChart hearingStats={hearingStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
              {((isAdmin || isCo || isUTP || isConvict  || isSP  || isCourt || isDarban || isVisitor || isHospital || isMedicine || isNormalAdmin || isDSP) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Prisoner Gender Wise Stats{" "}
                    </h4>
                    <PrisonerGenderWiseStatsNew prisonerStats={prisonerStats}/>
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
              {((isAdmin || isMedicine || isHospital ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Number of Days before expiry by Medicine Stock{" "}
                    </h4>
                    <MedicineChart counter={medicineDashboardStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

              {((isAdmin || isMedicine || isHospital ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Number of Days after expiry by Medicine Stock{" "}
                    </h4>
                    <MedicinePastExpiryChart counter={medicineDashboardStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
          {((isCourt || isAdmin ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      Upcoming Hearings (court Wise) Analysis{" "}
                    </h4>
                    <div className="charts">
                      <UpComingHearingChart  hearing={hearingStats} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
          {((isAdmin || isMedicine || isHospital ) && (
            <div className="card card-animate mt-5 animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">
                      10 Most Prevelant Diseases in the Prison{" "}
                    </h4>
                    <DiseasesBarChart counter={prevalentDisease} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}
        </div>
        <div className="col-lg-3 col-md-12 mt-2">
          {((isCo || isAdmin || isSP || isDSP ||  isIG || isDIG) && (
            <div className="card card-animate animation-fade-grids" >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Out of Prison Details </h4>
                    <OutBarrackDetails outOfBDetails={outOfBDetails}  />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          {((isAdmin || isUTP || isConvict || isDarban || isIG || isDIG) && (
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
          )) ||
            null}

          {((isAdmin || isUTP || isConvict || isDarban || isIG || isDIG) && (
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
          )) ||
            null}

          {((isAdmin ||
            isCo ||
            isCourt ||
            isDarban ||
            isVisitor ) && (
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
          )) ||
            null}

          {((isAdmin || isHR || isNormalAdmin ) && (
            <div className="card card-animate animation-fade-grids">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">
                      Total Employees Inside and Outside Prison{" "}
                    </h4>
                    <EmployeePieChart  employeeStats={employeeStats} />
                  </div>
                </div>
              </div>
            </div>
          )) ||
            null}

          

          {((isAdmin || isHR || isNormalAdmin) && (
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
          )) ||
            null}
          
          {((isHospital || isAdmin || isCo || isMedicine ) && (
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
          )) ||
            null}

          {((isConvict ||isAdmin ||isUTP ||isDarban ||isMedicine ||isCo ||isIG ||isDIG) && (
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
          )) ||
            null}

          {((isAdmin || isConvict || isUTP || isIG || isDIG) && (
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
          )) ||
            null}

          {((isCourt || isAdmin ) && (
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
          )) ||
            null}
          {/* dont delete this commented section */}

          {/* {(isHospital || isAdmin || isIG || isDIG) && (
            <div className="card card-animate">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="chart-heading">Special Treatment </h4>
                    <PolarAreaChart polar={counts} />
                  </div>
                </div>
              </div>
            </div>
          ) || null} */}
          {((isHospital ||
            isAdmin ||
            isSP ||
            isNormalAdmin ||
            isDSP
           ) && (
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
          )) ||
            null}
        </div>
      </div>
      
      {/* Render the table modal when data is available */}
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

export default AdminDashboard;