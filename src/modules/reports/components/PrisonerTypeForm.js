import { useState, useEffect } from "react";
import { getIds, transformData } from "../../../common/Helpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import { useSelector } from "react-redux";
import bannedOrg from "../../../assets/images/1.svg";
import { booleanOptions, mapIdsToLabels } from "../../../common/ReportHelpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const PrisonerTypeForm = ({ type, formPayload, setFormPayload }) => {
  const [lookup, setLookup] = useState();
  const [prisonerClass, setPrisonerClass] = useState([
    { label: "A", value: 0 },
    { label: "B", value: 1 },
    { label: "C", value: 2 },
  ]);
  const [convictDateRange, setConvictDateRange] = useState([null, null]);
  const [convictStartDate, convictEndDate] = convictDateRange;
  const newLookups = useSelector((state) => state?.dropdownLookups);

  useEffect(() => {
    // loadData();
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      const lookup = {};

      const prisonerTypeObj = transformData(newLookups?.prisonerType);
      lookup["prisonerstype"] = prisonerTypeObj;

      const prisonerSubTypeObj = transformData(newLookups?.prisonerSubType);
      lookup["prisonerSubtype"] = prisonerSubTypeObj;

      const bannedOrgsObj = transformData(newLookups?.bannedOrganizations);
      lookup["bannedorgs"] = bannedOrgsObj;
      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };


  return (
    <div className="row">
      <h3
        className="master-report-headings"
      >
        Prisoner Type
      </h3>

      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          inputType={"select"}
          isMulti={true}
          label={"Banned Organizations"}
          id={"banned-organizations"}
          require={false}
          imgIcon={bannedOrg}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerAdvancedInfo?.bannedOrganizationsId,
            lookup?.bannedorgs || []
          )}
          options={lookup?.bannedorgs || []}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerAdvancedInfo"]["bannedOrganizationsId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          inputType={"select"}
          label={"Prisoner Type"}
          id={"prisoner-type"}
          isMulti={true}
          require={false}
          options={lookup?.prisonerstype || []}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerAdvancedInfo?.prisonerTypeId,
            lookup?.prisonerstype || []
          )}
          icon={"icon-number"}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerAdvancedInfo"]["prisonerTypeId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          inputType={"select"}
          label={"Prisoner Sub Type"}
          id={"prisoner-sub-type"}
          isMulti={true}
          require={false}
          options={lookup?.prisonerSubtype || []}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerAdvancedInfo?.prisonerSubTypeId,
            lookup?.prisonerSubtype || []
          )}
          icon={"icon-number"}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerAdvancedInfo"]["prisonerSubTypeId"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>

      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"High Profile (خطرناک قیدی)"}
          isMulti={false}
          id={"high-profile"}
          icon={"icon-prisoner"}
          isClearable={true}
          options={booleanOptions}
          defaultValue={
            formPayload?.prisonerAdvancedInfo?.highProfile !== undefined
              ? formPayload.prisonerAdvancedInfo.highProfile
                ? { value: true, label: "Yes" }
                : { value: false, label: "No" }
              : null
          }
          setValue={(value) => {
            const payload = {
              ...formPayload
            };
          
              payload["prisonerAdvancedInfo"]["highProfile"] = value?.value 
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"Legal Assistance (قانونی امداد)"}
          isMulti={false}
          id={"legal-assistance"}
          icon={"icon-prisoner"}
          isClearable={true}
          options={booleanOptions}
          defaultValue={
            formPayload?.prisonerAdvancedInfo?.legalAssistance !== undefined
              ? formPayload.prisonerAdvancedInfo.legalAssistance
                ? { value: true, label: "Yes" }
                : { value: false, label: "No" }
              : null
          }
          setValue={(value) => {
            const payload = {
              ...formPayload
            };
              payload["prisonerAdvancedInfo"]["legalAssistance"] = value?.value 
            setFormPayload(payload);
          }}
        />
      </div>
      {type === "master" && (
        <div className="col-lg-3">
          <InputWidget
            type={"multiSelect"}
            label={"Habitual Offender (عادی مجرم)"}
            isMulti={false}
            id={"habitual-offender"}
            icon={"icon-prisoner"}
            isClearable={true}
            options={booleanOptions}
            defaultValue={
              formPayload?.prisonerAdvancedInfo?.habitualOffender !== undefined
                ? formPayload.prisonerAdvancedInfo.habitualOffender
                  ? { value: true, label: "Yes" }
                  : { value: false, label: "No" }
                : null
            }
            setValue={(value) => {
              const payload = {
                ...formPayload
              };
            
                payload["prisonerAdvancedInfo"]["habitualOffender"] = value?.value
              setFormPayload(payload);
            }}
          />
        </div>
      )}
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          inputType={"select"}
          label={"Prisoner Class (قیدی کی کلاس)"}
          id={"prisoner-class"}
          isMulti={true}
          require={false}
          icon={"icon-prisoner"}
          options={prisonerClass}
          defaultValue={mapIdsToLabels(
            formPayload?.prisonerAdvancedInfo?.prisonerClass,
            prisonerClass || []
          )}
          setValue={(value) => {
            console.log("prisonerClass", value);
            const payload = {
              ...formPayload,
            };
            payload["prisonerAdvancedInfo"]["prisonerClass"] = getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      {type === "master" && (
        <div className="col-lg-3">
          <div className="inputs force-active">
            <label>Conviction Start-End Date</label>
            <DatePicker
              icon={"icon-calendar"}
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={
                formPayload?.prisonerAdvancedInfo?.convictionDate?.start
                  ? new Date(formPayload.prisonerAdvancedInfo.convictionDate.start)
                  : null
              }
              endDate={
                formPayload?.prisonerAdvancedInfo?.convictionDate?.end
                  ? new Date(formPayload.prisonerAdvancedInfo.convictionDate.end)
                  : null
              }
              onChange={(date) => {
                setConvictDateRange(date);
                const payload = {
                  ...formPayload,
                };
                payload["prisonerAdvancedInfo"]["convictionDate"]["start"] =
                  date && date[0] != null
                    ? `${date[0].getFullYear()}-${
                        date[0].getMonth() + 1
                      }-${date[0].getDate()}`
                    : "";
                payload["prisonerAdvancedInfo"]["convictionDate"]["end"] =
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
              id={"conviction-start-end-date"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default PrisonerTypeForm;
