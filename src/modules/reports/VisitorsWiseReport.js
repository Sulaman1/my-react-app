import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useDispatch } from 'react-redux';
import { postData } from "../../services/request";
import ReportStats from "./components/ReportStats";
import TableGrid from "./components/TableGrid";
import { PayloadFtn } from "./helper/Payload";
import Print from "../../components/admin/search/Print";
import { filteredMasterData } from "./helper/filteredData";
import CommonModal from "./common/CommonModal";
import VisitorSearch from "./helper/VisitorSearch";
import AddressForm from "./components/AddressForm";
import { cleanReportsPayload } from "../../common/Helpers";

const VisitorsWiseReport = (props) => {
  const [formPayload, setFormPayload] = useState({
    "relationship": [],
    "country": [],
    "province": [],
    "district": [],
    "city": [],
  });
  const [VisitorData, setVisitorData] = useState();
  const [newData, setNewData] = useState();
  console.log('newData: ', newData);

  const [visibleModal, setVisibleModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [innerModalTitle, setInnerModalTitle] = useState("")
  const [rawData, setRawData] = useState([])
  const [selectedRawData, setSelectedRawData] = useState([])
  const [reportStats, setReportStats] = useState([
    { text: "Total Prisoners", stat: 0 },
    { text: "Males", stat: 0 },
    { text: "Females", stat: 0 },
  ]);


  const headers = VisitorData?.length ? Object.keys(VisitorData[0]).filter(header => header !== "Picture") : []


  useEffect(() => {
  }, []);


  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      const cleanedPayload = cleanReportsPayload(formPayload);
      const res = await postData(
        "/services/app/Reports/VisitorWiseReport",
        cleanedPayload
      );
      if (res.result && res.success) {
        await swal("Reported Successfully Generated!", "", "success");
        setRawData(res.result.data)
        console.log(res.result.data, 'dataaaaaaaaaaaaaa');
        const mappedData = res.result.data.map(ele => {
          return {
            "Id": ele.id,
            "Visitor Name": ele.fullName || "",
            "Visitor CNIC": ele.cnic || "",
            "Contact Number": ele.contactNumber || "",
            "Visitor Father's Name": ele.relationshipName || "",
            "Visits Details": `#${ele?.totalVisits}` || "",
          }
        })
        setVisitorData(mappedData);

        setNewData(mappedData);
      } else {
        swal(res.error?.message, res.error?.details ?? "", "error");
      }
    } catch (error) {
      console.log(error);
      swal("Something went wrong", "", "error");
    }
  };

  const handleSubData = (ele, key, rawData) => {
    const res = filteredMasterData(ele, key, rawData)
    openModal(res?.mappedData, res?.childData, res?.key)
  }

  function openModal(mappedData, childData, key) {

    setVisibleModal(!visibleModal);
    setInnerModalTitle(key);
    setModalData(mappedData);
    setSelectedRawData(childData)
  }



  const onClose = () => {
    setVisibleModal(false)
  }

  function getTDs(ele) {
    return Object.keys(VisitorData[0]).map((key, index) => {
      return <td className="gridjs-td">
        {`${ele[key]}`.indexOf('#') > -1 ?
          <a className="button" href="#" onClick={() => { handleSubData(ele, key, rawData) }}>{ele[key].split('#')[1]}</a> :
          ele[key]}
      </td>
    })
  }


  return (
    <>
      <div className="row">
        <h3 className="third-heading db-heading">Visitors Wise Report</h3>
      </div>
      <VisitorSearch formPayload={formPayload} setFormPayload={setFormPayload} />

      {selectedRawData && selectedRawData.length && (
        <CommonModal visible={visibleModal}
          typeTitle={innerModalTitle}
          data={modalData}
          selectedRawData={selectedRawData}
          onClose={() => { onClose() }} />

      ) || null
      }
      <div className="row p-2">
        <form onSubmit={handleGenerateReport}>
          <div className="row">
          <AddressForm formPayload={formPayload} setFormPayload={setFormPayload} />

            <div className="row mt-5">
            </div>
          </div>
          <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
            <button
              id={"generate-report-button"}
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
            >
              Generate Report <i className="icon-add ml-2"></i>
            </button>
          </div>
        </form>
      </div>
      {/* Stats */}
      <div className="row p-2">
        {reportStats.length > 0 && <ReportStats reportStats={reportStats} />}
      </div>
      <Print data={newData} headers={headers} filename={"Visitor Wise Report"} />

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
        <TableGrid thArr={VisitorData?.length ? Object.keys(VisitorData[0]) : []} tdArr={VisitorData} getTDs={getTDs} />

      </div>
    </>
  );
};

export default VisitorsWiseReport;
