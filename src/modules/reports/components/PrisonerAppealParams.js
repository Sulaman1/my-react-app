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

const PrisonerAppealParams = ({ type, formPayload, setFormPayload }) => {
  const [hearingDateRange, setHearingDateRange] = useState(() => [
    formPayload?.prisonerCase?.appeal?.hearingDate?.start ? new Date(formPayload.prisonerCase.appeal.hearingDate.start) : null,
    formPayload?.prisonerCase?.appeal?.hearingDate?.end ? new Date(formPayload.prisonerCase.appeal.hearingDate.end) : null
  ]);
  const [decisionDateRange, setDecisionDateRange] = useState(() => [
    formPayload?.prisonerCase?.appeal?.decisionDate?.start ? new Date(formPayload.prisonerCase.appeal.decisionDate.start) : null,
    formPayload?.prisonerCase?.appeal?.decisionDate?.end ? new Date(formPayload.prisonerCase.appeal.decisionDate.end) : null
  ]);

  const [startHearingDate, endHearingDate] = hearingDateRange;
  const [startDecisionDate, endDecisionDate] = decisionDateRange;
  const [lookup, setLookup] = useState();
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [open, setOpen] = useState(true);


  useEffect(() => {

    fetchLookUps();

  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
     
      const courtObj = transformData(newLookups?.court);
      lookup["court"] = courtObj;

      const judgeObj = transformData(newLookups?.judge);
      lookup["judge"] = judgeObj;

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
          Prisoner Appeal {" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> :  <IoMdArrowDroprightCircle size={27} />}{" "}
          </span>{" "}
        </h3>
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">

        <div className="col-lg-3">
          <InputWidget
            type={"multiSelect"}
            label={"Court"}
            isMulti={true}
            require={false}
            icon={"icon-operator"}
            id={"court"}
            options={lookup?.court || []}
            defaultValue={mapIdsToLabels(
              formPayload?.prisonerCase?.appeal?.courts,
              lookup?.court || []
            )}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["appeal"]["courts"] =
                getIds(value);
              setFormPayload(payload);
            }}
          />
        </div>
        {/* <div className="col-lg-3">
          <InputWidget
            type={"multiSelect"}
            label={"Appeal status"}
            isMulti={true}
            require={false}
            icon={"icon-operator"}
            id={"appeal-status"}
            options={lookup?.court || []}
            defaultValue={mapIdsToLabels(
              formPayload?.prisonerCase?.appeal?.status,
              lookup?.court || []
            )}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["appeal"]["status"] =
                getIds(value);
              setFormPayload(payload);
            }}
          />
        </div> */}
       
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Appeal Date</label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              icon={"icon-calendar"}
              selectsRange={true}
              startDate={startHearingDate}
              endDate={endHearingDate}
              onChange={(date) => {
                setHearingDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["prisonerCase"]["appeal"]["hearingDate"] = {
                  start: date?.[0] ? `${date[0].getFullYear()}-${date[0].getMonth() + 1}-${date[0].getDate()}` : "",
                  end: date?.[1] ? `${date[1].getFullYear()}-${date[1].getMonth() + 1}-${date[1].getDate()}` : ""
                };
                setFormPayload(payload);
              }}
              isClearable={true}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={"appeal-start-end-date"}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Decision Date</label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              icon={"icon-calendar"}
              selectsRange={true}
              startDate={startDecisionDate}
              endDate={endDecisionDate}
              onChange={(date) => {
                setDecisionDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["prisonerCase"]["appeal"]["decisionDate"] = {
                  start: date?.[0] ? `${date[0].getFullYear()}-${date[0].getMonth() + 1}-${date[0].getDate()}` : "",
                  end: date?.[1] ? `${date[1].getFullYear()}-${date[1].getMonth() + 1}-${date[1].getDate()}` : ""
                };
                setFormPayload(payload);
              }}
              isClearable={true}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={"appeal-decision-date"}
            />
          </div>
        </div>

        <div className="col-lg-3">
          <InputWidget
            type={"input"}
            label={"Appeal Number"}
            require={false}
            onlyNumbers
            icon={"icon-operator"}
            id={"appeal-number"}
            defaultValue={formPayload?.prisonerCase?.appeal?.appealNumber}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["appeal"]["appealNumber"] = value;
              setFormPayload(payload);
            }}
          />
        </div>
        </div>
      </Collapse>
    </div>
  )
};
export default PrisonerAppealParams;






