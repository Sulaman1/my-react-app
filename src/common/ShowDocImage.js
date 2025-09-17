import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ProfilePic from "../../src/assets/images/users/1.jpg";

const ShowDocImage = ({ showDocImage, viewDoc, setShowDocImage }) => {

	
  const closeDocImage = () => {
    setShowDocImage(!showDocImage)
  }


  const download = async () => {
	const nameSplit = viewDoc.split("Admin");
    const duplicateName = nameSplit.pop();
    const link = document.createElement('a');
    link.href = viewDoc;
    const newString = duplicateName.replace(/\\/g, ''); 
    link.download = newString; 
    link.target ='_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
	return (
		<>
			<Modal show={showDocImage} size='lg'>
				<Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
				</Modal.Header>
				<Modal.Body>
					<div className="profile-td profile-td-hover">
						<img
							onError={(ev) => {
								ev.target.src = ProfilePic;
							}}
							src={`${viewDoc
								}`}
							width="500"
							height="500"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
						Download
					</button>
					<button
						id={'cancel-btn'}
						className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
						onClick={closeDocImage}
					>
						Close
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ShowDocImage;
