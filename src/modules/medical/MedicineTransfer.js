import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

//import PrisonDetail from './components/Transfer/PrisonDetail';
//import PrisonList from './components/Transfer/PrisonList';
import TransferMedicine from './components/Transfer/TransferMedicine';
import IncomingTransferMedicine from './components/Transfer/IncomingTransferMedicine';

const MedicineTransfer = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space">
            <span>Medicine Transfer</span>
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
              Transfer Medicine {show &&(<label className='urdu-font'>(دوا کی منتقلی)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Incoming Transfer Medicine {show && (<label className='urdu-font'>(آنے والی منتقلی کی دوا)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <TransferMedicine title="Transer Medicine" />
              </TabPanel>
              <TabPanel>
                <IncomingTransferMedicine title="Incoming Transfer Medicine" />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default MedicineTransfer;
