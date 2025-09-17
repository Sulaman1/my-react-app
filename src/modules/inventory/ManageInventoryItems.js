import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PrescribeInformation from '../medical/components/Employee/PriscribeInformation';
import InventoryDetails from './components/allocate-items/InventoryDetails';
import ViewInventoryItems from './components/allocate-items/ViewInventoryItems';

const ManageInventoryItems = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)
  const [inventory] = useState([true])

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space">
            <span>Allocate Items</span>
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
              List of Employees {show && (<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
            >
              Items Details {show && (<label className='urdu-font'>(نسخہ کی تفصیلات)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewInventoryItems
                  setActiveTab={setActiveTab}
                  btnTitle="Dispense Item"
                  getURL="GetAllEmployee"
                  inventory={inventory}
                />
              </TabPanel>
              <TabPanel>
                <InventoryDetails setActiveTab={setActiveTab} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManageInventoryItems;
