import moment, { defaultFormat } from 'moment-mini';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import { postData } from '../../../../services/request';
import AddInventory from './AddInventory';
import { validateInventoryFields } from '../../../../common/FormValidator';

const InventoryModal = ({
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

  useEffect(() => {
    if (defaultValues) {
      setFormPayload(defaultValues);
    }
  }, [defaultValues]);
  const resetForm = () => {
    setFormPayload({})
  }
  const submitHandler = async () => {
    const prisoner = JSON.parse(sessionStorage.getItem('PrisonInventoryEntry'));

    let payload = {
      prisonerBasicInfoId: prisoner?.id,
      ...formPayload,
    };

    console.log('Submitting the form >>>', payload);

    let url = '/services/app/Inventory/PrisonInventoryEntry';

    if (medicine) {
      url = '/services/app/Inventory/PrisonInventoryEntry';
      if (!validateInventoryFields(formPayload)) {
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
        sessionStorage.removeItem('PrisonInventoryEntry');
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
    <AddInventory formPayload={formPayload} setFormPayload={setFormPayload} />
  );

  return (
    <Modal show={visible}  onHide={() => {resetForm();onClose();}} size="lg">
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
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;
