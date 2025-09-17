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

const PrisonerRemissionParams = ({ type, formPayload, setFormPayload }) => {
  const [remissionDateRange, setRemissionDateRange] = useState(() => [
    formPayload?.prisonerRemissions?.remissionDate?.start ? new Date(formPayload.prisonerRemissions.remissionDate.start) : null,
    formPayload?.prisonerRemissions?.remissionDate?.end ? new Date(formPayload.prisonerRemissions.remissionDate.end) : null
  ]);
  const [startRemissionDate, endRemissionDate] = remissionDateRange;
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

      const releaseTypeObj = transformData(newLookups?.ReleaseType);
      lookup["releaseType"] = releaseTypeObj;

      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  return (
    <div className="row">

      
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">

        <div className="col-lg-3 ">
                <InputWidget
                  type={"multiSelect"}
                  label={"Remissions Type"}
                  require={false}
                  isMulti={true}
                  icon={"icon-operator"}
                  id={"remission-type"}
                  options={lookup?.releaseType || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.prisonerRemissions?.remissionTypeId,
                    lookup?.releaseType || []
                  )}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["prisonerRemissions"]["remissionTypeId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>

              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Remission Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startRemissionDate}
                    endDate={endRemissionDate}
                    onChange={(date) => {
                      setRemissionDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload.prisonerRemissions.remissionDate = {
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
                    id={"remission-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3">
          <InputWidget
            type={"input"}
            label={"Remission Days Earned"}
            require={false}
            onlyNumbers
            icon={"icon-operator"}
            id={"remission-days-earned"}
            defaultValue={formPayload?.prisonerRemissions?.remissionDaysEarned}
            setValue={(value) => {
              const payload = {
                ...formPayload,
              };
              payload["prisonerRemissions"]["remissionDaysEarned"] = value;
              setFormPayload(payload);
            }}
          />
        </div>
      </div>
      </Collapse>
    </div>
  )
};
export default PrisonerRemissionParams;






