import React from 'react'
import { Modal } from 'react-bootstrap';

const VaccinationModal = ({ title, visible, onClose, submitHandler, children }) => {
    return (
        <>
            <Modal show={visible} onHide={onClose} size="lg" style={{ zIndex: 9999 }}>
                <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
                    <h5 class="modal-title" id="exampleModalgridLabel">
                        {title}
                    </h5>
                </Modal.Header>
                <Modal.Body>

                    {children}

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
                        onClick={submitHandler}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default VaccinationModal