import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useDispatch } from 'react-redux';
import { baseImageUrl, postData } from "../../services/request";

import { PayloadFtn } from "./helper/Payload";
import ReportStats from "./components/ReportStats";
import TableGrid from "./components/TableGrid";
import { validateDate } from "../../common/Helpers";
import ReportSearch from "./common/ReportSearch";
import { filteredMasterData } from "./helper/filteredData";

const GuestReport = (props) => {

  const dispatch = useDispatch();
  const [formPayload, setFormPayload] = useState(PayloadFtn);
  const [masterData, setMasterData] = useState([]);
  const [newData, setNewData] = useState();
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [innerModalTitle, setInnerModalTitle] = useState("")
  const [rawData, setRawData] = useState([])
  const [selectedRawData, setSelectedRawData] = useState([])
  const [reportStats, setReportStats] = useState([

  ]);


  useEffect(() => {

  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      
      const res = await postData(
        "/services/app/Reports/MasterReport",
        formPayload
      );
      if (res.result && res.success) {
        swal("Reported Successfully Generated!", "", "success");
        setRawData(res.result.data)
        const mappedData = res.result.data.map(ele => {
          return {
            "Picture": ele.frontPic,
            "Full Name": ele.fullName || "",
            "Designation": ele.designation || "",
            "organization": ele.organization || "",
            "Gender": ele.personalInfo?.gender || "",
            "Other Remarks": ele.OtherRemarks || "",
            "Entry Date": validateDate(ele.EntryDate) || "",

          }
        }
        )
        setMasterData(mappedData)
        const stats = Object.entries(res.result.counts);
        console.log(stats);
        setReportStats(
          stats.map(([name, value]) => ({
            text: `Total ${name.slice(5)}`,
            stat: value,
          }))
        );

        setNewData([]);
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
    return Object.keys(masterData[0]).map((key, index) => {
      return <td className="gridjs-td">
        {index === 0 ? <img src={baseImageUrl + ele[key]} width={100} height={100} /> :
          `${ele[key]}`.indexOf('#') > -1 ?
            <a className="button" href="#" onClick={() => { handleSubData(ele, key, rawData) }}>{ele[key].split('#')[1]}</a> :
            ele[key]}
      </td>
    })
  }

  return (
    <>
      {/*  */}
      <div className="row">
        <h3 className="third-heading db-heading">Guest Report</h3>
      </div>
      <ReportSearch type={"isguest"} formPayload={formPayload} setFormPayload={setFormPayload} />


      <div className="row p-2">
        <form onSubmit={handleGenerateReport}>

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
      <div className="card ">
        <div className="card-body">
          {reportStats.length > 0 && <ReportStats reportStats={reportStats} />}
        </div>
      </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <div className="card-body">
          <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
            <TableGrid thArr={masterData?.length ? Object.keys(masterData[0]) : []} tdArr={masterData} getTDs={getTDs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestReport;
