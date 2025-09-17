import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewBasicPrisoner from '../../components/prisoners/Components/release-prisoner/ViewBasicPrisoner';
import ViewAppealManagement from './ViewAppealManagement';
import ViewAppealCases from './ViewAppealCases';

const ManageAppealManagement = props => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)
  const userMeta = useSelector((state) => state.user);
  const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";
	const isSp = userMeta?.role === "Prison Superintendent";

  return (
    <>
      <div className='row'>
        <div class='row flex'>
          <h4 class='third-heading  just-space '>
            <span>Appeal Prisoner</span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab}>
          <TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
            {!isDig && !isIG && !isSp &&
              <>
                <Tab
                  className='nav-item  nav-link'
                  onClick={() => {
                    setActiveTab(0);
                  }}
                >
                  Prisoners Available For Appeal {show && (<label>(اپیل قیدی)</label>)}
                </Tab>
                <Tab
                  className='nav-item  nav-link'
                // onClick={() => {
                // 	setActiveTab(1);
                // }}
                >
                  Appeal  {show && (<label>(اپیل کی تفصیلات)</label>)}
                </Tab>
              </>
            }
            <Tab
              className='nav-item  nav-link'
              onClick={() => {
                {!isDig && !isIG && !isSp &&
                  setActiveTab(2);
                }
              }}
            >
              Prisoners with Appeal {show && (<label>(اپیل کے ساتھ قیدی۔)</label>)}
            </Tab>
          </TabList>
          <div className='card'>
            <div className='card-body'>
              {!isDig && !isIG && !isSp &&
                <>
                  <TabPanel>
                    <ViewBasicPrisoner
                      setActiveTab={setActiveTab}
                      getURL='SearchPrisonerForAppeal'
                      btnText='List Cases'
                      type='AppealFirstTab'
                      activeTab={1}
                    />
                  </TabPanel>

                  <TabPanel>
                    <ViewAppealManagement setActiveTab={setActiveTab} />
                  </TabPanel>
                </>
              }
              <TabPanel>
                <ViewAppealCases
                setActiveTab={setActiveTab}
                  getURL='SearchPrisonersWithAppeals'
                  type='Appeal'
                  appealView
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManageAppealManagement;
