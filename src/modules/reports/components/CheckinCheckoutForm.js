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

const CheckinCheckoutForm = ({ type, formPayload, setFormPayload }) => {
  const [checkoutDateRange, setCheckoutDateRange] = useState(() => [
    formPayload?.checkInOuts?.checkOutRequestDateTime?.start ? new Date(formPayload.checkInOuts.checkOutRequestDateTime.start) : null,
    formPayload?.checkInOuts?.checkOutRequestDateTime?.end ? new Date(formPayload.checkInOuts.checkOutRequestDateTime.end) : null
  ]);
  const [startCheckoutDate, endCheckoutDate] = checkoutDateRange;
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
   
      const CheckInOutReasonObj = transformData(newLookups?.checkReason);
      lookup["CheckInOutReason"] = CheckInOutReasonObj;

      const sections = transformData(newLookups?.sections);
      lookup["sections"] = sections;

      const checkInOutStatus = transformData(newLookups?.checkStatus);
      lookup["checkInOutStatus"] = checkInOutStatus;

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
        <span className="d-flex justify-content-between w-100">
          Prisoner Checkin/Out {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          <div className="col-lg-3">
            <InputWidget
              type={"input"}
              label={"Number of Checkouts"}
              require={false}
              onlyNumbers
              icon={"icon-operator"}
              id={"number-of-checkouts"}
              defaultValue={formPayload?.checkInOuts?.numberOfCheckouts}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["checkInOuts"]["numberOfCheckouts"] = value;
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-4">
            <InputWidget
              type={"multiSelect"}
              isMulti={true}
              label={"Check Reason"}
              require={false}
              icon={"icon-operator"}
              id={"check-reason"}
              options={lookup?.CheckInOutReason || []}
              defaultValue={mapIdsToLabels(
                formPayload?.checkInOuts?.checkReason,
                lookup?.CheckInOutReason || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["checkInOuts"]["checkReason"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <div className='inputs force-active'>
              <label>CheckOut Request Date Start-End Date</label>
              <DatePicker
                icon={"icon-calendar"}
                dateFormat="dd/MM/yyyy"
                selectsRange={true}
                startDate={startCheckoutDate}
                endDate={endCheckoutDate}
                onChange={(date) => {
                  setCheckoutDateRange(date);
                  const payload = { ...formPayload };
                  payload["checkInOuts"]["checkOutRequestDateTime"] = {
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
                id={"check-out-request-date-start-end-date"}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CheckinCheckoutForm;






