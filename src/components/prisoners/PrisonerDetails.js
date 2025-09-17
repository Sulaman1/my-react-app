import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { transformData } from "../../common/Helpers";
import { getData } from "../../services/request";
import Case from "./Components/Case";
import Dependent from "./Components/Dependent";
import Medical from "./Components/Medical";
//import { handleUrlRedirect } from "../../common/Common";
import PrisonerBelongings from "./Components/PrisonerBelongings";
const PrisonerDetails = (props) => {
  const userMeta = useSelector((state) => state.user);
  const [activetab, setActiveTab] = useState(0);
  const [details] = useState(true);
  const [lookups, setLookups] = useState({});
  const [prisonerData, setPrisonerData] = useState({});
  const show = useSelector((state) => state.language.urdu);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [isUTP, setIsUTP] = useState(userMeta?.role === 'Prison UTP Branch');
  const [isConvict, setIsConvict] = useState(userMeta?.role === 'Prison Convict Branch');

  // useEffect(() => {
  //   callAndHandleLookUps();
  //   getPrisonerData();
  //   // simple handle of tab when click from notification
  //   const tabIndex = handleUrlRedirect();
  //   setActiveTab(tabIndex);
  // }, []);

  const getPrisonerData = async () => {
    
    const entry = JSON.parse(sessionStorage.getItem("selectedPrisoner"));
    try {
      const res = await getData(
        `/services/app/AddPrisonerAppServices/GetOnePrisonerProfile?Prisonerid=${entry.id}`,
        "",
        true
      );
      if (res.success && res.result?.isSuccessful) {
        
        const data = res.result.prisonerProfile;
        const prisonerInfo = {
          ...data.personalInfo,
          admissionDate: data.prisonerAdmission?.admissionDate,
          prisonerNumber: data.prisonerNumber?.prsNumber,
          category: data.prisonerNumber?.category,
          prisonName: data.prisonerNumber?.prison,
          frontPic: data.biometricInfo?.frontPic,
          leftPic: data.biometricInfo?.leftPic,
          rightPic: data.biometricInfo?.rightPic,
        };
        setPrisonerData(prisonerInfo);
      } else {
        swal(
          res.error?.message || "An error occured",
          res.error?.details || "",
          "warning"
        );
      }
    } catch (error) {
      console.log(error);
      swal("Something went wrong!", "", "warning");
    }
  };

  const callAndHandleLookUps = async () => {
    try {
      const lookup = {};
   
      const relationshipObj = transformData(newLookups?.Relationships);
      lookup["relationship"] = relationshipObj;

      const genderObj = transformData(newLookups?.gender);
      lookup["gender"] = genderObj;
    
      const cateObj = transformData(newLookups?.prisonerCategory);
      lookup["prisonerCategory"] = cateObj;

      let caseStatusObj = transformData(newLookups?.caseStatus);
      if(isUTP){
        const filteredUTP = filterResponse(caseStatusObj, "UTP");
        caseStatusObj = filteredUTP
      }else if(isConvict){
        const filteredConvict = filterResponse(caseStatusObj, "Convict");
        caseStatusObj = filteredConvict
      }
      lookup["caseStatuses"] = caseStatusObj;
      setLookups(lookup);
    } catch (error) {
      console.error(error);
      alert("something went wrong in lookups api");
    }
  };

  function filterResponse(data, type) {
    if (type === "UTP") {
      // Remove "Released in Case" and "Convicted Case"
      return data.filter(item => item.label !== "Released in case" && item.label !== "Convicted case");
    } else if (type === "Convict") {
      // Remove "Released in Case"
      return data.filter(item => item.label !== "Released in case");
    }
    // Return the original array if no filter type matches
    return data;
  }

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space ">
            <span>
              Manage Prisoners{" "}
              {show && (
                <label className="urdu-font">(قیدی کا انتظام کریں)</label>
              )}
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
              Cases{" "}
              {show && <label className="urdu-font">(قیدی داخل کریں)</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(1);
              }}
            >
              Dependents/Children{" "}
              {show && <label className="urdu-font">(قیدی کی فہرست)</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(2);
              }}
            >
              Prisoner Belongings{" "}
              {show && <label className="urdu-font">()</label>}
            </Tab>
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(3);
              }}
            >
              Medical{" "}
              {show && <label className="urdu-font">(قیدی داخل کریں)</label>}
            </Tab>
          </TabList>
          <div className="card">
            <div className="card-body">
            <TabPanel>
                <Case
                  setActiveTab={setActiveTab}
                  lookUps={lookups}
                  prisoner={prisonerData}
                />
              </TabPanel>
              <TabPanel>
                <Dependent
                  setActiveTab={setActiveTab}
                  lookUps={lookups}
                  prisoner={prisonerData}
                />
              </TabPanel>
              <TabPanel>
                <PrisonerBelongings 
                  setActiveTab={setActiveTab}
                  lookUps={lookups}
                  prisoner={prisonerData}
                />
              </TabPanel>
              <TabPanel>
                <Medical
                  setActiveTab={setActiveTab}
                  prisoner={prisonerData}
                  details={details}
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default PrisonerDetails;
