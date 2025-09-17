import React, { useState } from 'react';
import { baseImageUrl } from '../../services/request';
import ProfilePic from "../../assets/images/users/1.jpg";
import ImagePreviewModal from './ImagePreviewModal';

const ImageCell = ({ value , noHover }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const imageUrl = value ? `${baseImageUrl}${value}` : ProfilePic;

  return (
    <>
      <div 
        className={`profile-td ${noHover ? '' : 'profile-td-hover'}`}
        onClick={() => {
          setSelectedImage(imageUrl);
          setShowModal(true);
        }}
      >
        <div className="pic-view">
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle"
            src={imageUrl}
            width="50"
          />
        </div>
        {!noHover && (
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
          className="avatar-xs rounded-circle"
          src={imageUrl}
          width="50"
        />
        )}
      </div>
      {selectedImage && (
        <ImagePreviewModal 
          show={showModal}
          onHide={() => setShowModal(false)}
          imageUrl={selectedImage}
        />
      )}
    </>
  );
};

export default ImageCell; 