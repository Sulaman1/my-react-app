import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ViewTransfer from "../../prisoners/Components/transfer-prisoner/ViewTransfer";
//D:\pmis-bl\src\components\prisoners\Components\transfer-prisoner\ViewTransfer.js



const ManagePrisonerTransfer = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu)

  useEffect(() => {
    const search = props?.location?.search;
    if (search) {
      let tab = search.split('=')[1]
      setTimeout(() => {
        setActiveTab(parseInt(tab));
      }, 2000)

    }

  }, [])
  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading just-space">
            <span>Transfer Prisoner</span>
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
              Prisoner Search{" "}
              {show && (<label className="urdu-font">(تلاش برائے قیدیان)</label>)}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Incoming Transfers{" "}
              {show && (<label className="urdu-font">(منتقلی برائے اندورن)</label>)}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(2);
              }}
            >
              Outgoing Transfers{" "}
              {show && (<label className="urdu-font">(منتقلی برائے بیرون)</label>)}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(3);
              }}
            >
              Cancelled Transfers{" "}
              {show && (<label className="urdu-font">(منسوخ شدہ منتقلیاں)</label>)}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(4);
              }}
            >
              Rejected By Them{" "}
              {show && (<label className="urdu-font">
                (دوسروں کی طرف سے کی گئی ترادید)
              </label>)}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(5);
              }}
            >
              Rejected By Us{" "}
              {show && (<label className="urdu-font">(ہماری طرف سے کی گئی ترادید)</label>)}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
              <TabPanel>
                <ViewTransfer
                  tabPos={1}
                  setActiveTab={setActiveTab}
                  getURL="SearchToBeTransferred"
                  apiEndpoint="CreateUpdateTransferRequest"
                  btn={{
                    id: "button-one",
                    text: "Transfer",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-transfer",
                    type: "button",
                  }}
                  reInitiate={false}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={2}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferInitiatedIncoming"
                  apiEndpoint="AcceptTransferRequest"
                  apiEndpoint2="RejectTransferRequest"
                  btn={{
                    id: "button-one",
                    text: "Accept",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-active",
                    type: "button",
                  }}
                  btn2={{
                    id: "button-two",
                    text: "Reject",
                    className:
                      "btn btn-danger waves-effect waves-light  tooltip",
                    icon: "icon-cross-sign",
                    type: "button",
                  }}
                  reInitiate={false}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={3}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferInitiatedOutgoing"
                  apiEndpoint="CancelTransferRequest"
                  btn={{
                    id: "button-one",
                    text: "Cancel",
                    className:
                      "btn btn-danger waves-effect waves-light tooltip",
                    icon: "icon-cross-sign",
                    type: "button",
                  }}
                  reInitiate={false}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={4}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferCanceled"
                  apiEndpoint="CreateUpdateTransferRequest"
                  btn={{
                    id: "button-one",
                    text: "ReInitiate",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-transfer",
                    type: "button",
                  }}
                  btn2={{
                    id: "button-three",
                    text: "Rehabilitate",
                    className:
                      "btn btn-danger waves-effect waves-light tooltip",
                    icon: "icon-leftangle",
                    type: "button",
                  }}
                  apiEndPoint3="GetOnePrisonerTransfer"
                  reInitiate={true}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={5}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferRejectedByThem"
                  apiEndpoint="CreateUpdateTransferRequest"
                  apiEndPoint3="GetOnePrisonerTransfer"
                  btn={{
                    id: "button-one",
                    text: "ReInitiate",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-transfer",
                    type: "button",
                  }}
                  btn2={{
                    id: "button-three",
                    text: "Rehabilitate",
                    className:
                      "btn btn-danger waves-effect waves-light tooltip",
                    icon: "icon-leftangle",
                    type: "button",
                  }}
                  reInitiate={true}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={6}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferRejectedByUs"
                  apiEndpoint="CreateUpdateTransferRequest"
                  apiEndPoint3="GetOnePrisonerTransfer"
                  btn={{
                    id: "button-one",
                    text: "ReInitiate",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-transfer",
                    type: "button",
                  }}
                  reInitiate={true}
                />
              </TabPanel>
              <TabPanel>
                <ViewTransfer
                  tabPos={7}
                  setActiveTab={setActiveTab}
                  getURL="SearchTransferHistory"
                  apiEndpoint="CreateUpdateTransferRequest"
                  apiEndPoint3="GetOnePrisonerTransfer"
                  btn={{
                    id: "button-one",
                    text: "ReInitiate",
                    className:
                      "btn btn-primary waves-effect waves-light  tooltip",
                    icon: "icon-transfer",
                    type: "button",
                  }}
                  btn2={{
                    id: "button-three",
                    text: "Rehabilitate",
                    className:
                      "btn btn-danger waves-effect waves-light tooltip",
                    icon: "icon-leftangle",
                    type: "button",
                  }}
                  reInitiate={true}
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ManagePrisonerTransfer;
