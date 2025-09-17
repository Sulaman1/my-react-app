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
import ProfilePic from "../../../../assets/images/users/1.jpg";
import { useSelector } from "react-redux";
import Print from "../../../admin/search/Print";
import DescriptionModal from "../../../../common/DescriptionModal";
import ScrollButtons from "../../../../common/ScrollButtons";
import ShowNoOfRecords from "../../../../common/ShowNoOfRecords";
import ViewRemissionPrisonerDetails from "./ViewRemissionPrisonerDetails";
import ViewRemissionsByPrisoner from "./ViewRemissionsByPrisoner";
import RemissionFilter from "./RemissionFilter";

const ManagePrisonersRemission = ({
  getURL,
  setActiveTab,
  tab = 1,
  type,
  activeTab,
  createUrl,
  isDeduct
}) => {
  const show = useSelector((state) => state.language.urdu);
  const [remissionType, setRemissionType] = useState([]);
  const userMeta = useSelector((state) => state.user);

  // Create dynamic column headers based on remissionType
  const createColHeaders = () => {
    const baseHeaders = {
      'Select': "",
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
    };

    if (remissionType.length) {
      remissionType.forEach(type => {
        if (type.remissionType) {
          baseHeaders[type.remissionType] = "";
        }
      });
    }



    // Add remaining columns
    baseHeaders[`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`] = "";

    if (userMeta?.role === "Super Admin") {
      baseHeaders[`Prison Name${show ? ' (جیل)' : ''}`] = "";
    }

    baseHeaders[`Actions${show ? ' (عملدرامد)' : ''}`] = "";

    return baseHeaders;
  };

  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [csvEntries, setCsvEntries] = useState([]);
  const [iconClassName, setIconClassName] = useState(type === 'Appeal' ? 'icon-menu-bar' : 'icon-convict');
  //const history = useHistory();
  const navigate = useNavigate();

  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const scrollContainerRef = useRef();
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const [remissionFields, setRemissionFields] = useState({});
  const [filterPayload, setFilterPayload] = useState({});
  const [modalPayload, setModalPayload] = useState([]);
  const [showRemissionModal, setShowRemissionModal] = useState(false);
  const [getSelectedPrisoners, setGetSelectedPrisoners] = useState([]);
  const [showViewRemissionsModal, setShowViewRemissionsModal] = useState(false);
  const [selectedPrisonerId, setSelectedPrisonerId] = useState(null);
  const isFirstRender = useRef(true);

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

  const renderViewRemissionsButton = (e) => {
    return _(
      <button
        id="view-remissions-btn"
        type="button"
        onClick={() => {
          setSelectedPrisonerId(e.id);
          setShowViewRemissionsModal(true);
        }}
        className="btn btn-info waves-effect waves-light mx-2 tooltip"
      >
        <i className="icon-show-password"></i>
        <span>View Remissions</span>
      </button>
    );
  };

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    loadData();
  }, [filterPayload]);



  const gridMapData = (entries) => {
    const filterdData = entries.map((e) => {
      const shortDescription =
        e?.underSection?.length > 50
          ? `${e.underSection.substring(0, 50)}...`
          : e.underSection;

      const obj = {
        selected: _(
          <input
            className="form-check-input"
            type="checkbox"
            style={{ width: '1.7rem', height: '1.7rem', marginLeft: '11px' }}
            checked={e.selected}
            disabled={e.isGuardian}
            onChange={(event) => {
              const checked = event.target.checked;
              e.selected = checked;
              if (checked) {
                selectPrisonerHandler(e);
              } else {
                unselectPrisonerHandler(e);
              }
            }}
          />
        ),
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
      };

      
        remissionType.forEach(type => {
          // Find the count for this remission type for this prisoner, update this one also
          const prisonerRemissionCount = e.remissionTypeCounts?.find(
            count => count.remissionTypeId === type.remissionTypeId && count.isDeductionRemission === isDeduct
          );
          obj[type.remissionType] = prisonerRemissionCount?.count ?? 0;
        });
      

      // Add remaining fields
      obj.lastModifiedBy = e.lastModifiedByUser;
      obj.Action = e.selected ? renderActionButtons(e) : renderViewRemissionsButton(e);

      if (userMeta?.role === "Super Admin") {
        obj.prisonName = e.prisonName;
      }

      return obj;
    });

    const data = transformDataForTableGrid(filterdData);
    return data;
  };

  const loadData = () => {
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
      maxResults: pageLimit,
      userId: parsedId,
      name: "",
      prisonId: 0,
      year: 0,
      prsNumber: 0,
      relationshipName: "",
      policeStationId: 0,
      firYear: 0,

      ...filterPayload
    };
    const extraPath = type === "released" ? "?checkedIn=true" : "";

    postData(`/services/app/PrisonerSearch/${getURL}${extraPath}`, obj)
      .then((result) => {
        if (result && result.success) {
          const data = result.result.data;
          setTotalNoOfRecords(result.result?.totalPrisoners);

          if (data.length > 0) {
            setEntries(data);
            setCsvEntries(data);
              const filteredRemissionTypes = data[0].remissionTypeCounts.filter(
                item => {
                  console.log(`Comparing: ${item.isDeductionRemission} === ${isDeduct}`, item.isDeductionRemission === isDeduct);
                  return item.isDeductionRemission === isDeduct;
                }
              );
              console.log('Filtered remissionTypes:', filteredRemissionTypes);
              setRemissionType(filteredRemissionTypes);
          } else {
            setEntries([]);
            setRemissionType([]);
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

  const selectPrisonerHandler = (entry) => {
    // [
    //   {
    //     "prisonerNumberId": 0,
    //     "prisonerId": 0,
    //     "remissionTypesId": 0,
    //     "remissionDate": "2025-05-14T15:50:20.894Z",
    //     "authorityTypeId": 0,
    //     "uploadFilePath": "string",
    //     "remarks": "string",
    //     "remissionDaysEarned": 0,
    //     "isIndividualRemission": true,
    //     "nextDueDate": "2025-05-14T15:50:20.894Z"
    //   }
    // ]
    const payload = {
      prisonerId: entry.id
    };
    setModalPayload((prevPayload) => [...prevPayload, payload]);
    const selectedPrisoners = [...getSelectedPrisoners, entry];
    setGetSelectedPrisoners(selectedPrisoners);
  };

  const unselectPrisonerHandler = (entry) => {
    setGetSelectedPrisoners((prevPayload) => prevPayload && prevPayload.filter((payload) => payload.prisonerId !== entry.id));
    setModalPayload((prevPayload) => prevPayload && prevPayload.filter((payload) => payload.prisonerId !== entry.id));
  };

  const submitRemission = () => {

    const updatedPayload = modalPayload.map(item => ({
      ...item,
      ...remissionFields,
      isDeductionRemission: isDeduct ? true : false
    }));

    postData(`/services/app/PrisonerRemission/${createUrl}`, updatedPayload)
      .then((result) => {
        if (result && result.result.isSuccessful) {
          swal('Successfully created remission.', '', 'success');
          setShowRemissionModal(false)
          setRemissionFields({});
          setModalPayload([]);
          setGetSelectedPrisoners([]);
          loadData()
        } else {
          swal(result.result.errorMessage, '', 'warning');
        }

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseM = () => {
    setShowRemissionModal(false)
    setRemissionFields({});
  }

  const handleApplyFilters = (filters) => {
    setFilterPayload(filters);
  };

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <ViewRemissionPrisonerDetails
        show={showRemissionModal}
        handleClose={handleCloseM}
        setRemissionFields={setRemissionFields}
        remissionFields={remissionFields}
        submitRemission={submitRemission}
        isDeduct={isDeduct}
      />

      <ViewRemissionsByPrisoner
        isDeduct={isDeduct}
        show={showViewRemissionsModal}
        handleClose={() => {
          setShowViewRemissionsModal(false);
          setSelectedPrisonerId(null);
        }}
        prisonerId={selectedPrisonerId}
      />

      <RemissionFilter onApplyFilters={handleApplyFilters} />
      <Print data={newCsv} filename={fileName} />
      <div className="wrapper">
        <ScrollButtons scrollContainerRef={scrollContainerRef} />
        <div className="card custom-card animation-fade-grids custom-card-scroll scrollable-container" ref={scrollContainerRef}>
          <div className="row">
            <div className="col">
              <div className="float-end">
                <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
              </div>
              {remissionType.length > 0 && (
                <Grid
                  ref={gridRef}
                  data={gridMapData(entries)}
                  columns={Object.keys(createColHeaders())}
                  search={true}
                  sort={true}
                  pagination={{
                    enabled: true,
                    limit: pageLimit,
                  }}
                />
              )}
            </div>
            <div className="btns just-center">
              {getSelectedPrisoners.length > 0 && (
                <button
                  id={"submit-btn"}
                  className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1 mt-2"
                  onClick={() => setShowRemissionModal(true)}
                >
                  {isDeduct ? "Add Deduction Remission" : "Add Remission"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default ManagePrisonersRemission;
