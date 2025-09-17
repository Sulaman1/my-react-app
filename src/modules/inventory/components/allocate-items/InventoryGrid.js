import { Grid, _ } from 'gridjs-react';
import { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';
// import { validateMedicineFormFields } from '../../../common/FormValidator';

import {
  getItemFromList,
  getValueFromList,
  transformData,
  transformDataForTableGrid,
} from '../../../../common/Helpers';
import { lookupName } from '../../../../components/admin/system-settings/lookupNames';
import InputWidget from '../../../../droppables/InputWidget';
import { getData } from '../../../../services/request';
import AddModal from '../../../hospital/components/CheckupModal';
import { useSelector } from 'react-redux';

const InventoryGrid = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [lookups, setLookups] = useState({});
  console.log('lookups: ', lookups);
  const [medicinePayload, setMedicinePayload] = useState({});
	const newLookups = useSelector((state) => state?.dropdownLookups) 

  const [medicines, setMedicines] = useState([]);
  const [inventorys, setInventory] = useState([]);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const data = {};

        const medicineTypeObj = transformData(newLookups?.medicineType);
        data['medicineTypes'] = medicineTypeObj;

        const inventoryTypeObj = transformData(newLookups?.inventoryType);
        data['inventoryTypes'] = inventoryTypeObj;

      const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
      const objParsed = objStringify && JSON.parse(objStringify);
      const allotedPrisons =
        objParsed &&
        objParsed.prisons.map((e) => ({
          id: e.prisonId,
          name: e.prisonName,
        }));

      if (allotedPrisons?.length === 1) {
        setMedicinePayload({
          prisonId: allotedPrisons[0].id,
        });
        props.setFormPayload((curPayload) => ({
          ...curPayload,
          prisonId: allotedPrisons[0].id,
        }));
      }

      const prisonsObj = transformData(allotedPrisons);
      data['prisons'] = prisonsObj;


      setLookups(data);

    } catch (err) {
      alert('An error occured');
    }
  };



  const handleFetchInventory = async (invTypeId) => {
    const url = `${lookupName.inventory}?inventoryTypeId=${invTypeId}&inventoryType=${getItemFromList(lookups['inventoryTypes'], invTypeId)}`;
    const fetchedInventory = await getData(url, '', true);
    if (fetchedInventory.result.isSuccessful) {
      let inventoryObj = transformData(fetchedInventory.result.data);
      setInventory(inventoryObj);
      setLookups((prevLookups) => ({
        ...prevLookups,
        inventory: inventoryObj,
      }));
    }
  };

  const gridDataMap = (e) => {
    return {
      inventory: getItemFromList(lookups['inventory'], e.inventoryId),
      quantityRequired: e.quantityRequired,
      Action: _(
        <div className="action-btns">
          <button
            id={'cross-btn'}
            type="button"
            onClick={deleteMedicineHandler.bind(this, e.id)}
            className="btn btn-danger waves-effect waves-light mx-1"
          >
            <i className="icon-cross-sign-sign"></i>
          </button>
        </div>
      ),
    };
  };

  const closeHandler = () => {
    setShowModal(false);
  };

  const addMedicineHandler = () => {

    const createdMedicine = {
      id: uuidv4(),
      medicineId: medicinePayload.medicineId,
      inventoryId: medicinePayload.inventoryId,
      quantityRequired: medicinePayload.quantityRequired,
    };
    props.setFormPayload((curPayload) => ({
      ...curPayload,
      prisonId: curPayload.prisonId || medicinePayload.prisonId,
      checkups: {
        ...curPayload.checkups,
        priscriptions: [...curPayload.checkups.priscriptions, createdMedicine],
      },
    }));
    setShowModal(false);
    setMedicinePayload((curPd) => ({
      prisonId: curPd.prisonId,
    }));
    setMedicines([]);
    setInventory([]);
  };

  const deleteMedicineHandler = (id) => {
    props.setFormPayload((curPayload) => ({
      ...curPayload,
      checkups: {
        ...curPayload.checkups,
        priscriptions: curPayload.checkups.priscriptions.filter(
          (m) => m.id !== id
        ),
      },
    }));
  };

  return (
    <>
      <AddModal
        visible={showModal}
        onClose={closeHandler}
        title="Add Items (اشیاء شامل کریں)"
        medicine
        onAddMedicine={addMedicineHandler}
      >
        <div className="row p-2">
          <div className="row">


            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Inventory Type (دوا کی قسم)'}
                id={'medicine-type'}
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={lookups['inventoryTypes'] || []}
                defaultValue={getValueFromList(
                  lookups['inventoryTypes'],
                  medicinePayload.inventoryTypesId
                )}
                setValue={(value) => {
                  console.log('medicineTypeId', value);
                  const payload = {
                    ...medicinePayload,
                  };
                  handleFetchInventory(value.value);
                  payload['inventoryTypeId'] = value.value;
                  setMedicinePayload(payload);
                }}
              />
            </div>

            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Inventory (دوا)'}
                id={'medicine'}
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={inventorys}
                defaultValue={getValueFromList(
                  inventorys,
                  medicinePayload.inventoryId
                )}
                setValue={(value) => {
                  console.log('inventoryId', value);
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['inventoryId'] = value.value;
                  setMedicinePayload(payload);
                }}
              />
            </div>



            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'number'}
                label={'Required Quantity (مطلوبہ تعداد)'}
                id={'required-quantity'}
                require={true}
                icon={'icon-number'}
                defaultValue={medicinePayload.quantityRequired}
                setValue={(value) => {
                  console.log('quantityRequired', value);
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['quantityRequired'] = value;
                  setMedicinePayload(payload);
                }}
              />
            </div>

            {props.emp && (
              <div className="col-lg-6">
                <InputWidget
                  type={'multiSelect'}
                  inputType={'name'}
                  label={'Prison جیل'}
                  id={'prison'}
                  require={true}
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
            )}
          </div>
        </div>
      </AddModal>

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-2 mb-5">
        <div className='btns just-center'>
          <button
            id={'add-medicine-btn'}
            className="btn btn-success  waves-effect waves-light mx-1 px-3 py-2 float-end"
            onClick={() => setShowModal(true)}
            type="button"
          >
            Add Inventory
          </button>
        </div>
        <Grid
          data={transformDataForTableGrid(
            props.data?.map((item) => gridDataMap(item))
          )}
          columns={['Item (دوائی)', 'Required Quantity (مطلوبہ مقدار)', 'Action (عملدرامد)']}
          search={true}
          sort={true}
          pagination={{
            enabled: true,
            limit: 10,
          }}
        />
      </div>
    </>
  );
};

export default InventoryGrid;
