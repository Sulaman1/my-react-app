import React from 'react'
import ProfileSlider from '../../prisoners/prisoners-details/ProfileSlider'
import moment from 'moment-mini';
import UserInformation from './UserInformation';
import ContactInfo from './ContactInfo';
import EmployeeInfo from './EmployeeInfo';
import EmployeeBasicInfo from './EmployeeBasicInfo';
import { Link } from 'react-router-dom';
import { baseImageUrl } from '../../../services/request';
import ProfilePic from '../../../../src/assets/images/users/1.jpg'

const OverVeiwInformation = (
    { details, domicileData, departmentData, designationData, employmentType, genderData, nationalityData, maritalStatus, casteData, religionData }
) => {
    return (
        <>
            <div className="row">
                <div className="col-xxl-3">
                    <div className="card pb-5">
                        <div className="card-body">
                            <h3 className="card-title mb-3">Biometric Information</h3>
                            <div className="row g-4 just-center">
                                <div className="col-auto">
                                    <div className="avatar-xl">
                                        <img className='img-' src={
                                            details?.biometricInfo?.frontPic
                                                ? baseImageUrl + details?.biometricInfo?.frontPic
                                                : ProfilePic
                                        } alt='' style={{
                                            height: '140px', width: '140px', borderRadius: '100px',
                                            border: '2px solid #fff', objectFit: 'contain'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Basic Information</h5>
                            <div className="table-responsive">
                                <table className="table table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="ps-0" scope="row">Full Name:</th>
                                            <td className="text-muted">{details?.personalInfo?.fullName}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Grand Father Name:</th>
                                            <td className="text-muted">{details?.personalInfo?.grandFatherName}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Relationship Type:</th>
                                            <td className="text-muted">{details?.personalInfo?.relationshipType}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Relationship Name:</th>
                                            <td className="text-muted">{details?.personalInfo?.relationshipName}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Phone No:</th>
                                            <td className="text-muted">{details?.contactInfo?.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Posting Location:</th>
                                            <td className="text-muted">{details?.prisons[0]?.prisonName || ""}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Joining Date:</th>
                                            <td className="text-muted">{moment(new Date(details?.joiningDate).toDateString()).format('L')}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Retirement Date:</th>
                                            <td className="text-muted">{moment(new Date(details?.retirementDate).toDateString()).format('L')}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Retirement Days Left:</th>
                                            <td className="text-muted">{details?.retirementDaysLeft}</td>
                                        </tr>
                                       
                                      
                                       
                                        <tr>
                                            <th className="ps-0" scope="row">Employment Status:</th>
                                            <td className="text-muted">{details?.serviceStatus|| details?.employmentStatus}</td>
                                        </tr>
                                       
                                        <tr>
                                            <th className="ps-0" scope="row">Facility Type:</th>
                                            <td className="text-muted">{details?.facilityTypeString|| "N/A"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    <Link

                        to={{
                            pathname: "/admin/administration/employee-details-print",
                            state: { stateParam: { details, domicileData, departmentData, designationData, employmentType, genderData, nationalityData, maritalStatus, casteData, religionData } }
                        }}
                    >
                        <button type="button" className="my-2 btn btn-info btn-label my-2">
                            <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
                        </button>
                    </Link>

                </div>
                <div className="col-xxl-9">
                    <div className="row">
                        <EmployeeBasicInfo
                            details={details}
                            genderData={genderData}
                            nationalityData={nationalityData}
                            maritalStatus={maritalStatus}
                            religionData={religionData}
                            casteData={casteData}
                        />
                        <UserInformation UserInformation={details} />
                        <ContactInfo contactInfo={details} />
                        <EmployeeInfo
                            employeeInfo={details}
                            domicileData={domicileData}
                            departmentData={departmentData}
                            designationData={designationData}
                            employmentType={employmentType}
                            religionData={religionData}
                            casteData={casteData}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default OverVeiwInformation