import React, { useEffect, useState } from 'react';
import { getItemFromList } from '../../../common/Helpers';
import { Grid, _ } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import { Modal } from 'react-bootstrap';
import CheckUpCard from './CheckUpCard';
import moment from 'moment-mini';
import { getData } from '../../../services/request';

const HivInfo = ({ lookups, hospital }) => {


	const [admissions, setAdmissions] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedAdmission, setSelectedAdmission] = useState([]);
	const [vaccinationData, setVaccinationData] = useState([])

	const diseases = hospital?.medicalInfo?.diseases

	const newData = hospital?.medicalInfo

	const hospitalGridCols = () => {
		const admissionHeaders = {
			"hospital Treatment Type": '',
			"investigations": '',
			"known case of": '',
			"diagnosis": '',
			"presently Complaining": '',
			"specialDiet": 0,
			"treatment": 0,
			"treatment Number": 0,
			"disease": '',
			"Admitted By": '',
			"admission Date": '',
			"Discharge/Return Date": '',
		}
		admissionHeaders["Checkups"] = ""

		return Object.keys(admissionHeaders);
	}

	const getVaccinationData = async () => {
		try {
			const res = await getData(
				'/services/app/MedicalLkpt/GetAllVaccinationsLkpt',
				'',
				true,
			)
			const tempdata = res?.result.data?.map((item) => {
				return {
					label: item.name,
					value: item.id
				}
			})
			setVaccinationData(tempdata)

		} catch (error) {
			console.log(error)
		}
	}

	const gridDataMap = (e) => {
		return {
			vaccine: getItemFromList(vaccinationData, e.vaccinationLkptId),
			vaccineDate: moment(new Date(e.vaccinationDate).toDateString()).format('L'),
			secondvaccineDate: moment(new Date(e.vaccinationDate2).toDateString()).format('L'),
			boosterDoseDate: moment(new Date(e.vaccinationDate3).toDateString()).format('L'),
		};
	};

	useEffect(() => {

		loadHospitalAdmissions();
		getVaccinationData()
	}, []);

	const handleClose = () => {
		setShowModal(false);
	};

	const handleDetailsBtn = (h) => {
		setSelectedAdmission(h);
		setShowModal(true);
	}
	const loadHospitalAdmissions = () => {
		const hospitalAdmission = hospital?.hospitalAdmissions

		if (hospitalAdmission?.length > 0) {
			const data = hospitalAdmission.map((h) => ({
				hospitalAdmissionType: h.hospitalAdmissionType || '',
				investigations: h.investigations,
				"known case of": h.knownCaseOf,
				diagnosis: h.diagnosis,
				presentlyComplaining: h.presentlyComplaining,
				specialDiet: h.specialDiet,
				treatment: h.treatment,
				treatmentNumber: h.treatmentNumber,
				disease: getItemFromList(lookups['diseases'], h.diseaseId),
				admittedBy: h.admittedBy,
				admissionDate: validateDate(h.admissionDate),
				dischargeDate: validateDate(h.dischargeDate),
				checkkups: _(
					<div className='action-btns'>
						<button
							id={'view-more=details-btn'}
							type='button'
							onClick={() => {
								handleDetailsBtn(h);
							}}
							className='tooltip btn btn-prim waves-effect waves-light mx-1'
						>
							<i className='icon-show-password'></i>
							<span>View More</span>
						</button>
					</div>
				),
			
			})
			);
			setAdmissions(transformDataForTableGrid(data));

		}

	}
	return (
    <>
      <div className="table-main">
        <div className="table-hover">
          <h4 className="third-heading heading p-0">Medical Details</h4>
          <div id="pagination-list">
            <div class="d-flex just-space mx-n3">
              <ul class="list col-xl-12 list-group list-group-flush colm-2-tabel">
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Medical Issue: </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {newData?.medicalIssue || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Medical Treatment: </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {newData?.medicalTreatment || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">blood Group: </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {newData?.bloodGroup || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">
                        First Mark Of Identification:{" "}
                      </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {newData?.markOfIdentification || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">
                        Second Mark Of Identification:{" "}
                      </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {newData?.markOfIdentification2 || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Height (cm) : </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.height || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Drug Addicted: </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.addict ? "Yes" : "No" || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Drug Addiction Details: </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.drugAddictionDetails || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Weight (kg): </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.weight || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Fit For Labour : </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.fitForLabour  ? "Yes" : "No" || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Injury : </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">{newData?.injury || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </li>
               
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">diseases : </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {diseases?.length > 0
                            ? diseases
                                .map((e) => e.name)
                                .slice(0, 5)
                                .join(", ") +
                              (diseases.length > 10 ? ", ..." : "")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            {newData?.vaccinations?.length < 1 ? (
              <h4>
                {" "}
                <b>No Vaccinations Records Found</b>
              </h4>
            ) : (
              <Grid
                data={
                  Array.isArray(newData && newData?.vaccinations)
                    ? transformDataForTableGrid(
                        newData &&
                          newData?.vaccinations?.map((item) =>
                            gridDataMap(item)
                          )
                      )
                    : []
                }
                columns={[
                  "vaccination (ویکسین)",
                  "vaccination Date (  ویکسین کی تاریخ)",
                  "Second vaccination Date (  دوسرا ویکسین کی تاریخ)",
                  "Booster Dose Date (  بوسٹر ویکسین کی تاریخ)"
                ]}
                search={false}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            )}
			<br></br>
            <h4 className="third-heading heading p-0">Hospital Records:</h4>
            <div class="d-flex just-space mx-n3">
              <ul class="list col-xl-12 list-group list-group-flush colm-2-tabel">
                <li class="list-group-item">
                  <div class="d-flex align-items-center pagi-list">
                    <div class="flex-grow-1 overflow-hidden">
                      <h5 class="dynamic-key">Total Admissions : </h5>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                      <div>
                        <p class="dynamic-value">
                          {admissions?.length || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <Modal show={showModal} onHide={handleClose} size="xl">
              <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
                <h5 class="modal-title" id="exampleModalgridLabel">
                  Checkups
                </h5>
              </Modal.Header>
              <Modal.Body>
                <CheckUpCard caseInfo={selectedAdmission} />
              </Modal.Body>
              <Modal.Footer>
                <button
                  id={"cancel-btn"}
                  className="btn btn-prim my-4 lg-btn submit-prim  waves-effect waves-light mx-1"
                  onClick={handleClose}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            {admissions?.length < 1 ? (
              <h4>
                {" "}
                <b>No Hospital Records Found</b>
              </h4>
            ) : (
              <div className="row">
                <Grid
                  data={admissions}
                  columns={hospitalGridCols()}
                  search={true}
                  sort={true}
                  pagination={{
                    enabled: true,
                    limit: 10,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

};
export default HivInfo;
