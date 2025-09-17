import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AddEmployee from "./adduser/AddEmployee";
import ViewEmployee from "./ViewEmployee";

const ManageEmployee = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu);
  const userMeta = useSelector((state) => state.user);
  const isHr = userMeta?.role === "HR Branch";
  const isSp = userMeta?.role === "Prison Superintendent";

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
              Employees List {show && <label>(ملازمین کی فہرست)</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                isSp ? setActiveTab(0) : setActiveTab(1);
              }}
            >
              {isSp ? "Details" : "Add Employee"}{" "}
              {show && <label>(ملازم شامل کریں)</label>}
            </Tab>

            {isHr && (
              <Tab
                className="nav-item  nav-link"
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                Employees Pending Approval {show && <label>(ملازم )</label>}
              </Tab>
            )}
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewEmployee tab={1} setActiveTab={setActiveTab} />
              </TabPanel>
              <TabPanel>
                <AddEmployee setActiveTab={setActiveTab} />
              </TabPanel>
              {isHr && (
                <TabPanel>
                  <ViewEmployee
                    tab={3}
                    inActiveUrl={
                      "/services/app/EmployeeAppServices/GetAllInactiveNewUsers"
                    }
                    setActiveTab={setActiveTab}
                  />
                </TabPanel>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManageEmployee;
