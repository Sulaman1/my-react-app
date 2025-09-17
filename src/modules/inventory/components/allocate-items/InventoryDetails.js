import { useState } from 'react';
import swal from 'sweetalert';
import PriscriptionGrid from '../../../hospital/components/PriscriptionGrid';
import { postData } from '../../../../services/request';
import PriscriptionModal from '../../../medical/components/Prescribe/PriscriptionModal';
import EmployeeInfoCard from '../../../medical/components/Employee/EmployeeInfoCard';
import InventoryModal from './InventoryModal';
import InventoryGrid from './InventoryGrid';

const InventoryDetails = (props) => {
  const employee = JSON.parse(sessionStorage.getItem('empMedicalEntry'));

  const [showModal, setShowModal] = useState(false);
  const [gridIsVisible, setGridIsVisible] = useState(false);

  const [formPayload, setFormPayload] = useState({
    employeeId: employee.id,
    checkups: {
      priscriptions: [],
    },
  });

  const [fetchedPriscriptions, setFetchedPriscriptions] = useState([]);
  const [stock, setStock] = useState([]);

  const [data, setData] = useState([]);

  const [ids, setIds] = useState({
    medicineId: null,
    priscriptionId: null,
    inventoryId: null
  });

  const showStockDetailsHandler = (entry) => {
    const medicineStock = entry.stock;
    setStock(medicineStock);

    const ids = {
      medicineId: entry.medicineId,
      priscriptionId: 0,
      inventoryId: entry.inventoryId
    };

    console.log(entry);

    setIds(ids);
    setData((dataItems) => [...dataItems, { ...ids, stock: [] }]);

    if (!gridIsVisible) {
      setGridIsVisible(true);
    }
  };

  const showPriscriptionsHandler = async () => {
    const transformedPriscriptions = formPayload.checkups.priscriptions.map(
      (p) => ({
        medicineId: p.medicineId,
        inventoryId: p.inventoryId,
        quantityRequired: p.quantityRequired,
      })
    );

    const payload = {
      employeeId: formPayload.employeeId,
      priscription: transformedPriscriptions,
      prisonId: formPayload.prisonId,
    };

    console.log(payload);

    try {
      const res = await postData(
        `/services/app/Inventory/GetIssuableInventoryForEmployee`,
        payload
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
    } catch (error) {
      swal('Something went wrong!', '', 'warning');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGridIsVisible(false);
    setStock([]);
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
    const index = data.findIndex((item) => item.medicineId === ids?.medicineId);

    if (index > -1) {
      const item = { ...data[index] };
      item.stock = item.stock?.filter((x) => x.stockId !== stockId);
      const dataList = [...data];
      dataList[index] = item;
      setData(dataList);
    }
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
    const index = data.findIndex((item) => item.medicineId === ids?.medicineId);

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
      (item) => item.medicineId === ids?.medicineId
    );
    if (itemIndex > -1) {
      const item = { ...fetchedPriscriptions[itemIndex] };

      const val =
        op === 'increment'
          ? item.quantityIssued + value
          : item.quantityIssued - value;

      item.quantityIssued = item.quantityIssued === undefined ? value : val;

      const updatedList = [...fetchedPriscriptions];
      updatedList[itemIndex] = item;

      setFetchedPriscriptions(updatedList);
    }
  };

  const issueHandler = async () => {
    const payload = {
      employeeId: employee.id,
      prisonId: 0,
      data: data,
    };

    try {
      const res = await postData(
        '/services/app/Inventory/IssueInventory',
        payload
      );

      if (res && res?.result?.isSuccessful) {
        await swal('Successfully issued Item!', '', 'success');
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

  return (
    <>
      <EmployeeInfoCard title="Employee Basic Information" emp={employee} />

      <InventoryGrid
        data={formPayload.checkups.priscriptions}
        setFormPayload={setFormPayload}
        emp
      />

      <InventoryModal
        title="Inventory"
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

      <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
        <button
          id={'dispense-medicine-btn'}
          type="submit"
          className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
          onClick={showPriscriptionsHandler}
        >
          <i className="icon-add ml-2"></i> Dispense Inventory
        </button>
      </div>
    </>
  );
};

export default InventoryDetails;
