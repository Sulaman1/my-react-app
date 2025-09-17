import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ViewApproveEmployee from "./ViewApproveEmployee";

const ManageApproveEmployee = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu);

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space ">
            <span>
              Manage Employee {show && <label>(ملازم کا انتظام کریں)</label>}
            </span>
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
              Employees pending approval{" "}
              {show && <label>(ملازمین کی فہرست)</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Activated employees {show && <label>(ملازمین کی فہرست)</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(2);
              }}
            >
              Deactivated employees {show && <label>(ملازمین کی فہرست)</label>}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewApproveEmployee
                  setActiveTab={setActiveTab}
                  tab={1}
                  activeUrl={
                    "/services/app/EmployeeAppServices/GetAllInactiveNewUsers"
                  }
                />
              </TabPanel>
              <TabPanel>
                <ViewApproveEmployee
                  setActiveTab={setActiveTab}
                  tab={2}
                  inactiveNewUrl={
                    "/services/app/EmployeeAppServices/GetAllActiveUsers"
                  }
                />
              </TabPanel>
              <TabPanel>
                <ViewApproveEmployee
                  setActiveTab={setActiveTab}
                  tab={3}
                  inactiveOldUrl={
                    "/services/app/EmployeeAppServices/GetAllInactiveOldUsers"
                  }
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManageApproveEmployee;
