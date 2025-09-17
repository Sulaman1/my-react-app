import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { transformData } from "../../../common/Helpers";

const MedicalStoreSearch = (props) => {
  const [prisonerData, setPrisonerData] = useState({});
  const [visitDateRange, setVisitDateRange] = useState([]);
  const [visitStartDate, visitEndDate] = visitDateRange;
  const newLookups = useSelector((state) => state?.dropdownLookups);

  useEffect(() => {
    fetchPrisonserData();
  }, []);

  const fetchPrisonserData = async () => {
    try {
      const Data = {};
      const medicineObj = transformData(newLookups?.medicine);
      Data["medicine"] = medicineObj;
      const medicineTypeId = transformData(newLookups?.medicineType);
      Data["medicineType"] = medicineTypeId;
      setPrisonerData(Data);
    } catch (error) {
      console.error(error);
      alert("something went wrong in lookups api");
    }
  };

  return (
    <>
      <div className="col-12 my-3 card-body card">
        <div className="row"></div>
        <h4 className="third-heading sub-fill-heading">Medical Store Report</h4>
        <form className="card-body card">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-3">
                  <InputWidget
                    type={"multiSelect"}
                    inputType={"name"}
                    options={prisonerData.medicine || []}
                    label={"Medicine"}
                    onlyNumbers={true}
                    icon={"icon-medical"}
                    setValue={(value) => {
                      const payload = {
                        ...props?.formPayload,
                      };
                      payload["medicneId"] = value.value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputWidget
                    type={"multiSelect"}
                    inputType={"name"}
                    options={prisonerData.medicineType || []}
                    label={"Medicine Type"}
                    onlyNumbers={true}
                    icon={"icon-medical"}
                    setValue={(value) => {
                      const payload = {
                        ...props?.formPayload,
                      };
                      payload["medicineTypeId"] = value.value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <div className="inputs force-active">
                    <label>recieve Start-End Date</label>
                    <DatePicker
                      icon={"icon-calendar"}
                      dateFormat="dd/MM/yyyy"
                      selectsRange={true}
                      startDate={visitStartDate}
                      endDate={visitEndDate}
                      onChange={(date) => {
                        setVisitDateRange(date);
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["recieveDateStart"] =
                          date && date[0] != null
                            ? `${date[0].getFullYear()}-${
                                date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                            : "";
                        payload["recieveDateEnd"] =
                          date && date[1] != null
                            ? `${date[1].getFullYear()}-${
                                date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                            : "";
                        props.setFormPayload(payload);
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
                <div className="col-lg-3">
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    label={"Batch number"}
                    icon={"icon-number"}
                    setValue={(value) => {
                      const payload = {
                        ...props.formPayload,
                      };
                      payload["batchNumber"] = value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default MedicalStoreSearch;
