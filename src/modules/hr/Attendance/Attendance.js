import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import EmployeeListing from '../../medical/components/Employee/EmployeeListing';

const Attendance = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space">
            <span>Attendance</span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab}>
          <TabList className="nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0">
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(0);
              }}
            >
              Absent {show &&(<label className='urdu-font'>(غیر حاضر)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Present {show && (<label className='urdu-font'>(موجود)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <EmployeeListing
                  getURL="EmployeesOutsidePrison"
                  btnTitle="Employee Entry"
                  hr
                  apiEndpoint="EmployeeEntry"
                  successMsg="Entry marked successfully."
                  hideCol
                />
              </TabPanel>
              <TabPanel>
                <EmployeeListing
                  getURL="EmployeesInsidePrison"
                  btnTitle="Employee Exit"
                  hr
                  apiEndpoint="EmployeeExit"
                  successMsg="Exit marked successfully."
                  hideCol
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Attendance;
