import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PrescribeDetails from './components/Prescribe/PrescribeDetails';

import PrisonerList from './components/ViewListing';

const PrescribeList = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space">
            <span>Prescription List</span>
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
              List of prescribed Prisoners {show && (<label className='urdu-font'>(تجویز کردہ قیدیوں کی فہرست)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
              // onClick={() => {
              //   setActiveTab(1);
              // }}
            >
              prescription Details {show && (<label className='urdu-font'>(نسخے کی تفصیلات)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <PrisonerList
                  getURL="SearchPrisonersWithMedicine"
                  btnTitle="Dispense Medicine"
                  navItem={2}
                  setActiveTab={setActiveTab}
                  prescribe
                />
              </TabPanel>
              <TabPanel>
                <PrescribeDetails setActiveTab={setActiveTab} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default PrescribeList;
