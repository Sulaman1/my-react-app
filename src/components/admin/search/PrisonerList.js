import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, _ } from "gridjs-react";
import {
  generateActionButtons,
  scrollToTop,
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import swal from "sweetalert";
import { baseImageUrl, deleteData } from "../../../services/request";
import ProfilePic from "../../../../src/assets/images/users/1.jpg";
import { useSelector } from "react-redux";
import Print from "./Print";
import ShowNoOfRecords from "../../../common/ShowNoOfRecords";
import DescriptionModal from "../../../common/DescriptionModal";
import ScrollButtons from "../../../common/ScrollButtons";
const PrisonerList = ({ searchData, searchType, totalCount, onPageLimitChange }) => {
  //const history = useHistory();
  const navigate = useNavigate();

	const [actionButton, setActionButton] = useState({edit: false, view: false});
	const {  user,  prisons } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
  const prisonName = prisons[0]?.prisonName;
  const userMeta = useSelector((state) => state.user);
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isAdmin = userMeta?.role === "Super Admin";
  const isDIG = userMeta?.role === "DIG Prisons";
  const [pageLimit, setPageLimit] = useState(10);
  const [showModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const show = useSelector((state) => state.language.urdu);
  const scrollContainerRef = useRef(null);
  const isInitialRender = useRef(true);

  // useEffect to handle page limit changes - similar to ViewAllocation.js
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (onPageLimitChange) {
      onPageLimitChange(pageLimit);
    }
  }, [pageLimit, onPageLimitChange]);

  const handleEditBtn = (item) => {
    sessionStorage.setItem("selectedPrisoner", JSON.stringify(item));
    sessionStorage.setItem("isEdit", true);
    sessionStorage.setItem("entryType", "fromSearch");
    navigate("/admin/prisoner/manage-prisoners",{
      state: {
        response: "success",
        ignoreRedirect: true,
        isEdit: true,
      },
    });
  };

  const handleShowModal = (description, title) => {
      const descriptionArray = description.split(',').map(item => item.trim());
      const formattedDescription = descriptionArray.map((item, index) => (
        <span key={index} style={{padding: "0.5rem"}}>
          ({index + 1}). {item}
          <br />
        </span>
      ));
      setModalContent(formattedDescription);
      setModalTitle("Under Sections");
      setShowDescModal(true);
    };
  
  useEffect(()=>{
      validateGloabalActionButtons(user, prisons, searchData, setActionButton);
  },[searchData])

  const handleDelBtn = (item) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete: " + item.fullName,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (willDelete) => {
      if (willDelete) {
        swal("Deleted!", "", "success").then((result) => {
          let url = deleteData(url + item.id)
            .then((res) => {
              if (res.success == true) {
              }
            })
            .catch((err) => {
              console.log("error while deleting employee or prisoner", err);
            });
        });
      }
    });
  };

  const handleDetails = (e) => {
    scrollToTop();
    sessionStorage.setItem("selectedPrisoner", JSON.stringify(e));
    navigate("/admin/prisoner/add-prisoner-detail",{
      state: {
        response: "success",
      },
    });
  };

  const handleAllDeatails = (e) => {
    navigate(`/admin/prisoner/prisoner-details/${e.id}`,{
      state: {
        ignoreRedirect: true,
        search: 'global'
      },
    });
  };

  const getGridCols = () => {
    const cols = {
      [`Profile Pic${show ? ' (تصویر)' : ''}`]: "",
      [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
      [`Year${show ? ' (سال)' : ''}`]: "",
      [`Full Name${show ? ' (نام)' : ''}`]: "",
      'Relationship Type': '',
			"Relationship Name": '',
      [`Barrack${show ? ' (بیرک)' : ''}`]: "",
      [`Admission Date${show ? ' (داخلہ تاریخ)' : ''}`]: "",
      [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
      [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: "",
      [`Condemned${show ? ' (سزائے موت)' : ''}`]: "",
      [`Escaped${show ? ' (فرار)' : ''}`]: "",
      [`High Profile${show ? ' (اہم شخصیت)' : ''}`]: "",
      [`Multiple Case${show ? ' (متعدد مقدمات)' : ''}`]: "",
      [`Under Sections${show ? ' (دفعات)' : ''}`]: "",
      [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",
    };

    if (searchType === "Global" || (isAdmin || isIG || isDIG)) {
      cols[`Prison Name${show ? ' (جیل)' : ''}`] = "";
    }

    if (userMeta?.role !== "Super Admin") {
      cols[`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`] = "";
    }

    cols[`Actions${show ? ' (عملدرامد)' : ''}`] = "";

    return Object.keys(cols);
  };

  const validateGloabalActionButtons = (data) => {
    const {  user, prisons } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
		const currentLoggedInUser = {user: user, prisons: prisons};
    let actionButtons = {};
		const prisonerData = data;
		// if edit is on same branch and prison
		const loggedInUserIsInPrison = currentLoggedInUser.prisons.find(item => item?.prisonName?.toLowerCase() === prisonerData?.prisonName?.toLowerCase());
		const prisonerCategoryIndex = currentLoggedInUser.user.roleNames.findIndex(item => item.toLowerCase().includes(prisonerData?.prisonerCategory?.toLowerCase()));
    if ( loggedInUserIsInPrison && Object.keys(loggedInUserIsInPrison).length && loggedInUserIsInPrison.prisonName && prisonerCategoryIndex > -1) {
			actionButtons = {
				edit: true,
				view: true,
			};
		} else if (loggedInUserIsInPrison && Object.keys(loggedInUserIsInPrison).length && loggedInUserIsInPrison.prisonName) {
			actionButtons = {
				edit: false,
				view: true,
			};
		}
    return actionButtons;
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
      admissionDate: validateDate(e.admissionDate),
      cnic: e.cnic,
      firNo: e.firNo,
      Condemned: _(
        <span style={{ color: e.condemend ? "red" : "inherit" }}>
          {e.condemend ? "Yes" : "No"}
        </span>
      ),
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
      lastModifiedBy: e.lastModifiedByUser,
    };

    if (searchType === "Global") {
      mapObj["prisonName"] = e.prisonName;
    }

    if (isIG || isDIG || isAdmin && searchType !== "Global") {
      mapObj["prisonName"] = e.prisonName;

    }

    if (userMeta?.role !== "Super Admin") {
      mapObj["status"] = e?.checkOutSting || e?.checkOutReason;
    }

    /*
      1. create a generic button 
      2. 
    */

    if (searchType !== "Global") {
      const actions = validateGloabalActionButtons(e);
      mapObj["Actions"] = _(generateActionButtons({events: {edit: handleEditBtn, add: handleDetails, del: handleDelBtn, view: handleAllDeatails}, data: e, key: "Search", userMeta}))
    } else {
     const actions = validateGloabalActionButtons(e);
      mapObj["Actions"] = _(
        <div className="action-btns">
          {e.appealInProgress == true && (
            <button
              id={"view-more-btn"}
              type="button"
              className="tooltip btn btn-danger waves-effect waves-light mx-1 "
            >
              <i className="icon-glamping"></i>
              <span>Appeal In process</span>
            </button>
          )}
          {actions.edit ? (
            <>
              <button
                id={"add-new-btn"}
                type="button"
                onClick={() => {
                  handleEditBtn(e);
                }}
                className="tooltip  btn btn-warning waves-effect waves-light"
              >
                <i className="icon-edit"></i>
                <span>Edit</span>
              </button>
              <button
                id={"add-more-details-btn"}
                type="button"
                onClick={() => {
                  handleDetails(e);
                }}
                className="tooltip btn btn-secondary waves-effect waves-light mx-1"
              >
                <i className="icon-add"></i>
                <span>Add Details</span>
              </button>
            </>
          ) : (
            ""
          )}
          {!e.prisonName && (
            <>
              <button
                id={"edit-new-details"}
                type="button"
                onClick={() => {
                  handleEditBtn(e);
                }}
                className="tooltip  btn btn-secondary waves-effect waves-light"
              >
                <i className="icon-add"></i>
                <span>Add</span>
              </button>
            </>
          )}
          <button
            id={"view-new-details"}
            className="tooltip btn btn-success waves-effect waves-light mx-1"
            type="button"
            onClick={() => handleAllDeatails(e)}
          >
            <i class="icon-show-password"></i>
            <span>View</span>
          </button>
        </div>
      );
    }

    return mapObj;
  };

  const newCsv = searchData?.map((x) => {
    const newData = {
      "Prisoner Number": x?.prisonerNumber,
      "Full Name": x?.fullName,
      'Relationship Type': x?.relationshipType,
			"Relationship Name": x?.relationshipName,
      Barrack: x?.barrack,
      "Admission Date": validateDate(x?.admissionDate),
      CNIC: x?.cnic,
      "Fir No": x?.firNo,
      "Under Section": x?.underSection,
      "Last Modified By": x?.lastModifiedByUser,
    };
    if (isAdmin || isIG || isDIG) {
      newData["prison Name"] = x?.prisonName;
    }
    return newData || [];
  });

  console.log(prisonName);

  return (
    <>
      <DescriptionModal
        show={showModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <div className="row gridjs">
        <Print data={newCsv} filename={"Prisoner Search"} />
        <div className="card custom-card animation-fade-grids custom-card-scroll ">
          <div className="row ">
            {/* <div className="float-end" style={{"position":"relative"}}>
              <label style={{"position":"absolute"}}>Total Prisoners: {totalCount}</label>
              <ShowNoOfRecords setPageLimit={setPageLimit} />
              </div> */}
            <div className="col">
          <div className="wrapper">
          <ScrollButtons scrollContainerRef={scrollContainerRef} />
          <div className="card custom-card animation-fade-grids scrollable-container" ref={scrollContainerRef}>
            <div className="row">
              <div className="col">
                <div className="float-end" style={{"position":"relative"}}>
                  <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalCount} />
                </div>
                <Grid
                  data={transformDataForTableGrid(
                    searchData?.map((e) => {
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrisonerList;