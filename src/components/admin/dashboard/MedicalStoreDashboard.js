import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import AllTime from './components/AllTime';
import DailyCount from './components/DailyCount';
import { HospitalChart } from '../../charts/HospitalChart';
import { UtiChart } from '../../charts/UtiChart';
import { GenderChart } from '../../charts/GenderChart';
import { MedicineChart } from '../../charts/MedicineChart';
import { DiseasesBarChart } from '../../charts/DiseasesBarChart';
//import Diseases from './components/Diseases';
import MedicineUsed from './components/MedicineUsed';
import MedicineCards from './components/MedicineCards';
import { dashApi } from './DashboardApis';

const MedicalStoreDashboard = props => {  
 
  const [speacialStats, setSpeacialStats] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");
  const [hospitalStats, setHospitalStats] = useState("");
  const [medicineDashboardStats, setMedicineDashboardStats] = useState("");
  const [prevalentDisease, setprevalentDisease] = useState("");


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
  
    { condition: true, 
      endpoint: dashApi.speacialStats,
      setter: setSpeacialStats,
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


  return (
    <>
      <div className='row'>
        <div className='col-md-9 col-sm-12'>
          <div className='db-card-container'>
            <div className='db-card-body'>
              <MedicineCards medicine={medicineDashboardStats} />
            </div>
          </div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <AllTime hospitalStats={hospitalStats} />
            </div>
          </div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <DailyCount hospitalStats={hospitalStats} />
            </div>
          </div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <MedicineUsed counts={medicineDashboardStats} />
            </div>
          </div>

          {/* <div className='db-card-container'>
            <div className='db-card-body'>
              <Diseases daily={medicineDashboardStats} />
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

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Total UTP/CONVICT </h4>
                  <UtiChart prisonerStats={prisonerStats} />
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
          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Gender Wise Prisoner Stats </h4>
                  <GenderChart speacialStats={speacialStats} />
                </div>
              </div>
            </div>
          </div>




        </div>
      </div>


    </>
  );
};

export default MedicalStoreDashboard;
