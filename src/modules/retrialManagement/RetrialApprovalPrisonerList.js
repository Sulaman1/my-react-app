import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, _ } from "gridjs-react";
import {
  generateActionButtons,
  scrollToTop,
  transformDataForTableGrid,
  validateDate,
  formatDate,
  getFormattedDate
} from "../../common/Helpers";
import swal from "sweetalert";
import { baseImageUrl, deleteData , getData, postData} from "../../services/request";
import ProfilePic from "../../../src/assets/images/users/1.jpg";
import { useSelector } from "react-redux";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";
import { getTodayDate } from "../../components/prisoners/Components/circleoffice/checkinout/ViewHearingCheckInOut";
import DatePicker from "react-datepicker";
import Modal from "react-bootstrap/Modal";  
import "react-datepicker/dist/react-datepicker.css";
import ProfileCard from "../../components/prisoners/Components/circleoffice/profile/ProfileCard";
import moment from "moment-mini";
import VisitorModal from "../../components/admin/administration/visitor/components/VisitorModal";

const RetrialApprovalPrisonerList = (props) => {
const {  user,  prisons } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
  const prisonName = prisons[0]?.prisonName;
  const userMeta = useSelector((state) => state.user);
  const [isAdmin] = useState(userMeta?.role === "Super Admin");
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
 const [prisoners, setPrisoners] = useState([]);
 const [loading, setLoading] = useState(false);
 const [searchVisibility, setSearchVisibility] = useState(false);
 const [datePayload, setDatePayload] = useState();
 const [showModal, setShowModal] = useState(false);
 const today = new Date();
 const todayDate = formatDate(getTodayDate(today));
 const [fetchedPrisoner, setFetchedPrisoner] = useState({});
 const [isdisabled, setIsDisabled] = useState(false)

//this is just for visitorModal
 const [showQueueModal, setShowQueueModal] = useState(false)
 const [showQueue, setShowQueue] = useState(false)
 const [printQueueObj, setPrintQueueObj] = useState({})
  
useEffect(() => {
    loadData();
}, [pageLimit]);

const loadData = async () => {
  
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
        "maxResults": parseInt(pageLimit),
        "skipCount": 0,
        "userId": parsedId,
        "name": "",
        "year": 0,
        "prsNumber": 0,
        "relationshipName": "",
        "cnic": "",
        "genderId": 0,
        "policeStationId": 0,
        "firYear": 0,
        "firNo": ""
      }
    const datePickerDate = formatDate(datePayload?.datePicked || todayDate)
    const param = `?date=${datePickerDate}`

   let url;
   if (props.isRelease) {
       url = props.getUrl;
   } else if (props.isVisit) {
       if (props.isApproved === true) {
           url = `${props.getUrl}?approved=true`;
       } else if (props.isDenied === true) {
           url = `${props.getUrl}?approved=false`;
       } else {
           url = `${props.getUrl}`;
       }
   } else {
       url = `${props.getUrl}${param}`;
   }

    postData(url, obj)
			.then(async (result) => {

				if (result && result.success) {
          setTotalNoOfRecords(result.result?.totalPrisoners)
					setPrisoners(result.result.data)
				}else{
					setPrisoners([])
				}
			})
			.catch((error) => {
				console.log(error);
			});
    }

  const handleApprovelBtn = async(isApproved) => {
    setIsDisabled(true)
    const dynamicUrl = props.isRelease ? `CompleteCaseRelease?caseId=${fetchedPrisoner.cases?.[0].id}&approved=${isApproved}` : `ApproveRetrialOfCase?prisonerId=${fetchedPrisoner.id}`
    const url = `/services/app/PrisonerRelease/${dynamicUrl}`;
    const response = await postData(url,{})
    if(response && response.success){
      loadData();
      if(props.isRelease && !isApproved){
        swal( "Release Approval has been Rejected", "", "success");
      }else{
        swal( "Approved Successfully", "", "success");
      }
      hideModal();
    }else{
      swal(response.error.message, "", "warning");
    }
    setIsDisabled(false)
  };

  const handleVisitApprovelBtn = async(isApproved) => {
    setIsDisabled(true)
    const visitId = fetchedPrisoner?.visitId;
    const url = `/services/app/Visitors/VisitorDsApproval?visitId=${visitId}&approved=${isApproved}`;
    const response = await postData(url,{})
    if(response && response.success){
      loadData();
      if(isApproved){
        swal( "Visit has been Approved", "", "success");
      }else{
        swal( "Visit has been Declined", "", "success");
      }
      hideModal();
    }else{
      swal(response.error.message, "", "warning");
    }
    setIsDisabled(false)
  };



  const getGridCols = () => {
    const cols = {
      "Profile Pic (تصویر)": "",
      "Prisoner Number(قیدی نمبر)": "",
      "Year (سال)": "",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relationship Name (ولدیت)": "",
      "Barrack (بیرک)": "",
      "Admission Date (داخلہ تاریخ)": "",
      "CNIC (شناختی کارڈ)": "",
      "Fir No (ایف آئی آر نمبر)": "",
      "Condemned": "",
      "Escaped": "",
      "High Profile": "",
      "Multiple Case": "",
      "Under Sections (دفعات)": "",
      "Checkout Status": "",
    };
    if(userMeta?.role === "Super Admin"){
      cols['Prison Name (جیل)'] = ""
    }
    // if(!props.noAction){
      cols['Actions (عملدرامد)'] = ""
    // }
    return Object.keys(cols);
  };


  const gridDataMap = (e) => {
    const shortDescription =
    e?.underSection?.length > 50
      ? `${e.underSection.substring(0, 50)}...`
      : e.underSection;

      
    const mapObj = {
      profile: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic}`}
              width="50"
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic}`}
            width="50"
          />
        </div>
      ),
      prisonerNumber: e.prisonerNumber,
      year: e.year,
      fullName: e.fullName,
      relationshipType: e?.relationshipType,
      relationshipName: e.relationshipName,
      barrack: e.barrack || "not allocated yet",
      admissionDate: validateDate(e.admissionDate) || "",
      cnic: e.cnic,
      firNo: e.firNo,
      Condemned: e.condemend ? "Yes" : "No",
      isEscaped: e.isEscaped ? "Yes" : "No",
      highProfile: e.highProfile ? "Yes" : "No",
      hasManyCases: e.hasManyCases ? "Yes" : "No",
      underSection: _(
        <div className="cursor-pointer"
        onClick={() => {
          if (e.underSection?.length > 30) {
            handleShowModal(e.underSection, e.underSection)
          }
        }}
        >
          {shortDescription ||  "not added yet"}
        </div>
      ),
    };

    if (userMeta?.role === "Super Admin" && searchType !== "Global") {
      mapObj["prisonName"] = e.prisonName;

    }

    if (userMeta?.role !== "Super Admin") {
      mapObj["status"] = e?.checkOutSting || e?.checkOutReason;
    }
    mapObj["Action"] =_(
      <div className="action-btns">
        {!props.noAction && 
        <button
          id={"approve-btn"}
          type="button"
          onClick={() =>  handleSelectedPrisoner(e)}
          className="btn btn-success waves-effect waves-light mx-1 tooltip"
        >
          <i className="icon-active"></i>
          <span>Approve</span>
          </button>
        }
        {props?.showOnlyVisitor &&
          <button
              id={"ok-btn"}
              type="button"
              onClick={() => handleQueue(e)}
              className="btn btn-prim waves-effect waves-light mx-1"
            >
              {'Print Ticket'}
            </button>
        }
        </div>
      
    )

    return mapObj;
  };

  const handleSearchVisibility = () => {
    setSearchVisibility((prevVisibility) => !prevVisibility);
  };

  const handleSearchButtonClick = (event) => {
    event.preventDefault();
    loadData();
  };


  const handleSelectedPrisoner = (p) => {
      setShowModal(true);
      setFetchedPrisoner(p);
  };

  const hideModal = () => {
    setShowModal(false);
  };


  // these both for visitor Modal only
  const handleQueue = async(e) => {
    try {
      const result = await getData(
        `/services/app/Visitors/GetCurrentVisit?visitId=${e?.visitId}&visitorStatus=${41}`
      );

      if (result && result.success) {
        const data = result?.result;
        if (data) {
          setShowQueueModal(true)
          setShowQueue(true)
          setPrintQueueObj({
              queueNo: e?.queueNumber,
              currentDate: moment(data?.visitDate).format("DD-MM-YYYY"),
              visitorsInfo: data?.visitorsInformation,
              prisonerInfo: {
                prisonName: e?.prisonName,
                fullName: e?.fullName,
                relationshipType: e?.relationshipType,
                relationshipName: e?.relationshipName
              }
          })
        }
      } else {
        console.error("something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const closePrintModal = () => {
    setShowQueueModal(false)
    setShowQueue(false)
    setPrintQueueObj({})
  }

  return (
    <>
    <VisitorModal
      visible={showQueueModal}
      onClose={closePrintModal}
      showQueue={showQueue}
      setShowQueue={setShowQueue}
      printQueueObjFromParent={printQueueObj}
    />
    
    {props.showDate && (
      <>
        <button className="btn btn-prim search-btn-prim" onClick={handleSearchVisibility}>
          Search By Date
        </button>
        {searchVisibility && (
          <div className="col-12 px-0">
            <form onSubmit={handleSearchButtonClick}>
              <div className="col-lg-4">
                <div className="inputs force-active">
                  <label>Date (تاریخ)</label>
                  <DatePicker
                    selected={getFormattedDate(datePayload?.datePicked)}
                    onChange={(datePicked) => {
                      const payload = {
                        ...datePayload,
                        datePicked: datePicked,
                      };
                      setDatePayload(payload);
                    }}
                    dateFormat="dd/MM/yyyy"
                    icon={"icon-operator"}
                    maxDate={new Date()}
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={5000}
                    showMonthDropdown
                  />
                </div>
              </div>
              <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
                <button
                  type="submit"
                  className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
                >
                  <i className="icon-search ml-2"></i> Search
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    )}

      <Modal
        show={showModal}
        onHide={hideModal}
        size="custom-xl "
        class="modal-custom-xl"
      >
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 className="modal-title" id="exampleModalgridLabel">
            Approve Request
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form className="bg-form">
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                   <ProfileCard
                     data={fetchedPrisoner}
                     tabTitle={"Approve"}
                     tabPos={""}
                     extra={fetchedPrisoner}
                   /> 
                </>
              )}
            </>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"cancel-btn"}
            className="btn btn-light"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button
            disabled={isdisabled}
            id={"confirm-btn"}
            className="btn btn-primary"
            onClick={()=>{props.isVisit ? handleVisitApprovelBtn(true) : handleApprovelBtn(true)}}
          >
            Confirm
          </button>
          {(props.isRelease || props.isVisit) && (
            <button
              disabled={isdisabled}
              id={"confirm-btn"}
              className="btn btn-danger"
              onClick={() => {props.isVisit ? handleVisitApprovelBtn(false) : handleApprovelBtn(false) }}
            >
              Reject
            </button>
          )}
        </Modal.Footer>
      </Modal>
      <div className="row gridjs">
        <div className="card custom-card animation-fade-grids custom-card-scroll ">
          <div className="row ">
            <div className="col">
            <div className="float-end">
              <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
              </div>
              <Grid
                data={transformDataForTableGrid(
                  prisoners?.map((e) => {
                    return gridDataMap(e);
                  })
                )}
                columns={getGridCols()}
                search={true}
                pagination={{
                  enabled: true,
                  limit: pageLimit,
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default RetrialApprovalPrisonerList;
