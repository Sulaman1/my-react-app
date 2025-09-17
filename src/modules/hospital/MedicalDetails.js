import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewAdmissions from './components/ViewAdmissions';
import AddMedical from './AddMedical'
import { useSelector } from 'react-redux';
const MedicalDetails = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space ">
            <span>Add/View Medical Details</span>
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
              Pending Medical Details {show && (<label>(زیر التواء طبی تفصیلات)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Prisoners With Medical Details {show && (<label>(طبی تفصیلات کے ساتھ قیدی۔)</label>)}
            </Tab>

            <Tab
              className="nav-item  nav-link"
            >
              Medical Information {show && (<label>(طبی معلومات)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewAdmissions
                  setActiveTab={setActiveTab}
                  redirectTab={2}
                  type="hospital"
                  getURL="SearchPrisonerWithoutMedicalInfo"
                  btnTitle="Add"
                  navItem={1}
                />
              </TabPanel>
              <TabPanel>
                <ViewAdmissions
                  setActiveTab={setActiveTab}
                  redirectTab={2}
                  type="hospital"
                  getURL="SearchPrisonerWithMedicalInfo"
                  btnTitle="Edit"
                  navItem={1}
                />
              </TabPanel>
              <TabPanel>
                <AddMedical setActiveTab={setActiveTab} redirectTab={0} />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default MedicalDetails;
