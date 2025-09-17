import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import { validateHearingModalFields } from '../../../common/FormValidator';
import { postData } from '../../../services/request';
import CaseHearingInfo from './CaseHearingInfo';

const HearingModal = ({
  visible,
  onClose,
  hideModal,
  refetch,
  lookups,
  prisonerCaseId,
  oldHearingId,
  defaultValues,
  loadGridData_1,
  loadRealtimeHearings
}) => {
  const [formPayload, setFormPayload] = useState({});
  console.log('formPayload: ', formPayload);

  useEffect(() => {
    refetch()
    
    if (defaultValues) {
      if (defaultValues.hearings && defaultValues.hearings.length > 0) {
        let lastHearing = defaultValues.hearings[defaultValues.hearings.length - 1]
        setFormPayload({
          lastHearingDate: lastHearing.nextHearingDate,
          remandingCourtId: parseInt(lastHearing.remandingCourtId),
          courtId: parseInt(lastHearing.courtId),
          judge: lastHearing.judge,
        });
      } else {
        setFormPayload({
          lastHearingDate: defaultValues.nextHearingDate,
          remandingCourtId: parseInt(defaultValues.remandingCourtId),
          courtId: parseInt(defaultValues.courtId),
          judge: defaultValues.judge
        })
      }
    }
  }, [defaultValues]);

  const handleSubmit = async () => {
    if (!validateHearingModalFields(formPayload)) {
      return false;
    }
    let payload = {
      ...formPayload,
      prisonerCaseId: prisonerCaseId
    };

    try {
      
      let url = `/services/app/PrisonerDetailInformation/CreateUpdateCaseHearing?OldHearingId=${oldHearingId ?? 0}`;
      const res = await postData(url,
        payload
      );
      if (res.success && res.result?.isSuccessful) {

        swal('Successfully created hearing.', '', 'success');
        sessionStorage.removeItem('prisonerHearingEntry');
        onClose();
        if (loadGridData_1) {
          loadGridData_1()
        }
        if (hideModal) {
          hideModal()
        }
        if (refetch && loadRealtimeHearings) {
          loadRealtimeHearings(prisonerCaseId, false, true)
          refetch();
        }
        setFormPayload({});
      } else {
        swal(
          res.error?.message || 'An error occured',
          res.error?.details || '',
          'warning'
        );
      }
    } catch (error) {
      console.log(error);
      swal('An error occured!', '', 'warning');
    }
    finally {
      
    }
  };

  return (
    <Modal show={visible} onHide={onClose} size="lg">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 class="modal-title" id="exampleModalgridLabel">
          Case Hearing Information
        </h5>
      </Modal.Header>
      <Modal.Body>
        <form className="hover-card">
          <CaseHearingInfo
            formPayload={formPayload}
            setFormPayload={setFormPayload}
            lookups={lookups}
          />
        </form>
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
          onClick={handleSubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default HearingModal;
