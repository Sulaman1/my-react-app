import React, { useEffect } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import circleOffice from "../assets/images/roleimages/1.svg"
import convict from "../assets/images/roleimages/1.svg"
import CourtProduction from "../assets/images/roleimages/1.svg"
import darban from "../assets/images/roleimages/1.svg"
import Hospital from "../assets/images/roleimages/1.svg"
import Hr from "../assets/images/roleimages/1.svg"
import Inventory from "../assets/images/roleimages/1.svg"
import Medicine from "../assets/images/roleimages/1.svg"
import Suprident from "../assets/images/roleimages/1.svg"
import UTP from "../assets/images/roleimages/1.svg"
import VisitorBranch from "../assets/images/roleimages/1.svg"
import { useDispatch, useSelector } from 'react-redux';
import { setRoleModalOpen, setCurrentRole } from '../store/roleSlice';

const roleImages = {
  "Admin": Suprident,
  "Inspector General Prisons": Suprident,
  "DIG Prisons": Suprident,
  "Prison Superintendent": Suprident,
  "Prison UTP Branch": UTP,
  "Prison Convict Branch": convict,
  "Darban": darban,
  "Prison Circle Office": circleOffice,
  "Prison Hospital": Hospital,
  "Prison Medicine Store": Medicine,
  "Court Production Branch": CourtProduction,
  "Visitor Branch": VisitorBranch,
  "HR Branch": Hr,
  "Inventory Branch": Inventory
};

const RoleSelectionModal = ({ roles, onRoleSelect }) => {
  const dispatch = useDispatch();
  const { isRoleModalOpen, currentRole } = useSelector((state) => state.role);

  useEffect(() => {
    // Get the current role from session storage and set it in Redux
    const selectedRole = sessionStorage.getItem('selectedRole');
    if (selectedRole && !currentRole) {
      dispatch(setCurrentRole(selectedRole));
    }
  }, [dispatch]);

  const handleRoleSelect = (role) => {
    onRoleSelect(role);
    dispatch(setRoleModalOpen(false));
  };

  return (
    <Modal 
      show={isRoleModalOpen} 
      onHide={() => dispatch(setRoleModalOpen(false))} 
      centered 
      size="xl" 
      className="role-selection "
      id="role-selection-modal"
    >
      
      <Modal.Header closeButton className="role-modal-header ">
        <Modal.Title className="role-modal-title">Select Your Role</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Row className="role-grid">
          {roles.map((role, index) => (
            <Col key={index} xs={6} sm={4} md={2} className="mb-3">
              <div
                onClick={() => role !== currentRole && handleRoleSelect(role)}
                className={`role-card ${role === currentRole ? 'disabled' : ''}`}
                role="button"
                style={role === currentRole ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                <img 
                  src={roleImages[role] || Suprident} 
                  alt={role} 
                  className="role-image" 
                />
              </div>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer className="role-modal-footer">
        <Button variant="secondary" onClick={() => dispatch(setRoleModalOpen(false))}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleSelectionModal;