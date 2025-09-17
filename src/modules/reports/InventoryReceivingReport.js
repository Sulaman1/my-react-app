import { useState, useEffect } from "react";
import swal from "sweetalert";
import { validateDate } from "../../common/Helpers";
import { postData } from "../../services/request";
import ReportStats from "./components/ReportStats";
import TableGrid from "./components/TableGrid";
import { PayloadFtn } from "./helper/Payload";
import Print from "../../components/admin/search/Print";
import InventorySearch from "./components/InventorySearch";

const InventoryReceivingReport = (props) => {
  const [formPayload, setFormPayload] = useState(PayloadFtn);
  const [TreatmentData, setTreatmentData] = useState();
  const [newData, setNewData] = useState();

  const [reportStats, setReportStats] = useState([
    { text: "Total Prisoners", stat: 0 },
    { text: "Males", stat: 0 },
    { text: "Females", stat: 0 },
    { text: "No of Items", stat: 0 },
    { text: "No of Item Types", stat: 0 },
  ]);

  const inventoryColumns = [
    "Prison", "Item Type", "Item Name", "Item Receive Date", "Qty Received", "Received by", "Batch No", "Serial Number",
    "Manufacturer", "Manufacturing Date"
  ]
  const headers = inventoryColumns.slice(1)

  useEffect(() => {
  }, []);



  const handleGenerateReport = async (e) => {
    let mappedData = []
    e.preventDefault();
    try {
      
      const res = await postData(
        "/services/app/Reports/MasterReport",
        formPayload
      );
      if (res.result && res.success) {
        await swal("Reported Successfully Generated!", "", "success");
        console.log(res.result.data, 'dataaaaaaaaaaaaaa');
        res.result.data.forEach(ele => {
          mappedData.push([ele.frontPic, ele.fullName, ele.relationshipName, ele.prisonerNumber,
          validateDate(ele.admissionDate) ? new Date(ele.admissionDate).toDateString() : "", "", ele.prisonerCategory, ele.cnic, "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "", "", "", "", "",])
        })
        setTreatmentData(mappedData);
        const stats = Object.entries(res.result.counts);
        console.log(stats);
        setReportStats(
          stats.map(([name, value]) => ({
            text: `Total ${name.slice(5)}`,
            stat: value,
          }))
        );
        const Data = mappedData?.map(entry => entry.slice(1));
        setNewData(Data);
      } else {
        swal(res.error?.message, res.error?.details ?? "", "error");
      }
    } catch (error) {
      console.log(error);
      swal("Something went wrong", "", "error");
    }
  };

  return (
    <>
      <div className="row">
        <h3 className="third-heading db-heading">Receiving Wise Report</h3>
      </div>
      <div className="row p-2">
        <form onSubmit={handleGenerateReport}>
          <div className="row">
            <div className="row">
              <InventorySearch type={"receving"} formPayload={formPayload} setFormPayload={setFormPayload} />
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
        <ReportStats reportStats={reportStats} />
      </div>
      <Print data={newData} headers={headers} filename={"Inventory Receving Report"} />

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
        <TableGrid thArr={inventoryColumns} tdArr={TreatmentData} />
      </div>
    </>
  );
};

export default InventoryReceivingReport;
