import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, _ } from 'gridjs-react';
import swal from 'sweetalert';
import {
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import { postData, getData, deleteData, baseImageUrl } from '../../../../services/request';
import MedicalModal from '../MedicalModal';
import Print from '../../../../components/admin/search/Print';
import letter from '../../../../assets/images/users/1.png';
import { Modal } from 'react-bootstrap';
import ShowNoOfRecords from '../../../../common/ShowNoOfRecords';

const generateGridCols = (pos) => {
  
  const entries = {
    'Medicine Type (دوا کی قسم)': '',
    'Medicine Name (دوا کا نام)': '',
    'Generic Name': '',
    'Total Received  (موصول شدہ)': '',
    'Total In Store (اسٹور میں کل)': '',
    'Received Date (تاریخ موصولی)': '',
    "Quantity (تعداد)": '',
    'Expiry Date (ایکسپائری تاریخ)': '',
    'Serial No (سیریل نمبر)': '',
    'Manufacturer (کارخانہ دار)': '',
    'Manufacturing Date (مینوفیکچرنگ کی تاریخ)': '',
    'Description (تفصیل)': '',
    'Medicine Provided By (دوائی کی فراہم۔)': '',
    'Provided By Details (تفصیلات)': '',
    'Relevant Document':'',
    "Actions (عملدرامد)": '',
  };

  return Object.keys(entries);
};

const ViewListing = (props) => {
  const [entries, setEntries] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [newUserData, setNewUserData] = useState([]);
  const [showDocImage, setShowDocImage] = useState(false)
  const [viewDoc, setViewDoc] = useState("") 
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  const newLookups = useSelector((state) => state?.dropdownLookups)
  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    const rawData = sessionStorage.getItem('user');
    const userId = JSON.parse(rawData).userId;

    try {
      const res = await getData(
        `/services/app/Medicine/GetAllMedicineInStore?UserId=${userId}`,
        '',
        true
      );
      console.log('ENTRIES >>>', res);
      if (res.success && res.result !== null) {
        const data = res.result.data;
        setTotalNoOfRecords(data?.length)
        if (data?.length > 0) {
          setEntries(data);
          setNewUserData(data);
        }
      } else {
        swal(
          res.error?.message || 'An error occured',
          res.error?.details || '',
          'warning'
        );
      }
    } catch (err) {
      console.log(err);
      swal('Something went wrong!', '', 'warning');
    }
  };

  const handleOpenModal = () => {
    setModalIsVisible(true);
  };

  const handleCloseModal = () => {
    setModalIsVisible(false);
  };

  const editHandler = (item) => {
    let selectedMedicine = {};
    for (const key in item) {
      if (key === 'quanitity') {
        selectedMedicine['quantity'] = item[key];
      } else {
        selectedMedicine[key] = item[key];
      }
    }
    selectedMedicine.isEdit = true;
    console.log('selectedMedicineselectedMedicine',selectedMedicine);
    setDefaultValues(selectedMedicine);
    setModalIsVisible(true);
  };

  const deleteHandler = async (item) => {
    const medicineStoreId = item.medicineStoreId;

    try {
      const willDelete = await swal({
        title: 'Are you sure?',
        text: 'You want to delete',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (willDelete) {
        await swal('Deleted!', '', 'success');

        const res = await deleteData(
          `/services/app/Medicine/DeleteMedicineStoreEntry?MedicineStoreId=${medicineStoreId}`
        );

        if (res.success) {
          loadGridData();
        }
      }
    } catch (error) {
      swal('An error occured while deleting the medicine!', '', 'warning');
    }
  };

  const gridDataMap = (e) => {
    const mapObj = {
      medicineType: e.medicineType,
      medicineName: e.medicineName,
      GenericName: newLookups.medicine.filter(item => item.id === e.medicineId)[0]?.abbreviation,
      totalRecived: e.totalRecived,
      totalInStore: e.totalInStore,
      recieveDate: validateDate(e.recieveDate),
      quantity: e.quanitityFull,
      expiryDate: validateDate(e.expiryDate),
      serialNo: e.serialNo,   
      Manufacturer: e.manufacturer,
      ManufacturingDate : validateDate(e.manufacturingDate),
      description : e.discription,
      medicineProvidedBy : e.providedBy == 0 ? "Donor" : e.providedBy == 1 ? "Government's MSD" : e.providedBy == 2 ? "Self" : "other" ,
      providedByOthers : e.providedByOther,
      uploadedDocuments: e.uploadedDocuments ? _(<img onClick={() => { setShowDocImage(true), setViewDoc(baseImageUrl + e.uploadedDocuments) }} width={100} src={baseImageUrl + e.uploadedDocuments} />) : _(<img width={100} src={letter} />),
      Actions: _(
        <div className="action-btns">
          <button
            id={'edit-btn'}
            type="button"
            className="tooltip btn btn-secondary waves-effect waves-light mx-1"
            onClick={editHandler.bind(this, e)}
          >
            <i className="icon-edit"></i>
            <span>Edit</span>
          </button>
          {/* <button
            id={'delete-btn'}
            type="button"
            onClick={deleteHandler.bind(this, e)}
            className="tooltip btn btn-danger waves-effect waves-light mx-1"
          >
            <i className="icon-delete"></i>
            <span>Delete</span>
          </button> */}
        </div>
      ),
    };

    return mapObj;
  };

  const newData = newUserData.map(x => {
    return {
      'Medicine Name': x.medicineName,
      'Total Recived': x.totalRecived,
      'Total in Store': x.totalInStore,
      'Recived Date': validateDate(x.recieveDate),
      'Quantity': x.quanitity,
      'Expiry Date': validateDate(x.expiryDate),
      'Serial No': x.serialNo,
      "Manufacturer": x.manufacturer,
      'description' : x.discription,
       medicineProvidedBy : x.providedBy == 0 ? "Donor" : x.providedBy == 1 ? "Government's MSD" : x.providedBy == 2 ? "Self" : "other" ,
      'providedByOthers' : x.providedByOther,


    }
  })

  const download = async () => {
  
    const nameSplit = viewDoc.split("Admin");
    const duplicateName = nameSplit.pop();
    const link = document.createElement('a');
    link.href = viewDoc;
    const newString = duplicateName.replace(/\\/g, ''); 
    link.download = newString; 
    link.target ='_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeDocImage = () => {
    setShowDocImage(!showDocImage)
  }
  
  return (
    <>
      <MedicalModal
        visible={modalIsVisible}
        title="Add Medicine"
        onClose={handleCloseModal}
        medicine
        refetch={loadGridData}
        defaultValues={defaultValues}
      />

      <div className="btns">
        <Print data={newData} filename={'Medical Stock'} />
        <button
            id={'add-medicine-btn'}
            className="btn my-2 btn-success "
            onClick={handleOpenModal}
          >
            Add Medicine
          </button>
          </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-2">
        <div className="row">
          <div className="col">
            <div className="float-end">
              <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} type={"Medicines"}/>
            </div>
            <Grid
              data={transformDataForTableGrid(
                entries.map((entry) => gridDataMap(entry))
              )}
              columns={generateGridCols()}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: pageLimit,
              }}
            />
          </div>
        </div>
      </div>
             {/*------------------ Show Documents in Modal ---------------*/}
      <Modal show={showDocImage} size='lg'>
        <Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-td profile-td-hover">

            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              src={`${viewDoc
                }`}
              width="500"
              height="500"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
            Download
          </button>
          {/* <a href={viewDoc} download={true} className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1'>Download</a> */}
          <button
            id={'cancel-btn'}
            className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
            onClick={closeDocImage}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewListing;
