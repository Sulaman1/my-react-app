import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AddAdmission from './AddAdmission';
import ViewAdmissions from './components/ViewAdmissions';

const Admission = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space ">
            <span>New Treatment</span>
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
              List of Prisoner {show && (<label className='urdu-font'>(قیدیوں کی فہرست)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"

            >
              New Treatment {show && (<label className='urdu-font'>(نیا علاج)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewAdmissions
                  setActiveTab={setActiveTab}
                  redirectTab={1}
                  type="hospital"
                  getURL="SearchHospitalAdmissionAvailable"
                  btnTitle="Add"
                  navItem={1}
                />
              </TabPanel>
              <TabPanel>
                <AddAdmission setActiveTab={setActiveTab} redirectTab={0} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Admission;
