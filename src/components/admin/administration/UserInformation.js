import React, { useState } from 'react'
import DescriptionModal from '../../../common/DescriptionModal'

const UserInformation = ({ UserInformation }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    const handleShowModal = (content, title) => {
        setModalContent(content);
        setModalTitle(title);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const renderRoleNames = (roleNames) => {
        if (!roleNames) return '';
        
        // Convert array to string if needed
        const rolesString = Array.isArray(roleNames) ? roleNames.join(', ') : roleNames;
        
        if (rolesString.length <= 15) {
            return rolesString;
        }

        return (
            <div>
                {rolesString.substring(0, 15)}... 
                <span 
                    className="text-primary"
                    onClick={() => handleShowModal(rolesString, "Role Names")}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    (View All)
                </span>
            </div>
        );
    };

    return (
        <>
        <DescriptionModal 
            show={showModal}
            handleClose={handleCloseModal}
            description={modalContent}
            title={modalTitle}
        />
        {UserInformation?.user?.userName &&
            <div className='table-main'>
                <div className="hover-card">
                    <h4 className='third-heading heading'>
                        User Information
                    </h4>
                    <div id='pagination-list'>
                        <div class='d-flex just-space mx-n3'>
                            <ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                User Name:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{UserInformation?.user?.userName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Email Address:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{UserInformation?.user?.emailAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Role Name:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p className='dynamic-value'>
                                                    {renderRoleNames(UserInformation?.user?.roleNames)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default UserInformation