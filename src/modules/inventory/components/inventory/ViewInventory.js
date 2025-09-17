import { useEffect, useState } from 'react';

import { Grid, _ } from 'gridjs-react';
import swal from 'sweetalert';
import { postData, getData, deleteData, baseImageUrl } from '../../../../services/request';
import Print from '../../../../components/admin/search/Print';
import InventoryModal from './InventoryModal';
import { transformDataForTableGrid, validateDate } from '../../../../common/Helpers';
import ProfilePic from '../../../../assets/images/users/1.png';
import Modal from 'react-bootstrap/Modal';
import ShowNoOfRecords from '../../../../common/ShowNoOfRecords';

const generateGridCols = (pos) => {
  const entries = {
    'inventory Name (انوینٹری کا نام)': '',
    'inventory Type  (انوینٹری کی قسم)': '',
    'total Recived (اسٹور میں کل)': '',
    'total In Store (اسٹور میں کل)': '',
    'batch Number (اسٹور میں کل)': '',
    'Received Date (تاریخ موصولی)': '',
    "Quantity (تعداد)": '',
    // 'Expiry Date (ایکسپائری تاریخ)': '',
    'manufacturing Date (ایکسپائری تاریخ)': '',
    'Serial No (سیریل نمبر)': '',
    'manufacturer (سیریل نمبر)': '',
    'Items Provided By (انوینٹری کی فراہم۔)': '',
    'Provided By Details (تفصیلات)': '',
    'Uploaded Documents': '',
    "Actions (عملدرامد)": '',
  };

  return Object.keys(entries);
};

const ViewInventory = (props) => {
  const [entries, setEntries] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [newUserData, setNewUserData] = useState([]);
  const [showDocImage, setShowDocImage] = useState(false)
	const [viewDoc, setViewDoc] = useState("")
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  const closeDocImage = () => {
		setShowDocImage(!showDocImage)
	  }

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
    document.body.removeChild(link)
  };


  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    const rawData = sessionStorage.getItem('user');
    const userId = JSON.parse(rawData).userId;
    try {
      const res = await getData(
        `/services/app/Inventory/GetOneInventoryItemInPrison?InventoryId=${0}`,
        '',
        true
      );
      console.log('ENTRIES >>>', res);
      if (res.success && res.result !== null) {
        const data = res.result.data;
        if (data?.length > 0) {
          setTotalNoOfRecords(data?.length);
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

    console.log(selectedMedicine);
    setDefaultValues(selectedMedicine);
    setModalIsVisible(true);
  };

  const gridDataMap = (e) => {
    const mapObj = {
      inventoryName: e.inventoryName,
      inventoryType: e.inventoryType,
      totalRecived: e.totalRecived,
      totalInStore: e.totalInStore,
      batchNumber: e.batchNumber,
      recieveDate: validateDate(e.recieveDate),
      quantity: e.quanitity,

      manufacturingDate: validateDate(e.manufacturingDate),
      serialNo: e.serialNo,
      manufacturer: e.manufacturer,
      medicineProvidedBy: e.providedBy,
      providedByOther: e.providedByOther || e.donor,
      uploadedDocuments :_(
        <div
          className="profile-td profile-td-hover form-check-label"
          onClick={() => {
            setShowDocImage(true),
            setViewDoc(e?.uploadedDocuments ? baseImageUrl + e?.uploadedDocuments : ProfilePic);
          }}
        >
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle"
            src={e?.uploadedDocuments ? baseImageUrl + e?.uploadedDocuments : ProfilePic}
            width="50"
            alt="AttestedDocument"
          />
        </div>
          )
      ,
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
        </div>
      ),
    };

    return mapObj;
  };

  const newData = newUserData.map(e => {
    return {
      inventoryName: e.inventoryName,
      inventoryType: e.inventoryType,
      totalRecived: e.totalRecived,
      totalInStore: e.totalInStore,
      batchNumber: e.batchNumber,
      recieveDate: validateDate(e.recieveDate),
      quantity: e.quanitity,
      manufacturingDate: validateDate(e.manufacturingDate),
      serialNo: e.serialNo,
      manufacturer: e.manufacturer,

    }
  })

  return (
    <>
     <Modal centered show={showDocImage} size='lg'>
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
          <button
            id={'cancel-btn'}
            className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
            onClick={closeDocImage}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <InventoryModal
        visible={modalIsVisible}
        title="Add Inventory"
        onClose={handleCloseModal}
        medicine
        refetch={loadGridData}
        defaultValues={defaultValues}
      />

      <div className="btns">
        <Print data={newData} filename={'Inventory'} />
        <button
          id={'add-medicine-btn'}
          className="btn my-2 btn-success"
          onClick={handleOpenModal}
        >
          Add Inventory
        </button>
      </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-2">
        <div className='row'>
          <div className="col">
            <div className="float-end" style={{ "position": "relative" }}>
              <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} type={"Inventories"} />
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
    </>
  );
};

export default ViewInventory;
