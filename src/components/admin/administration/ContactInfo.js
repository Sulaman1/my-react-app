import React from 'react'

const ContactInfo = ({ contactInfo }) => {
    return (
        <>
            <div className='table-main'>
                <div className="hover-card">
                    <h4 className='third-heading heading'>
                        Contact Information
                    </h4>
                    <div id='pagination-list'>
                        <div class='d-flex just-space mx-n3'>
                            <ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                            Emergency Phone Number:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{contactInfo?.contactInfo?.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class='list-group-item'>
                                    <div class='d-flex align-items-center pagi-list'>
                                        <div class='flex-grow-1 overflow-hidden'>
                                            <h5 class='fs-13 mb-1 dynamic-key'>
                                                Mobile Number:{' '}
                                            </h5>
                                        </div>
                                        <div class='flex-shrink-0 ms-2'>
                                            <div>
                                                <p class='dynamic-value'>{contactInfo?.contactInfo?.mobileNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactInfo