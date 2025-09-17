import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import AllTime from './components/AllTime';
import DailyCount from './components/DailyCount';
import { HospitalChart } from '../../charts/HospitalChart';
import MedicineUsed from './components/MedicineUsed';
import { DiseasesBarChart } from '../../charts/DiseasesBarChart';
import { MedicineChart } from '../../charts/MedicineChart';
import { TotalCoU } from '../../charts/TotalCoU';
import { dashApi } from './DashboardApis';
import DynamicTable from '../../common/DynamicTable';

const HospitalDashboard = props => {

  
  const [prisonerStats, setPrisonerStats] = useState("");
  const [hospitalStats, setHospitalStats] = useState("");
  const [medicineDashboardStats, setMedicineDashboardStats] = useState("");
  const [prevalentDisease, setprevalentDisease] = useState("");

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
      condition: true, 
      endpoint: dashApi.prisonerStats,
      setter: setPrisonerStats,
    },
    {
      condition: true,
      endpoint: dashApi.hospitalStats,
      setter: setHospitalStats,
    },
    {
      condition: true, 
      endpoint: dashApi.medicineDashboardStats,
      setter: setMedicineDashboardStats,
    },
    {
      condition: true,
      endpoint: dashApi.prevalentDisease,
      setter: setprevalentDisease,
    },
  ];

  const handleCardClick = async (type, params) => {
    try {
      let endpoint;
      let title;
      
      setTableData(null);
      setTableTitle('Loading...');
      setShowModal(true);

      switch(type) {
        case 'hospital':
          endpoint = dashApi.hospitalDetailedStats(params.type, params.duration);
          title = params.type === 1 ? 'OPD Patients' : 
                  params.type === 2 ? 'IPD Patients' : 
                  params.type === 3 ? 'Outside Hospital Patients' : 
                  'Hospital Details';
          setTableType('prisoner');
          break;

        case 'medicine':
          endpoint = dashApi.medicineDetailedStats(params.type);
          title = 'Medicine Details';
          setTableType('medicine');
          break;

        case 'disease':
          endpoint = dashApi.diseaseDetailedStats(params.type);
          title = 'Disease Details';
          setTableType('disease');
          break;

        default:
          console.log('Unknown card type:', type);
          return;
      }

      const response = await getData(endpoint);
      if (response?.success) {
        setTableData(response.result);
        setTableTitle(title);
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
      <div className='row'>
        <div className='col-md-9 col-sm-12'>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <AllTime 
                hospitalStats={hospitalStats}
                handleCardClick={handleCardClick}
              />
            </div></div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <DailyCount 
                hospitalStats={hospitalStats}
                handleCardClick={handleCardClick}
              />
            </div></div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <MedicineUsed 
                medicine={medicineDashboardStats}
                handleCardClick={handleCardClick}
              />
            </div></div>

          {/* <div className='db-card-container'>
            <div className='db-card-body'>
              <Diseases daily={hospitalStats} />
            </div></div> */}


          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">10 Most Prevelant Diseases in the Prison </h4>
                  <DiseasesBarChart counter={prevalentDisease} />
                </div>
              </div>
            </div>
          </div>
          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Number of Days before expiry by Medicine Stock </h4>
                  <MedicineChart counter={medicineDashboardStats} />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='col-lg-3 col-md-12 mt-2'>
          {/* <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Special Treatment </h4>
                  <PolarAreaChart polar={counts} />
                </div>
              </div>
            </div>
          </div> */}

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Total UTP And Convicted </h4>
                  <TotalCoU prisonerStats={prisonerStats} />
                </div>
              </div>
            </div>
          </div>



          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Prison Hospital Stats </h4>
                  <HospitalChart hospitalStats={hospitalStats} />
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

export default HospitalDashboard;
