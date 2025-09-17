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

const HearingForm = ({ type, formPayload, setFormPayload }) => {
  const [hearingDateRange, setHearingDateRange] = useState(() => [
    formPayload?.prisonerCase?.hearing?.hearingDate?.start ? new Date(formPayload.prisonerCase.hearing.hearingDate.start) : null,
    formPayload?.prisonerCase?.hearing?.hearingDate?.end ? new Date(formPayload.prisonerCase.hearing.hearingDate.end) : null
  ]);
  const [startHearingDate, endHearingDate] = hearingDateRange;
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
          Prisoner Hearing {" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> :  <IoMdArrowDroprightCircle size={27} />}{" "}
          </span>{" "}
        </h3>
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">

        <div className="col-lg-3">
          <InputWidget
            type={"input"}
            label={"Number Of Hearing"}
            require={false}
            onlyNumbers
            icon={"icon-operator"}
            id={"number-of-hearing"}
            defaultValue={formPayload?.prisonerCase?.hearing?.numberOfHearings}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["hearing"]["numberOfHearings"] = value;
              setFormPayload(payload);
            }}
          />
        </div>
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
              formPayload?.prisonerCase?.hearing?.courtId,
              lookup?.court || []
            )}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["hearing"]["courtId"] =
                getIds(value);
              setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputWidget
            type={"multiSelect"}
            label={"Remanding Court"}
            require={false}
            isMulti={true}
            icon={"icon-operator"}
            id={"remanding-court"}
            options={lookup?.court || []}
            defaultValue={mapIdsToLabels(
              formPayload?.prisonerCase?.hearing?.remandingCourtId,
              lookup?.court || []
            )}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["hearing"]["remandingCourtId"] =
                getIds(value);
              setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputWidget
            type={"multiSelect"}
            label={"Judge"}
            isMulti={true}
            require={false}
            icon={"icon-operator"}
            id={"judge"}
            options={lookup?.judge || []}
            defaultValue={mapIdsToLabels(
              formPayload?.prisonerCase?.hearing?.judgeId,
              lookup?.judge || []
            )}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["hearing"]["judgeId"] =
                getIds(value);
              setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-3">
          <div className='inputs force-active'>
            <label>Hearing Date</label>
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
                payload["prisonerCase"]["hearing"]["hearingDate"] = {
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
              id={"hearing-start-end-date"}
            />
          </div>
        </div>
        </div>
      </Collapse>
    </div>
  )
};
export default HearingForm;






