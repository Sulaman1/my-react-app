import React, { useEffect, useState } from "react";
import {
  getIds,
  getItemFromList,
  getValueFromList,
  transformData,
} from "../../common/Helpers";
import { getData } from "../../services/request";
import InputWidget from "../../droppables/InputWidget";
import "react-datepicker/dist/react-datepicker.css";
import { lookupName } from "../../components/admin/system-settings/lookupNames";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const GoodsSearch = ({
  formPayload,
  setFormPayload,
  handleSearch,
  handleReset,
}) => {
  const [searchVisibility, setSearchVisibility] = useState(false);
  const [inventorys, setInventory] = useState([]);
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [date, setDate] = useState(new Date());
  const [entryTimeDate, setEntryTimeDate] = useState([null, null]);
  const [entryStartDate, entryEndDate] = entryTimeDate;
  const [exitTimeRange, setEitTimeDate] = useState([null, null]);
  const [exitStartDate, exitEndDate] = exitTimeRange;
   const userMeta = useSelector((state) => state.user);
  const isSpOrDarban = userMeta?.role === "Darban" || userMeta?.role === "Prison Superintendent"
  const [fetchedData, setFetchedData] = useState({
    inventoryTypes: [],
    inventory: [],
  });

  const fetchApiData = async () => {
    try {
      const data = {
        prison: transformData(newLookups?.prison),
        inventory: transformData(newLookups?.inventory),
        inventoryTypes: transformData(newLookups?.inventoryType),
        prison: transformData(newLookups?.prison),
      };
      setFetchedData(data);
    } catch (err) {
      alert("An error occurred");
    }
  };

  useEffect(() => {
    fetchApiData();
  }, [newLookups]);

  const handleSearchVisibility = () => {
    setSearchVisibility((prevVisibility) => !prevVisibility);
  };


  const handleFetchInventory = async (invTypeId) => {
    const url = `${
      lookupName.inventory
    }?inventoryTypeId=${invTypeId}&inventoryType=${getItemFromList(
      fetchedData.inventoryTypes,
      invTypeId
    )}`;
    const fetchedInventory = await getData(url, "", true);
    if (fetchedInventory.result.isSuccessful) {
      const inventoryObj = transformData(fetchedInventory.result.data);
      setInventory(inventoryObj);
      setFetchedData((prevLookups) => ({
        ...prevLookups,
        inventory: inventoryObj,
      }));
    }
  };

  return (
    <>
      <button
        className="btn btn-prim search-btn-prim"
        onClick={handleSearchVisibility}
      >
        {searchVisibility ? "Hide" : "Show"} Search
      </button>
      {searchVisibility && (
        <div className="animation-fade-grids mt-3 mb-3 pt-2 pb-5">
          <h2>Search Parameters</h2>
          <div className="col-12">
            <div className="row">
              <div className="col-12 px-0 mt-1">
                <form>
                  <div className="row animation-left">
                    <div className="col-lg-3">
                      <InputWidget
                        type="multiSelect"
                        inputType="name"
                        label="Items Type "
                        id="medicine-type"
                        require
                        multiple={false}
                        icon="icon-medical"
                        options={fetchedData.inventoryTypes || []}
                        defaultValue={getValueFromList(
                          fetchedData.inventoryTypes,
                          formPayload.inventoryTypesId
                        )}
                        setValue={(value) => {
                          handleFetchInventory(value.value);
                          // setFormPayload({ ...formPayload, inventoryTypeId: value.value });
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputWidget
                        type="multiSelect"
                        inputType="name"
                        label="Item "
                        id="medicine"
                        require
                        multiple={false}
                        icon="icon-medical"
                        options={inventorys}
                        defaultValue={getValueFromList(
                          inventorys,
                          formPayload.inventoryId
                        )}
                        setValue={(value) => {
                          setFormPayload({
                            ...formPayload,
                            inventoryId: value.value,
                          });
                        }}
                      />
                    </div>

                    <div className="col-lg-3">
                      <div className="inputs force-active">
                        <label>Entry Start-End date</label>
                        <DatePicker
                          icon={"icon-calendar"}
                          dateFormat="dd/MM/yyyy"
                          selectsRange={true}
                          startDate={entryStartDate}
                          endDate={entryEndDate}
                          onChange={(date) => {
                            setEntryTimeDate(date);
                            const payload = {
                              ...formPayload,
                            };
                            payload["EntryTimeFrom"] =
                              date && date[0] != null
                                ? `${date[0].getFullYear()}-${
                                    date[0].getMonth() + 1
                                  }-${date[0].getDate()}`
                                : "";
                            payload["EntryTimeTo"] =
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
                          id={"release-start-end-date"}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="inputs force-active">
                        <label>Exit Start-End Date</label>
                        <DatePicker
                          icon={"icon-calendar"}
                          dateFormat="dd/MM/yyyy"
                          selectsRange={true}
                          startDate={exitStartDate}
                          endDate={exitEndDate}
                          onChange={(date) => {
                            setEitTimeDate(date);
                            const payload = {
                              ...formPayload,
                            };
                            payload["ExitTimeFrom"] =
                              date && date[0] != null
                                ? `${date[0].getFullYear()}-${
                                    date[0].getMonth() + 1
                                  }-${date[0].getDate()}`
                                : "";
                            payload["ExitTimeTo"] =
                              date && date[1] != null
                                ? `${date[1].getFullYear()}-${
                                    date[1].getMonth() + 1
                                  }-${date[1].getDate()}`
                                : "";
                            props.setFormPayload(payload);
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

                   { !isSpOrDarban && (
                     <div className="col-lg-3">
                      <InputWidget
                        type={"multiSelect"}
                        label={"Prison"}
                        id={"prison"}
                        // isMulti={true}
                        icon={"icon-office"}
                        options={fetchedData?.prison || []}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["PrisonId"] = value.value;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                    <div className="col-lg-3">
                      <InputWidget
                        type={"switch"}
                        inputType={"checkbox"}
                        label={"Exited"}
                        id={"Exited"}
                        require={false}
                        defaultValue={formPayload?.IsExit}
                        setValue={(checked) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["IsExit"] = checked;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
                    <button
                      onClick={handleSearch}
                      className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
                    >
                      <i className="icon-search ml-2"></i> Search
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn rounded-pill w-lg btn-secondary waves-effect waves-light"
                    >
                      <i className="icon-refresh ml-2"></i> Reset Table
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoodsSearch;

// // Helper Functions
// const formatTime = (time) => {
//   return `${time.hour || "12"}:${time.minute} ${time.meridiem}`;
// };

// const updatePayload = (formPayload, date, key, time) => {
//   if (date) {
//     return {
//       ...formPayload,
//       [key]: `${date.getFullYear()}-${
//         date.getMonth() + 1
//       }-${date.getDate()} ${formatTime(time)}`,
//     };
//   }
//   return formPayload;
// };
