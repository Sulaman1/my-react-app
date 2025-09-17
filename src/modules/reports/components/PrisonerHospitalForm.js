import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";

const PrisonerHospitalForm = ({ type, formPayload, setFormPayload }) => {
  const [lookup, setLookup] = useState();
  const [dischargeDateRange, setDischargeDateRange] = useState(() => {
    const startDate = formPayload?.hospitalAdmissions?.dischargeDate?.start
      ? new Date(formPayload.hospitalAdmissions.dischargeDate.start)
      : null;
    const endDate = formPayload?.hospitalAdmissions?.dischargeDate?.end
      ? new Date(formPayload.hospitalAdmissions.dischargeDate.end)
      : null;
    return [startDate, endDate];
  });
  const [startDischargeDate, endDischargeDate] = dischargeDateRange;
  const [checkup, setCheckupDateRange] = useState(() => {
    const startDate = formPayload?.hospitalAdmissions?.checkUpDate?.start
      ? new Date(formPayload.hospitalAdmissions.checkUpDate.start)
      : null;
    const endDate = formPayload?.hospitalAdmissions?.checkUpDate?.end
      ? new Date(formPayload.hospitalAdmissions.checkUpDate.end)
      : null;
    return [startDate, endDate];
  });
  const [startCheckupDate, endCheckupDate] = checkup;
  const [admissionDateRange, setAdmissionDateRange] = useState(() => {
    const startDate = formPayload?.hospitalAdmissions?.admissionDate?.start
      ? new Date(formPayload.hospitalAdmissions.admissionDate.start)
      : null;
    const endDate = formPayload?.hospitalAdmissions?.admissionDate?.end
      ? new Date(formPayload.hospitalAdmissions.admissionDate.end)
      : null;
    return [startDate, endDate];
  });
  const [admissionStartDate, admissionEndDate] = admissionDateRange;
	const [open, setOpen] = useState(true);
	const [isOutside, setIsOutside] = useState('');
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	const [lastTreatmentNo, setLastTreatmentNo] = useState(0);

  useEffect(() => {
    fetchLookUps();

  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
     
      const docObj = newLookups?.doctors?.map((e) => {
        return {
          label: e.userName,
          value: e.userId,
        };
      });
      lookup["doctors"] = docObj;

      const medicineObj = transformData(newLookups?.medicine);
      lookup["medicine"] = medicineObj;
     
      const hospitalAdmissionTypeObj = transformData(newLookups?.hospitalAdmissionTypes);
      lookup["hospitalAdmissionType"] = hospitalAdmissionTypeObj;

      const diseasesObj = transformData(newLookups?.disease);
      lookup["diseases"] = diseasesObj;

      const outHospitalsObj = transformData(newLookups?.outsideHospitals);
      lookup["hospitals"] = outHospitalsObj;
			
      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  return (
    <div className="row">
      <h3
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          className="master-report-headings"
        >
          {" "}
          <span className="d-flex justify-content-between w-100">
          Prisoner Hospital Admissions {" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> :  <IoMdArrowDroprightCircle size={27} />}{" "}
          </span>{" "}
        </h3>
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">
      {type === "treatment" && (<>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Admission Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={admissionStartDate}
              endDate={admissionEndDate}
              onChange={(date) => {
                setAdmissionDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["admissionDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["admissionDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
            />
          </div>
        </div>
        
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Discharge Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={startDischargeDate}
              endDate={endDischargeDate}
              onChange={(date) => {
                setDischargeDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["dischargeDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["dischargeDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
              id={"checkup-start-end-date"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>checkup Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={startCheckupDate}
              endDate={endCheckupDate}
              onChange={(date) => {
                setCheckupDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["checkUpDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["checkUpDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
              id={"checkup-start-end-date"}
            />
          </div>
        </div>
      </>)}
      <div className='col-lg-3'>
        <div className="inputs force-active">
          <label>Treatment Number (علاج نمبر)</label>
          <div className="d-flex align-items-center">
            <InputWidget
              type={"input"}
              placeholder="Start"
              require={false}
              icon={"icon-number"}
              id={"treatment-number-start"}
              defaultValue={formPayload?.hospitalAdmissions?.treatmentNumber?.start}
              style={{ marginRight: "-1px", borderRadius: "4px 0 0 4px" }}
              onKeyPress={(e) => {
                const validChars = /[0-9]/;
                if (!validChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              setValue={(startValue) => {
                const payload = {
                  ...formPayload,
                };
                
                const start = parseInt(startValue);
                
                if (!isNaN(start)) {
                  payload["hospitalAdmissions"]["treatmentNumber"] = {
                    ...payload["hospitalAdmissions"]["treatmentNumber"],
                    start: start
                  };
                } else {
                  // If start is invalid, remove only the start value
                  const newNumber = { ...payload["hospitalAdmissions"]["treatmentNumber"] };
                  delete newNumber.start;
                  if (Object.keys(newNumber).length === 0) {
                    delete payload["hospitalAdmissions"]["treatmentNumber"];
                  } else {
                    payload["hospitalAdmissions"]["treatmentNumber"] = newNumber;
                  }
                }
                
                setFormPayload(payload);
              }}
            />
            <span className="mx-2 mb-3">-</span>
            <InputWidget
              type={"input"}
              placeholder="End"
              require={false}
              id={"treatment-number-end"}
              defaultValue={formPayload?.hospitalAdmissions?.treatmentNumber?.end}
              style={{ marginLeft: "-1px", borderRadius: "0 4px 4px 0" }}
              onKeyPress={(e) => {
                const validChars = /[0-9]/;
                if (!validChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              setValue={(endValue) => {
                const payload = {
                  ...formPayload,
                };
                
                const end = parseInt(endValue);
                
                if (!isNaN(end)) {
                  payload["hospitalAdmissions"]["treatmentNumber"] = {
                    ...payload["hospitalAdmissions"]["treatmentNumber"],
                    end: end
                  };
                } else {
                  // If end is invalid, remove only the end value
                  const newNumber = { ...payload["hospitalAdmissions"]["treatmentNumber"] };
                  delete newNumber.end;
                  if (Object.keys(newNumber).length === 0) {
                    delete payload["hospitalAdmissions"]["treatmentNumber"];
                  } else {
                    payload["hospitalAdmissions"]["treatmentNumber"] = newNumber;
                  }
                }
                
                setFormPayload(payload);
              }}
            />
          </div>
        </div>
      </div>
		
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Admission Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={admissionStartDate}
              endDate={admissionEndDate}
              onChange={(date) => {
                setAdmissionDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["admissionDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["admissionDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Discharge Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={startDischargeDate}
              endDate={endDischargeDate}
              onChange={(date) => {
                setDischargeDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["dischargeDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["dischargeDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
              id={"checkup-start-end-date"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>checkup Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={startCheckupDate}
              endDate={endCheckupDate}
              onChange={(date) => {
                setCheckupDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["checkUpDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                    }-${date[0].getDate()}`
                    : "";
                payload["hospitalAdmissions"]["checkUpDate"]["end"] =
                  date && date[1] != null
                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                    }-${date[1].getDate()}`
                    : "";
                setFormPayload(payload);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              isClearable={true}
              id={"checkup-start-end-date"}
            />
          </div>
        </div>
				
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"Disease"}
          isMulti
          id={"disease"}
          icon={"icon-office"}
          options={lookup?.diseases || []}
          defaultValue={mapIdsToLabels(
            formPayload?.hospitalAdmissions?.diseaseId,
            lookup?.diseases || []
          )}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };

            payload["hospitalAdmissions"]["diseaseId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"Hospital Admission Type"}
          require={false}
          isMulti={true}
          icon={"icon-operator"}
          id={"hos-ad-type"}
          options={lookup?.hospitalAdmissionType || []}
          defaultValue={mapIdsToLabels(
            formPayload?.hospitalAdmissions?.hospitalAdmissionType,
            lookup?.hospitalAdmissionType || []
          )}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["hospitalAdmissions"]["hospitalAdmissionType"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>

      {(!type === "Treatment" || type === "hospital") &&
        <>
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Medicine"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"medicine"}
              
              options={lookup?.medicine || []}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["checkup"]["medicines"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
        </>
      }
      {
        type === "master" && (
          <>
           <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Medicine"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"medicine"}
              options={lookup?.medicine || []}
              defaultValue={mapIdsToLabels(
                formPayload?.hospitalAdmissions?.checkup?.medicines,
                lookup?.medicine || []
              )}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["hospitalAdmissions"]["checkup"]["medicines"]= getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Doctor"}
                isMulti={true}
                require={false}
                icon={"icon-operator"}
                id={"doctor"}
                options={lookup?.doctors || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.hospitalAdmissions?.doctorId,
                  lookup?.doctors || []
                )}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload["hospitalAdmissions"]["doctorId"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Hospital"}
                isMulti={true}
                require={false}
                icon={"icon-operator"}
                id={"hospital"}
                options={lookup?.hospitals || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.hospitalAdmissions?.hospitalId,
                  lookup?.hospitals || []
                )}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload["hospitalAdmissions"]["hospitalId"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>
          </>
        )}
 </div>
      </Collapse>
    </div>
  )
};
export default PrisonerHospitalForm;






