import React from 'react';
import { Modal } from 'react-bootstrap';
import ProfilePic from "../../assets/images/users/1.jpg";

const ImagePreviewModal = ({ show, onHide, imageUrl }) => {
  const download = async () => {
    const nameSplit = imageUrl.split("Admin");
    const duplicateName = nameSplit.pop();
    const link = document.createElement('a');
    link.href = imageUrl;
    const newString = duplicateName.replace(/\\/g, '');
    link.download = newString;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal show={show} size="lg" onHide={onHide} centered>
      <Modal.Header closeButton >
        </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            src={imageUrl}
            width="500"
            height="500"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-prim lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
          Download
        </button>
        <button
          className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
          onClick={onHide}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImagePreviewModal; 