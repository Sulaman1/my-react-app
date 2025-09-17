import React, { useState } from 'react'
import moment from 'moment-mini';
import DescriptionModal from '../../../common/DescriptionModal';

const EmployeeInfo = ({ employeeInfo, domicileData, departmentData, designationData, employmentType }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState("");

    const handleShowModal = (content, title) => {
        setModalContent(content);
        setModalTitle(title);
        setShowModal(true);
    };

    const handleShowPrisons = () => {
        if (employeeInfo?.prisons) {
            const formattedDescription = employeeInfo.prisons.map((prison, index) => (
                <span key={index}>
                    ({index + 1}). {prison.name}
                    <br />
                </span>
            ));
            handleShowModal(formattedDescription, "All Prisons");
        }
    };

    const handleCloseModal = () => setShowModal(false);


    const renderPrisons = () => {
        if (!employeeInfo?.prisons || employeeInfo.prisons.length === 0) {
            return 'N/A';
        }

        if (employeeInfo.prisons.length <= 1) {
            return employeeInfo.prisons.map(e => e.name).join(', ');
        }

        return (
            <>
                {`${employeeInfo.prisons[0].name}... `}
                <span 
                    className="text-primary cursor-pointer" 
                    onClick={handleShowPrisons}
                    style={{ cursor: 'pointer' }}
                >
                    (View All)
                </span>
            </>
        );
    };

    const renderLongText = (text, title, characterLimit = 15) => {
        if (!text || text === "N/A") return "N/A";
        
        const trimmedText = text.trim();
        
        if (trimmedText.length <= characterLimit) {
            return trimmedText;
        }

        const handleShowFullText = () => {
            const formattedDescription = (
                <span style={{ whiteSpace: 'pre-wrap' }}>
                    {trimmedText}
                </span>
            );
            handleShowModal(formattedDescription, title);
        };

        return (
            <>
                {`${trimmedText.substring(0, characterLimit)}... `}
                <span 
                    className="text-primary"
                    onClick={handleShowFullText}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    (View All)
                </span>
            </>
        );
    };

    return (
        <>
            <div className='table-main'>
                <div className="hover-card">
                    <h4 className='third-heading heading'>
                        Employee Information
                    </h4>
                    <div id='pagination-list'>
                        <div class='d-flex just-space mx-n3'>
                            <ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Employee Number:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{employeeInfo?.employeeNumber || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Employee type:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{employmentType?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Domicile:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{domicileData?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Joining Date:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{moment(new Date(employeeInfo?.joiningDate).toDateString()).format('L')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Retirement Days Left:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{employeeInfo?.retirementDaysLeft || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Retirement Date:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{moment(new Date(employeeInfo?.retirementDate).toDateString()).format('L')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Department:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{departmentData?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Prisons:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value '>{renderPrisons()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Designation:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{designationData?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                BPS:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{employeeInfo?.bps || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Disciplinary Action:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>
                                                    {renderLongText(employeeInfo?.disciplinaryAction, "Disciplinary Action")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Complaint Record:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>
                                                    {renderLongText(employeeInfo?.complaintRecord, "Complaint Record")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Promotions:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>
                                                    {renderLongText(employeeInfo?.promotions, "Promotions")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Previous Posting:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{renderLongText(employeeInfo?.previousPosting, "Previous Postings")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Seniority:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{renderLongText(employeeInfo?.seniority, "Seniority")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <DescriptionModal 
                show={showModal}
                handleClose={handleCloseModal}
                description={modalContent}
                title={modalTitle}
            />
        </>
    )
}

export default EmployeeInfo