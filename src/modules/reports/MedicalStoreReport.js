import React, { useState } from 'react'
import swal from 'sweetalert';
import TableGrid from './components/TableGrid';
import MedicalStoreSearch from './components/MedicalStoreSearch';
import { postData } from '../../services/request';
import Print from '../../components/admin/search/Print';
import { validateDate } from '../../common/Helpers';

const MedicalStoreReport = () => {
  const [formPayload, setFormPayload] = useState({});
  const [courtData, setcourtData] = useState();
  const [newData, setNewData] = useState();

  const [reportStats, setReportStats] = useState([]);

  const [visibleModal, setVisibleModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [innerModalTitle, setInnerModalTitle] = useState("")
  const [rawData, setRawData] = useState([])
  const [selectedRawData, setSelectedRawData] = useState([])
  const headers = courtData?.length ? Object.keys(courtData[0]).filter(header => header !== "Picture") : [];

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    try {
      
      const res = await postData(
        "/services/app/Reports/MedicineReport",
        formPayload
      );
      if (res.result && res.success && res.result.medicines?.length > 0) {
        await swal("Reported Successfully Generated!", "", "success");
        setRawData(res?.result?.medicines)

        const mappedData = res.result?.medicines.map(ele => {
          return {
            "Medicine Name": ele.name || '',
            "Medicine Type": ele.medicineType || '',
            "Batch Number": ele?.medicineStore[0]?.batchNumber || '',
            "Recieve Date": validateDate(ele?.medicineStore[0]?.recieveDate ) ? new Date(ele?.medicineStore[0]?.recieveDate ).toDateString() : "",
            "Quantity Recieved": ele.medicineStore[0]?.quanitityRecieved || '',
            "Quantity Used": ele.medicineStore[0]?.quanitityUsed || '',
            "Quantity Type": ele.medicineStore[0]?.quantityType || '',
            "Per Pack Count": ele.medicineStore[0]?.perPackCount || '',
            "Packs Recieved": ele.medicineStore[0]?.packsRecieved || '',
            "Manufacturing Date": validateDate(ele?.medicineStore[0]?.manufacturingDate ) ? new Date(ele?.medicineStore[0]?.manufacturingDate ).toDateString() : "",
            "Expiry Date": validateDate(ele?.medicineStore[0]?.expiryDate ) ? new Date(ele?.medicineStore[0]?.expiryDate ).toDateString() : "",
            "Discription": ele.medicineStore[0]?.discription || '',
            "Serial No": ele.medicineStore[0]?.serialNo || '',
            "Page Number": ele.medicineStore[0]?.pageNumber || '',
            "Manufacturer": ele.medicineStore[0]?.manufacturer || '',
            "Provided By": ele.medicineStore[0]?.providedBy || '',
            "Medicine Donor": ele.medicineStore[0]?.medicineDonorId || '',
            "Provied By": ele.medicineStore[0]?.providedByOther || '',
          }
        })
        setcourtData(mappedData);
        const stats = Object.entries(res.result.medicines);
        console.log(stats);
        setReportStats(
          stats.map(([name, value]) => ({
            text: `Total ${name.slice(5)}`,
            stat: value,
          }))
        );
        const Data = mappedData.map(e => {
          const { Picture, ...rest } = e;
          return rest;
        });
        setNewData(Data);
      
      }
      else if (res.result?.medicines?.length === 0) {
        swal('No Data Found', "", "warning")
        
      }
      else {
        
        swal(res.error?.message || 'error', res.error?.details ?? "", "error");
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


  function getTDs(ele) {
    return Object.keys(courtData[0]).map((key, index) => {
      return <td className="gridjs-td">
        {`${ele[key]}`.indexOf('#') > -1 ?
          <a className="button" href="#" onClick={() => { handleSubData(ele, key, rawData) }}>{ele[key].split('#')[1]}</a> :
          ele[key]}
      </td>
    })
  }

  return (<>
    <div>MedicalStoreReport</div>
    <MedicalStoreSearch formPayload={formPayload} setFormPayload={setFormPayload}/>
    <div className="row p-2">
        <form onSubmit={handleGenerateReport}>
          <div className="row">
            <div className="row">
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
        {reportStats.length > 0 && <>
      <div className="row p-2">
          <Print data={newData} headers={headers} filename={"Medical store Report"} /> 
      </div>
          </>}
          {courtData &&(
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
        <TableGrid thArr={courtData?.length ? Object.keys(courtData[0]) : []} tdArr={courtData} getTDs={getTDs} />
      </div>
      )}
  </>
  )
}

export default MedicalStoreReport