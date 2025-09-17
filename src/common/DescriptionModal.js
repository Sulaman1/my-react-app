import React from "react";
import { Modal, Button } from "react-bootstrap";

const DescriptionModal = ({ show, handleClose, description, title }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
     <Modal.Header closeButton>
        <h5 className="modal-title" id="exampleModalgridLabel">
          {title ? title.charAt(0).toUpperCase() + title.slice(1) : "Description"}
        </h5>
     </Modal.Header>

      <Modal.Body>
        <div className="h4 custom-card-scroll card mt-3 shadow-lg py-2 lh-base">{description}</div>
      </Modal.Body>
      <Modal.Footer>
        <button
          id={"cancel-btn"}
          className="btn btn-prim my-4 lg-btn submit-prim  waves-effect waves-light mx-1"
          onClick={handleClose}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DescriptionModal;
