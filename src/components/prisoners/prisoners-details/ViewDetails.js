import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PrisonerAddress from "./PrisonerAddress";
import HivInfo from "./HivInfo";
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PrisonerCases from "./PrisonerCases";
import { ICONS } from "../../../services/icons";
import { getData } from "../../../services/request";
import JailBg from "../../../assets/images/1.jpg";
//import { useHistory, useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import ProfileSlider from "./ProfileSlider";
import ProfileOverview from "./ProfileOverview";
import {
  scrollToTop,
  transformData,
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import BarrackHistory from "./BarrackHistory";
import TransferHistory from "./TransferHistory";
import VisitorHistory from "./VisitorHistory";
import { FaWheelchair } from "react-icons/fa";
import InPrisonEducation from "./InPrisonEducation";
import AppealHistory from "./AppealHistory";
//import { BiSolidDonateBlood } from "react-icons/bi";
import { Modal, Button } from 'react-bootstrap';
import { baseImageUrl } from "../../../services/request";
import ProfilePic from '../../../assets/images/users/1.png';
import { Grid, _ } from "gridjs-react";
import PrisonerAdmissions from "./PrisonerAdmissions";

const ViewDetails = (props) => {
  const location = useLocation();
  const { state } = location;
  const tabs = [
    'overview',
    'address',
    'cases',
    'prisonHistory',
    'transferHistory',
    'visitors',
    'education',
    'offences',
    'appeals',
  ];

  const initialTabIndex = state?.openTab ? tabs.indexOf(state.openTab) : 0;

  const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    if (state?.openTab) {
      setSelectedTabIndex(initialTabIndex);
    }
  }, [state, initialTabIndex]);
  

  const dispatch = useDispatch();
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const userMeta = useSelector((state) => state.user);
  const [lookups, setLookups] = useState({});
  const [actionBtns, setActionBtns] = useState({});
  const isSp = userMeta?.role === "Prison Superintendent";
  const isDig = userMeta?.role === "DIG Prisons";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const { id } = useParams();
  const [ProfileOverviewData, setProfileOverviewData] = useState({});
  const [detailsTab] = useState(true);
  const [prisonerData, setPrisonerData] = useState({
    presentAddress: {},
    biometricInfo: {},
    prisonerCase: [],
    personalInfo: {},
    dependents: [],
    hospitalAdmissions: [],
  });
console.log(prisonerData, "prisoner data");
  let legalAssistance = prisonerData?.legalAssistance;
  let highProfile = prisonerData?.highProfile;
  let isBloodDonor = prisonerData?.isBloodDonor;

  //const history = useHistory();
  const navigate = useNavigate();

  const [loadedAppealEntries, setLoadedAppealEntires] = useState([]);

  useEffect(() => {
    loadLookups();
    getPrisonerProfile();
  }, []);

  const validateGloabalActionButtons = (data) => {
    const {  user, prisons } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
		const currentLoggedInUser = {user: user, prisons: prisons};
    let actionButtons = {
      edit: true
    };
		const prisonerData = data;
		// if edit is on same branch and prison
		const loggedInUserIsInPrison = currentLoggedInUser.prisons.find(item => item?.prisonName?.toLowerCase() === prisonerData?.prisonerNumber?.prison?.toLowerCase());
		const prisonerCategoryIndex = currentLoggedInUser.user.roleNames.findIndex(item => item.toLowerCase().includes(prisonerData?.prisonerNumber?.category?.toLowerCase()));
    if ( loggedInUserIsInPrison && Object.keys(loggedInUserIsInPrison).length && loggedInUserIsInPrison.prisonName && prisonerCategoryIndex > -1) {
			actionButtons = {
				edit: true
			};
		} else {
      actionButtons = {
				edit: false
			};
    }
    return actionButtons;
	};

  
  const loadLookups = () => {
    const lookup = {};

    const hospitalAdmissionTypeObj = transformData(
      newLookups?.hospitalAdmissionTypes
    );
    lookup["hospitalAdmissionType"] = hospitalAdmissionTypeObj;

    const courtObj = transformData(newLookups?.court);
    lookup["court"] = courtObj;

    const judgeObj = transformData(newLookups?.judge);
    lookup["judge"] = judgeObj;

    const diseasesObj = transformData(newLookups?.disease);
    lookup["diseases"] = diseasesObj;

    const relationshipObj = transformData(newLookups?.Relationships);
    lookup["relationship"] = relationshipObj;

    const ageObj = transformData(newLookups?.ageCategory);
    lookup["ageCategory"] = ageObj;

    const gendersObj = transformData(newLookups?.gender);
    lookup["genders"] = gendersObj;

    const covidObj = transformData(newLookups?.vaccinations);
    lookup["CovidVacinationTypes"] = covidObj;

    const bloodGroupObj = transformData(newLookups?.bloodGroup);
    lookup["bloodGroup"] = bloodGroupObj;

    const countryObj = transformData(newLookups?.country);
    lookup['country'] = countryObj;

    const provinceObj = transformData(newLookups?.province);
    lookup['province'] = provinceObj;

    const cityObj = transformData(newLookups?.city);
    lookup['city'] = cityObj;

    const districtObj = transformData(newLookups?.district);
    lookup['district'] = districtObj;

    const relationshipsObj = transformData(newLookups?.Relationships);
    lookup['relationships'] = relationshipsObj;

    setLookups(lookup);
  };

  const getPrisonerProfile = async () => {
    try {
      const res = await getData(
        `/services/app/AddPrisonerAppServices/GetOnePrisonerProfileNew?Prisonerid=${id}`,
        "",
        true
      );
      if (res.result.isSuccessful) {
        const data = res.result.data;
        
        // Transform new data structure to match component expectations
        const transformedData = {
          personalInfo: data.personalInfo,
          presentAddress: data.presentAddress,
          prisonerCase: data.prisonerCase || [],
          dependents: data.dependents || [],
          advancedInfo: data.advancedInfo,
          contactInfo: data.contactInfo,
          hospitalAdmissions: data.hospitalAdmissions || [],
          appeals: data.prisonerCase?.flatMap(c => c.appeals || []),
          medicalInfo: data.medicalInfo,
          prisonerBasicInfo: data.prisonerBasicInfo,
          prisonerNumber: {
            prison: data.prisonerBasicInfo?.prisonName,
            category: data.prisonerBasicInfo?.prisonerNumber?.split('-')[0],
            prsNumber: data.prisonerBasicInfo?.prisonerNumber?.split('-')[1]
          },
          prisonerAdmission: {
            admissionDate: data.prisonerBasicInfo?.admissionDate
          },
          prisonerAdmissions: data.prisonerAdmissions || [],
          permanentAddress: data?.permanentAddress,
          hospitalAdmissions: data.hospitalAdmissions || [],
          highProfile: data.advancedInfo?.highProfile === "Yes",
          isBloodDonor: data.advancedInfo?.isBloodDonor === "Yes",
          condemend: data.advancedInfo?.condemend === "Yes",
          isEscaped: data.advancedInfo?.isEscaped === "Yes",
          legalAssistance: data.advancedInfo?.legalAssistance === "Yes",
          crimeType: data.advancedInfo?.crimeType,
          getReleaseDate: data.advancedInfo?.getReleaseDate,
          getReleaseDateDays: data.advancedInfo?.getReleaseDateDays,
          prisonerEducations: data.prisonerEducations || [],
          professionalInfo: data.professionalInfo || [],
          prisonerAccommodation: data.prisonerAccommodation || [],
          prisonerTransfers: data.prisonerTransfers || [],
          prisonerVisitors: data.prisonerVisitors || [],
          frontPic: data.prisonerBasicInfo?.frontPic,
          leftPic: data.biometricInfo?.leftPic,
          rightPic: data.biometricInfo?.rightPic,
          biometricInfo: data.biometricInfo || {}
        };
        
        // Check if prisoner is released in all cases
        let isReleasedInAllCases = false;
        if (transformedData.prisonerCase && transformedData.prisonerCase.length > 0) {
          isReleasedInAllCases = transformedData.prisonerCase.every(obj => 
            obj['status']?.toLowerCase().includes('released')
          );
        }
        transformedData.isPrisonerReleased = isReleasedInAllCases;
        transformedData['globalSearch'] = location.state?.search;
        
        if(transformedData.globalSearch) {
          setActionBtns(validateGloabalActionButtons(transformedData));
        }
        
        setPrisonerData(transformedData);
        setProfileOverviewData(transformedData);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };
  let medical = prisonerData?.medicalInfo?.vaccinations;
  let country = prisonerData?.personalInfo?.nationality;

  const handleEditBtn = async () => {
    try {
      
      const res = await getData(
        `/services/app/AddPrisonerAppServices/GetOnePrisoner?id=${id}`,
        "",
        true
      );
      if (res.result.isSuccessful) {
        const data = res.result.data;
        sessionStorage.setItem("selectedPrisoner", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
    navigate("/admin/prisoner/manage-prisoners",{
      state: {
        response: "success",
        ignoreRedirect: true
      },
    });
  };

  const handleDetails = async () => {
    scrollToTop();
    try {
      
      const res = await getData(
        `/services/app/AddPrisonerAppServices/GetOnePrisoner?id=${id}`,
        "",
        true
      );
      if (res.result.isSuccessful) {
        const data = res.result.data;
        sessionStorage.setItem("selectedPrisoner", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
    navigate("/admin/prisoner/add-prisoner-detail",{
      state: {
        response: "success",
      },
    });
  };

  useEffect(()=>{
    loadAppealData();

  }, [prisonerData])

  
  const [showDocImage, setShowDocImage] = useState(false);
  const [viewDoc, setViewDoc] = useState("");

  const handleShowAttachmentModal = (attachment) => {
    setViewDoc(attachment ? baseImageUrl + attachment : ProfilePic);
    setShowDocImage(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowDocImage(false);
    setViewDoc("");
  };

  const download = () => {
    if (viewDoc) {
      const nameSplit = viewDoc.split("Admin");
      const duplicateName = nameSplit.pop();
      const link = document.createElement('a');
      link.href = viewDoc;
      const newString = duplicateName.replace(/\\/g, '');
      link.download = newString;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const loadAppealData = () => {
    if (prisonerData?.appeals) {
      const filteredData = prisonerData?.appeals?.map((e) => {
        return {
          court: e?.court,
          remarks: e?.remarks,
          firNo: e?.case?.firNo,
          appealDate: validateDate(e?.appealDate),
          appealNo: e?.appealNumber,
          preference: e?.preference,
          appealType: e?.type,
          appealStatus: e?.status,
          decissionDate: validateDate(e?.decissionDate),
          appealDocument: _(
            <div className="profile-td profile-td-hover">
              <img
                src={e?.documents ? baseImageUrl + e?.documents : ProfilePic}
                className="avatar-xs rounded-circle"
                alt=""
                onClick={() => handleShowAttachmentModal(e?.documents)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          ),
        };
      });
      setLoadedAppealEntires(transformDataForTableGrid(filteredData));
    } else {
      setLoadedAppealEntires([]);
    }
  };

  return (
    <>
      <div className="profile-foreground position-relative mx-n4 mt-n4">
        <div className="profile-wid-bg">
          <img src={JailBg} alt="" className="profile-wid-img" />
        </div>
      </div>
      <div className="pt-4 row mb-4 mt-3  mb-lg-0 pb-lg-4">
        <div className="row g-4 mt-0 col-lg-8">
          <div className="col-auto">
            <div className="avatar-xl">
              <ProfileSlider prisonerData={prisonerData} />
            </div>
          </div>
          <div className="col-8">
            <div className="p-2">
              <h3 className="text-white mb-1">
                {prisonerData?.prisonerBasicInfo?.fullName}
              </h3>
              <p className="text-white-75">
                {prisonerData?.presentAddress?.city},{" "}
                {prisonerData?.presentAddress?.country}
              </p>
              <div className="flex just-space">
                <div className="mx-2">
                  <p className="text-white-75 mb-0">Prisoner Number</p>
                  <div className="me-2 flex mt-lg-1">
                    <i className="icon-prisoner text-white mx-1"></i>{" "}
                    <p className="text-white">
                      {prisonerData?.prisonerNumber?.category}-
                      {prisonerData?.prisonerNumber?.prsNumber}
                    </p>{" "}
                  </div>
                </div>
                <div>
                  <p className="text-white-75 mb-0">Prison Name</p>
                  <div className="me-2 flex  mt-lg-1">
                    <i className="icon-prison text-white mx-1"></i>
                    <p className="text-white">
                      {prisonerData?.prisonerNumber?.prison}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-white-75 mb-0">Admission Date :</p>
                  <div className="me-2 flex  mt-lg-1">
                    <i className="icon-event text-white mx-1"></i>
                    <p className="text-white">
                      {validateDate(prisonerData?.prisonerAdmission?.admissionDate) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <di3v className="col-lg-4 align-center">
          <div className="d-flex just-right flex-wrap  gap-2 fs-15">
            {prisonerData?.prisonerNumber?.category == "Convict" && (
              <>
                <div className="flex">
                  {validateDate(prisonerData?.getReleaseDate) && (
                    <h3
                      style={{
                        color: "#ef4f4c",
                        fontSize: "19px",
                        fontWeight: "400",
                      }}
                    >
                      {" "}
                      Prisoner Release Date :
                    </h3>
                  )}
                  <span
                    style={{
                      color: "#ef4f4c",
                      fontSize: "17px",
                      fontWeight: "400",
                    }}
                  >
                    {validateDate(prisonerData?.getReleaseDate) || 'N/A'}
                  </span>
                </div>
                <div className="flex">
                  {prisonerData?.getReleaseDateDays > 0 ? (
                    <>
                      <h3
                        style={{
                          color: "#ef4f4c",
                          fontSize: "17px",
                          fontWeight: "400",
                        }}
                      >
                        Days Until Release :
                      </h3>
                      <span
                        style={{
                          color: "#ef4f4c",
                          fontSize: "17px",
                          fontWeight: "400",
                        }}
                      >
                        {prisonerData?.getReleaseDateDays}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            )}

            {highProfile == true && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg"
              >
                High Profile
              </a>
            )}
            {isBloodDonor == true && (
              <>
              <div className="d-flex badge badge-soft-danger opt-bg">
              <BiSolidDonateBlood size={30} color="red" />
              <a
                href="javascript:void(0);"
              >
                Blood Donor
              </a>
              </div>  
              </>
            )}
            {prisonerData?.condemend && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg"
              >
                Condemned
              </a>
            )}
            {prisonerData?.isEscaped && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg"
              >
                Escaped
              </a>
            )}
            {prisonerData?.medicalInfo?.disabled && (
              <>
                <a
                  href="javascript:void(0);"
                  className="badge badge-soft-danger opt-bg"
                >
                  Disabled
                  <i>
                    <FaWheelchair style={{ transform: "scaleX(-1)" }} />{" "}
                  </i>
                </a>
              </>
            )}
            {/* <a href="javascript:void(0);" className="text-white">Prisoner Reales Date : 20 Aug 2023</a> */}
            {legalAssistance != true && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg"
              >
                <i
                  className="custom-icon-warning"
                  dangerouslySetInnerHTML={{ __html: ICONS.warning }}
                ></i>
                No Legal Assistance
              </a>
            )}
            {prisonerData?.medicalInfo?.vaccinations?.length > 0 ? (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-success opt-bg "
              >
                Covid Vaccinated
              </a>
            ) : (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg "
              >
                Not Vaccinated
              </a>
            )}
            {country && !["Pakistani", "Pakistan"].includes(country) && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg"
              >
                Foreigner
              </a>
            )}
            {prisonerData?.crimeType && (
              <a
                href="javascript:void(0);"
                className="badge badge-soft-danger opt-bg "
              >
                {prisonerData?.crimeType}
              </a>
            )}
           {!(isSp || isDig || isIG || prisonerData.isPrisonerReleased) &&
            <div className="action-btns mt-3 just-right">
              {
              ((actionBtns.edit) && 
                <>
                 <button
                id="edit-btn"
                type="button"
                class="tooltip  btn btn-warning waves-effect waves-light"
                onClick={() => {
                  handleEditBtn();
                }}
              >
                <i class="icon-edit"></i>
                <span>Edit</span>
              </button>

              <button
                id="add-details-btn"
                type="button"
                class="tooltip btn btn-secondary waves-effect waves-light mx-1"
                onClick={() => {
                  handleDetails();
                }}
              >
                <i class="icon-add"></i>
                <span>Add Details</span>
              </button>
              </>
              )}
             
            </div>
            }
          </div>
        </di3v>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div>
            <Tabs className="profile-tabs" selectedIndex={selectedTabIndex} onSelect={index => setSelectedTabIndex(index)}>
              <TabList
                className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                role="tablist"
              >
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14">
                    <i className="icon-dashboard"></i>
                    <span>Overview</span>
                  </a>
                </Tab>
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-destination"></i>
                    <span>Address</span>
                  </a>
                </Tab>
                {(userMeta?.role === "Prison Superintendent" || userMeta?.role === "Prison Hospital")
                  && (
                    <>
                      <Tab className="nav-item">
                        <a href="#" className="nav-link fs-14 ">
                          <i className="icon-medical"></i>
                          <span>Medical information</span>
                        </a>
                      </Tab>
                    </>
                  )}
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-file"></i>
                    <span>Cases</span>
                  </a>
                </Tab>

                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-prison"></i>
                    <span>Prison/Barrack History</span>
                  </a>
                </Tab>
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-transfer"></i>
                    <span>Transfer History</span>
                  </a>
                </Tab>
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-visitor"></i>
                    <span>Visitors</span>
                  </a>
                </Tab>
               
                <Tab className="nav-item">
                  <a href='#' className="nav-link fs-14 ">
                    <i className="icon-inquiry"></i><span>In-Prison Education</span>
                  </a>
                </Tab>
                
                <Tab className="nav-item">
                  <a href='#' className="nav-link fs-14 ">
                    <i className="icon-inquiry"></i><span>Prisoner Admissions</span>
                  </a>
                </Tab>
                {prisonerData?.prisonerNumber?.category === "Convict"  && prisonerData?.appeals?.length > 0 &&(
                <Tab className="nav-item">
                  <a href="#" className="nav-link fs-14 ">
                    <i className="icon-prison"></i>
                    <span>Appeals</span>
                  </a>
                </Tab>)}
               
              </TabList>
              <div className="tab-content pt-4 text-muted">
                <TabPanel>
                  <ProfileOverview
                    personalData={ProfileOverviewData}
                    lookups={lookups}
                  />
                </TabPanel>

                <TabPanel>
                  <PrisonerAddress address={prisonerData} />
                </TabPanel>
                {(userMeta?.role === "Prison Superintendent" || userMeta?.role === "Prison Hospital")
                  && (
                    <>
                      <TabPanel>
                        <div className="hover-card">
                          {/* Medical details */}
                          <HivInfo lookups={lookups} hospital={prisonerData} />
                        </div>
                      </TabPanel>
                    </>
                  )}
                <TabPanel>
                  <div className="hover-card">
                    <PrisonerCases cases={prisonerData} lookups={lookups} />
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="hover-card">
                    <h2>Allocated Barrack History</h2>
                    <BarrackHistory cases={prisonerData} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="hover-card">
                    <h2>Transfer History</h2>
                    <TransferHistory cases={prisonerData} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="hover-card">
                    <h2>Visitors History</h2>
                    <VisitorHistory visitor={prisonerData} lookups={lookups} />
                  </div>
                </TabPanel>
               
                <TabPanel>
                  <div className="hover-card">
                    <h2>In-Prison Education</h2>
                    <InPrisonEducation education={prisonerData}  />
                  </div>
                </TabPanel>
               
                <TabPanel>
                  <div className="hover-card">
                    <h2>Prisoner Admissions</h2>
                    <PrisonerAdmissions prisoner={prisonerData} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="hover-card">
                    <h2>Appeals</h2>
                    <AppealHistory  loadedAppealEntries={loadedAppealEntries}/>
                  </div>
                </TabPanel>
               
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal show={showDocImage} onHide={handleCloseAttachmentModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Appeal Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={viewDoc}
            alt="Appeal Document"
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAttachmentModal}>
            Close
          </Button>
          <Button variant="primary" onClick={download}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ViewDetails;
