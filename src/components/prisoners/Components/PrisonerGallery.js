import React, {useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

const PrisonerGallery = ({ showModal, viewDoc, setShowModal }) => {

    useEffect(() => {
        const lightbox = GLightbox({
          selector: '.glightbox'
        });
    
        return () => {
          // Clean up the lightbox on component unmount
          lightbox.destroy();
        };
    }, [showModal]);

    const closeDocImage = () => {
        setShowModal(!showModal)
    }

	return (
		<>
			<Modal show={showModal} size='xl'>
				<Modal.Header style={{ padding: '1rem 0.5rem 0rem 0.5rem' }}>
                <h5 class="modal-title" id="exampleModalgridLabel">
                    Previous Images
                </h5>
				</Modal.Header>
				<Modal.Body>
                <div>
                     <div class="row gallery-wrapper">
                     {viewDoc.map(function (ele, i) {
                            return (<div key={i} class="element-item col-xxl-3 col-xl-4 col-sm-6 project designing development"  data-category="designing development">
                                <div class="gallery-box card">
                                    <div class="gallery-container">
                                        <a class="image-popup glightbox" href={ele} title="">
                                            <img class="gallery-img img-fluid mx-auto" src={ele} alt="" />
                                        </a>
                                    </div>
                                </div>
                            </div>);
                        })}
                        
                    </div>
                </div>
				</Modal.Body>
				<Modal.Footer>
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

export default PrisonerGallery;
