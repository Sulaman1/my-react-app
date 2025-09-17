import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setVisitorStatus } from "../../../store/language";

const PrisonerVisitorForm = ({ type, formPayload, setFormPayload }) => {
  const dispatch = useDispatch();
  const [visitorDateRange, setVisitorDateRange] = useState(() => [
    formPayload?.prisonerVisitors?.visitDate?.start ? new Date(formPayload.prisonerVisitors.visitDate.start) : null,
    formPayload?.prisonerVisitors?.visitDate?.end ? new Date(formPayload.prisonerVisitors.visitDate.end) : null
  ]);
  const [startVisitorDate, endVisitorDate] = visitorDateRange;
  const [open, setOpen] = useState(true);
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [hasVisitors, setHasVisitors] = useState(formPayload?.prisonerVisitors?.hasVisitors || '');

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
      const RelationshipsObj = transformData(newLookups?.Relationships);
      lookup["Relationships"] = RelationshipsObj;
      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  // Add options for the dropdown
  const visitorOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  // Handle visitor selection change
  const handleHasVisitorChange = (selected) => {
    const payload = { ...formPayload };
    
    if (!selected) {
      payload.prisonerVisitors = {
        hasVisitors: undefined
      };
      setHasVisitors('');
      dispatch(setVisitorStatus(false));
    } else {
      payload.prisonerVisitors = {
        ...payload.prisonerVisitors,
        hasVisitors: selected.value
      };
      
      if (!selected.value) {
        payload.prisonerVisitors = {
          hasVisitors: false
        };
      }
      setHasVisitors(selected.value);
      dispatch(setVisitorStatus(selected.value));
    }
    
    setFormPayload(payload);
  };

  return (
    <div className="row">
      <h3
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="master-report-headings"
      >
        <span className="d-flex justify-content-between w-100">
          Prisoner Visitor {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          <div className="col-lg-3">
            <InputWidget
              type="multiSelect"
              label="Has Visitors"
              isMulti={false}
              icon="icon-operator"
              isClearable={true}
              id="has-visitors"
              options={visitorOptions}
              defaultValue={
                formPayload?.prisonerVisitors?.hasVisitors !== undefined
                  ? { value: formPayload.prisonerVisitors.hasVisitors, label: formPayload.prisonerVisitors.hasVisitors ? "Yes" : "No" }
                  : null
              }
              setValue={handleHasVisitorChange}
            />
          </div>
          
          {hasVisitors && hasVisitors === true && (
            <>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Number of Visits"}
                  require={false}
                  onlyNumbers
                  icon={"icon-operator"}
                  id={"number-of-visits"}
                  defaultValue={formPayload?.prisonerVisitors?.numberOfVisits}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload.prisonerVisitors.numberOfVisits = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Full Name"}
                  require={false}
                  icon={"icon-operator"}
                  id={"full-name"}
                  defaultValue={formPayload?.prisonerVisitors?.fullName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["prisonerVisitors"]["fullName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"cnic"}
                  inputType={"text"}
                  label={"CNIC"}
                  require={false}
                  onlyNumbers={true}
                  icon={"icon-operator"}
                  id={"cnic"}
                  defaultValue={formPayload?.prisonerVisitors?.cnic}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["prisonerVisitors"]["cnic"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Father Name"}
                  require={false}
                  icon={"icon-operator"}
                  id={"father-name"}
                  defaultValue={formPayload?.prisonerVisitors?.relationshipName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["prisonerVisitors"]["relationshipName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Relationships"}
                  isMulti
                  require={false}
                  icon={"icon-operator"}
                  id={"Relationships"}
                  options={lookup?.Relationships || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.prisonerVisitors?.relationshipId,
                    lookup?.Relationships || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["prisonerVisitors"]["relationshipId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <div className='inputs force-active'>
                  <label>Visit Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startVisitorDate}
                    endDate={endVisitorDate}
                    onChange={(date) => {
                      setVisitorDateRange(date);
                      const payload = { ...formPayload };
                      payload["prisonerVisitors"]["visitDate"] = {
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
                    id={"visit-start-end-date"}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default PrisonerVisitorForm;






