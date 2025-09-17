import { useEffect, useState } from 'react';

import { Grid, _ } from 'gridjs-react';
import {
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import { getData, postData } from '../../../../services/request';
import swal from 'sweetalert';
import PrisonerInfoCard from '../../../../components/prisoners/Components/release-prisoner/PrisonerInfoCard';
import PriscriptionModal from './PriscriptionModal';

const generateGridCols = () => {
  const entries = {
    'Admission Date (داخلہ کی تاریخ)': '',
    'Admission Type (داخلہ کی قسم)': '',
    'Disease (بیماری)': '',
    'Action (عملدرامد)': '',
  };

  return Object.keys(entries);
};

const PrescribeDetails = (props) => {
  const [gridCheckups, setGridCheckups] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [gridIsVisible, setGridIsVisible] = useState(false);
  const [fetchedPriscriptions, setFetchedPriscriptions] = useState([]);
  const [stock, setStock] = useState([]);
  const [ids, setIds] = useState({
    medicineId: null,
    priscriptionId: null,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem('prisonerMedicalEntry')) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    const prisoner = JSON.parse(sessionStorage.getItem('prisonerMedicalEntry'));
    
    try {
      const res = await getData(
        `/services/app/Medicine/GetAllPrisonerOpenPriscriptions?PrisonerId=${prisoner.id}`,
        '',
        true
      );

      const data = res.result;
      console.log('ENTRIES >>>', data);

      if (res.success && res.result !== null) {
        const prisonerData = data.prisonerData;
        const checkups = data.data;

        setFetchedData(prisonerData);
        

        if (checkups?.length > 0) {
          setGridCheckups(checkups);
        
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

  const gridDataMap = (entry) => {
    const mappedObj = {
      admissionDate: validateDate(entry.admissionDate),
      admissionType: entry.hospitalAdmissionType,
      disease: entry.disease,
      Action: _(
        <div className="action-btns">
          <button
            id={'view-prescriptions-btn'}
            type="button"
            onClick={showPriscriptionsHandler.bind(this, entry)}
            className="tooltip btn btn-prim waves-effect waves-light mx-1"
          >
            <i className="icon-show-password"></i>
            <span>View Prescriptions</span>
          </button>
        </div>
      ),
    };

    return mappedObj;
  };

  const showStockDetailsHandler = (entry) => {
    const medicineStock = entry.stock;
    console.log(medicineStock);
    setStock(medicineStock);

    const ids = {
      medicineId: entry.medicineId,
      priscriptionId: entry.priscriptionId,
    };

    setIds(ids);
    setData((dataItems) => [...dataItems, { ...ids, stock: [] }]);

    if (!gridIsVisible) {
      setGridIsVisible(true);
    }
  };

  const showPriscriptionsHandler = async (entry) => {
    const checkupId = entry.checkups?.[0].checkupId;
    const prisonerId = JSON.parse(
      sessionStorage.getItem('prisonerMedicalEntry')
    ).id;

    try {
      
      const res = await getData(
        `/services/app/Medicine/GetIssuableMedicineForPrisoner?PrisonerId=${prisonerId}&CheckupId=${checkupId}`
      );
      if (res.success && res.result?.isSuccessful) {
        const priscriptions = res.result.data;
        console.log(priscriptions);
        setFetchedPriscriptions(priscriptions);
        setShowModal(true);
        
      } else {
        
        swal(
          res.error?.message || 'An error occured',
          res.error?.details || '',
          'warning'
        );
      }
      // }
    } catch (error) {
      
      swal('Something went wrong!', '', 'warning');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGridIsVisible(false);
    setStock([]);
  };

  const updateTotalIssued = (id, value) => {
    const itemIndex = stock?.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const item = { ...stock[itemIndex] };
      item.totalIssued = value;
      const stockList = [...stock];
      stockList[itemIndex] = item;
      setStock(stockList);
      updateQuantityIssuedHandler(value, 'increment');
      updateDataHandler({ stockId: item.id, quantityIssued: item.totalIssued });
    }
  };

  const updateDataHandler = (stockItem) => {
    const index = data.findIndex(
      (item) => item.priscriptionId === ids?.priscriptionId
    );

    if (index > -1) {
      const item = { ...data[index] };
      item.stock = [...item.stock, stockItem];
      const dataList = [...data];
      dataList[index] = item;
      setData(dataList);
    }
  };

  const updateQuantityIssuedHandler = (value, op) => {
    const itemIndex = fetchedPriscriptions?.findIndex(
      (item) => item.priscriptionId === ids?.priscriptionId
    );
    if (itemIndex > -1) {
      const item = { ...fetchedPriscriptions[itemIndex] };

      const val =
        op === 'increment'
          ? item.quantityIssued + value
          : item.quantityIssued - value;

      item.quantityIssued = item.quantityIssued === undefined ? value : val;

      const updatedList = [...stock];
      updatedList[itemIndex] = item;

      setFetchedPriscriptions(updatedList);
    }
  };

  const issueHandler = async () => {
    const payload = {
      employeeId: 0,
      prisonId: 0,
      data: data,
    };

    try {
      
      const res = await postData(
        '/services/app/Medicine/IssueMedicine',
        payload
      );

      if (res && res?.result?.isSuccessful) {
        
        await swal('Successfully issued medicine!', '', 'success');
        props.setActiveTab(0);
      } else {
        
        swal(
          res.error?.message || 'An error occured',
          res.error?.details || '',
          'warning'
        );
      }
    } catch (error) {
      
      console.error(error);
      swal('Something went wrong!', '', 'warning');
    }
  };

  const undoTotalIssuedHandler = (id, value) => {
    const itemIndex = stock?.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const item = { ...stock[itemIndex] };
      const val = item.totalIssued - value;
      item.totalIssued = val;
      const stockList = [...stock];
      stockList[itemIndex] = item;
      setStock(stockList);
      updateQuantityIssuedHandler(value, 'decrement');
      undoDataItemHandler(id);
    }
  };

  const undoDataItemHandler = (stockId) => {
    const index = data.findIndex(
      (item) => item.priscriptionId === ids?.priscriptionId
    );

    if (index > -1) {
      const item = { ...data[index] };
      item.stock = item.stock?.filter((x) => x.stockId !== stockId);
      const dataList = [...data];
      dataList[index] = item;
      setData(dataList);
    }
  };

  return (
    <>
      <PrisonerInfoCard prisoner={fetchedData} />

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-5">
        <h2>List of Checkups</h2>
        <div className="row">
          <Grid
            data={transformDataForTableGrid(
              gridCheckups.map((entry) => gridDataMap(entry))
            )}
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

      <PriscriptionModal
        emp
        title="Prescribe Medicines (نسخہ)"
        priscriptions={fetchedPriscriptions}
        stockList={stock}
        onClose={closeModal}
        visible={showModal}
        onShowStockDetails={showStockDetailsHandler}
        gridIsVisible={gridIsVisible}
        onUpdate={updateTotalIssued}
        onIssue={issueHandler}
        onUndoTotalIssued={undoTotalIssuedHandler}
      />
    </>
  );
};

export default PrescribeDetails;
