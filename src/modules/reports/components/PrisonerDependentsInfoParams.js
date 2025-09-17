import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIds, transformData } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PrisonerDependentsInfoParams = ({
  formPayload,
  setFormPayload,
  type,
}) => {
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [admissionDateRange, setAdmissionDateRange] = useState(() => {
    const startDate = formPayload?.dependents?.dateOfBirth?.start
      ? new Date(formPayload.dependents.dateOfBirth.start)
      : null;
    const endDate = formPayload?.dependents?.dateOfBirth?.end
      ? new Date(formPayload.dependents.dateOfBirth.end)
      : null;
    return [startDate, endDate];
  });
  
  const [admissionStartDate, admissionEndDate] = admissionDateRange;

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
      const gendersObj = transformData(newLookups?.gender);
      lookup["genders"] = gendersObj;

      const RelationshipsObj = transformData(newLookups?.Relationships);
      lookup["Relationships"] = RelationshipsObj;

      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  return (
    <>
      <div className="row">
        <h3
          className="master-report-headings"
        >
          <span className="d-flex justify-content-between w-100">
            Dependents
          </span>
        </h3>

        <div id="example-collapse-text" className="row">
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Gender"}
              isMulti
              require={false}
              icon={"icon-operator"}
              id={"gender"}
              options={lookup?.genders || []}
              defaultValue={mapIdsToLabels(
                formPayload?.dependents?.genderId,
                lookup?.genders || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["dependents"]["genderId"] = getIds(value);
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
                formPayload?.dependents?.relationshipId,
                lookup?.Relationships || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["dependents"]["relationshipId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <div className="inputs force-active">
              <label>Date of Birth Start-End date</label>
              <DatePicker
                icon={"icon-calendar"}
                dateFormat="dd/MM/yyyy"
                selectsRange={true}
                startDate={admissionStartDate}
                endDate={admissionEndDate}
                onChange={(date) => {
                  setAdmissionDateRange(date);
                  const payload = { ...formPayload };
                  payload["dependents"]["dateOfBirth"]["start"] =
                    date && date[0] != null
                      ? `${date[0].getFullYear()}-${
                          date[0].getMonth() + 1
                        }-${date[0].getDate()}`
                      : "";
                  payload["dependents"]["dateOfBirth"]["end"] =
                    date && date[1] != null
                      ? `${date[1].getFullYear()}-${
                          date[1].getMonth() + 1
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
        </div>

        <h3
          className="master-report-headings"
        >
          <span className="d-flex justify-content-between w-100">
            Prisoner Belongings
          </span>
        </h3>

        <div className="col-lg-3">
          <InputWidget
            type={"input"}
            label={"Item Name"}
            require={false}
            onlyLetters={true}
            icon={"icon-operator"}
            id={"item-name"}
            defaultValue={formPayload?.prisonerBellongings?.itemName}
            setValue={(value) => {
              const payload = { ...formPayload };
              payload["prisonerBellongings"]["itemName"] = value;
              setFormPayload(payload);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PrisonerDependentsInfoParams;
