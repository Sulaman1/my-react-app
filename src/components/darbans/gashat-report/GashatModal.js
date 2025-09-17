
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import GashatForm from './GashatForm';
import { postData } from '../../../services/request';
import { setLoaderOff, setLoaderOn } from '../../../store/loader';
import { useDispatch } from 'react-redux';

const GashatModal = ({
	openModal,
	data,
	onClose,
    title,
    refetch,
    employeeData
}) => {
    const [formPayload, setFormPayload] = useState({})

	const userSessionData = sessionStorage.getItem("user");
	const parsedUser = JSON.parse(userSessionData);
	const prisonId = parsedUser?.employee?.prisons[0]?.prisonId
	
	const dispatch = useDispatch()
    const handleAddGashat = async() => {
        
        try {
			
            const payload = {
                "employeeIds": [
                    employeeData.id
                  ],
                  "prisonId": prisonId,
                ...formPayload,
            }
           const res = await postData(`/services/app/EmployeeAppServices/CreateOrUpdateGhashtReport`, payload, true)
           if(res.success && res.result.isSuccessful) {
                refetch()
                setFormPayload({})
				
               swal('Gashat Report added successfully!', '', 'success');
               onClose();
           }
            
        } catch (error) {
			
            console.log(error);
            swal('An error occured!', JSON.stringify(error), 'warning'); 
        }
    }



	return (
		<Modal show={openModal} onHide={onClose} size="lg">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					{title}
				</h5>
			</Modal.Header>
			<Modal.Body>
                <GashatForm formPayload={formPayload} setFormPayload={setFormPayload} />
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
					onClick={handleAddGashat}
				>
					Save
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default GashatModal;
