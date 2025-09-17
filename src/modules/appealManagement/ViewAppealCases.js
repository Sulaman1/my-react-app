import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
  transformDataForTableGrid,
  validateDate,
} from "../../common/Helpers";
import { useNavigate } from "react-router-dom";
import { baseImageUrl, postData } from "../../services/request";
import swal from "sweetalert";
import AllSearch from "../../components/admin/search/AllSearch";
import ProfilePic from "../../../src/assets/images/users/1.jpg";
import { useSelector } from "react-redux";
import Print from "../../components/admin/search/Print";
import ShowDocImage from "../../common/ShowDocImage";
import DescriptionModal from "../../common/DescriptionModal";

const ViewAppealCases = ({
  getURL,
  tab = 1,
  type
}) => {
  const show = useSelector((state) => state.language.urdu);
  

  const colHeaders = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: "",
    [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
    'Relationship Type': "",
    [`Relationship Name`]: "",
  };
  const headers = [];
  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [csvEntries, setCsvEntries] = useState([]);
  const userMeta = useSelector((state) => state.user);
  //const history = useHistory();
  const navigate = useNavigate();

  const [showDocImage, setShowDocImage] = useState(false)
  const [viewDoc, setViewDoc] = useState("")
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";
	const isSp = userMeta?.role === "Prison Superintendent";

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

  const handleAllDeatails = (e) => {
    navigate(`/admin/prisoner/prisoner-details/${e.id}`,{
      state: {
        ignoreRedirect: true,
        openTab: 'appeals'
      },
    });
  };

  colHeaders[`CNIC${show ? ' (شناختی کارڈ)' : ''}`] = "";
  colHeaders[`Admission Date${show ? ' (داخلہ کی تاریخ)' : ''}`] = "";
  colHeaders[`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`] = "";
  colHeaders[`Under Section${show ? ' (دفعات)' : ''}`] = "";
  colHeaders[`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`] = "";
  colHeaders[`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`] = "";
  colHeaders[`Appeal Type${show ? ' (اپیل قسم)' : ''}`] = "";
  colHeaders[`Appeal No${show ? ' (اپیل نمبر)' : ''}`] = "";
  colHeaders[`Prefernce${show ? ' (ترجیح)' : ''}`] = "";
  colHeaders[`Appeal Remarks${show ? ' (اپیل ریمارکس)' : ''}`] = "";
  colHeaders[`Actions${show ? ' (عملدرامد)' : ''}`] = "";

  headers.push(colHeaders);

  useEffect(() => {
    loadData();
  }, []);



  const loadData = () => {


    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
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
          setEntries(data);
          setCsvEntries(data);
        } else {
          console.error("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error, 'getting error while fetching API ' + getURL + ' & fileName is {ViewBasicPrisoner.js}');
      });
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
      maxResults: payload?.maxResults || 10
    };
    const extraPath =
      type === "released" ? `?checkedIn=${payload.checkedIn}` : "";
    postData(`/services/app/PrisonerSearch/${getURL}${extraPath}`, reqPayload)
      .then((result) => {

        if (result && result.result.isSuccessful) {
          const data = result.result.data;
          setEntries(data);
          setCsvEntries(data);
        } else {

          swal(result.error.message, result.error.details, "warning");
        }
      })
      .catch((err) => {
        swal("Something went wrong!", err, "warning");
        console.log(err, 'getting error while fetching API ' + getURL + ' & fileName is {ViewBasicPrisoner.js}');

      });
  };

  const newCsv = csvEntries.map((x) => {
    const csv = {
      "Prisoner Number": x.prisonerNumber,
      "Full Name": x.fullName,
      'Relation Type': x?.relationshipType,
      "Relation Name": x.relationshipName,
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



  const gridMapData = (e) => {
    const shortDescription =
      e?.underSection?.length > 50
        ? `${e.underSection.substring(0, 50)}...`
        : e.underSection;
    let obj = {};
    obj["profile"] = _(
      <div className="profile-td profile-td-hover">
        <div className="pic-view">
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.frontPic
              ? baseImageUrl + e.frontPic
              : ProfilePic
              }`}
            width="50"
          />
        </div>
        <img
          onError={(ev) => {
            ev.target.src = ProfilePic;
          }}
          className="avatar-xs rounded-circle "
          src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
            }`}
          width="50"
        />
      </div>
    );
    obj["prisonerNumber"] = e.prisonerNumber;
    obj["fullName"] = e.fullName;
    obj["relationshipType"] = e.relationshipType;
    obj["relationshipName"] = e.relationshipName;
    obj["cnic"] = e.cnic;
    obj["admissionDate"] = validateDate(e.admissionDate);
    obj["firNo"] = e.firNo;
    obj["underSection"] = _(
      <div className="cursor-pointer"

        onClick={() => {
          if (e.underSection?.length > 30) {
            handleShowModal(e.underSection, e.underSection)
          }
        }}
      >
        {shortDescription || "not added yet"}
      </div>
    );
    obj["checkOutSting"] = e?.checkOutSting || e?.checkOutReason;
    obj["lastModifiedBy"] = e.lastModifiedByUser;
    obj['appealType'] = e?.cases?.length > 0 ? e.cases[0].currentAppeal?.type : "";
    obj['appealNo'] = e?.cases?.length > 0 ? e.cases[0].currentAppeal?.appealNumber : "";
    obj['preference'] = e?.cases?.length > 0 ? e.cases[0].currentAppeal?.preference : "";
    obj['remarks'] = e?.cases?.length > 0 ? e.cases[0].currentAppeal?.remarks : "";
    obj["Actions"] = _(
      <>
        {!isDig && !isIG && !isSp &&
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
            <button
              id={"add-btn-two"}
              type="button"
              onClick={() => handleAllDeatails(e)}
              className="btn btn-success waves-effect waves-light mx-1 tooltip"
            >
              <i className="icon-show-password" ></i>
              <span>View Details</span>
            </button>
            <button className='tooltip btn btn-prim  waves-effect waves-light' type='button' onClick={() => handleDeclineAppeal(e)}>
              <i className='icon-toolkit'></i>
              <span>Deny Appeal</span>
            </button>
            <button className='btn btn-success waves-effect waves-light mx-1 tooltip' type='button' onClick={() => handleApproveAppeal(e)}>
              <i className='icon-toolkit'></i>
              <span>Approve Appeal</span>
            </button>

          </div>

        }

      </>
    );
    return obj;
  }

  const handleDeclineAppeal = (prionser) => {
    const appealId = prionser?.cases?.[0].currentAppeal?.id;
    swal({
      title: 'Are you sure?',
      text: 'You want to Decline the Appeal of this prisoner',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Declined it!',
      cancelButtonText: 'No, cancel!',
    }).then(async willDelete => {
      if (willDelete) {
        try {
          const declineResponse = await postData(`/services/app/PrisonerRelease/FinishAppealInCase?appealId=${appealId}&approved=false`, {});
          if (declineResponse?.success) {  
            swal("Prisoner Appeal has been declined", "", "success");
          loadData();
          }else{
            swal("Error", declineResponse.error.message || "Something went wrong", "error");
          }
        } catch (error) {
          swal("Error", error.message || "Something went wrong", "error");

        }
      }
    });
  }

  const handleApproveAppeal = async (prionser) => {
    
    const appealId = prionser?.cases?.[0].currentAppeal?.id;
    const approvedResponse = await postData(`/services/app/PrisonerRelease/FinishAppealInCase?appealId=${appealId}&approved=true`, {});
    if (approvedResponse?.success) {
      swal("Prisoner Appeal has been approved", "", "success");
      loadData();
    } else {
      swal("Error", approvedResponse.error.message || "Something went wrong", "error");
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
      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <div className="row">
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(entries.map((ele) =>
              gridMapData(ele, true))
            )}
            columns={Object.keys(headers[0])}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      </div>
      <ShowDocImage showDocImage={showDocImage} viewDoc={viewDoc} setShowDocImage={setShowDocImage} />
    </>
  );

};

export default ViewAppealCases;
