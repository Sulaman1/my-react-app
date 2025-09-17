import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import EmployeeListing from './components/Employee/EmployeeListing';
import PrescribeInformation from './components/Employee/PriscribeInformation';
import PrescribeDetails from './components/Prescribe/PrescribeDetails';

const EmployeePriscriptions = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space">
            <span>Employee Priscriptions</span>
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
              List of Employees {show &&(<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
              // onClick={() => {
              //   setActiveTab(1);
              // }}
            >
              Prescribe Details {show && (<label className='urdu-font'>(نسخہ کی تفصیلات)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <EmployeeListing
                  setActiveTab={setActiveTab}
                  btnTitle="Dispense Medicine"
                  getURL="GetAllEmployee"
                />
              </TabPanel>
              <TabPanel>
                <PrescribeInformation setActiveTab={setActiveTab} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default EmployeePriscriptions;
