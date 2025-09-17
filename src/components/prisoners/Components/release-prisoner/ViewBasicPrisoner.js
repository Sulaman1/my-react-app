import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
  transformDataForTableGrid,
  validateDate,
} from "../../../../common/Helpers";
import { useNavigate } from "react-router-dom";
import { baseImageUrl, postData } from "../../../../services/request";
import swal from "sweetalert";
import AllSearch from "../../../admin/search/AllSearch";
import ProfilePic from "../../../../../src/assets/images/users/1.jpg";
import { useSelector } from "react-redux";
import Print from "../../../admin/search/Print";
import ShowDocImage from "../../../../common/ShowDocImage";
import DescriptionModal from "../../../../common/DescriptionModal";
import ScrollButtons from "../../../../common/ScrollButtons";
import ShowNoOfRecords from "../../../../common/ShowNoOfRecords";

const ViewBasicPrisoner = ({
  getURL,
  btnText,
  setActiveTab,
  tab = 1,
  type,
  activeTab,
  isRemission,
  showAction,
  redButton
}) => {
  const show = useSelector((state) => state.language.urdu);
  const colHeaders = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: "",
    [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
    [`Year${show ? ' (سال)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
    'Relationship Type': "",
    'Relationship Name': "",
    [`Barrack${show ? ' (بیرک)' : ''}`]: "",
    [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
    [`Admission Date${show ? ' (داخلہ تاریخ)' : ''}`]: "2022-04-14T00:00:00+05:00",
    [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: "",
    [`Under Section${show ? ' (دفعات)' : ''}`]: "",
    [`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`]: "",
    [`Has Opposition${show ? ' (مخالفت ہے؟)' : ''}`]: "",
    [`Condemned${show ? ' (سزائے موت)' : ''}`]: "",
    [`Escaped${show ? ' (فرار)' : ''}`]: "",
    [`High Profile${show ? ' (اہم شخصیت)' : ''}`]: "",
    [`Multiple Case${show ? ' (متعدد مقدمات)' : ''}`]: "",
    [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",
  };
  const headers = [];
  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [csvEntries, setCsvEntries] = useState([]);
  const [iconClassName, setIconClassName] = useState(type === 'Appeal' ? 'icon-menu-bar' : 'icon-convict');
  const userMeta = useSelector((state) => state.user);
  //const history = useHistory();
  const navigate = useNavigate();

  const [showDocImage, setShowDocImage] = useState(false)
  const [viewDoc, setViewDoc] = useState("")
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const scrollContainerRef = useRef();
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const handleShowModal = (description, title) => {
    const descriptionArray = description.split(',').map(item => item.trim());
    const formattedDescription = descriptionArray.map((item, index) => (
      <span key={index} style={{ padding: "0.5rem" }}>
        ({index + 1}). {item}
        <br />
      </span>
    ));
    setModalContent(formattedDescription);
    setModalTitle("Under Sections");
    setShowDescModal(true);
  };

  // Helper functions
  const getShortDescription = (underSection) =>
    underSection?.length > 50 ? `${underSection.substring(0, 50)}...` : underSection;

  const renderProfileImage = (frontPic) => _(
    <div className="profile-td profile-td-hover">
      <div className="pic-view">
        <img
          onError={(ev) => { ev.target.src = ProfilePic }}
          className="avatar-xs rounded-circle"
          src={frontPic ? `${baseImageUrl}${frontPic}` : ProfilePic}
          width="50"
        />
      </div>
      <img
        onError={(ev) => { ev.target.src = ProfilePic }}
        className="avatar-xs rounded-circle"
        src={frontPic ? `${baseImageUrl}${frontPic}` : ProfilePic}
        width="50"
      />
    </div>
  );

  const renderUnderSection = (underSection) => {
    const shortDesc = getShortDescription(underSection);
    return _(
      <div
        className="cursor-pointer"
        onClick={() => {
          if (underSection?.length > 30) {
            handleShowModal(underSection, underSection);
          }
        }}
      >
        {shortDesc || "not added yet"}
      </div>
    );
  };

  const renderCondemend = (condemend) => _(
    <span style={{ color: condemend ? "red" : "inherit" }}>
      {condemend ? "Yes" : "No"}
    </span>
  );

  const renderReleaseDoc = (releaseDocs) => _(
    <div
      className="profile-td profile-td-hover form-check-label"
      onClick={() => handleDoc({ releaseDocs })}
    >
      <img
        onError={(ev) => { ev.target.src = ProfilePic }}
        className="avatar-xs rounded-circle"
        src={releaseDocs ? `${baseImageUrl}${releaseDocs}` : ProfilePic}
        width="50"
      />
    </div>
  );

  const renderActionButtons = (e) => {
    return _(
      <div className="action-btns">
        {e.appealInProgress && (
          <button
            id="view-more-btn"
            type="button"
            className="tooltip btn btn-danger waves-effect waves-light mx-1"
          >
            <i className="icon-glamping"></i>
            <span>Appeal In process</span>
          </button>
        )}
        {type !== "Appeal" && (
          <button
            id="add-btn"
            type="button"
            onClick={() => handleClick(e)}
            className="btn btn-success waves-effect waves-light mx-1 tooltip"
          >
            <i className={iconClassName}></i>
            <span>{btnText}</span>
          </button>
        )}
        {activeTab === 3 && (
          <button
            id="add-btn-two"
            type="button"
            onClick={() => handleAllDeatails(e)}
            className="btn btn-success waves-effect waves-light mx-1 tooltip"
          >
            <i className="icon-show-password"></i>
            <span>{btnText}</span>
          </button>
        )}
      </div>
    );
  };

  const renderDeclineButton = (e) => {
    return _(
      <div className="action-btns">
        {showAction && e.cases.length > 0 && (
          <button
            id="add-btn"
            type="button"
            onClick={() => declineRelease(e)}
            className={`btn waves-effect waves-light mx-1 tooltip ${redButton ? 'btn-danger' : 'btn-success'}`}
          >
            <i className="icon-new"></i>
            <span>Decline</span>
          </button>
        )}
      </div>
    );
  };

  const handleAllDeatails = (e) => {
    navigate(`/admin/prisoner/prisoner-details/${e.id}`,{
      state: {
        ignoreRedirect: true,
        openTab: 'appeals'
      },
    });
  };

  if (userMeta?.role === "Super Admin") {
    colHeaders[`Prison Name${show ? ' (جیل)' : ''}`] = "";
  }
  if (tab === 2) {
    colHeaders[`Release Document${show ? ' (رہائی کا دستاویز)' : ''}`] = "";
  }

  if (tab === 1 || showAction) {
    colHeaders[`Actions${show ? ' (عملدرامد)' : ''}`] = "";
  }
  headers.push(colHeaders);

  useEffect(() => {
    loadData();
  }, [pageLimit]);



  const getSuperAdminData = (e) => ({
    ...getCommonPrisonerData(e),
    prisonName: e.prisonName
  });

  const transformPrisonerData = (data, isTab1 = true) => {
    return data.map(e => {
      const baseData = userMeta?.role === "Super Admin"
        ? getSuperAdminData(e)
        : getCommonPrisonerData(e);

      if (isTab1) {
        return {
          ...baseData,
          Actions: renderActionButtons(e)
        };
      } else {
        return {
          ...baseData,
          releaseDoc: renderReleaseDoc(e.releaseDocs),
          Actions: renderDeclineButton(e)
        };
      }
    });
  };


  const getCommonPrisonerData = (e) => {
    const shortDescription = getShortDescription(e.underSection);

    const baseData = {
      profile: renderProfileImage(e.frontPic),
      prisonerNumber: e.prisonerNumber,
      year: e.year,
      fullName: e.fullName,
      relationshipType: e?.relationshipType,
      relationshipName: e.relationshipName,
      barrack: e.barrack || "not allocated yet",
      cnic: e.cnic,
      admissionDate: validateDate(e.admissionDate),
      firNo: e.firNo,
      underSection: renderUnderSection(e.underSection),
      checkOutSting: e?.checkOutSting || e?.checkOutReason,
      hasOpposition: e.hasOpposition ? "Yes" : "No",
      condemend: renderCondemend(e.condemend),
      isEscaped: e.isEscaped ? "Yes" : "No",
      highProfile: e.highProfile ? "Yes" : "No",
      hasManyCases: e.hasManyCases ? "Yes" : "No",
      lastModifiedBy: e.lastModifiedByUser
    };

    // if (!isRemission) {

    // }  

    return baseData;
  };



  const declineRelease = (p) => {
    swal({
      title: 'Are you sure you want to decline the release for this prisoner?',
      text: 'This action cannot be undone',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Decline it!'
    }).then(async willDelete => {
      if (willDelete) {
        const caseId = p.cases?.[0]?.id;
        postData(`/services/app/PrisonerRelease/CompleteCaseRelease?caseId=${caseId}&approved=false`, {})
          .then((res) => {
            if (res.success && res.result.isSuccessful) {
              loadData();
              swal("Successfully Declined!", "", "success");
            } else {
              swal(res.error.message, res.error.details, "warning");
            }
          })
          .catch((err) => {
            console.log(err);
            swal("Something went wrong!", "", "warning");
          });
      }
    });
  }

  const loadData = () => {
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
      underSection: 0,
      barrack: 0,
      checkOutSting: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };
    const extraPath = type === "released" ? "?checkedIn=true" : "";

    postData(`/services/app/PrisonerSearch/${getURL}${extraPath}`, obj)
      .then((result) => {
        if (result && result.success) {
          const data = result.result.data;
          setTotalNoOfRecords(result.result?.totalPrisoners);

          if (data.length > 0) {
            const transformedData = transformPrisonerData(data, tab === 1);
            setEntries(transformDataForTableGrid(transformedData));
            setCsvEntries(data);
          } else {
            setEntries([]);
          }
        } else {
          console.error("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error, `getting error while fetching API ${getURL} & fileName is {ViewBasicPrisoner.js}`);
      });
  };

  const handleClick = (e) => {
    sessionStorage.setItem(`${type}Prisoner`, JSON.stringify(e));
    setActiveTab(activeTab);
  };


  const handleSubmit = (payload) => {
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
    const extraPath = type === "released" ? `?checkedIn=${payload.checkedIn}` : "";

    postData(`/services/app/PrisonerSearch/${getURL}${extraPath}`, reqPayload)
      .then((result) => {
        if (result && result.result.isSuccessful) {
          const data = result.result.data;
          setTotalNoOfRecords(result.result?.totalPrisoners);

          if (data.length > 0) {
            const transformedData = transformPrisonerData(data, tab === 1);
            setEntries(transformDataForTableGrid(transformedData));
          } else {
            setEntries([]);
          }
        } else {
          swal(result.error.message, result.error.details, "warning");
        }
      })
      .catch((err) => {
        swal("Something went wrong!", err, "warning");
        console.log(err, `getting error while fetching API ${getURL} & fileName is {ViewBasicPrisoner.js}`);
      });
  };

  const newCsv = csvEntries.map((x) => {
    const csv = {
      "Prisoner Number": x.prisonerNumber,
      "Full Name": x.fullName,
      'Relationship Type': x?.relationshipType,
      "Relationship Name": x.relationshipName,
      Barrack: x.barrack,
      CNIC: x.cnic,
      "Admission Date": validateDate(x.admissionDate),
      "Fir No": x.firNo,
      "Under Section": x.underSection,
      "check-Out Status": x.checkOutSting,
      "Last Modified By": x.lastModifiedBy,
      "Appeal In Process": x.appealInProgress ? "Yes" : "No",
      "Condemned": x.condemend ? "Yes" : "No",
      "Escaped": x.isEscaped ? "Yes" : "No",
      "High Profile": x.highProfile ? "Yes" : "No",
      "Has Many Cases": x.hasManyCases ? "Yes" : "No",

    };
    if (userMeta?.role === "Super Admin") {
      csv["Prison Name"] = x.prisonName;
    }
    return csv;
  });
  let fileName = tab == 1 ? "Prisoners List" : "Release in Process List";

  const handleDoc = (e) => {
    if (e.releaseDocs) {
      setShowDocImage(true)
      setViewDoc(e.releaseDocs ? baseImageUrl + e.releaseDocs : ProfilePic)
    }
  }

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <AllSearch release type={type} handleSubmit={handleSubmit} />
      <Print data={newCsv} filename={fileName} />
      <div className="wrapper">
        <ScrollButtons scrollContainerRef={scrollContainerRef} />
        <div className="card custom-card animation-fade-grids custom-card-scroll scrollable-container" ref={scrollContainerRef}>
          <div className="row">
            <div className="col">
              <div className="float-end">
                <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
              </div>
              <Grid
                ref={gridRef}
                data={entries}
                columns={Object.keys(headers[0])}
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
      </div>
      <ShowDocImage showDocImage={showDocImage} viewDoc={viewDoc} setShowDocImage={setShowDocImage} />
    </>
  );

};

export default ViewBasicPrisoner;
