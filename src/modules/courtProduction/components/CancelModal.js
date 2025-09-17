import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import InputWidget from '../../../droppables/InputWidget';
import { postData } from '../../../services/request';

const CancelModal = ({
	showCancelModal,
	cancelHearingId,
	onClose,
	loadHearingsData,
	FetchHearingInRealTime,
	loadVisitorData,
	prisonerId,
	prisonerCaseId,
	loadRealtimeHearings
}) => {
	const [reasonField, setReasonField] = useState()
	useEffect(() => {

	}, []);


	const handleCancelBtn = async item => {
		try {
			const willDelete = await swal({
				title: 'Are you sure?',
				text: 'You want to cancel',
				icon: 'warning',
				buttons: true,
				dangerMode: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Cancelled it!'
			});
			const payload = {}
			if (cancelHearingId) {
				payload['hearingId'] = cancelHearingId
				payload['reason'] =  reasonField
			} else if (prisonerId) {
				payload['PrisonerId'] = prisonerId
				payload['CancelReason'] =  reasonField
			}
			if (willDelete) {
			
				await swal('Cancelled!', '', 'success');
				
				const url = cancelHearingId ? 'CourtProduction/CancelHearing' : `Visitors/CancelledVisit`;
				const res = await postData(
					`/services/app/${url}`, payload
				);
				
				if (res.success) {
					if (cancelHearingId) {
						loadRealtimeHearings(prisonerCaseId, false, true)
						FetchHearingInRealTime();
					} else if (prisonerId) {
						loadVisitorData()
					}
					onClose()
				}
			}
		} catch (error) {
			swal('An error occured while cancel the hearing!', '', 'warning');
		}
	};

	return (
		<Modal show={showCancelModal} onHide={onClose} size="lg">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					Cancel Reason
				</h5>
			</Modal.Header>
			<Modal.Body>
				<form className="hover-card">
					<div className='row'>
						<div className='col-lg-12'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Reason'}
								id={'reason'}
								require={true}
								icon={'icon-operator'}
								setValue={(value) => {
									setReasonField(value);
								}}
							/>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button
					id={'cancel-btn'}
					className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={onClose}
				>
					Close
				</button>
				<button
					id={'save-btn'}
					className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={handleCancelBtn}
				>
					Save
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default CancelModal;
