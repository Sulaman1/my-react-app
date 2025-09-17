import { Grid, _ } from 'gridjs-react';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import {
  getValueFromList,
  transformData,
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import { lookupName } from '../../../../components/admin/system-settings/lookupNames';
import InputWidget from '../../../../droppables/InputWidget';
import { getData, postData } from '../../../../services/request';
import DispenseMedicine from '../Prescribe/DispenseMedicine';
import { useSelector } from 'react-redux';

const getStockCols = () => {
  const entries = {
    'Batch Number': '',
    'Total Received': '',
    'Total In Store': '',
    'Total Issued': '',
    'Expiry Date': '',
    'Recieve Date': '',
    'Issued Medicine': '',
    Action: '',
  };

  return Object.keys(entries);
};

const TransferMedicine = (props) => {
  const [lookups, setLookups] = useState({});
  const [medicinePayload, setMedicinePayload] = useState({});
  const [medicineId, setMedicineId] = useState();
	const newLookups = useSelector((state) => state?.dropdownLookups) 

  const [medicines, setMedicines] = useState([]);
  const [medicineStock, setMedicineStock] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [stockItemId, setStockItemId] = useState();
  const [data, setData] = useState([]);

  const [requiredQty, setRequiredQty] = useState('');
  const [minLen, setMinLen] = useState();
  const [issuedQty, setIssuedQty] = useState(0);

  const filteredStock = medicineStock.filter((item) => item.issuedMedicine);
  console.log('FILTERED STOCK', filteredStock);
  const showSubmitButton = filteredStock.length > 0;

  useEffect(() => {
    fetchApiData();
  }, []);

  useEffect(() => {
    const fetchMedicineStock = async () => {
      try {
        const res = await getData(
          `/services/app/Medicine/GetOneMedicineInStore?MedicineId=${medicineId}`,
          '',
          true
        );
        if (res.success && res.result?.isSuccessful) {
          const data = res.result.data;

          if (data?.length > 0) {
            setMedicineStock(data);
            setData((dataItems) => [
              ...dataItems,
              {
                priscriptionId: 0,
                totalIssued: 0,
                medicineId: medicineId,
                stock: [],
              },
            ]);
          }
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

    if (medicineId) {
      fetchMedicineStock();
    }
  }, [medicineId]);

  const fetchApiData = async () => {
    try {
      const data = {};

        const medicineTypeObj = transformData(newLookups?.medicineType);
        data['medicineTypes'] = medicineTypeObj;
    
        const prisonsObj = transformData(newLookups?.prison);
        const filteredPrisons = prisonsObj?.filter((p) => p.value !== 9);

        data['prisons'] = filteredPrisons;

      setLookups(data);
    } catch (err) {
      alert('An error occured');
    }
  };

  const handleFetchMedicines = async (medTypeId) => {
    const url = `${lookupName.medicine}?medicineTypeId=${medTypeId}`;
    const fetchedMedicines = await getData(url, '', true);
    if (fetchedMedicines.result.isSuccessful) {
      let medicineObj = transformData(fetchedMedicines.result.data);
      setMedicines(medicineObj);
    }
  };

  const updateQtyIssued = (qty) => {
    const itemIndex = medicineStock.findIndex(
      (item) => item.medicineStoreId === stockItemId
    );

    if (itemIndex > -1) {
      const updatedItem = { ...medicineStock[itemIndex] };
      updatedItem.issuedMedicine = qty;
      const updatedMedicineStock = [...medicineStock];
      updatedMedicineStock[itemIndex] = updatedItem;
      setMedicineStock(updatedMedicineStock);
      setIsOpen(false);
      setStockItemId(null);
      updateDataItemHandler(
        {
          stockId: stockItemId,
          quantityIssued: qty,
        },
        qty
      );
      setMinLen((curMin) => curMin - qty);
      setIssuedQty((curQty) => curQty + qty);
    }
  };

  const updateDataItemHandler = (stockItem, value) => {
    const index = data.findIndex((item) => item.medicineId === medicineId);

    if (index > -1) {
      const item = { ...data[index] };
      item.totalIssued += value;
      item.stock = [...item.stock, stockItem];
      const dataList = [...data];
      dataList[index] = item;
      setData(dataList);
    }
  };

  const uncheckItemHandler = (itemId) => {
    const itemIndex = medicineStock.findIndex(
      (item) => item.medicineStoreId === itemId
    );

    if (itemIndex > -1) {
      const updatedItem = { ...medicineStock[itemIndex] };
      const quantity = parseInt(updatedItem.issuedMedicine);
      updatedItem.issuedMedicine = null;
      const updatedMedicineStock = [...medicineStock];
      updatedMedicineStock[itemIndex] = updatedItem;
      setMedicineStock(updatedMedicineStock);
      undoDataItemHandler(itemId, quantity);
      setMinLen((curMin) => curMin + quantity);
      setIssuedQty((curQty) => curQty - quantity);
    }
  };

  const undoDataItemHandler = (stockId, value) => {
    const index = data.findIndex((item) => item.medicineId === medicineId);

    if (index > -1) {
      const item = { ...data[index] };
      item.stock = item.stock?.filter((x) => x.stockId !== stockId);
      item.totalIssued -= value;
      const dataList = [...data];
      dataList[index] = item;
      setData(dataList);
    }
  };

  const dispenseHandler = (e) => {
    setIsOpen(true);
    setStockItemId(e.medicineStoreId);
  };

  const gridDataMap = (e) => {
    const mappedObj = {
      batchNo: e.batchNumber,
      totalRecived: e.totalRecived,
      totalInStore: e.totalInStore,
      totalIssued: e.totalIssued,
      expiryDate: validateDate(e.expiryDate),
      recieveDate: validateDate(e.recieveDate),
      issuedMedicine: e.issuedMedicine,
      Action: _(
        <div className="action-btns">
          <button
            id={'dispense-btn'}
            type="button"
            onClick={dispenseHandler.bind(this, e)}
            className="btn btn-success p-2 tooltip"
          >
            Dispense
          </button>
          {!!e.issuedMedicine && (
            <button
              id={'Undo-dispense-btn'}
              type="button"
              className="btn btn-danger p-2 tooltip"
              onClick={uncheckItemHandler.bind(this, e.medicineStoreId)}
            >
              Undo
            </button>
          )}
        </div>
      ),
    };

    return mappedObj;
  };

  const issueMedicineHandler = async (e) => {
    e.preventDefault();

    if (!medicinePayload.prisonId) {
      swal('Please select a prison!', '', 'warning');
      return;
    }

    const hasEmptyStock = data.some(item => 
      item.totalIssued <= 0 || 
      !item.stock || 
      item.stock.length === 0 ||
      item.stock.some(stock => stock.quantityIssued <= 0)
    );

    if (hasEmptyStock) {
      swal('Invalid quantities!', 'Please ensure all quantities are greater than zero.', 'warning');
      return;
    }

    // Check for duplicate medicine IDs
    const medicineIds = data.map(item => item.medicineId);
    const uniqueMedicineIds = new Set(medicineIds);
    
    if (medicineIds.length !== uniqueMedicineIds.size) {
      swal('Duplicate medicines!', 'Please select each medicine only once.', 'warning');
      return;
    }

    const cleanedData = data
      .filter(item => item.stock && item.stock.length > 0) // Remove any items without stock
      .map(item => {
        const cleanItem = { 
          medicineId: item.medicineId,
          totalIssued: item.totalIssued,
          stock: item.stock
        };
        return cleanItem;
      });

    if (cleanedData.length === 0) {
      swal('No medicines selected!', 'Please select at least one medicine to transfer.', 'warning');
      return;
    }

    const payload = {
      prisonId: medicinePayload.prisonId,
      data: cleanedData
    };

    try {
      const res = await postData(
        '/services/app/Medicine/IssueMedicine',
        payload
      );

      if (res && res?.result?.isSuccessful) {
        await swal('Successfully issued medicine!', '', 'success');
        // Optional: Reset form or redirect
        resetForm();
      } else {
        swal(
          res.error?.message || 'An error occurred',
          res.error?.details || '',
          'warning'
        );
      }
    } catch (error) {
      console.error(error);
      swal('Something went wrong!', '', 'warning');
    }
  };

  // Helper function to reset the form after successful submission
  const resetForm = () => {
    setMedicinePayload({});
    setMedicineId(null);
    setMedicines([]);
    setMedicineStock([]);
    setData([]);
    setRequiredQty('');
    setMinLen(null);
    setIssuedQty(0);
  };

  return (
    <>
      <DispenseMedicine
        DispenseModalIsVisible={isOpen}
        handleDispenseCloseModal={() => setIsOpen(false)}
        onUpdate={updateQtyIssued}
        minLength={minLen}
      />

      <form>
        <div className="row p-2">
          <div className="row">
            <h4 className="third-heading">{props.title}</h4>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Prison (جیل)'}
                id={'prison'}
                multiple={false}
                icon={'icon-prison'}
                options={lookups['prisons'] || []}
                defaultValue={getValueFromList(
                  lookups['prisons'],
                  medicinePayload.prisonId
                )}
                setValue={(value) => {
                  console.log('prisonId', value);
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['prisonId'] = value.value;
                  setMedicinePayload(payload);
                }}
              />
            </div>

            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Medicine Type (دوا کی قسم)'}
                id={'medicine-type'}
                multiple={false}
                icon={'icon-medical'}
                options={lookups['medicineTypes'] || []}
                defaultValue={getValueFromList(
                  lookups['medicineTypes'],
                  medicinePayload.medicineTypeId
                )}
                setValue={(value) => {
                  console.log('medicineTypeId', value);
                  const payload = {
                    ...medicinePayload,
                  };
                  handleFetchMedicines(value.value);
                  payload['medicineTypeId'] = value.value;
                  setMedicinePayload(payload);
                }}
              />
            </div>

            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Medicine (دوا)'}
                id={'medicine'}
                multiple={false}
                icon={'icon-medical'}
                options={medicines}
                defaultValue={getValueFromList(medicines, medicineId)}
                setValue={(value) => {
                  console.log('medicineId', value);
                  setMedicineId(value.value);
                }}
              />
            </div>

            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'number'}
                label={'Required Quantity (مطلوبہ تعداد)'}
                id={'required-quantity'}
                require={false}
                icon={'icon-number'}
                defaultValue={requiredQty}
                setValue={(value) => {
                  console.log('reqQty', value);
                  setRequiredQty(value);
                  setMinLen(value);
                }}
              />
            </div>

            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'number'}
                label={'Issued Quantity (جاری کردہ تعداد)'}
                id={'issued-quantity'}
                require={false}
                icon={'icon-number'}
                defaultValue={issuedQty === 0 ? '' : issuedQty}
                readOnly={true}
              />
            </div>

            {medicineStock.length > 0 && (
              <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
                <div className="row">
                  <Grid
                    data={transformDataForTableGrid(
                      medicineStock.map((e) => gridDataMap(e))
                    )}
                    columns={getStockCols()}
                    search={true}
                    sort={true}
                    pagination={{
                      enabled: true,
                      limit: 10,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {showSubmitButton && (
          <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
            <button
              id={'issue-medicine-btn'}
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              onClick={issueMedicineHandler}
            >
              <i className="icon-add ml-2"></i> Transfer Medicine
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default TransferMedicine;
