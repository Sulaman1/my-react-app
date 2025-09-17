import React, { useState, useRef, useCallback } from 'react';
import { getData } from "../../services/request";
import Webcam from "react-webcam";
import { SVGS } from '../../services/CustomIcons';

const CaptureImageWidget = props => {
    const webcamRef = useRef(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        props.setValue(imageSrc)
        props.setCroppedImage(imageSrc);
        setCroppedImage(imageSrc);
        props.setShowModal();
    }, [webcamRef, setCroppedImage]);
    console.log('I reached for camera capturing initialisation');
    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "user",
    };
    return (
        <>
            <div className="overlay modal-auto visible">
                <div className="popup">
                    <div className='modal-header'>
                        <h3 className="third-heading text-center light">Capture Image</h3>
                        <button
                            onClick={() => props.setShowModal()}
                            type="button"
                            className="btn btn-soft-info waves-effect waves-light"
                        >
                          <i className='icon-cross-sign-sign'></i>
                        </button>
                    </div>
                    <div className="cam">
                        <div className='avatar'>
                        <i className='icon-avatar avatar'></i>
                        </div>
                        <Webcam
                            audio={false}
                            height={600}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={600}
                            videoConstraints={videoConstraints}
                        />
                    </div>
                    <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
                        <button type="button" className="btn rounded-pill w-lg btn-prim waves-effect waves-light" onClick={captureImage}>
                         <i className='icon-photographers'></i>   Capture photo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CaptureImageWidget;
