import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import BasicStats from './components/BasicStats';
import { UtiChart } from '../../charts/UtiChart';
import { GenderChart } from '../../charts/GenderChart';
import { PrisonerTypeChart } from '../../charts/PrisonerTypeChart';
import HighProfileChart  from '../../charts/HighProfileChart';
import  LegalAssistanceChart from '../../charts/LegalAssistanceChart';
import { PrisonStatsChartsNew } from '../../charts/PrisonStatsChartsNew';
import { CountryWiseStatsChart } from '../../charts/CountryWiseStatsChart';
import { dashApi } from './DashboardApis';

const UnderTrialDashboard = props => {
  const [barrackStats, setBarrackStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [actWiseStats, setActWiseStats] = useState("");
  const [prisonerTypes, setPrisonerTypes] = useState("");
  const [countryWise, setCountryWise] = useState("");
  const [speacialStats, setSpeacialStats] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");


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
      endpoint: dashApi.outOfBarrackDetails,
      setter: setOutOfBDetails,
    },
    { condition: true, 
      endpoint: dashApi.speacialStats,
      setter: setSpeacialStats,
    },
    { condition: true, 
      endpoint: dashApi.actWiseStats,
      setter: setActWiseStats,
    },
    { condition: true, 
      endpoint: dashApi.countryWise,
      setter: setCountryWise,
    },
    { condition: true, 
      endpoint: dashApi.prisonerTypes,
      setter: setPrisonerTypes,
    },
    { condition: true, 
      endpoint: dashApi.barrackCappacity,
      setter: setBarrackStats,
    },
  ];


  return (
    <>
      <div className='row'>
        <div className='col-md-9 col-sm-12'>
          <div className='db-card-container'>
            <div className='db-card-body'>
              <BasicStats  barrackStats={barrackStats}  prisonerStats={prisonerStats} outOfBDetails={outOfBDetails} />
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Act Wise Crime Analysis </h4>
                  <PrisonStatsChartsNew actWiseStats={actWiseStats} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Country Wise Stats </h4>
                  <CountryWiseStatsChart  countryWise={countryWise} />
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
                  <h4 className="chart-heading">High Profile Prisoner Stats </h4>
                  <HighProfileChart speacialStats={speacialStats} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Legal Assistance Prisoner Stats </h4>
                  <LegalAssistanceChart speacialStats={speacialStats} />
                </div>
              </div>
            </div>
          </div>

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
                  <h4 className="chart-heading">Gender Wise Prisoner Stats </h4>
                  <GenderChart speacialStats={speacialStats} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Type Wise Prisoner Stats </h4>
                  <PrisonerTypeChart prisonerTypes={prisonerTypes} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

    </>
  );
};

export default UnderTrialDashboard;
