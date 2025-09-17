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

const PrisonerTransferForm = ({ type, formPayload, setFormPayload }) => {
  const [transferDateRange, setTransferDateRange] = useState(() => [
    formPayload?.prisonerTransfers?.transferDate?.start ? new Date(formPayload.prisonerTransfers.transferDate.start) : null,
    formPayload?.prisonerTransfers?.transferDate?.end ? new Date(formPayload.prisonerTransfers.transferDate.end) : null
  ]);
  const [startTransferDate, endTransferDate] = transferDateRange;
  const [lookup, setLookup] = useState();
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [open, setOpen] = useState(true);

  


  useEffect(() => {
    // loadData();
    fetchLookUps();

  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
    
      const prisonsObj = transformData(newLookups?.prison);
      lookup["prisons"] = prisonsObj;
     
      const transferStatus = transformData(newLookups?.transferStatus);
      lookup["transferStatus"] = transferStatus;

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
          Prisoner Transfer {" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> :  <IoMdArrowDroprightCircle size={27} />}{" "}
          </span>{" "}
        </h3>
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">

        <div className="col-lg-3 ">
        <InputWidget
            type={"input"}
            label={"Number Of Transfers"}
            require={false}
            onlyNumbers
            icon={"icon-operator"}
            id={"number-of-transfers"}
            defaultValue={formPayload?.prisonerTransfers?.numberOfTransfers}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerTransfers"]["numberOfTransfers"] = value;
              setFormPayload(payload);
            }}
          />
              </div>

              <div className="col-lg-3">
        <div className='inputs force-active'>
          <label>Transfer Date Start-End Date</label>
        <DatePicker
          icon={"icon-calendar"}
          dateFormat="dd/MM/yyyy"
          selectsRange={true}
          startDate={startTransferDate}
          endDate={endTransferDate}
          onChange={(date) => {
            setTransferDateRange(date);
            const payload = {
              ...formPayload,
            };
            payload["prisonerTransfers"]["transferDate"] = {
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
          id={"transfer-start-end-date"}
        />
        </div>
      </div>

      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"Old Prison"}
          require={false}
          isMulti={true}
          icon={"icon-operator"}
          id={"old-prison"}
          options={lookup?.prisons || []}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerTransfers?.oldPrisonId,
            lookup?.prisons || []
          )}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerTransfers"]["oldPrisonId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"New Prison"}
          require={false}
          isMulti={true}
          icon={"icon-operator"}
          id={"new-prison"}
          options={lookup?.prisons || []}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerTransfers?.newPrisonId,
            lookup?.prisons || []
          )}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerTransfers"]["newPrisonId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
     
    
      </div>
      </Collapse>
    </div>
  )
};
export default PrisonerTransferForm;






