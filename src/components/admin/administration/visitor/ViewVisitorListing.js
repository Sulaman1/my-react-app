import { useRef, useEffect, useState } from "react";

import AllSearch from "../../search/AllSearch";
import { Grid, _ } from "gridjs-react";
import {
  formatedTime,
  transformData,
  transformDataForTableGrid,
  validateDate,
} from "../../../../common/Helpers";
import { baseImageUrl, getData, postData } from "../../../../services/request";
import swal from "sweetalert";
import ProfilePic from "../../../../assets/images/users/1.jpg";
import { useDispatch, useSelector } from "react-redux";
import Print from "../../search/Print";
import CancelModal from "../../../../modules/courtProduction/components/CancelModal";
import GroupVisitorsModal from "../../../../modules/courtProduction/components/GroupVisitorsModal";
import DescriptionModal from "../../../../common/DescriptionModal";
import ShowNoOfRecords from "../../../../common/ShowNoOfRecords";
import VisitorsQueue from "./components/VisitorsQueue";
import { Modal } from "react-bootstrap";

const ViewVisitorsQueue = ({
  type,
  getURL,
  btnTitle,
  apiEndpoint,
  swalText,
  successMsg,
  blockVisitor,
  activeTab,
  tabSequence,
  inMeeting,
  unBlockVisitor,
  visitorStatus,
  hide
}) => {
  const [entries, setEntries] = useState([]);
  const gridRef = useRef(null);
  const [newUserData, setNewUserData] = useState([]);
  const userMeta = useSelector((state) => state.user);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loader, showLoader] = useState(false);
  const [groupVisitorsModal, setGroupVisitorsModal] = useState(false);
  const [groupVisitorModalData, setGroupVisitorModalData] = useState([]);
  const [prisonerId, setPrisonerId] = useState(null);
  const [lookups, setLookups] = useState({});
  const dispatch = useDispatch()
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [initialLoad, setInitialLoad] = useState(true);
  const [showDescModal, setShowDescModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [modalTitle, setModalTitle] = useState("");
  const show = useSelector((state) => state.language.urdu);
  const [groupVisitorEntries, setGroupVisitorEntries] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const [showQueueModal, setShowQueueModal] = useState(false);

  const handleShowDescModal = (description, title) => {
    const descriptionArray = description.split(',').map(item => item.trim());
    const formattedDescription = descriptionArray.map((item, index) => (
      <span key={index} style={{padding: "0.5rem"}}>
        ({index + 1}). {item}
        <br />
      </span>
    ));
    setModalContent(formattedDescription);
    setModalTitle("Under Sections");
    setShowDescModal(description?.length > 30 ?  true : false);
  };
  
  const fetchLookUps = async () => {
    try {
      
      const lookup = {};
    
      const nationalityObj = transformData(newLookups?.Nationality);
      lookup['nationlities'] = nationalityObj;

    
      const gendersObj = transformData(newLookups?.gender);
      lookup['genders'] = gendersObj;

    
      const maritalObj = transformData(newLookups?.MaritalStatus);
      lookup['marital'] = maritalObj;

     
      const casteObj = transformData(newLookups?.caste);
      lookup['caste'] = casteObj;

      
      const sectionObj = transformData(newLookups?.sections);
      lookup['section'] = sectionObj;

     
      const religionObj = transformData(newLookups?.religion);
      lookup['religion'] = religionObj;

     
      const countryObj = transformData(newLookups?.country);
      lookup['country'] = countryObj;

     
      const relationshipsObj = transformData(newLookups?.Relationships);
      lookup['relationships'] = relationshipsObj;
      
      
      setLookups(lookup);
    } catch (error) {
      console.error(error);
      alert('Something went wrong in lookups api');
    }
  };
  useEffect(() => {
    loadGridData();
    recursiveMethod();
    fetchLookUps();
  }, [pageLimit]);

  const recursiveMethod = () => {
    setTimeout(() => {
      loadGridData(false);
      recursiveMethod();
    }, 30000);
  };

  const isVisitor = userMeta?.role === "Visitor Branch"
  const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";
  const generateGridCols = () => {
    const commonEntries = {
      [`Queue No`]: "",
      [`Profile Pic${show ? ' تصویر' : ''}`]: "",
      [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
      [`Full Name${show ? ' (نام)' : ''}`]: "",
      [`Year${show ? ' (سال)' : ''}`]: "",
      [`Relationship Type ${show ? ' (رشتہ)' : ''}`]: "",
      [`Relationship Name${show ? ' (رشتہ کا نام)' : ''}`]: "",
      [`Barrack${show ? ' (بیرک)' : ''}`]: "",
      [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: "",
      [`under Sections${show ? ' (دفعات)' : ''}`]: "",
      [`check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`]: "",
      [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
      [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",

    };
  
    const roleSpecificEntries = {};
  
    if (userMeta?.role === "Super Admin" || isDig || isIG) {
      roleSpecificEntries['Prison Name'] = "";
    } 
    if(tabSequence == '1'){
      roleSpecificEntries['Visit Creation Date']= "";
      roleSpecificEntries['Visit Creation Time']= "";
    }
    roleSpecificEntries[`Actions${show ? ' (عملدرامد)' : ''}`] = "";
    

  
    const entries = { ...commonEntries, ...roleSpecificEntries };
    return Object.keys(entries);
  };

  const loadGridData = async (showLoaderFlag = true) => {
    try {
      if (initialLoad && showLoaderFlag) {
        showLoader(true);
        setInitialLoad(false);
      }
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
      maxResults: pageLimit,
      userId: parsedId,
      name: "",
      category: 0,
      prisonId: 0,
      year: 0,
      prsNumber: 0,
      relationshipName: "",
      relationshipTypeId: "",
      genderId: 0,
      policeStationId: 0,
      firYear: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };
      const extraPath = type === "visitor" ? "?checkedIn=false" : "";
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${extraPath}`,
        obj, false
      );
      if (result && result.success) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        if (data.length > 0) {
          
          setEntries(data);
          setNewUserData(data);

          setTimeout(() => {
          showLoader(false)
          }, 1000);
        } else {
          setEntries([]);
          setTimeout(() => {
          showLoader(false)
          }, 1000);

        }
      } else {
        console.error("something went wrong");
        showLoader(false)

      }
    } catch (err) {
      showLoader(false)
      console.log(err);
    }
  };

  const handleGroupVistors = async (e)=> {

      try {
        const result = await getData(
          `/services/app/Visitors/GetCurrentVisit?visitId=${e?.visitId}&visitorStatus=${visitorStatus}`
          
        );
  
        if (result && result.success) {
          const data = result?.result;
          if (data) {
            
            setGroupVisitorEntries(data);
            setGroupVisitorsModal(true)
            setGroupVisitorModalData(e)
          } else {
            setGroupVisitorEntries([]);
          
          }
        } else {
          console.error("something went wrong");
  
        }
      } catch (err) {
        console.log(err);
      }

      
  }
  const handleClick = async (prisonerEntry) => {
    const prisonerId = prisonerEntry.id;

    try {
      const willProceed = await swal({
        title: "Are you sure?",
        text: unBlockVisitor ? "Unblock this visitor" : "Block this visitor",
        icon: "warning",
        buttons: true,
      });
      if (willProceed) {
        
        const res = await postData(
          `/services/app/Visitors/${apiEndpoint}?PrisonerId=${prisonerId}`,
          {}
        );
        if (res.success && res.result.isSuccessful) {
          swal(successMsg, "", "success");
          loadGridData();
        } else {
          swal(res.error.message, res.error.details, "warning");
        }
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    }
    finally {
      
    }
  };


  const gridDataMap = (entry) => {
    const shortDescription =
    entry?.underSection?.length > 50
      ? `${entry.underSection.substring(0, 50)}...`
      : entry.underSection;

    const mapObj = {
      queueNo: entry?.queueNumber,
      profile: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              src={entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic}
              className="avatar-xs rounded-circle"
              alt=""
            />
          </div>
          <img
            src={entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic}
            className="avatar-xs rounded-circle"
            alt=""
          />
        </div>
      ),
    };


    mapObj["prisonerNumber"] = entry.prisonerNumber;
    mapObj["fullName"] = entry.fullName;
    mapObj["year"] = entry.year;
    mapObj["relationshipName"] = entry.relationshipName;
    mapObj["relationshipType"] = entry.relationshipType;
    mapObj["barrack"] = entry.barrack || "not allocated yet";
    mapObj["Fir No"] = entry.firNo;
    mapObj['under Section'] = _(
      <div className="cursor-pointer"
        onClick={() =>
        handleShowDescModal(entry?.underSection, entry?.underSection)
        }
      >
        {shortDescription ||  "not added yet"}
      </div>
      );

    mapObj["check-Out Status"] = entry.checkOutSting;
    mapObj["cnic"] = entry.cnic;
    mapObj["Last Modified By"] = entry.lastModifiedByUser || "N/A";
    isDig || isIG  ? mapObj["Prison Name"] = entry?.prisonName : "";
    if(tabSequence == '1'){
      mapObj['createDate'] = validateDate(entry.visitDate);
      mapObj['createTime'] = formatedTime(entry.visitDate);
    }
if(tabSequence != "4"){ 
    mapObj["Actions"] = _(
      <>
        <div className="action-btns" >
          {entry.appealInProgress == true && (
            <button
              id={"view-more-btn"}
              type="button"
              className="tooltip btn btn-danger waves-effect waves-light mx-1 "
            >
              <i className="icon-glamping"></i>
              <span>{show ? 'اپیل جاری ہے' : 'Appeal In process'}</span>
            </button>
          )}
          {blockVisitor && !hide && 
          <button
            id={"ok-btn"}
            type="button"
            onClick={() => handleClick(entry)}
            className="btn btn-prim waves-effect waves-light mx-1"
          >
            {unBlockVisitor ? "Unblock Visitor" : "Block Visitor"}
          </button>}
           {!blockVisitor && 
            <button
              id={"ok-btn"}
              type="button"
              onClick={() => handleGroupVistors(entry)}
              className="btn btn-prim waves-effect waves-light mx-1"
            >
              {'View Visitors'}
            </button>}
        </div>
      </>
    );
  }
  if(isVisitor){
    mapObj["Actions"] = _(
      <>
        <div className="action-btns" >
            <button
              id={"ok-btn"}
              type="button"
              onClick={() => handleGroupVistors(entry)}
              className="btn btn-prim waves-effect waves-light mx-1"
            >
              {'View Visitors'}
            </button>
        </div>
      </>
    );
  }
    return mapObj;
  };

  const handleSubmit = async (payload) => {
    

    const { userId } = JSON.parse(sessionStorage.getItem("user"));
    const reqPayload = {
      relationshipName: payload.relationshipName,
      relationshipTypeId: payload.relationshipTypeId,
      firNo: payload.firNo,
      firYear: payload.firYear,
      genderId: payload.genderId,
      name: payload.name,
      policeStationId: payload.policeStationId,
      prsNumber: payload.prsNumber,
      userId,
      year: payload.year,
      maxResults: payload?.maxResults || pageLimit 
    };

    try {
      const extraPath =
        type === "visitor" ? `?checkedIn=${payload.checkedIn}` : "";

      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${extraPath}`,
        reqPayload
      );
      if (result && result.result.isSuccessful) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        setEntries(data); 
      } else {
        swal(result.error.message, result.error.details, "warning");   
      }
    } catch (err) {
      
      swal("Something went wrong!", "", "warning");
    }
  };

  const newData = newUserData.map((x) => {
    if (!blockVisitor) {
      return {
        "Prisoner Number": x.prisonerNumber,
        "Full Name": x.fullName,
        'Relationship Type': x?.relationshipType,
        "Relationship Name": x.relationshipName,
        Barrack: x.barrack || "not allocated yet",
        "Fir No": x.firNo,
        "Under Section": x.underSection,
        "check-Out Status": x.checkOutSting,
        CNIC: x.cnic,
        "Visitor Name": x.visitorName,
        "Visit Date": validateDate(x.visitDate),
        Relationship: x.relationship,
      };
    } else if (blockVisitor) {
      return {
        "Prisoner Number": x.prisonerNumber,
        "Full Name": x.fullName,
        'Relationship Type': x?.relationshipType,
        "Relationship Name": x.relationshipName,
        Barrack: x.barrack || "not allocated yet",
        "Fir No": x.firNo,
        "Under Section": x.underSection,
        "check-Out Status": x.checkOutSting,
        CNIC: x.cnic,
      };
    }
  });

  const handleClose = () => {
    setShowCancelModal(false);
  };

  const openQueueDisplay = () => {
    // Open a new window with maximum size
    const queueWindow = window.open("/admin/vistors/show-visitors-queue", "_blank", 
      "width=1920,height=1080,menubar=no,toolbar=no,location=no,resizable=yes");
    
    // Add instructions about moving to second display
    queueWindow.onload = function() {
      try {
        // Alert the user about moving to second display
        const moveMessage = document.createElement('div');
        moveMessage.innerHTML = `
          <div style="position:fixed;top:0;left:0;right:0;background:#f8d7da;color:#721c24;padding:10px;text-align:center;z-index:9999;font-size:16px;">
            To display on a second monitor: Drag this window to your other display, then click "Enter Fullscreen"
            <button onclick="this.parentNode.style.display='none'" style="margin-left:10px;padding:3px 8px;background:#721c24;color:white;border:none;border-radius:3px;">Dismiss</button>
          </div>
        `;
        queueWindow.document.body.insertBefore(moveMessage, queueWindow.document.body.firstChild);
        
        // Focus the window
        queueWindow.focus();
      } catch (e) {
        console.log("Could not show second display instructions", e);
      }
    };
  };

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      {loader &&
        <div className="loading-overlay">
              <div class="loader align-center d-flex gap-2 custom-loader2" >
                  <b>Please wait...</b>
                  <div class="lds-ring">
                      <div>
                      </div>
                      <div>
                      </div>
                      <div>
                      </div>
                      <div>
                      </div>
                  </div>
              </div>
              </div>
      }
      <CancelModal
        showCancelModal={showCancelModal}
        prisonerId={prisonerId}
        onClose={handleClose}
        loadVisitorData={loadGridData}
      />
      <GroupVisitorsModal visitorStatus={visitorStatus} visitId={groupVisitorModalData?.visitId} data={groupVisitorEntries} show={groupVisitorsModal} hideButton={hide} hide= {()=> setGroupVisitorsModal(false)} lookups={lookups} isVisitor={isVisitor} refresh={loadGridData} tabSequence={tabSequence}/>
      <AllSearch type={type} handleSubmit={handleSubmit} />
      <div className="d-flex">
        <Print data={newData} />
        <button 
          className="btn btn-prim waves-effect waves-light mx-2 mb-3"
          onClick={openQueueDisplay}
        >
          <i className="fas fa-tv"></i> View Queue Display
        </button>
      </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <div className="row">
          <div className="col">
          <div className="float-end">
            <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
          </div>
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry))
            )}
            columns={generateGridCols()}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: pageLimit,
            }}
          />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewVisitorsQueue;