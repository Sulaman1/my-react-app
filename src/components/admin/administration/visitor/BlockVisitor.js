import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewVisitorListing from './ViewVisitorListing';

const BlockVisitor = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu);
  const userMeta = useSelector((state) => {
    return state.user;
  });
  
  const restrictedRoles = [
    "Prison Superintendent",
    "DIG Prisons",
    "Inspector General Prisons",
    "Prison DSP"
  ];
  
  const isRestricted = restrictedRoles.includes(userMeta?.role);
  useEffect(() => {
    if (isRestricted) {
      setActiveTab(0);
    }
  }, [isRestricted]);

  return (
    <>
      <div className="row">
        <div className="row flex">
          <h4 className="third-heading just-space">
            <span>Manage Visitors</span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab} onSelect={index => setActiveTab(index)}>
          <TabList className="nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0">
            {!isRestricted && (
              <Tab
                className="nav-item nav-link"
                onClick={() => setActiveTab(0)}
              >
                List of Prisoners {show && (<label className='urdu-font'>(وزیٹر کو غیر مسدود کریں۔)</label>)}
              </Tab>
            )}
            <Tab
              className="nav-item nav-link"
              onClick={() => setActiveTab(isRestricted ? 0 : 1)}
            >
              Prisoners With Blocked Visitors {show && (<label className='urdu-font'>(بلاک وزیٹر)</label>)}
            </Tab>
          </TabList>
          
          <div className="card">
            <div className="card-body">
              {!isRestricted && (
                <TabPanel>
                  <ViewVisitorListing
                    setActiveTab={setActiveTab}
                    getURL="SearchUnblockedVisitors"
                    btnTitle="Block Visitor"
                    apiEndpoint="BlockVisitors"
                    swalText="You want to block visitor"
                    successMsg="Visitor Blocked."
                    blockVisitor
                  />
                </TabPanel>
              )}
              <TabPanel>
                <ViewVisitorListing
                  setActiveTab={setActiveTab}
                  getURL="SearchBlockedVisitors"
                  btnTitle="Unblock Visitor"
                  apiEndpoint="UnBlockVisitors"
                  swalText="You want to unblock visitor"
                  successMsg="Visitor Unblocked."
                  blockVisitor
                  unBlockVisitor
                  hide={isRestricted}
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default BlockVisitor;
