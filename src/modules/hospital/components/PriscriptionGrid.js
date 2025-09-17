import { Grid, _ } from 'gridjs-react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { validateMedicineFormFields } from '../../../common/FormValidator';
import {
  getItemFromList,
  getValueFromList,
  transformData,
  transformDataForTableGrid,
} from '../../../common/Helpers';
import { lookupName } from '../../../components/admin/system-settings/lookupNames';
import InputWidget from '../../../droppables/InputWidget';
import { getData } from '../../../services/request';
import AddModal from './CheckupModal';
import { useSelector } from 'react-redux';

const PriscriptionGrid = (props) => {

  const [showModal, setShowModal] = useState(false);
  const [lookups, setLookups] = useState({});
  const [medicinePayload, setMedicinePayload] = useState({});
  const [medicineCounts, setMedicineCounts] = useState(0)
  const [isCount, setIsCount] = useState(false);
  const [medicines, setMedicines] = useState([]);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const columnsForEmp = ['Medicine (دوائی)', 'Required Quantity (مطلوبہ مقدار)', 'Action (عملدرامد)'];
  const columnsForOthers = ['Medicine (دوائی)', 'Required Quantity (مطلوبہ مقدار)', 'Prescription Timming', 'Action (عملدرامد)'];

  const columns = props?.emp ? columnsForEmp : columnsForOthers;
  useEffect(() => {
    fetchApiData();
  }, []);
  const rawData = sessionStorage.getItem("user");
  const pId = JSON.parse(rawData)?.employee?.prisons.find(e => e && e.prisonId)?.prisonId || ''

  const fetchApiData = async () => {
    try {
      const data = {};
    
        const medicineTypeObj = transformData(newLookups?.medicineType);
        data['medicineTypes'] = medicineTypeObj;
        const medicine = transformData(newLookups?.medicine);
        data['medicine'] = medicine;
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
      console.log(err, `getting error while fetching function {fetchApiData} & fileName is {PriscriptionGrid.js}`)
    }
  };

  const handleFetchMedicines = async (medTypeId) => {
    const url = `${lookupName.medicine}?medicineTypeId=${medTypeId}`;
    const fetchedMedicines = await getData(url, '', true);
    if (fetchedMedicines.result.isSuccessful) {
      let medicineObj = transformData(fetchedMedicines.result.data);
      setMedicines(medicineObj);
      setLookups((prevLookups) => ({
        ...prevLookups,
        medicines: medicineObj,
      }));
    }
  };
  const gridDataMap = (e) => {
    return {
      medicine: lookups?.medicine.find(
        (med) => med.value === e.medicineId)?.label,
      quantityRequired: e.quantityRequired,
      prescriptionTimming: e.prescriptionTimming,
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
    setIsCount(false)
  };

  const addMedicineHandler = () => {
    if (!validateMedicineFormFields(medicinePayload, props.emp)) {
      return false;
    }
    const createdMedicine = {
      id: uuidv4(),
      medicineId: medicinePayload.medicineId,
      quantityRequired: medicinePayload.quantityRequired,
      prescriptionTimming: medicinePayload.prescriptionTimming,
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
    setIsCount(false);
    setMedicinePayload((curPd) => ({
      prisonId: curPd.prisonId,
    }));
    setMedicines([]);
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

  const loadMedicineCount = async (id) => {
    if (id) {
      setIsCount(true)
      const counts = await getData(
        `/services/app/Medicine/GetMedicineCount?medicineId=${id}&prisonId=${pId}`,
        '',
        true
      );
      const medicineCounts = counts?.result
      setMedicineCounts(medicineCounts);
    } else {
      setIsCount(false)
    }
  }
  

  return (
    <>
      <AddModal
        visible={showModal}
        onClose={closeHandler}
        title="Add Prescription (نسخہ)"
        medicine
        onAddMedicine={addMedicineHandler}
      >
        <div className="row p-2">
          <div className="row">
            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Medicine Type (دوا کی قسم)'}
                id={'medicine-type'}
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={lookups['medicineTypes'] || []}
                defaultValue={getValueFromList(
                  lookups['medicineTypes'],
                  medicinePayload.medicineTypeId
                )}
                setValue={(value) => {
                  const payload = {
                    ...medicinePayload,
                  };
                  setMedicines(transformData(newLookups.medicine.filter(item => item.medicineTypeId === value.value)))
                  // handleFetchMedicines(value.value);
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
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={medicines}
                defaultValue={getValueFromList(
                  medicines,
                  medicinePayload.medicineId
                )}
                setValue={(value) => {
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['medicineId'] = value.value;
                  loadMedicineCount(value.value);
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
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['quantityRequired'] = value;
                  setMedicinePayload(payload);
                }}
              />
            </div>
           {!props?.emp && 
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'name'}
                label={'Prescription Timming'}
                id={'required-quantity'}
                require={true}
                icon={'icon-chat'}
                defaultValue={medicinePayload.prescriptionTimming}
                setValue={(value) => {
                  const payload = {
                    ...medicinePayload,
                  };
                  payload['prescriptionTimming'] = value;
                  setMedicinePayload(payload);
                }}
              />
            </div>}
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
                    const payload = {
                      ...medicinePayload,
                    };
                    payload['prisonId'] = value.value;
                    setMedicinePayload(payload);
                  }}
                />
              </div>
            )}
            <div >
              {isCount ? (
                <div className='col float-start'>
                  <h4 style={{ color: medicineCounts > 0 ? 'green' : 'red' }} >
                    Medicines Available : &nbsp;
                    {medicineCounts}
                  </h4>
                </div>
              ) : ''}
            </div>
          </div>
        </div>
      </AddModal>
      <div className='btns just-center'>
        <button
          id={'add-medicine-btn'}
          className="btn btn-success  waves-effect waves-light mx-1 px-3 py-2 float-end"
          onClick={() => setShowModal(true)}
          type="button"
        >
          Add Medicine
        </button>
      </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-2 mb-5">
        <Grid
          data={transformDataForTableGrid(
            props.data?.map((item) => gridDataMap(item))
          )}
          columns={columns}
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

export default PriscriptionGrid;
