import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import { postData } from '../../../services/request';
import Checkups from './Checkups';
import PriscriptionGrid from './PriscriptionGrid';

const CheckupModal = ({
  visible,
  title,
  onClose,
  admissionData,
  refetch,
  type,
  medicine,
  children,
  onAddMedicine,
  setActiveTab,
}) => {

  const [formPayload, setFormPayload] = useState({
    checkups: {
      priscriptions: [],
    },
  });
  const submitHandler = async (e) => {
    e.preventDefault();

    const prisonerId = JSON.parse(
      sessionStorage.getItem('prisonerAdmissionEntry')
    )?.id;
    let payload = {};
    for (const key in admissionData) {
      if (key !== 'checkups') {
        payload[key] = admissionData[key];
      }
    }
    const transformedPriscriptions = formPayload.checkups.priscriptions.map(
      (p) => ({
        medicineId: p.medicineId,
        quantityRequired: p.quantityRequired,
        PrescriptionTimming: p.PrescriptionTimming,
      })
    );
    payload['prisonerBasicInfoId'] = prisonerId;
    payload['checkups'] = {
      ...formPayload.checkups,
      priscriptions: transformedPriscriptions,
    };
    let res;
    let willProceed;
    try {
      if (type === 'discharge') {
        willProceed = await swal({
          title: 'Are you sure?',
          text: 'You want to discharge',
          icon: 'warning',
          buttons: true,
        });
      }
      if (willProceed || type === 'add') {
        
        res = await postData(
          `/services/app/PrisonerMedicalInfo/CreatePrisonerHospitalAdmission?CheckUpOnly=${type === 'add'
          }&discharge=${type === 'discharge'}`,
          payload
        );
        if (res.result?.isSuccessful) {
          
          swal(type === 'discharge' ? 'Successfully Dischared' : 'Successfully Created!', '', 'success');
          refetch();
          onClose();
          setFormPayload({ checkups: { priscriptions: []} });
          setActiveTab(0);
        } else {
          
          swal(res.error?.message, res.error?.details ?? '', 'warning');
        }
      }
    } catch (err) {
      
      swal('Something went wrong!', err, 'warning');
      console.log(err,`getting error while posting API {CreatePrisonerHospitalAdmission} & fileName is {CheckupModal.js}`)
    }
  };

  let content = (
    <Checkups
      formPayload={formPayload}
      setFormPayload={setFormPayload}
      showCheckboxes={false}
      isCheckup={true}
    />
  );

  if (medicine) {
    content = children;
  }

  return (
    <Modal show={visible} onHide={onClose} size="xl">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 class="modal-title" id="exampleModalgridLabel">
          {title}
        </h5>
      </Modal.Header>
      <Modal.Body>
        <form>{content}</form>
       
      </Modal.Body>
      <Modal.Footer>
        <button
          id={'cancel-btn'}
          className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          id={'save-btn'}
          className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
          onClick={medicine ? onAddMedicine : submitHandler}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckupModal;
