import { useState, useEffect } from "react";
import { transformData, getIds, getValueFromList } from "../../../common/Helpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { lookupName } from "../../../components/admin/system-settings/lookupNames";
import { useSelector } from "react-redux";

const InventorySearch = ({ type, formPayload, setFormPayload }) => {
  const [productionDateRange, setProductionDateRange] = useState([null, null]);
  const [startProductionDate, endProductionDate] = productionDateRange;
	const newLookups = useSelector((state) => state?.dropdownLookups) 

  const [lookup, setLookup] = useState();


  useEffect(() => {

    fetchLookUps();

  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
  
      const policeStationObj = transformData(newLookups?.policeStation);
      lookup["policeStation"] = policeStationObj;
    
      const courtObj = transformData(newLookups?.court);
      lookup["court"] = courtObj;

      const inventoryTypeObj = transformData(newLookups?.inventoryType);
      lookup["inventoryType"] = inventoryTypeObj;

      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };



  return (
    <div className="row">
      <div className="col-lg-3">
        <div className='inputs force-active'>
          <label>Start-End Date</label>
          <DatePicker
            icon={"icon-calendar"}
            dateFormat="dd/MM/yyyy"
            selectsRange={true}
            startDate={startProductionDate}
            endDate={endProductionDate}
            onChange={(date) => {
              setProductionDateRange(date);
              const payload = {
                ...formPayload,
              };
              payload["prisonerCase"]["productionOrderDateStart"] =
                date && date[0] != null
                  ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                  }-${date[0].getDate()}`
                  : "";
              payload["prisonerCase"]["productionOrderDateEnd"] =
                date && date[1] != null
                  ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                  }-${date[1].getDate()}`
                  : "";
              setFormPayload(payload);
            }}
            isClearable={true}
            id={"start-end-date"}
          /></div>
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"multiSelect"}
          label={"Prison Name"}
          require={false}
          isMulti={true}
          icon={"icon-operator"}
          id={"Decision-authority"}
          options={lookup?.policeStation}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["prisonerCase"]["decisionAuthorityId"] =
              getIds(value);
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={'multiSelect'}
          inputType={'name'}
          label={'Inventory Type (دوا)'}
          id={'Inventory'}
          multiple={false}
          icon={'icon-medical'}
          options={lookup?.inventoryType || []}
          defaultValue={getValueFromList(
            lookup?.inventoryType,
            formPayload.inventoryType
          )}
          setValue={(value) => {
            console.log('inventoryType', value);
            const payload = {
              ...props.formPayload,
            };
            payload['inventoryType'] = value.value;
            setFormPayload(payload);
          }}
        />
      </div>


    </div>
  )
};
export default InventorySearch;






