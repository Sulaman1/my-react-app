import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import {
  IoMdArrowDroprightCircle,
  IoMdArrowDropdownCircle,
} from "react-icons/io";
import { Collapse } from "react-bootstrap";
//import { generateYears } from "../../../common/Common";
import { PayloadFtn } from "../helper/Payload";
import { mapIdsToLabels } from "../../../common/ReportHelpers";

const PrisonerBasicInfoParams = ({ type, formPayload, setFormPayload, dailyDarbanReport }) => {
  const [birthdayDateRange, setBirthdayDateRange] = useState(() => {
    const startDate = formPayload?.prisonerBasicInfo?.dateOfBirth?.start
      ? new Date(formPayload.prisonerBasicInfo.dateOfBirth.start)
      : null;
    const endDate = formPayload?.prisonerBasicInfo?.dateOfBirth?.end
      ? new Date(formPayload.prisonerBasicInfo.dateOfBirth.end)
      : null;
    return [startDate, endDate];
  });
  const [birthdayStartDate, birthdayEndDate] = birthdayDateRange;
  const [admissionDateRange, setAdmissionDateRange] = useState(() => {
    const startDate = formPayload?.prisonerBasicInfo?.admissionDate?.start
      ? new Date(formPayload.prisonerBasicInfo.admissionDate.start)
      : null;
    const endDate = formPayload?.prisonerBasicInfo?.admissionDate?.end
      ? new Date(formPayload.prisonerBasicInfo.admissionDate.end)
      : null;
    return [startDate, endDate];
  });
  const [admissionStartDate, admissionEndDate] = admissionDateRange;
  const [darbanEntryDate, setDarbanEntryDate] = useState(
    formPayload?.prisonerAdvancedInfo?.darbanEntryDate?.start
      ? new Date(formPayload.prisonerAdvancedInfo.darbanEntryDate.start)
      : null
  );
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [open, setOpen] = useState(true);
  const [prisons, setPrisons] = useState([]);
  const [isRoleExist, setIsRoleExist] = useState("");
  const [lookup, setLookup] = useState();
  //const years = generateYears();

  const confinedOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  useEffect(() => {
    const rawData = sessionStorage.getItem("user");
    const employee = JSON.parse(rawData)?.employee;
    const prisonObj = employee?.prisons.map((e) => {
      return { value: e.prisonId, label: e.prisonName };
    });
    setPrisons(prisonObj);
    setIsRoleExist(employee?.user?.roleNames[0]);
    const prisonId = JSON.parse(rawData)?.employee?.prisons.map(
      (e) => e.prisonId
    );
    PayloadFtn["prisonerBasicInfo"]["prisonId"] = prisonId;
  }, []);

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
      const categoryObj = transformData(newLookups?.prisonerCategory);
      lookup["category"] = categoryObj;
      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  useEffect(() => {
    if (isRoleExist === "Inspector General Prisons" || isRoleExist === "DIG Prisons") {
      const payload = {
        ...formPayload,
      };
      payload.prisonerBasicInfo.prisonId = prisons?.map(prison => prison.value) || [];
      setFormPayload(payload);
    }
  }, []);

  return (
    <div className="row">
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
        {dailyDarbanReport ? (
            <div className="col-lg-3">
              <div className="inputs force-active">
                <label>Darban Entry Date</label>
                <DatePicker
                  icon={"icon-calendar"}
                  dateFormat="dd/MM/yyyy"
                  selected={darbanEntryDate}
                  onChange={(date) => {
                    setDarbanEntryDate(date);
                    const payload = {
                      ...formPayload,
                    };
                    if (!payload.prisonerAdvancedInfo) {
                      payload.prisonerAdvancedInfo = {};
                    }
                    if (!payload.prisonerAdvancedInfo.darbanEntryDate) {
                      payload.prisonerAdvancedInfo.darbanEntryDate = {};
                    }
                    
                    // Set the same date for both start and end
                    const formattedDate = date 
                      ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                      : "";
                      
                    payload.prisonerAdvancedInfo.darbanEntryDate.start = formattedDate;
                    payload.prisonerAdvancedInfo.darbanEntryDate.end = formattedDate;
                    
                    setFormPayload(payload);
                  }}
                  id={"darban-entry-date"}
                  isClearable={true}
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                />
              </div>
            </div>
          ) : (
            <>
          <div className="col-lg-3">
            <InputWidget
              type={"input"}
              label={"Full Name"}
              require={false}
              onlyLetters={true}
              icon={"icon-operator"}
              id={"full-name"}
              defaultValue={formPayload?.prisonerBasicInfo?.fullName}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["prisonerBasicInfo"]["fullName"] = value;
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
              defaultValue={formPayload?.prisonerBasicInfo?.relationshipName}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["prisonerBasicInfo"]["relationshipName"] = value;
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
              defaultValue={formPayload?.prisonerBasicInfo?.cnic}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["prisonerBasicInfo"]["cnic"] = value;
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <div className="inputs force-active">
              <label>Prisoner Number </label>
              <div className="d-flex align-items-center">
                <InputWidget
                  type={"input"}
                  placeholder="Start"
                  require={false}
                  icon={"icon-operator"}
                  id={"number-range-start"}
                  style={{ marginRight: "-1px", borderRadius: "4px 0 0 4px" }}
                  defaultValue={formPayload?.prisonerBasicInfo?.number?.start}
                  setValue={(startValue) => {
                    const payload = {
                      ...formPayload,
                    };

                    const start = parseInt(startValue);
                    const currentEnd = payload["prisonerBasicInfo"]?.number?.end;

                    if (!isNaN(start)) {
                      payload["prisonerBasicInfo"]["number"] = {
                        ...payload["prisonerBasicInfo"]["number"],
                        start: start
                      };
                    } else {
                      // If start is invalid, remove only the start value
                      const newNumber = { ...payload["prisonerBasicInfo"]["number"] };
                      delete newNumber.start;
                      if (Object.keys(newNumber).length === 0) {
                        delete payload["prisonerBasicInfo"]["number"];
                      } else {
                        payload["prisonerBasicInfo"]["number"] = newNumber;
                      }
                    }

                    setFormPayload(payload);
                  }}
                />
                <span className="mx-2 mb-3">-</span>
                <InputWidget
                  type={"input"}
                  placeholder="End"
                  require={false}
                  id={"number-range-end"}
                  style={{ marginLeft: "-1px", borderRadius: "0 4px 4px 0" }}
                  defaultValue={formPayload?.prisonerBasicInfo?.number?.end}
                  setValue={(endValue) => {
                    const payload = {
                      ...formPayload,
                    };

                    const end = parseInt(endValue);
                    const currentStart = payload["prisonerBasicInfo"]?.number?.start;

                    if (!isNaN(end)) {
                      payload["prisonerBasicInfo"]["number"] = {
                        ...payload["prisonerBasicInfo"]["number"],
                        end: end
                      };
                    } else {
                      // If end is invalid, remove only the end value
                      const newNumber = { ...payload["prisonerBasicInfo"]["number"] };
                      delete newNumber.end;
                      if (Object.keys(newNumber).length === 0) {
                        delete payload["prisonerBasicInfo"]["number"];
                      } else {
                        payload["prisonerBasicInfo"]["number"] = newNumber;
                      }
                    }

                    setFormPayload(payload);
                  }}
                />
              </div>
            </div>
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
                      payload["prisonerBasicInfo"]["dateOfBirth"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerBasicInfo"]["dateOfBirth"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    id={"date-of-birth-start-end-date"}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                  />
                </div>
              </div>
              {(isRoleExist == "Inspector General Prisons" ||
                isRoleExist == "DIG Prisons") && (
                <>
                  <div className="col-lg-3">
                    <div className="inputs force-active">
                      <label>Year Start</label>
                      <InputWidget
                        type="multiSelect"
                        placeholder="Start"
                        id="start-year"
                        options={years}
                        isClearable={true}
                        defaultValue={years.find(
                          (year) =>
                            year.value ===
                            formPayload?.prisonerBasicInfo?.year?.start
                        )}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          
                          if (value) {
                            payload.prisonerBasicInfo.year = {
                              ...payload.prisonerBasicInfo?.year,
                              start: parseInt(value.value)
                            };
                          } else {
                            // If start is cleared, remove only start value
                            const newYear = { ...payload.prisonerBasicInfo?.year };
                            delete newYear.start;
                            if (Object.keys(newYear).length === 0) {
                              delete payload.prisonerBasicInfo.year;
                            } else {
                              payload.prisonerBasicInfo.year = newYear;
                            }
                          }
                          
                          setFormPayload(payload);
                        }}
                        icon={"icon-calender"}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="inputs force-active">
                      <label>Year End</label>
                      <InputWidget
                        type="multiSelect"
                        placeholder="End"
                        id="end-year"
                        options={years.filter(year => 
                          !formPayload?.prisonerBasicInfo?.year?.start || 
                          year.value >= formPayload.prisonerBasicInfo.year.start
                        )}
                        isClearable={true}
                        defaultValue={years.find(
                          (year) =>
                            year.value === formPayload?.prisonerBasicInfo?.year?.end
                        )}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          
                          if (value) {
                            payload.prisonerBasicInfo.year = {
                              ...payload.prisonerBasicInfo?.year,
                              end: parseInt(value.value)
                            };
                          } else {
                            // If end is cleared, remove only end value
                            const newYear = { ...payload.prisonerBasicInfo?.year };
                            delete newYear.end;
                            if (Object.keys(newYear).length === 0) {
                              delete payload.prisonerBasicInfo.year;
                            } else {
                              payload.prisonerBasicInfo.year = newYear;
                            }
                          }
                          
                          setFormPayload(payload);
                        }}
                        icon={"icon-calender"}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Admission Start-End date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={admissionStartDate}
                    endDate={admissionEndDate}
                    onChange={(date) => {
                      setAdmissionDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerBasicInfo"]["admissionDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerBasicInfo"]["admissionDate"]["end"] =
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
           
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Gender"}
              isMulti
              require={false}
              icon={"icon-operator"}
              id={"gender"}
              defaultValue={mapIdsToLabels(
                formPayload?.prisonerBasicInfo?.genders,
                lookup?.genders || []
              )}
              options={lookup?.genders || []}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["prisonerBasicInfo"]["genders"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
          {(isRoleExist == "Inspector General Prisons" ||
            isRoleExist == "DIG Prisons") && (
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Prison"}
                isMulti={true}
                id={"prison"}
                icon={"icon-office"}
                defaultValue={
                  formPayload?.prisonerBasicInfo?.prisonId?.length === prisons?.length 
                    ? [{ value: 'all', label: 'All Prisons' }]
                    : mapIdsToLabels(
                        formPayload?.prisonerBasicInfo?.prisonId,
                        prisons || []
                      )
                }
                options={[
                  { value: 'all', label: 'All Prisons' },
                  ...(prisons || [])
                ]}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };

                  const allPrisonsSelected = value?.some(v => v.value === 'all');

                  if (allPrisonsSelected) {
                    payload.prisonerBasicInfo.prisonId = prisons.map(prison => prison.value);
                  } else {
                    payload.prisonerBasicInfo.prisonId = getIds(value);
                  }

                  setFormPayload(payload);
                }}
                isOptionDisabled={(option) => {
                  return formPayload?.prisonerBasicInfo?.selectAllPrisons && option.value !== 'all';
                }}
                onChange={(selected, action) => {
                  if (action.option?.value === 'all') {
                    return [{ value: 'all', label: 'All Prisons' }];
                  }
                  return selected.filter(option => option.value !== 'all');
                }}
              />
            </div>
          )}
          {(type !== "undertrial" && type !== "convict") && (
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              isMulti={true}
              label={"Category"}
              id={"category"}
              icon={"icon-office"}
              defaultValue={mapIdsToLabels(
                formPayload?.prisonerBasicInfo?.category,
                lookup?.category || []
              )}
              options={lookup?.category || []}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload["prisonerBasicInfo"]["category"] = getIds(value);
                setFormPayload(payload);
              }}
              />
            </div>
          )}

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Currently Confined"}
              isMulti={false}
              id={"currently-confined"}
              icon={"icon-prison"}
              isClearable={true}
              defaultValue={
                formPayload?.prisonerBasicInfo?.currentlyConfined !== undefined
                  ? formPayload.prisonerBasicInfo.currentlyConfined
                    ? { value: true, label: "Yes" }
                    : { value: false, label: "No" }
                  : null
              }
              options={confinedOptions}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };

                payload["prisonerBasicInfo"]["currentlyConfined"] =
                  value?.value;

                setFormPayload(payload);
              }}
            />
          </div>
          </>
          )}
        </div>
      </Collapse>
    </div>
  );
};
export default PrisonerBasicInfoParams;
