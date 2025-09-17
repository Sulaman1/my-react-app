import moment, { defaultFormat } from 'moment-mini';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import Medical from '../../../components/prisoners/Components/Medical';
import { postData } from '../../../services/request';
import LeaveForm from '../../hr/Leave/LeaveForm';
import AddMedicine from './Medicine/AddMedince';
import { validateMedicalStoreFields } from '../../../common/FormValidator';
import { useSelector } from 'react-redux';

const MedicalModal = ({
  visible,
  title,
  onClose,
  setActiveTab,
  medicine,
  refetch,
  defaultValues,
  leaves,
  onSubmit,
}) => {
  const [formPayload, setFormPayload] = useState({});
  const newLookups = useSelector((state) => state?.dropdownLookups)
  
  useEffect(() => {
    if (defaultValues) {
      setFormPayload(defaultValues);
    }
  }, [defaultValues]);

  const resetForm = () => {
    setFormPayload({})
  }
  const submitHandler = async () => {
    const prisoner = JSON.parse(sessionStorage.getItem('prisonerMedicalEntry'));
    let payload = {
      prisonerBasicInfoId: prisoner?.id,
      ...formPayload,
    };

    if( moment(payload["recieveDate"]).isBefore(moment(payload["manufacturingDate"]))){
      swal("", "Manufacturing Date cannot be greater than Recieve Date", "error")
      return
    }
    if (!payload['firstCovidVaccineDate']) {
      payload['firstCovidVaccineDate'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
    }

    if (!payload['secondCovidVaccineDate']) {
      payload['secondCovidVaccineDate'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
    }

    console.log('Submitting the form >>>', payload);

    let url = '/services/app/PrisonerMedicalInfo/CreateOrEditMedicalInfo';

    if (medicine) {
      
      if(!payload['medicineTypeId'] && payload.medicineType){
        const medicineType = newLookups.medicineType.find(item => item.name.toLowerCase() === payload.medicineType.toLowerCase())
        formPayload['medicineTypeId'] = medicineType.id
      }
      
      url = '/services/app/Medicine/MedicineStoreEntry';
      if (!validateMedicalStoreFields(formPayload)) {
        return false;
      }
      if (formPayload['providedBy'] === undefined || formPayload['providedBy'] === null || formPayload['providedBy'] === '') {
        swal("Please select the Medicine Provider",'','warning');
        return false;
      }
    }

    let res;
    try {
      
      res = await postData(url, medicine ? { ...formPayload } : payload);
      if (res.result.isSuccessful) {
        
        swal('Successfully Saved!', '', 'success');
        if (medicine) {
        

          refetch();
        }
        sessionStorage.removeItem('prisonerMedicalEntry');
        // setActiveTab(0);
        onClose();
        setFormPayload({});
      } else {
        
        swal('Something went wrong!', '', 'warning');
      }
    } catch (err) {
      
      swal(res.error.message, res.error.details ?? '', 'warning');
    }
  };

  let modalContent = (
    <Medical formPayload={formPayload} setFormPayload={setFormPayload} />
  );

  if (medicine) {
    modalContent = (
      <AddMedicine formPayload={formPayload} setFormPayload={setFormPayload} />
    );
  }

  if (leaves) {
    modalContent = (
      <LeaveForm formPayload={formPayload} setFormPayload={setFormPayload} />
    );
  }

  return (
    <Modal show={visible} onHide={() => {resetForm();onClose();}} size="lg">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 class="modal-title" id="exampleModalgridLabel">
          {title}
        </h5>
      </Modal.Header>
      <Modal.Body>
        <form>{modalContent}</form>
      </Modal.Body>
      <Modal.Footer>
        <button
          id={'cancel'}
          onClick={() => {resetForm();onClose();}}
          className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
        >
          Cancel
        </button>
        <button
          id={'save-btn'}
          onClick={() => (onSubmit ? onSubmit(formPayload) : submitHandler())}
          className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
        >
          {leaves ? 'Apply' : 'Save'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicalModal;
