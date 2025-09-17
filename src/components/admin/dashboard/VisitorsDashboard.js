import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import BasicStats from './components/BasicStats';
import { UtiChart } from '../../charts/UtiChart';
import TodaysVisitors from './components/TodaysVisitors';
import { VisitorTrendChart } from '../../charts/VisitorTrendChart';
import { dashApi } from './DashboardApis';

const VisitorsDashboard = props => {

  const [barrackStats, setBarrackStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");
  const [visitorStats, setvisitorStats] = useState("");


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
      endpoint: dashApi.visitorStats,
      setter: setvisitorStats,
    },
    { condition: true, 
      endpoint: dashApi.outOfBarrackDetails,
      setter: setOutOfBDetails,
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
              <BasicStats barrackStats={barrackStats}  prisonerStats={prisonerStats} outOfBDetails={outOfBDetails} />
            </div>
            <div className='db-card-container'>
              <div className='db-card-body'>
                <TodaysVisitors visitorStats={visitorStats} />
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Visitor Trend Stats </h4>
                  <VisitorTrendChart visitorStats={visitorStats} />
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
                  <UtiChart  prisonerStats={prisonerStats} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  );
};

export default VisitorsDashboard;
