import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import OffenceForm from './OffenceForm';

const OffenceModal = ({
	showModal,
	onClose,
    handleSubmit,
	lookups
}) => {
	const [formPayload, setFormPayload] = useState({});

	return (
		<Modal show={showModal} onHide={onClose} size="lg">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					Add Offense
				</h5>
			</Modal.Header>
			<Modal.Body>
                <OffenceForm formPayload={formPayload} lookups={lookups} setFormPayload={setFormPayload}/>
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
					onClick={()=>{handleSubmit(formPayload, setFormPayload)}}
				>
					Save
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default OffenceModal;
