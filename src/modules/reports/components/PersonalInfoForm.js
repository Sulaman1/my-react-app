import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import {
  IoMdArrowDroprightCircle,
  IoMdArrowDropdownCircle,
} from "react-icons/io";
import { Collapse } from "react-bootstrap";

const PersonalInfoForm = ({ type, formPayload, setFormPayload }) => {
  const [birthdayDateRange, setBirthdayDateRange] = useState(() => {
    const startDate = formPayload?.personalInfo?.dateOfBirth?.start
      ? new Date(formPayload.personalInfo.dateOfBirth.start)
      : null;
    const endDate = formPayload?.personalInfo?.dateOfBirth?.end
      ? new Date(formPayload.personalInfo.dateOfBirth.end)
      : null;
    return [startDate, endDate];
  });
  const [birthdayStartDate, birthdayEndDate] = birthdayDateRange;
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [open, setOpen] = useState(true);

  const [lookup, setLookup] = useState();
  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};

      const gendersObj = transformData(newLookups?.gender);
      lookup["genders"] = gendersObj;

      const nationalityObj = transformData(newLookups?.Nationality);
      lookup["nationlities"] = nationalityObj;

      const maritalObj = transformData(newLookups?.MaritalStatus);
      lookup["marital"] = maritalObj;

      const casteObj = transformData(newLookups?.caste);
      lookup["caste"] = casteObj;

      const religionObj = transformData(newLookups?.religion);
      lookup["religion"] = religionObj;

      const sectObj = transformData(newLookups?.sect);
      lookup["sect"] = sectObj;

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
          Personal Info{" "}
          {open ? (
            <IoMdArrowDropdownCircle size={27} />
          ) : (
            <IoMdArrowDroprightCircle size={27} />
          )}
        </span>
      </h3>

      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          {type !== "master" && (
            <>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Full Name"}
                  require={false}
                  onlyLetters={true}
                  icon={"icon-operator"}
                  id={"full-name"}
                  defaultValue={formPayload?.personalInfo?.fullName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["fullName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Father Name"}
                  require={false}
                  onlyLetters={true}
                  icon={"icon-operator"}
                  id={"father-name"}
                  defaultValue={formPayload?.personalInfo?.relationshipName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["relationshipName"] = value;
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
                  defaultValue={formPayload?.personalInfo?.cnic}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["cnic"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
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
                    formPayload?.personalInfo?.genderId,
                    lookup?.genders || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["genderId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Date of birth Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={birthdayStartDate}
                    endDate={birthdayEndDate}
                    onChange={(date) => {
                      setBirthdayDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["personalInfo"]["dateOfBirth"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["personalInfo"]["dateOfBirth"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"date-of-birth-start-end-date"}
                  />
                </div>
              </div>
            </>
          )}

          {type !== "darban" && (
            <>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Grand Father Name"}
                  require={false}
                  onlyLetters={true}
                  icon={"icon-operator"}
                  id={"grand-father-name"}
                  defaultValue={formPayload?.person?.personalInfo?.grandFatherName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["grandFatherName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Brother Name"}
                  require={false}
                  onlyLetters={true}
                  icon={"icon-operator"}
                  id={"brother-name"}
                  defaultValue={formPayload?.person?.personalInfo?.brotherName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["brotherName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Nick Name"}
                  require={false}
                  onlyLetters={true}
                  icon={"icon-operator"}
                  id={"Nick-name"}
                  defaultValue={formPayload?.person?.personalInfo?.nickName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["nickName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Official ID No (For Foreigners Only)"}
                  require={false}
                  icon={"icon-operator"}
                  id={"passport-number"}
                  defaultValue={formPayload?.person?.personalInfo?.passportNumber}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["passportNumber"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>

              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Nationality"}
                  isMulti={true}
                  require={false}
                  icon={"icon-operator"}
                  id={"Nationality"}
                  options={lookup?.nationlities || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.person?.personalInfo?.nationalityId,
                    lookup?.nationlities || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["nationalityId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>

              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Marital Status"}
                  isMulti={true}
                  require={false}
                  icon={"icon-operator"}
                  id={"Marital-status"}
                  options={lookup?.marital || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.person?.personalInfo?.maritalStatusId,
                    lookup?.marital || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["maritalStatusId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Caste"}
                  isMulti={true}
                  require={false}
                  icon={"icon-operator"}
                  id={"caste"}
                  options={lookup?.caste || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.person?.personalInfo?.casteId,
                    lookup?.caste || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["casteId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Religion"}
                  isMulti
                  require={false}
                  icon={"icon-operator"}
                  id={"religion"}
                  options={lookup?.religion || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.person?.personalInfo?.religionId,
                    lookup?.religion || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["religionId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"multiSelect"}
                  label={"Sect"}
                  isMulti={true}
                  require={false}
                  icon={"icon-operator"}
                  id={"sec-id"}
                  options={lookup?.sect || []}
                  defaultValue={mapIdsToLabels(
                    formPayload?.person?.personalInfo?.sectId,
                    lookup?.sect || []
                  )}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["person"]["personalInfo"]["sectId"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>
              {type === "master" && (
                <>
                  <h3
                    aria-expanded={open}
                    className={`${
                      type === "master"
                        ? "master-report-headings"
                        : " third-heading sub-fill-heading cursor-pointer "
                    }`}
                  >
                    <span className="d-flex justify-content-between w-100">
                      Biometric Info
                    </span>
                  </h3>
                  <div className="col-lg-3">
                    <InputWidget
                      type={"input"}
                      label={"Fingerprints Count"}
                      require={false}
                      onlyNumbers
                      icon={"icon-operator"}
                      id={"fingerprints-count"}
                      defaultValue={formPayload?.person?.biometricInfo?.fingerprintsCount}
                      setValue={(value) => {
                        const payload = { ...formPayload };
                        payload["person"]["biometricInfo"]["fingerprintsCount"] = value;
                        setFormPayload(payload);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputWidget
                      type={"input"}
                      label={"Pictures Count"}
                      require={false}
                      onlyNumbers
                      icon={"icon-operator"}
                      id={"pictures-count"}
                      defaultValue={formPayload?.person?.biometricInfo?.picturesCount}
                      setValue={(value) => {
                        const payload = { ...formPayload };
                        payload["person"]["biometricInfo"]["picturesCount"] = value;
                        setFormPayload(payload);
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};
export default PersonalInfoForm;
