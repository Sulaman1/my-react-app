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

const PrisonerReleaseParams = ({ type, formPayload, setFormPayload }) => {
  const [releaseDateRange, setReleaseDateRange] = useState(() => [
    formPayload?.prisonerRelease?.releaseDate?.start ? new Date(formPayload.prisonerRelease.releaseDate.start) : null,
    formPayload?.prisonerRelease?.releaseDate?.end ? new Date(formPayload.prisonerRelease.releaseDate.end) : null
  ]);
  const [startReleaseDate, endReleaseDate] = releaseDateRange;
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
                  label={"Release Type"}
                  require={false}
                  isMulti={true}
                  icon={"icon-operator"}
                  id={"release-type"}
                  options={lookup?.releaseType || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.prisonerRelease?.releaseTypeId,
                    lookup?.releaseType || []
                  )}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["prisonerRelease"]["releaseTypeId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Release Court"}
                  require={false}
                  isMulti={true}
                  icon={"icon-operator"}
                  id={"release-court"}
                  options={lookup?.court || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.prisonerRelease?.releaseCourtId,
                    lookup?.court || []
                  )}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["prisonerRelease"]["releaseCourtId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Release Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startReleaseDate}
                    endDate={endReleaseDate}
                    onChange={(date) => {
                      setReleaseDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload.prisonerRelease.releaseDate = {
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
                    id={"release-start-end-date"}
                  />
                </div>
              </div>
      </div>
      </Collapse>
    </div>
  )
};
export default PrisonerReleaseParams;






