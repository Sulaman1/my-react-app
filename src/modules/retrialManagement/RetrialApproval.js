import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import EmployeeListing from '../medical/components/Employee/EmployeeListing';
import EmployeeDetails from '../hr/Leave/EmployeeDetails';
import RetrialApprovalPrisonerList from './RetrialApprovalPrisonerList';

const RetrialApproval = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const userMeta = useSelector((state) => state.user);
  const show = useSelector((state) => state.language.urdu)
  const isAdmin =
  userMeta.role === 'Admin' || userMeta.role === 'Super Admin';
  const isDSP = userMeta?.role === 'Prison DSP';
  const isSP = userMeta?.role === 'Prison Superintendent';


  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading just-space">
            Retrial Approval
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
                Pending Retrial Requests
              </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
            {(isSP || isAdmin || isDSP) &&
                <TabPanel>
                    <RetrialApprovalPrisonerList setActiveTab={setActiveTab} getUrl={`/services/app/PrisonerSearch/SearchPrisonersForRetrialPending`} showDate={true} />
                </TabPanel>
              }
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default RetrialApproval;
