import React from 'react'


const BioMatiricInfo = ({ biometricInfo }) => {
    
    return (
        <>
            <div className='table-main'>
                <div className="hover-card">
                    <h4 className='third-heading heading'>
                        Bio Metric Information
                    </h4>
                    <img src={biometricInfo?.biometricInfo?.frontPic} className='img-thumbnail rounded-circle' />
                </div>
            </div>

        </>
    )
}

export default BioMatiricInfo