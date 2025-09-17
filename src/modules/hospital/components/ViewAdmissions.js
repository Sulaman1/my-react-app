import { useRef, useEffect, useState } from "react";
//import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Grid, _ } from "gridjs-react";
import swal from "sweetalert";
import ProfilePic from "../../../assets/images/users/1.jpg";
import {
  transformDataForTableGrid,
  formatDate,
  validateDate,
  cleanThePayload,
} from "../../../common/Helpers";
import AllSearch from "../../../components/admin/search/AllSearch";
import { postData, baseImageUrl } from "../../../services/request";
import Print from "../../../components/admin/search/Print";
import { Modal } from "react-bootstrap";
import PriscriptionCard from "./PriscriptionCard";

import { setLoaderOff, setLoaderOn } from "../../../store/loader";
import { useDispatch, useSelector } from "react-redux";

import DescriptionModal from "../../../common/DescriptionModal";
import ShowNoOfRecords from "../../../common/ShowNoOfRecords";

const ViewAdmissions = ({
  type,
  getURL,
  btnTitle,
  setActiveTab,
  redirectTab,
  navItem,
  item,
  icon,
}) => {
  const [entries, setEntries] = useState([]);
  const [newUserData, setNewUserData] = useState([]);
  const gridRef = useRef(null);
  const today = new Date();
  const todayDate = formatDate(today);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState([]);
  const [expanded, setExpanded] = useState(false);
  //const history = useHistory();
  const navigate = useNavigate();

  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  const userMeta = useSelector((state) => state.user);
  const isDig = userMeta?.role === "DIG Prisons";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isSp = userMeta?.role === "Prison Superintendent";


  const show = useSelector((state) => state.language.urdu);


  const handleShowDescModal = (description, title) => {
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


  useEffect(() => {
    loadGridData();
  }, [pageLimit]);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleDetailsBtn = (entry) => {
    console.log(entry, "entry")
    setSelectedAdmission({ ...entry.hopitalAdmission, prisonerPhoto: entry.frontPic });
    setShowModal(true);
  };

  const generateGridCols = (pos) => {
    const entries = {};

    if (pos === 1) {
      entries["profile Pic"] = "";
      entries[`Full Name${show ? " (نام)" : ""}`] = "";
      entries['Relationship Type'] = "";
      entries['Relationship Name'] = "";
      entries[`Year${show ? " (سال)" : ""}`] = "";
      entries[`Category${show ? " (قیدی کی درجہ بندی)" : ""}`] = "";
      entries[`Under Section${show ? " (دفعات)" : ""}`] = "";
      entries[`Check-out Status${show ? " (رہائی کی حیثیت)" : ""}`] = "";
      entries[`Has Opposition${show ? " (مخالفت ہے؟)" : ""}`] = "";
      entries[`condemend${show ? " (سزائے موت)" : ""}`] = "";
      entries[`Escaped${show ? " (فرار)" : ""}`] = "";
      entries[`Last Modified By${show ? " (آخری ترمیم کرنے والا)" : ""}`] = "";
      entries[`Actions${show ? " (کارروائیاں)" : ""}`] = "";
    } else if (pos === 3) {
      entries["profile Pic"] = "";
      entries[`Full Name${show ? " (نام)" : ""}`] = "";
      entries['Relationship Type'] = "";
      entries['Relationship Name'] = "";
      entries[`Year${show ? " (سال)" : ""}`] = "";
      entries[`Category${show ? " (قیدی کی درجہ بندی)" : ""}`] = "";
      entries[`Under Section${show ? " (دفعات)" : ""}`] = "";
      entries[`Last Modified By${show ? " (آخری ترمیم کرنے والا)" : ""}`] = "";
      entries[`Actions${show ? " (کارروائیاں)" : ""}`] = "";
    } else if (pos === 2) {
      entries["profile Pic"] = "";
      entries[`Full Name${show ? " (نام)" : ""}`] = "";
      entries['Relationship Type'] = "";
      entries['Relationship Name'] = "";
      entries[`Year${show ? " (سال)" : ""}`] = "";
      entries[`Category${show ? " (قیدی کی درجہ بندی)" : ""}`] = "";
      entries[`Under Section${show ? " (دفعات)" : ""}`] = "";
      entries[`Last Modified By${show ? " (آخری ترمیم کرنے والا)" : ""}`] = "";
      entries[`Actions${show ? " (کارروائیاں)" : ""}`] = "";
    } else if (pos === 4) {
      entries["profile Pic"] = "";
      entries[`Full Name${show ? " (نام)" : ""}`] = "";
      entries['Relationship Type'] = "";
      entries['Relationship Name'] = "";
      entries[`Year${show ? " (سال)" : ""}`] = "";
      entries[`Category${show ? " (قیدی کی درجہ بندی)" : ""}`] = "";
      entries[`Under Section${show ? " (دفعات)" : ""}`] = "";
      entries[`Last Modified By${show ? " (آخری ترمیم کرنے والا)" : ""}`] = "";
      entries[`Hospital${show ? " (ہسپتال)" : ""}`] = "";
      entries[`Actions${show ? " (کارروائیاں)" : ""}`] = "";
    } else {
      entries["profile Pic"] = "";
      entries[`Full Name${show ? " (نام)" : ""}`] = "";
      entries['Relationship Type'] = "";
      entries['Relationship Name'] = "";
      entries[`Year${show ? " (سال)" : ""}`] = "";
      entries[`Category${show ? " (قیدی کی درجہ بندی)" : ""}`] = "";
      entries[`Under Section${show ? " (دفعات)" : ""}`] = "";
      entries[`Date of admission${show ? " (داخلہ کی تاریخ)" : ""}`] = "";
      entries[`Admitted by${show ? " (داخل کرنے والا)" : ""}`] = "";
    }

    return Object.keys(entries);
  };
  const loadGridData = async () => {

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
      relationshipTypeId: '',
      genderId: 0,
      policeStationId: 0,
      firYear: 0,
      underSection: 0,
      barrack: 0,
      checkOutSting: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };

    try {


      const extraPath =
        type === "hospital" ? "?CheckedIn=false" : `?AdmissionDate=${""}`;

      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${type = "offence" ? "" : extraPath}`,
        obj
      );
      if (result && result.success) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        if (data.length > 0) {
          setEntries(data);
          setNewUserData(data);
        } else {
          setEntries([]);
        }
      } else {
        swal(
          result.error?.message || "An error occured",
          result.error?.details || "",
          "warning"
        );
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    } finally {

    }
  };

  const handleClick = async (prisonerEntry) => {
    let entry = item || "prisonerAdmissionEntry";
    sessionStorage.setItem(entry, JSON.stringify(prisonerEntry));
    setActiveTab(redirectTab);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const gridDataMap = (entry) => {
    const mapObj = {};

    const shortDescription =
      entry?.underSection?.length > 50
        ? `${entry.underSection.substring(0, 50)}...`
        : entry.underSection;
    if (navItem === 1) {
      (mapObj["profile"] = _(
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
      )),
        (mapObj["fullName"] = entry.fullName),
        (mapObj["relationshipType"] = entry?.relationshipType),
        (mapObj["relationshipName"] = entry.relationshipName),
        (mapObj["year"] = entry.year),
        (mapObj["prisonerCategory"] = entry.prisonerNumber),
        (mapObj['underSection'] = _(
          <div className="cursor-pointer"
            onClick={() => {
              if (entry?.underSection?.length > 30) {
                handleShowDescModal(entry?.underSection, entry?.underSection)
              }
            }}
          >
            {shortDescription || "not added yet"}
          </div>
        )
        ),
        (mapObj["check-out status"] = entry?.checkOutSting || entry?.checkOutReason),
        (mapObj["Has Opposition"] = entry.hasOpposition ? "Yes" : "No"),
        mapObj["condemend"] = _(
          <span style={{ color: entry.condemend ? "red" : "inherit" }}>
            {entry.condemend ? "Yes" : "No"}
          </span>
        ),
        (mapObj["isEscaped"] = entry.isEscaped ? "Yes" : "No"),
        (mapObj["lastModifiedBy"] = entry?.lastModifiedByUser),
        (mapObj["Actions"] = _(
          <div className="action-btns">
            {entry.appealInProgress == true && (
              <button
                id={"view-more-btn"}
                type="button"
                className="tooltip btn btn-danger waves-effect waves-light mx-1 "
              >
                <i className="icon-glamping"></i>
                <span>Appeal In process</span>
              </button>
            )}
            {/* {!isIG && !isDig && !isSp && ( */}
            <button
              id={"add-btn"}
              type="button"
              onClick={() => handleClick(entry)}
              className="btn btn-prim p-2 tooltip"
            >
              <i className={icon || "icon-add"}></i>{" "}
              <span>{btnTitle || "Add"}</span>
            </button>

            {/* )} */}
          </div>
        ));
    } else if (navItem === 3) {
      (mapObj["profile"] = _(
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
      )),
        (mapObj["fullName"] = entry.fullName),
        (mapObj["relationshipType"] = entry?.relationshipType),
        (mapObj["relationshipName"] = entry.relationshipName),
        (mapObj["year"] = entry.year),
        (mapObj["prisonerCategory"] = entry.prisonerCategory),
        (mapObj['underSection'] = _(
          <div className="cursor-pointer"
            onClick={() => {
              if (entry?.underSection?.length > 30) {
                handleShowDescModal(entry?.underSection, entry?.underSection)
              }
            }}
          >
            {shortDescription || "not added yet"}
          </div>
        )
        ),
        (mapObj["lastModifiedBy"] = entry?.lastModifiedByUser),
        (mapObj["Actions"] = _(
          <div className="action-btns">
            {entry.appealInProgress == true && (
              <button
                id={"view-more-btn"}
                type="button"
                className="tooltip btn btn-danger waves-effect waves-light mx-1 "
              >
                <i className="icon-glamping"></i>
                <span>Appeal In process</span>
              </button>
            )}
            {!isIG && !isDig && !isSp && (
              <button
                id={"add-btn"}
                type="button"
                onClick={() => handleClick(entry)}
                className="btn btn-success p-2 tooltip"
              >
                <i className={icon || "icon-add"}></i>{" "}
                <span>{btnTitle || "Add"}</span>
              </button>
            )}
            <button
              id={"add-btn"}
              type="button"
              onClick={() => handleDetailsBtn(entry)}
              className="btn btn-prim p-2 tooltip"
            >
              <i className={"icon-show-password"}></i>{" "}
              <span>{"Prescribed Medicine"}</span>
            </button>
          </div>
        ));

    } else if (navItem === 2 || navItem === 4) {
      (mapObj["profile"] = _(
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
      )),
        (mapObj["fullName"] = entry.fullName),
        (mapObj["relationshipType"] = entry?.relationshipType),
        (mapObj["relationshipName"] = entry.relationshipName),
        (mapObj["year"] = entry.year),
        (mapObj["prisonerCategory"] = entry.prisonerCategory),
        (mapObj['underSection'] = _(
          <div className="cursor-pointer"
            onClick={() => {
              if (entry?.underSection?.length > 30) {
                handleShowDescModal(entry?.underSection, entry?.underSection)
              }
            }}
          >
            {shortDescription || "not added yet"}
          </div>
        )
        ),
        (mapObj["lastModifiedBy"] = entry?.lastModifiedByUser),
        (mapObj["Hospital"] = entry?.hopitalAdmission?.hospital || " "),
        (mapObj["Actions"] = _(
          <div className="action-btns">
            {entry.appealInProgress == true && (
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
              id={"add-btn"}
              type="button"
              onClick={() => handleDetailsBtn(entry)}
              className="btn btn-prim p-2 tooltip"
            >
              <i className={"icon-show-password"}></i>{" "}
              <span>{"View prescription"}</span>
            </button>
          </div>
        ));
      if (navItem === 2) {
        delete mapObj.Hospital;
      }
    }
    if (isIG || isDig || isSp) {
      if (Array.isArray(mapObj.Actions)) {
        mapObj.Actions = mapObj.Actions.filter((action) => action.id !== "add-btn");
      }
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

    console.log("SEARCH PAYLOAD >>>", reqPayload);

    const cleanedPayload = cleanThePayload(reqPayload);
    try {

      const datePicker = formatDate(payload.datePicked);

      const extraPath =
        type === "hospital"
          ? `?CheckedIn=${payload.checkedIn}`
          : `?AdmissionDate=${datePicker || " "}`;
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${extraPath}`,
        cleanedPayload
      );
      if (result && result.result?.isSuccessful) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        console.log("SEARCH RESULTS", data);
        setEntries(data);
      } else {
        swal(
          result.error?.message || "An error occured",
          result.error?.details || "",
          "warning"
        );
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    } finally {

    }
  };

  const newData = newUserData.map((x) => {
    if (navItem == 1) {
      return {
        "Full Name": x.fullName,
        "Relationship Type": x?.relationshipType,
        "Relationship Name": x.relationshipName,
        "Under Section": x.underSection,
      };
    } else if (navItem == 2 || navItem == 3 || navItem == 4) {
      return {
        "Full Name": x.fullName,
        "Relationship Type": x?.relationshipType,
        "Relationship Name": x.relationshipName,
        "Under Section": x.underSection,
        "Date of admission": validateDate(x.hospitalAdmissionDate),
        "Admitted by": x.medicalOfficerName,
      };
    }
  });

  let file =
    navItem == 1
      ? "Prisoners"
      : navItem == 2
        ? "OPD Treatment"
        : navItem == 3
          ? "IPD Treatment"
          : navItem == 4
            ? "Outside Hospital"
            : "prisoners";


  const printPrescription = async (e) => {
    e.ignoreRedirect = true;
    navigate('/admin/print-prescription',{
      state: {
        stateParam: { e, navItem }
      },
    });
  }

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <AllSearch
        type={type}
        handleSubmit={handleSubmit}
        dateType={"hospitalAdmission"}
        todayDate={todayDate}
        tabPosition={navItem}
      />
      <Print data={newData} filename={file} />

      <Modal show={showModal} onHide={handleClose} size="xxl">
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            First Prescription
          </h5>
        </Modal.Header>
        <Modal.Body>
          <PriscriptionCard caseInfo={selectedAdmission} navItem={navItem} />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-info" style={{ width: "fit-content" }} onClick={() => { printPrescription(selectedAdmission) }}>
            <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
          </button>
          <button
            id={"cancel-btn"}
            className="btn btn-prim my-4 lg-btn submit-prim  waves-effect waves-light mx-1"
            onClick={handleClose}
          >
            Close
          </button>


        </Modal.Footer>
      </Modal>

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
              columns={generateGridCols(navItem)}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: pageLimit,
              }}
              render={(row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={`row-${rowIndex}-cell-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAdmissions;