import React, { useState } from 'react';
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, validateDate } from "../../../common/Helpers";

const CheckUpCard = ({ caseInfo }) => {
  const [selectedAdmission, setSelectedAdmission] = useState([]);
  const [show, setShow] = useState(false);
  const checkupEntries = {
    "Admission Type": "",
    "Investigations ": "",
    "Presently Complaining ": "",
    "Special Diet ": "",
    "Treatment ": "",
    "Blood Pressure ": "",
    "Fbs Rbs": "",
    "Gcs ": "",
    "Pulse ": "",
    "Temperature ": "",
    "CheckUp Date ": "",
    "prescriptions": "",
  };
  const priscriptionsEntires = {
    "Medicine ": "",
    "Quantity Required ": "",
    "Quantity Issued ": "",
    "Date Issued ": "",
    "Prescription Timming ": "",
  };

  const gridHeaingsDataMap = (e) => {
    const mapObj = {
      "admissionType": caseInfo?.hospitalAdmissionType,
      "investigations ": e.investigations,
      "presently Complaining ": e.presentlyComplaining,
      "specialDiet ": e.specialDiet,
      "treatment ": e.treatment,
      "bloodPressure ": e.bloodPressure,
      "fbsRbs": e.fbsRbs,
      "gcs ": e.gcs,
      "pulse ": e.pulse,
      "temperature ": e.temperature,
      "checkUpDate ": validateDate(e.checkUpDate),
    };
    mapObj['Actions'] = _(

      <div className="action-btns">
        <button
          id={"view-btn"}
          type="button"
          onClick={() => {
            setSelectedAdmission(e);
            setShow(true)
          }}
          className="tooltip  btn  btn-prim waves-effect waves-light"
        >
          <i className="icon-show-password"></i>
        </button>
      </div>
    );
    return mapObj;
  };
  const gridPriscriptionsDataMap = (e) => {
    const mapObj = {
      "medicine ": e?.medicine,
      "quantityRequired ": e?.quantityRequired,
      "quantityIssued ": e?.quantityIssued,
      "dateIssued ": validateDate(e?.dateIssued),
      "prescriptionTimming ": e?.prescriptionTimming,
    };
    return mapObj;
  };
  return (
    <>
      <div className="table-main overflow-auto">
        <div className="">
          <h4 className="third-heading db-heading mb-2">
            CheckUps Information
          </h4>
          <div id="pagination-list">
            <Grid
              data={
                Array.isArray(caseInfo?.checkups)
                  ? transformDataForTableGrid(
                      caseInfo?.checkups?.map((entry) =>
                        gridHeaingsDataMap(entry)
                      )
                    )
                  : []
              }
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
            {show ? (
        <div className="mt-4">
          <h4 className="third-heading db-heading mb-2">
            Prescriptions Information
          </h4>
          <div id="pagination-list">
              <Grid
              data={
                Array.isArray(selectedAdmission?.priscription)
                  ? transformDataForTableGrid(
                      selectedAdmission?.priscription?.map((entry) =>
                      gridPriscriptionsDataMap(entry)
                      )
                    )
                  : []
              }
                columns={Object.keys(priscriptionsEntires)}
                search={true}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
          </div>
        </div>
            ) : (
              <p>No data available</p>
            )}
      </div>
    </>
  );
};

export default CheckUpCard;
