import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import BasicStats from './components/BasicStats';
import { UtiChart } from '../../charts/UtiChart';
import PrisonerHearing from './components/PrisonerHearing';
import { HearingChart } from '../../charts/HearingChart';
import { UpComingHearingChart } from '../../charts/UpComingHearingChart';
import { DoughutChart } from '../../Demo/components/DoughutChart';
import { dashApi } from './DashboardApis';
import DynamicTable from '../../common/DynamicTable';

const CourtProductionDashboard = props => {
  const [barrackStats, setBarrackStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");
  const [hearingStats, setHearingStats] = useState("");

  // Add new states for the dynamic table
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [tableTitle, setTableTitle] = useState("");
  const [tableType, setTableType] = useState("");

  useEffect(() => {
    loadApi();
  }, []);

  const handleCardClick = async (type, params) => {
    try {
      let endpoint;
      let title;
      
      setTableData(null);
      setTableTitle('Loading...');
      setShowModal(true);

      switch(type) {
        case 'prisoners':
          endpoint = dashApi.prisonerDetailedStats(params.category, params.admissionStatus);
          title = params.category === 1 ? 'Under Trial Prisoners' : 
                  params.category === 2 ? 'Convicted Prisoners' : 
                  'Total Prisoners';
          setTableType('prisoner');
          break;

        case 'hearing':
          endpoint = dashApi.hearingDetailedStats(params.duration);
          title = params.duration === 1 ? 'Yesterday\'s Hearings' :
                  params.duration === 2 ? 'Today\'s Hearings' :
                  params.duration === 3 ? 'Tomorrow\'s Hearings' :
                  'Hearing Details';
          setTableType('prisoner');
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
    {
      condition: true,
      endpoint: dashApi.hearingStats,
      setter: setHearingStats,
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
              <BasicStats 
                barrackStats={barrackStats}  
                prisonerStats={prisonerStats} 
                outOfBDetails={outOfBDetails}
                handleCardClick ={handleCardClick}
              />
            </div>
            <div className='db-card-container'>
              <div className='db-card-body'>
                <PrisonerHearing 
                  hearingStats={hearingStats}
                  handleCardClick ={handleCardClick}
                />
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Next Seven Days Hearings </h4>
                  <HearingChart hearingStats={hearingStats} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Upcoming Hearings (court Wise) Analysis </h4>
                  <div className='charts'>
                    <UpComingHearingChart hearing={hearingStats} />
                  </div>
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
                  <UtiChart prisonerStats={prisonerStats}  />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="chart-heading">Hearings </h4>
                  <DoughutChart total={hearingStats} />
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

export default CourtProductionDashboard;
