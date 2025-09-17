import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RetrialApprovalPrisonerList from '../../../../modules/retrialManagement/RetrialApprovalPrisonerList';

const ManageVisitApprovals = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const userMeta = useSelector((state) => state.user);
  const isAdmin = userMeta.role === 'Admin' || userMeta.role === 'Super Admin';
  const isSP = userMeta?.role === 'Prison Superintendent';
  const isDSP = userMeta?.role === 'Prison DSP';

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading just-space">
            Visit Approvals
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
                Pending Visit Approvals 
              </Tab>
              <Tab
                className="nav-item  nav-link"
                onClick={() => {
                  setActiveTab(1);
                }}
              >
                Approved Visits
              </Tab>
              <Tab
                className="nav-item  nav-link"
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                Declined Visit Approvals 
              </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
            {(isSP || isAdmin || isDSP) &&
            <>
                <TabPanel>
                    <RetrialApprovalPrisonerList setActiveTab={setActiveTab} isVisit={true} getUrl={`/services/app/PrisonerSearch/SearchVisitDspPending`} />
                </TabPanel>
                <TabPanel>
                    <RetrialApprovalPrisonerList setActiveTab={setActiveTab} isVisit={true} isApproved={true} getUrl={`/services/app/PrisonerSearch/SearchVisitDspPending`} noAction={true} />
                </TabPanel>
                <TabPanel>
                    <RetrialApprovalPrisonerList setActiveTab={setActiveTab} isVisit={true} isDenied={true} getUrl={`/services/app/PrisonerSearch/SearchVisitDspPending`} noAction={true} />
                </TabPanel>
            
            </>}
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManageVisitApprovals;
