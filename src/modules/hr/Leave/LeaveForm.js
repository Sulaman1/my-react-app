import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { getFormattedDate, transformData, validateDate } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import { getData } from "../../../services/request";
import { useSelector } from "react-redux";

const LeaveForm = (props) => {
  const [lookups, setLookups] = useState({});
  const newLookups = useSelector((state) => state?.dropdownLookups)
  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      const lookup = {};
     
      const leaveTypesObj = transformData(newLookups?.leaveTypes);
      lookup["leaveTypes"] = leaveTypesObj;

      const dayPartsObj = transformData(newLookups?.dayParts);
      lookup["dayParts"] = dayPartsObj;

      setLookups(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  const minEndDate = new Date(props.formPayload.start);

  return (
    <div className="row p-2">
      <div className="row">
        <div className="col-lg-6">
          <div className="inputs force-active">
            <label>Start Date (تاریخ سے)</label>
            <DatePicker
              selected={
                validateDate(props?.formPayload?.start)
                  ? getFormattedDate(props?.formPayload?.start)
                  : null
              }
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload["start"] = date
                  ? `${date.getFullYear()}-${
                      date.getMonth() + 1
                    }-${date.getDate()}`
                  : "";
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              icon={"icon-operator"}
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={"start-date"}
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="inputs force-active">
            <label>End Date (تاریخ تک)</label>
            <DatePicker
              selected={
                validateDate(props?.formPayload?.end)
                  ? getFormattedDate(props?.formPayload?.end)
                  : null
              }
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload["end"] = date
                  ? `${date.getFullYear()}-${
                      date.getMonth() + 1
                    }-${date.getDate()}`
                  : "";
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={"icon-operator"}
              minDate={minEndDate}
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={"end-date"}
            />
          </div>
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={"multiSelect"}
            label={"Leave Type (چھٹی کی نویت)"}
            multiple={false}
            icon={"icon-office"}
            id={"leave-type"}
            options={lookups.leaveTypes || []}
            setValue={(value) => {
              console.log("leaveType", value);
              const payload = {
                ...props.formPayload,
              };
              payload["leaveTypeId"] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-6">
          <InputWidget
            type={"multiSelect"}
            label={"Day parts (دن کے حصے)"}
            multiple={false}
            icon={"icon-calender"}
            id={"leave-type"}
            options={lookups.dayParts || []}
           setValue={(value) => {
              console.log("dayParts", value);
              const payload = {
                ...props.formPayload,
              };
              payload["dayPart"] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className='col-lg-12'>
                <InputWidget
                  id={'remarks'}
                  type={'textarea'}
                  inputType={'text'}
                  label={'Remarks'}
                  require={false}
                  setValue={value => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['remarks'] = value;
                    props.setFormPayload(payload);
                  }}
                  icon={'icon-chat'}
                />
              </div>
            </div>
    </div>
  );
};

export default LeaveForm;
