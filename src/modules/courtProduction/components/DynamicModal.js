import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { validateHearingModalFields } from '../../../common/FormValidator';
import InputWidget from '../../../droppables/InputWidget';
import { postData } from '../../../services/request';
import { setLoaderOff, setLoaderOn } from '../../../store/loader';
import WomenGaurdian from '../../../components/prisoners/Components/release-prisoner/WomenGaurdian';

const DynamicModal = ({
	showModal,
	onClose,
    handleSubmit,
	setReleaseInfoPayload,
	releaseInfoPayLoad,
	lookups
}) => {



	return (
		<Modal show={showModal} onHide={onClose} size="lg">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					Information
				</h5>
			</Modal.Header>
			<Modal.Body>
                <WomenGaurdian 
				 formPayload={releaseInfoPayLoad}
				 setFormPayload={setReleaseInfoPayload}
				 lookups={lookups}
				/>
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
					onClick={handleSubmit}
				>
					Save
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default DynamicModal;
