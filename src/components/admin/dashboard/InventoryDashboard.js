import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import InventoryCards from './components/InventoryCards';
import { EmployeeWiseIssuanceChart } from '../../charts/EmployeeWiseIssuanceChart';
import { MostIssuedItemsChart } from '../../charts/MostIssuedItemsChart';
import { dashApi } from './DashboardApis';

const InventoryDashboard = props => {
  const [mostIssuedItemsStats, setMostIssuedItemsStats] = useState("");
  const [employeeInventoryStats, setEmployeeInventoryStats] = useState("");

  useEffect(() => {
    loadApi();
  }, []);

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

  const apiConfigurations = [
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
  ]

  return (
    <>
      <div className='row'>
        <div className='col-md-9 col-sm-12'>
          <div className='db-card-container'>
            <div className='db-card-body'>
              <InventoryCards  />
            </div></div>

         

            <div className="card card-animate mt-5">
              <div className='card-body'>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">Employees Wise Issuance Chart </h4>
                    <EmployeeWiseIssuanceChart counter={employeeInventoryStats} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-animate mt-5">
              <div className='card-body'>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 overflow-hidden">
                    <h4 className="third-heading db-heading">Most Issued Items Chart </h4>
                    <MostIssuedItemsChart counter={mostIssuedItemsStats} />
                  </div>
                </div>
              </div>
            </div>

        </div>
        <div className='col-lg-3 col-md-12 mt-2'>

        </div>
      </div>


    </>
  );
};

export default InventoryDashboard;
