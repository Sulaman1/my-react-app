import { Grid, _ } from "gridjs-react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ProfilePic from "../../../assets/images/users/1.jpg";

import {
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import { baseImageUrl } from "../../../services/request";
import Print from "../../../components/admin/search/Print";
//import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function getHearingCols() {
    return Object.keys({
      "Profile pic (تصویر)": "",
      "Prisoner Number(قیدی نمبر)": "",
      "Year (سال)": "",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relationship Name":"",
      "CNIC (شناختی کارڈ)": "",
      "Court (شناختی کارڈ)": "",
      "judge (شناختی کارڈ)": "",
      "Remanding Court (شناختی کارڈ)": "",
      "Prison Name (جیل)": "",
      "Fir No (ایف آئی آر نمبر)": "",
      "Fir Year (ایف آئی آر سال) ": "",
      "Police Station (ایف آئی آر سال) ": "",
      "underSections (ایف آئی آر سال) ": "",
      "Last Hearing Date (اگلی پیشی)": "",
      "Next Hearing Date (اگلی پیشی)": "",
      "Special Guard (اگلی پیشی)": "",
      "check-In Vehicle Number (اگلی پیشی)": "",
      "check-Out Vehicle Number (اگلی پیشی)": "",
      "warrant Only (اگلی پیشی)": "",
      "Warrant (اگلی پیشی)": "",
      "Guards info (اگلی پیشی)": "",
    });
  }
function getPoliceOfficerHeader() {
    return Object.keys({
        "name (اگلی پیشی)": "",
      "Belt Number (تصویر)": "",
      "Mobile Number(قیدی نمبر)": "",
    });
  }

  
  const CPHistoryModal = ({loadedHearings, closeModal, modalIsVisible}) => {
    //const history = useHistory()
    const navigate = useNavigate();

      
    const [policeOfficerGrid,  setPoliceOfficerGrid] = useState(false);
    const [policeOfficerData, setPoliceOfficerData] = useState([]);

    const handlePoliceOfficer = (e) => {
        setPoliceOfficerGrid(true)
        setPoliceOfficerData(e)
      }
      
      const handleCloseModal = () => {
        closeModal();
        setPoliceOfficerGrid(false);
      }
      const gridHearingsDataMap = (entry) => {
        const mappedObj = {
          profile: _(
            <div className="profile-td profile-td-hover">
              <div className="pic-view">
                <img
                  src={entry?.prisoner?.frontPic ? baseImageUrl + entry?.prisoner?.frontPic : ProfilePic}
                  className="avatar-xs rounded-circle"
                  alt=""
                />
              </div>
              <img
                src={entry?.prisoner?.frontPic ? baseImageUrl + entry?.prisoner?.frontPic : ProfilePic}
                className="avatar-xs rounded-circle"
                alt=""
              />
            </div>
          ),
          prisonerNumber: entry?.prisoner?.prisonerNumber,
          year: entry?.prisoner?.year,
          fullName: entry?.prisoner?.fullName,
          relationshipType: entry?.prisoner?.relationshipType,
          relationshipName: entry?.prisoner?.relationshipName,
          cnic: entry?.prisoner?.cnic,
          court: entry?.court,
          judge: entry?.judge,
          remandingCourt: entry?.remandingCourt,
          prisonName: entry?.prisoner?.prisonName,
          firno: entry?.caseData?.firNo,
          firYear: entry.caseData?.firYear,
          policeStation: entry?.caseData?.policeStation,
          underSections: entry?.caseData?.underSections,
          lastDate: validateDate(entry?.lastHearingDate),
          nextDate: validateDate(entry?.nextHearingDate),
            specialGuard: entry?.specialGuard ? "Yes" : "No",
            checkInVehicleNumber: entry?.checkInVehicleNumber || "Yet to be assigned",
            checkOutVehicleNumber: entry?.checkOutVehicleNumber || "Yet to be assigned",
            warrantOnly: entry?.warrantOnly ? "Yes" : "No",
            warrant: _(
                <div className="profile-td profile-td-hover">
                  <a
                          href={entry?.hearingDocuments || ProfilePic}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                                entry?.hearingDocuments || ProfilePic,
                              "_blank"
                            );
                          }}
                        >
                  <img
                    src={entry?.hearingDocuments ? baseImageUrl + entry?.hearingDocuments : ProfilePic}
                    className="avatar-xs rounded-circle"
                    alt=""
                  />
                  </a>
                </div>
              ),
              Action: _(
                <div className="action-btns">
                  <button
                    type="button"
                    onClick={() => handlePoliceOfficer(entry)}
                    className="tooltip btn btn-prim waves-effect waves-light mx-1"
                  >
                    <i className="icon-show-password"></i>
                    <span>Guard Info</span>
                  </button>
                </div>
              ),
        };
    
        return mappedObj;
      };
      const gridPoliceOfficerDataMap = (entry) => {
        const mappedObj = {
            name: entry?.name,
            beltNumber: entry?.beltNumber,
            mobileNumber: entry?.mobileNumber,
        };
    
        return mappedObj;
      };

      const gridCheckoutPoliceOfficerDataMap = (entry) => {
        const mappedObj = {
            name: entry?.name,
            beltNumber: entry?.beltNumber,
            mobileNumber: entry?.mobileNumber,
        };
    
        return mappedObj;
      };

       const historyEntiresForCsv = loadedHearings && loadedHearings?.prisoners?.map(entry => {
        return {
            prisonerNumber: entry?.prisoner?.prisonerNumber,
          year: entry?.prisoner?.year,
          fullName: entry?.prisoner?.fullName,
          relationshipType: entry?.prisoner?.relationshipType,
          relationshipName: entry?.prisoner?.relationshipName,
          cnic: entry?.prisoner?.cnic,
          court: entry?.court,
          judge: entry?.judge,
          remandingCourt: entry?.remandingCourt,
          prisonName: entry?.prisoner?.prisonName,
          firno: entry?.caseData?.firNo,
          firYear: entry.caseData?.firYear,
          policeStation: entry?.caseData?.policeStation,
          underSections: entry?.caseData?.underSections,
          lastDate: validateDate(entry?.lastHearingDate),
          nextDate: validateDate(entry?.nextHearingDate),
            specialGuard: entry?.specialGuard ? "Yes" : "No",
            warrantOnly: entry?.warrantOnly ? "Yes" : "No",
          };
        
  });

  const PrintMarasla = async (e) => { 
    e.ignoreRedirect = true;
    navigate('/admin/print-marasla',{
			state: {
				stateParam: { e } 
			},
		});
  }

  return (
   <>
    <Modal show={modalIsVisible} onHide={handleCloseModal} size="xxl">
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            Hearing Details
          </h5>
        </Modal.Header>
        <Modal.Body>
          <Print data={historyEntiresForCsv} filename = {"hearings"}/>
          <button type="button" className="btn btn-info" style={{ width: "fit-content" }} onClick={() => { PrintMarasla(loadedHearings) }}>
                    <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
                  </button>
          <div className="card custom-card  custom-card-scroll animation-fade-grids ">
            <div className="row">
              <Grid
                data={transformDataForTableGrid(
                  loadedHearings && loadedHearings?.prisoners?.map((e) => gridHearingsDataMap(e))
                )}
                columns={getHearingCols()}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
          
         {policeOfficerGrid &&
         <>
         

          <div className="card custom-card animation-fade-grids custom-card-scroll">
            <div className="row">
                <h3 className="mt-2 mb-2 animation-fade">{policeOfficerData?.prisoner?.fullName || ""}'s Check-out police officer details</h3>
              <Grid
                data={transformDataForTableGrid(
                    policeOfficerData && policeOfficerData?.checkOutPoliceOfficers?.map((e) => gridCheckoutPoliceOfficerDataMap(e))
                )}
                columns={getPoliceOfficerHeader()}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>

          <div className="card custom-card animation-fade-grids custom-card-scroll ">
            <div className="row">
                <h3 className="mt-2 mb-2 animation-fade">{policeOfficerData?.prisoner?.fullName || ""}'s Check-in police officer details</h3>
              <Grid
                data={transformDataForTableGrid(
                    policeOfficerData && policeOfficerData?.checkInPoliceOfficers?.map((e) => gridPoliceOfficerDataMap(e))
                )}
                columns={getPoliceOfficerHeader()}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
          </>}
        </Modal.Body>
        <Modal.Footer>
        <button
            id="close-btn"
            className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={ handleCloseModal}
        >
            Close
        </button>
        </Modal.Footer>
      </Modal></>
  )
}

export default CPHistoryModal