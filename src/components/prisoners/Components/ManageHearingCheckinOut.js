// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
//import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { transformData } from '../../../common/Helpers';
import { getData } from '../../../services/request';
import { lookupName } from '../../admin/system-settings/lookupNames';
import ViewCheckInOut from './circleoffice/checkinout/ViewCheckInOut';
//import { handleUrlRedirect } from '../../../common/Common';
import ViewHearingCheckInOut from './circleoffice/checkinout/ViewHearingCheckInOut';

const ManageHearingCheckinOut = () => {
  const [activetab, setActiveTab] = useState(0);
  const [checkReasons, setCheckReasons] = useState([]);
  const userMeta = useSelector(state => state.user);
  const isAdmin = userMeta.role === 'Admin' || userMeta.role === 'Super Admin';
  const show = useSelector((state) => state.language.urdu)


  // useEffect(() => {
  //   getData(lookupName.checkReason, '', true).then(res => {
  //     const reasons = transformData(res.result.data);
  //     setCheckReasons(reasons);
  //     // simple handle of tab when click from notification
  //     const tabIndex = handleUrlRedirect();
  //     setActiveTab(tabIndex);
  //   });
  // }, []);



  return (
    <>
      <div className='row'>
        <div className='row flex'>
          <h4 className='third-heading  just-space '>
            <span>Hearing Checkin/Checkout</span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab}>
          <TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>

            {(isAdmin ||
              userMeta.role === 'Prison Circle Office') && (
                <Tab
                  className='nav-item  nav-link'
                  onClick={() => {
                    setActiveTab(0);
                  }}
                >
                  Check Out By Circle Office {show && (<label className='urdu-font'>(سرکل آفس سے چیک آؤٹ کریں۔)</label>)}
                </Tab>
              )}
            {(isAdmin ||
              userMeta.role === 'Prison Circle Office') && (
                <Tab
                  className='nav-item  nav-link'
                  onClick={() => {
                    setActiveTab(isAdmin? 6 : 1);
                  }}
                >
                  Checked Out By Circle Office {show && (<label className='urdu-font'>(سرکل آفس سے چیک آؤٹ کریں۔)</label>)}
                </Tab>
              )}

            {(isAdmin || userMeta.role === 'Darban') && (
              <Tab
                className='nav-item  nav-link'
                onClick={() => {
                  setActiveTab(isAdmin ? 1 : 0);
                }}
              >
                Check Out By Darban {show && (<label className='urdu-font'>(دربان سے چیک آوٹ کریں)</label>)}
              </Tab>
            )}

            {(isAdmin || userMeta.role === 'Darban') && (
              <Tab
                className='nav-item  nav-link'
                onClick={() => {
                  setActiveTab(isAdmin ? 2 : 1);
                }}
              >
                Checked Out By Darban {show && (<label className='urdu-font'>(دربان سے چیک آوٹ کریں)</label>)}
              </Tab>
            )}

            {(isAdmin || userMeta.role === 'Darban') && (
              <Tab
                className='nav-item nav-link'
                onClick={() => {
                  setActiveTab(isAdmin ? 3 : 2);
                }}
              >
                 check-in {show && (<label className='urdu-font'>(دربان سے چیک ان کریں)</label>)}
              </Tab>
            )}

            {(isAdmin || userMeta.role === 'Darban') && (
              <Tab
                className='nav-item nav-link'
                onClick={() => {
                  setActiveTab(isAdmin ? 4 : 3);
                }}
              >
                Checked In By Darban {show && (<label className='urdu-font'>(دربان سے چیک ان کریں)</label>)}
              </Tab>
            )}
            {(isAdmin ||
              userMeta.role === 'Prison Circle Office') && (
                <Tab
                  className='nav-item  nav-link'
                  onClick={() => {
                    setActiveTab(isAdmin ? 5 : 2);
                  }}
                >
                  Check In By Circle Office {show && (<label className='urdu-font'>(سرکل آفس  سے چیک ان کریں۔)</label>)}
                </Tab>
              )}
            {(isAdmin ||
              userMeta.role === 'Prison Circle Office') && (
                <Tab
                  className='nav-item  nav-link'
                  onClick={() => {
                    setActiveTab(isAdmin ? 6 : 3);
                  }}
                >
                  Checked In By Circle Office {show && (<label className='urdu-font'>(سرکل آفس  سے چیک ان کریں۔)</label>)}
                </Tab>
              )}
           
          </TabList>
          <div className='card'>
            <div className='card-body'>
              {(isAdmin ||
                userMeta.role === 'Prison Circle Office') && (
                  <TabPanel>
                    <ViewHearingCheckInOut
                      tabPos={isAdmin ? 1 : 0}
                      setActiveTab={setActiveTab}
                       getURL='MaraslaListsToBeCheckOutCircleOffice'
                      secondGetUrl='SearchCheckedOutByCircleOffice'
                      apiEndpoint='CreateUpdateCheckOut'
                      swalText='Successfully checked out by circle office.'
                      subTitle='Hearing Checkout Requests'
                      subTitle2='Checked Out'
                      tabTitle='Checkout Request by CO'
                    />
                  </TabPanel>
                )}
              {(isAdmin ||
                userMeta.role === 'Prison Circle Office') && (
                  <TabPanel>
                    <ViewHearingCheckInOut
                      tabPos={isAdmin ? 7 : 1}
                      setActiveTab={setActiveTab}
                       getURL='MaraslaListsCheckedOutCircleOffice'
                      secondGetUrl='SearchCheckedOutByCircleOffice'
                      apiEndpoint='CreateUpdateCheckOut'
                      swalText='Successfully checked out by circle office.'
                      subTitle='Hearing Checked out'
                      subTitle2='Checked Out'
                      tabTitle='Checkout Request by CO'
                      noAction
                    />
                  </TabPanel>
                )}
              {(isAdmin || userMeta.role === 'Darban') && (
                <TabPanel>
                  <ViewHearingCheckInOut
                    tabPos={isAdmin ? 2 : 0}
                    setActiveTab={setActiveTab}
                    getURL='MaraslaListsToBeCheckOutDarban'
                    secondGetUrl='SearchCheckedOutByDarban'
                    apiEndpoint='CreateUpdateMultipleHearingCheckOutDarban'
                    swalText='Successfully checked out by darban.'
                    subTitle='Hearing Checkout Requests'
                    subTitle2='Checked Out'
                    tabTitle='Checkout Request by Darban'
                    isCheckBoxShow={true}
                    btnTitle='Checkout'
                    noAction
                    isShowHearingStats={true}
                    headerTitle={"Hearing Information"}
                  />
                </TabPanel>
              )}
              {(isAdmin || userMeta.role === 'Darban') && (
                <TabPanel>
                  <ViewHearingCheckInOut
                    tabPos={isAdmin ? 3 : 1}
                    setActiveTab={setActiveTab}
                    getURL='MaraslaListsCheckedOutDarban'
                    secondGetUrl='SearchCheckedOutByDarban'
                    apiEndpoint='CreateUpdateCheckOutDarban'
                    swalText='Successfully checked out by darban.'
                    subTitle='Hearing Checked-out'
                    subTitle2='Checked Out'
                    tabTitle='Checkout Request by Darban'
                    noAction
                    policeOfficer
                    btnTitle='Checkout'

                    
                  />
                </TabPanel>
              )}
              {(isAdmin || userMeta.role === 'Darban') && (
                <TabPanel>
                  <ViewHearingCheckInOut
                    tabPos={isAdmin ? 4 : 2}
                    setActiveTab={setActiveTab}
                    getURL='MaraslaListsToBeCheckInDarban'
                    secondGetUrl='SearchCheckedInByDarbanEntries'
                    apiEndpoint='CreateUpdateMultipleHearingCheckInDarban'
                    swalText='Successfully checked in by darban.'
                    subTitle='Hearing Checkin Requests'
                    subTitle2='Checked In'
                    tabTitle='Checkin by Darban'
                    forDarban={true}
                    checkBoxForCheckIn={true}
                    showEscaped={true}
                    btnTitle='check-In'
                    isShowHearingStats={true}
                    headerTitle={"Hearing Information"}

                  />
                </TabPanel>
              )}

              {(isAdmin || userMeta.role === 'Darban') && (
                <TabPanel>
                  <ViewHearingCheckInOut
                    tabPos={isAdmin ? 5 : 3}
                    setActiveTab={setActiveTab}
                    getURL='MaraslaListsCheckedInDarban'
                    secondGetUrl='SearchCheckedInByDarbanEntries'
                    apiEndpoint='CreateUpdateCheckInDarban'
                    swalText='Successfully checked in by darban.'
                    subTitle='Hearing Checked-in'
                    subTitle2='Checked In'
                    tabTitle='Checkin by Darban'
                    noAction
                    policeOfficer

                  />
                </TabPanel>
              )}



              {(isAdmin ||
                userMeta.role === 'Prison Circle Office') && (
                  <TabPanel>
                  <ViewHearingCheckInOut
                      tabPos={isAdmin ? 6 : 2}
                      setActiveTab={setActiveTab}
                      getURL='MaraslaListsToBeCheckInCircleOffice'
                      secondGetUrl={'SearchCheckedInEntries'}
                      apiEndpoint='CreateUpdateCheckIn'
                      swalText='Successfully checked in by circle office.'
                      subTitle='Hearing Checkin Requests co'
                      subTitle2='Checked In'
                      tabTitle='Checkin by CO'
                      Notify
                    />
                  </TabPanel>
                )}
              {(isAdmin ||
                userMeta.role === 'Prison Circle Office') && (
                  <TabPanel>
                  <ViewHearingCheckInOut
                      tabPos={isAdmin ? 8 : 3}
                      setActiveTab={setActiveTab}
                      getURL='MaraslaListsCheckedInCircleOffice'
                      secondGetUrl={'SearchCheckedInEntries'}
                      apiEndpoint='CreateUpdateCheckIn'
                      swalText='Successfully checked in by circle office.'
                      subTitle='Hearing Checked-in'
                      subTitle2='Checked In'
                      tabTitle='Checkin by CO'
                      noAction
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

export default ManageHearingCheckinOut;
