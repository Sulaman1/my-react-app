import { Grid, _ } from "gridjs-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import { useSelector } from "react-redux";

import {
  formatDate,
  getDateMinusDays,
  getFormattedDate,
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import { getData } from "../../../services/request";
import Print from "../../../components/admin/search/Print";
import CPHistoryModal from "./CPHistoryModal";

const ViewCPHistory = () => {
  const today = new Date();
  const show = useSelector((state) => state.language.urdu);

  const [formPayload, setFormPayload] = useState({
    fromDate: getDateMinusDays(today, 7),
    toDate: today,
  });
  const [entries, setEntries] = useState([]);
  const [loadedHearings, setLoadedHearings] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [csvEntries, setCsvEntries] = useState([]);

  function generateGridCols() {
    const cols = {
      [`Court Production Date/Warrant date${show ? ' (تاریخ برائے پیشی/ وارنٹ دیتاریخ)' : ''}`]: "",
      [`Marasla Date${show ? ' (تاریخ ماراسلا )' : ''}`]: "",
      [`Total Hearings prisoners${show ? ' (کل پیشیاں)' : ''}`]: "",
      [`Total Physical prisoners${show ? ' (کل پیشیاں)' : ''}`]: "",
      [`Total warrants${show ? ' (کل وارنٹ)' : ''}`]: "",
      [`Prison Name${show ? ' (جیل کا نام)' : ''}`]: "",
      [`Action${show ? ' (عملدرامد)' : ''}`]: "",
    };

    return Object.keys(cols);
  }

  const gridDataMap = (e) => {
    const mapObj = {
      courtProductionDate: validateDate(e?.courtProductionDate),
      maraslaDate: validateDate(e?.maraslaDate),
      totalHearings: e?.totalHearings || "-------",
      totalPhysical: e?.totalPhysical || "-------",
      totalWarrants: e?.totalWarrants || "-------",
      prisonName: e?.prison || "-------",
      Action: _(
        <div className="action-btns">
          <button
            type="button"
            onClick={() => handleClick(e)}
            className="tooltip btn btn-prim waves-effect waves-light mx-1"
          >
            <i className="icon-show-password"></i>
            <span>{`View Hearings${show ? ' (پیشیاں دیکھیں)' : ''}`}</span>
          </button>
        </div>
      ),
    };

    return mapObj;
  };
  
  const handleClick = async (e) => {

    setLoadedHearings(e);
    setModalIsVisible(true);
   
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!formPayload.fromDate || !formPayload.toDate) {
      swal("Please select the From and To date");
      return;
    }
    const fromDate = formatDate(formPayload.fromDate);
    const toDate = formatDate(formPayload.toDate);

    try {
      const res = await getData(
        `/services/app/CourtProduction/GetAllMaraslaLists?DateTo=${toDate}&DateFrom=${fromDate}`,
        "",
        true
      );
      if (res.success && res.result.isSuccessful) {
        const data = res?.result?.maraslas;
        console.log("ENTRIES >>>", data);
        if (data?.length > 0) {
          setEntries(data);
          setCsvEntries(data);
        }
      }
    } catch (error) {
      swal("Something went wrong!", "", "warning");
    }
  };

  const newCsv = csvEntries.map((x) => {
    const csv = {
      "court Production Date": validateDate(x.courtProductionDate),
      "police Officer Name": x.policeOfficerName,
      "vehicle Number": x.vehicleNumber,
      "other Details": x.otherDetails,
      "total Hearings": x.totalHearings,
    };
    return csv;
  });

 
  return (
    <>
  <CPHistoryModal modalIsVisible={modalIsVisible} closeModal={() => setModalIsVisible(false)} loadedHearings={loadedHearings} />
      <div className="col-12 px-0">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6">
              <div className="inputs force-active">
                <label>{`From Date${show ? ' (شروع کی تاریخ)' : ''}`}</label>
                <DatePicker
                  selected={getFormattedDate(formPayload.fromDate)}
                  onChange={(date) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["fromDate"] = date;
                    setFormPayload(payload);
                  }}
                  dateFormat="dd/MM/yyyy"
                  icon={"icon-operator"}
                  id={"from-date"}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="inputs force-active">
                <label>{`To Date${show ? ' (اختتام کی تاریخ)' : ''}`}</label>
                <DatePicker
                  selected={getFormattedDate(formPayload.toDate)}
                  onChange={(date) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["toDate"] = date;
                    setFormPayload(payload);
                  }}
                  dateFormat="dd/MM/yyyy"
                  icon={"icon-operator"}
                  minDate={formPayload.fromDate}
                  id={"to-date"}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                />
              </div>
            </div>
          </div>
          <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
            <button
              id={"search-btn"}
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
            >
              <i className="icon-search ml-2"></i> Search
            </button>
          </div>
        </form>
      </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-5 ">
        <Print data={newCsv} filename={"Court production history"} />
        <div className="row">
          <Grid
            data={transformDataForTableGrid(entries.map((e) => gridDataMap(e)))}
            columns={generateGridCols()}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ViewCPHistory;