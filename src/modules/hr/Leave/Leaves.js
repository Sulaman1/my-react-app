import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import EmployeeListing from '../../medical/components/Employee/EmployeeListing';
import EmployeeDetails from './EmployeeDetails';

const Leaves = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)
  const userMeta = useSelector((state) => state.user);
  const isSP = userMeta?.role === 'Prison Superintendent';
  const restrictedRoles = [
    "DIG Prisons",
    "Inspector General Prisons"
  ];
  
  const isRestricted = restrictedRoles.includes(userMeta?.role);
  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading just-space">
            <span>{props.title || 'Leaves'}</span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab}>
          <TabList className="nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0">
          {isSP &&
              <Tab
                className="nav-item  nav-link"
                onClick={() => {
                  setActiveTab(isSP ? 0 : 1);
                }}
              >
                Leave Requests {show && (<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
              </Tab>
            }
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(isSP ? 1 : 0);
              }}
            >
              List of Employees {show && (<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
            </Tab>
            <Tab className="nav-item  nav-link">Leave Details {show && (<label className='urdu-font'>(ملازم کی تفصیلات)</label>)}</Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
            {isSP &&
                <TabPanel>
                  <EmployeeListing
                    setActiveTab={setActiveTab}
                    getURL={`GetEmployeeWithUnApprovedLeaves?approvalStatus=0`}
                    leaves
                    hideCol
                    approval={props.approval}
                    leaveInProgress
                    hide={isRestricted}
                  />
                </TabPanel>
              }
              <TabPanel>
                <EmployeeListing
                  setActiveTab={setActiveTab}
                  getURL="GetAllEmployee"
                  leaves
                  hideCol
                  approval={props.approval}
                  HideButtonInList={isSP ? true : false}
                  hide={isRestricted}
                />
              </TabPanel>
              <TabPanel>
                <EmployeeDetails approval={props.approval} hide={isRestricted} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Leaves;
