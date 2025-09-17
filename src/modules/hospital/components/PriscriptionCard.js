import React, { useState } from 'react';
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, validateDate } from "../../../common/Helpers";
import { baseImageUrl } from '../../../services/request';
import ProfilePic from '../../../assets/images/users/1.png';
import Modal from 'react-bootstrap/Modal';

const PriscriptionCard = ({ caseInfo, navItem }) => {
  const [selectedAdmission, setSelectedAdmission] = useState([]);
  const [show, setShow] = useState(false);
  const [showDocImage, setShowDocImage] = useState(false)
	const [viewDoc, setViewDoc] = useState("")

  const closeDocImage = () => {
		setShowDocImage(!showDocImage)
	  }

  const download = async () => {
    const nameSplit = viewDoc.split("Admin");
    const duplicateName = nameSplit.pop(); 
    const link = document.createElement('a');
    link.href = viewDoc;
    const newString = duplicateName.replace(/\\/g, ''); 
    link.download = newString; 
    link.target ='_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  };

  const generateGridCols = () => {
    const gridCols = {
      "Admission Date": '',
      "Outside Hospital Admission": "",
      "Disease": '',
      "bloodPressure": '',
      "fbsRbs": '',
      "gcs": '',
      "investigations": '',
      "presentlyComplaining": '',
      "pulse": '',
      "specialDiet": '',
      "temperature": '',
      "treatment": '',
      "Health Improved": '',
      "Investigations": '',
    };
    if (navItem === 4) {
      gridCols['Refering Doctor'] = '';
    }
    else {
      gridCols['Medical Officer Name'] = '';
    }
    gridCols['Medicines'] = '';
    return gridCols;
  };

  const checkupEntries = {
    "Medicine": "",
    "Quantity Required": "",
    "Prescription Timming": "",

  };

  const gridHeaingsDataMap = (h) => {
    const mapObj = {
      admissionDate: validateDate(caseInfo.admissionDate),
      "outsideHospitalAdmissionDate": validateDate(caseInfo.outsideHospitalAdmissionDate),
      "disease": caseInfo.disease,
      "bloodPressure": h.bloodPressure,
      "fbsRbs": h.fbsRbs,
      "gcs": h.gcs,
      "investigations": h.investigations,
      "presentlyComplaining": h.presentlyComplaining,
      "pulse": h.pulse,
      "specialDiet": h.specialDiet,
      "temperature": h.temperature,
      "treatment": h.treatment,
      "healthImproved": h.healthImproved ? "Yes" : "No",
      'Investigations': _(
				<div
			className="profile-td profile-td-hover form-check-label"
    	onClick={() => {
				setShowDocImage(true),
				setViewDoc(h?.clinicalTest ? baseImageUrl + h?.clinicalTest : ProfilePic);
			}}
			>
			 <img
        onError={(ev) => {
          ev.target.src = ProfilePic;
        }}
        className="avatar-xs rounded-circle"
        src={h?.clinicalTest ? baseImageUrl + h?.clinicalTest : ProfilePic}
        width="50"
        alt="Clinical Test"
      />
			</div>
      ),
    };
    
    mapObj['medicalOfficerName'] = caseInfo.medicalOfficerName;

    mapObj['Actions'] = _(

      <div className="action-btns">
        <button
          id={"view-btn"}
          type="button"
          onClick={() => {
            setSelectedAdmission(h);
            setShow(!show)
          }}
          className="tooltip  btn  btn-prim waves-effect waves-light"
        >
          <i className="icon-show-password"></i>
        </button>
      </div>
    );
    return mapObj;
  };

  const gridMedicineDataMap = (h) => {
    const mapObj = {
      "medicine": h.medicine,
      "quantity Required": h.quantityRequired,
      "prescription Timming": h.prescriptionTimming,
    };
    return mapObj
  };

  return (
    <>
    <Modal centered show={showDocImage} size='lg' className='custom-card-scroll">'>
        <Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-td profile-td-hover">

            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              src={`${viewDoc
                }`}
              width="500"
              height="500"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
            Download
          </button>
          <button
            id={'cancel-btn'}
            className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
            onClick={closeDocImage}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <div className='table-main animation-fade'>
        <div className='custom-card-scroll'>
          <h4 className='third-heading db-heading mb-2'>Prescriptions Information</h4>
          <div id='pagination-list'>
            <Grid
              data={Array.isArray(caseInfo?.checkups) ? transformDataForTableGrid(
                caseInfo?.checkups?.map((h) => gridHeaingsDataMap(h))
              ) : []}
              columns={Object.keys(generateGridCols())}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
          </div>
        </div>
      </div>

      {show &&
        <div className='table-main animation-fade mt-4'>
          <div className=''>
            <h4 className='third-heading db-heading mb-2'>Medicine Information</h4>
            <div id='pagination-list'>
              <Grid
                data={Array.isArray(selectedAdmission?.priscriptions) ? transformDataForTableGrid(
                  selectedAdmission?.priscriptions?.map((h) => gridMedicineDataMap(h))
                ) : []}
                columns={Object.keys(checkupEntries)}
                search={true}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
        </div>}
    </>
  );
};

export default PriscriptionCard;
