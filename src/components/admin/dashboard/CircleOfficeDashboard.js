import React, { useEffect, useState } from 'react';
import { getData } from '../../../services/request';
import AllTime from './components/AllTime';
import BasicStats from './components/BasicStats';
import DailyCount from './components/DailyCount';
import PrisonerHearing from './components/PrisonerHearing';
import { HospitalChart } from '../../charts/HospitalChart';
import { UtiChart } from '../../charts/UtiChart';
import OutBarrackDetails  from '../../charts/OutBarrackDetails';
import { useSelector } from 'react-redux';
import { GenderChart } from '../../charts/GenderChart';
import { PrisonerTypeChart } from '../../charts/PrisonerTypeChart';
import { BarrackCapacity } from '../../charts/BarrackCapacity';
import  HighProfileChart  from '../../charts/HighProfileChart';
import LegalAssistanceChart  from '../../charts/LegalAssistanceChart';
import AllTimeBarrackDetails from './components/AllTimeBarrackDetails';
import { PrisonStatsChartsNew } from '../../charts/PrisonStatsChartsNew';
import { VisitorTrendChart } from '../../charts/VisitorTrendChart';
import { CountryWiseStatsChart } from '../../charts/CountryWiseStatsChart';
import { OverCrowdedBarracks } from '../../charts/OverCrowdedBarracks';
import TodaysVisitors from './components/TodaysVisitors';
import { dashApi } from './DashboardApis';
import DynamicTable from '../../common/DynamicTable';

const CircleOfficeDashboard = props => {
  const userMeta = useSelector((state) => state.user);
  const isAdmin = userMeta?.role === 'Super Admin';
  const isCo = userMeta?.role === 'Prison Circle Office';
  const isSP = userMeta?.role === 'Prison Superintendent';
  const isIG = userMeta?.role === 'Inspector General Prisons';
  const isDIG = userMeta?.role === 'DIG Prisons';
  const isNormalAdmin = userMeta?.role === 'Admin';

  const [barrackStats, setBarrackStats] = useState("");
  const [outOfBDetails, setOutOfBDetails] = useState("");
  const [actWiseStats, setActWiseStats] = useState("");
  const [prisonerTypes, setPrisonerTypes] = useState("");
  const [countryWise, setCountryWise] = useState("");
  const [speacialStats, setSpeacialStats] = useState("");
  const [prisonerStats, setPrisonerStats] = useState("");
  const [hospitalStats, setHospitalStats] = useState("");
  const [visitorStats, setvisitorStats] = useState("");
  const [hearingStats, setHearingStats] = useState("");

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
      endpoint: dashApi.visitorStats,
      setter: setvisitorStats,
    },
    {
      condition: true, 
      endpoint: dashApi.hearingStats,
      setter: setHearingStats,
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
    {
      condition: true,
      endpoint: dashApi.hospitalStats,
      setter: setHospitalStats,
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

        case 'hospital':
          endpoint = dashApi.hospitalDetailedStats(params.type, params.duration);
          title = params.type === 1 ? 'OPD Patients' : 
                  params.type === 2 ? 'IPD Patients' : 
                  params.type === 3 ? 'Outside Hospital Patients' : 
                  'Hospital Details';
          setTableType('prisoner');
          break;

        case 'visitors':
          endpoint = dashApi.visitorDetailedStats(params.duration);
          title = 'Visitor Details';
          setTableType('visitor');
          break;

        case 'hearing':
          endpoint = dashApi.hearingDetailedStats(params.duration);
          title = params.duration === 1 ? 'Yesterday\'s Hearings' :
                  params.duration === 2 ? 'Today\'s Hearings' :
                  params.duration === 3 ? 'Tomorrow\'s Hearings' :
                  'Hearing Details';
          setTableType('prisoner');
          break;

          case 'barrack':
            endpoint = dashApi.barrackDetailedStats(params.allocated);
            title = params.allocated === 1 ? 'Allocated Prisoners' : 
                    params.allocated === 2 ? 'Unallocated Prisoners' : 
                    'Total Prisoners in Prison';

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
        <div className='col-lg-9 col-sm-12 col-md-12'>
          <div className='db-card-container'>
            <div className='db-card-body'>
              <BasicStats 
                barrackStats={barrackStats}  
                prisonerStats={prisonerStats} 
                outOfBDetails={outOfBDetails} 
                normalAdmin={isNormalAdmin}
                handleCardClick={handleCardClick}
              />
              <AllTimeBarrackDetails  
                barrackStats={barrackStats}
                outOfBDetails={outOfBDetails} 
                ig={isIG || isDIG || isCo || isSP || isAdmin || isNormalAdmin}
                handleCardClick={handleCardClick}
              />
            </div>
          </div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <TodaysVisitors 
                visitorStats={visitorStats}
                handleCardClick={handleCardClick}
              />
            </div>
          </div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <AllTime 
                hospitalStats={hospitalStats}
                handleCardClick={handleCardClick}
              />
            </div></div>

          <div className='db-card-container'>
            <div className='db-card-body'>
              <DailyCount hospitalStats={hospitalStats} 
                handleCardClick={handleCardClick}
              />
            </div></div>


          <div className='db-card-container'>
            <div className='db-card-body'>
              <PrisonerHearing 
                hearingStats={hearingStats}
                handleCardClick={handleCardClick}
              />
            </div></div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Visitor Trend Stats  </h4>
                  <VisitorTrendChart visitorStats={visitorStats} />

                </div>
              </div>
            </div>
          </div>


          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Barrack Capacity </h4>
                  <BarrackCapacity barrackStats={barrackStats} />

                </div>
              </div>
            </div>
          </div>

          <div className="card card-animate mt-5">
            <div className='card-body'>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <h4 className="third-heading db-heading">Over Crowded </h4>
                  <OverCrowdedBarracks barrackStats={barrackStats} />

                </div>
              </div>
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
                  <CountryWiseStatsChart countryWise={countryWise} />

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
                  <h4 className="chart-heading">Out of Barracks Details </h4>
                  <OutBarrackDetails outOfBDetails={outOfBDetails} />
                </div>
              </div>
            </div>
          </div>

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

export default CircleOfficeDashboard;
