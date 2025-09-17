import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useDispatch } from 'react-redux';
import { validateDate } from "../../common/Helpers";
import { postData } from "../../services/request";
import ReportStats from "./components/ReportStats";
import TableGrid from "./components/TableGrid";
import { PayloadFtn } from "./helper/Payload";
import PrisonerHospitalForm from "./components/PrisonerHospitalForm";
import Print from "../../components/admin/search/Print";

const TreatmentWiseMedicalReport = (props) => {
  const dispatch = useDispatch();
  const [formPayload, setFormPayload] = useState(PayloadFtn);
  const [TreatmentData, setTreatmentData] = useState();
  const [newData, setNewData] = useState();

  const [reportStats, setReportStats] = useState([]);

  const treatmentWiseGridColumms = [
    "Photo", "Name", "Father's Name", "Priosner Number", "Admission Date", "Treatment Type", "Category", "CNIC", "Treatment Date", "Disease",
    "Known Case of", "Diagnosis", "Presently Complaining", "Special Diet", "Investigations", "Treatment",
    "Treatment Number", "Presently Complaining", "Special Diet", "Investigations", "Pluse", "Blood Pressure",
    "Temprature", "GCS", "FBS RBS", "CheckUp Date",
  ]
  const headers = treatmentWiseGridColumms.slice(1)

  useEffect(() => {
    const rawData = sessionStorage.getItem("user");
    const prisonId = JSON.parse(rawData)?.employee?.prisons.map((e) => e.prisonId);
    PayloadFtn['prisonerNumber']['prisonId'] = prisonId
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
        <h3 className="third-heading db-heading">Treatment Wise Report</h3>
      </div>

      <div className="row p-2">
        <form onSubmit={handleGenerateReport}>
          <div className="row">
            <div className="row">
              <PrisonerHospitalForm type={"treatment"} formPayload={formPayload} setFormPayload={setFormPayload} />
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
      <Print data={newData} headers={headers} filename={"Treatment Wise Medical Report"} />

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
        <TableGrid thArr={treatmentWiseGridColumms} tdArr={TreatmentData} />
      </div>
    </>
  );
};

export default TreatmentWiseMedicalReport;
