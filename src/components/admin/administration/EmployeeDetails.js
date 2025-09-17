import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import JailBg from '../../../assets/images/1.jpg'
import { baseImageUrl, getData } from '../../../services/request';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProfileSlider from '../../prisoners/prisoners-details/ProfileSlider';
import EmployeeBasicInfo from './EmployeeBasicInfo';
import UserInformation from './UserInformation';
import BioMatiricInfo from './BioMatiricInfo';
import ContactInfo from './ContactInfo';
import EmployeeInfo from './EmployeeInfo';
import OverVeiwInformation from './OverVeiwInformation';
import ProfilePic from '../../../../src/assets/images/users/1.jpg'

const EmployeeDetails = () => {
    const parma = useParams()
    const [employeeDetails, setEmployeeDetails] = useState()
    const [domicileData, setDomicileData] = useState()
    const [departmentData, setDepartmentData] = useState()
    const [designationData, setdesignation] = useState()
    const [employmentType, setEmploymentType] = useState()
    const [nationalityData, setNationalityData] = useState()
    const [genderData, setGenderData] = useState()
    const [maritalStatus, setMaritalStatus] = useState()
    const [casteData, setCasteData] = useState()
    const [religionData, setReligionData] = useState()
    const [isEmployee, setIsEmployee] = useState(false)
    const dataFetchedRef = useRef(false);
    const location = useLocation();
    const isDashboard = location?.state?.dashboard
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        const fetchAllData = async () => {
            try {
                const isEmp = parma?.id.includes('&')
                setIsEmployee(isEmp)
                let con = isEmp || isDashboard ? `?EmployeeId=${parma?.id.split('&')[0]}` : `?UserId=${parma?.id}`
                const res = await getData(
                    `/services/app/EmployeeAppServices/GetOneEmployee${con}`,
                    '',
                    true
                );
                const employeeData = res?.result?.data;
                setEmployeeDetails(employeeData);

                if (employeeData) {
                    const [GetOneDomicile, GetOneDepartment, GetOneDesignation, GetOneEmploymentType, GetOneGender, GetOneNationality, GetOneMaritalStatus, GetOneCaste, GetOneReligion]
                        = await Promise.allSettled([
                            getData(`/services/app/AddressLkpt/GetOneDomicile?input=${employeeData?.domicileId}`, '', true),
                            getData(`/services/app/AdminLkpt/GetOneDepartment?input=${employeeData?.departmentId}`, '', true),
                            getData(`/services/app/AdminLkpt/GetOneDesignation?input=${employeeData?.designationId}`, '', true),
                            getData(`/services/app/AdminLkpt/GetOneEmploymentType?input=${employeeData?.employmentTypeId}`, '', true),
                            getData(`/services/app/PersonalInfoLkpt/GetOneGender?input=${employeeData?.personalInfo?.genderId}`, '', true),
                            getData(`/services/app/PersonalInfoLkpt/GetOneNationality?input=${employeeData?.personalInfo?.nationalityId}`, '', true),
                            getData(`/services/app/PersonalInfoLkpt/GetOneMaritalStatus?input=${employeeData?.personalInfo?.maritalStatusId}`, '', true),
                            getData(`/services/app/PersonalInfoLkpt/GetOneCaste?input=${employeeData?.personalInfo?.casteId}`, '', true),
                            getData(`/services/app/ReligionLkpt/GetOneReligion?input=${employeeData?.personalInfo?.religionId}`, '', true),
                        ]);

                    setEmploymentType(GetOneEmploymentType?.value?.result?.data)
                    setDepartmentData(GetOneDepartment?.value?.result?.data)
                    setDomicileData(GetOneDomicile?.value?.result?.data)
                    setdesignation(GetOneDesignation?.value?.result?.data)
                    setGenderData(GetOneGender?.value?.result?.data)
                    setNationalityData(GetOneNationality?.value?.result?.data)
                    setMaritalStatus(GetOneMaritalStatus?.value?.result?.data)
                    setReligionData(GetOneReligion?.value?.result?.data)
                    setCasteData(GetOneCaste?.value?.result?.data)
                }
            } catch (error) {
                console.log('ERROR', error)
                alert('Something went wrong!');
            }
        };

        fetchAllData();
    }, [parma]);

    return (
        <>
            <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                    <img src={JailBg} alt="" className="profile-wid-img" />
                </div>
            </div>

            <div className="pt-4 mb-4 mt-3  mb-lg-0 pb-lg-4">
                <div className="row g-4">
                    <div className="col-auto">
                        <div className="avatar-xl">
                            <img className='img-' src={
                                employeeDetails?.biometricInfo?.frontPic
                                    ? baseImageUrl + employeeDetails?.biometricInfo?.frontPic
                                    : ProfilePic
                            } alt='' style={{
                                height: '140px', width: '140px', borderRadius: '100px',
                                border: '2px solid #fff', objectFit: 'contain'
                            }} />
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="p-2">
                            <h3 className="text-white mb-1" >{employeeDetails?.personalInfo?.fullName}
                            </h3>

                            <div className='flex just-space'>
                                <div>
                                    <p className="text-white-75 mb-0">Employee Number</p>
                                    <div className="me-2 flex mt-lg-1"><p className='text-white'>{employeeDetails?.employeeNumber}</p>  </div>
                                </div>
                                <div>
                                    <p className="text-white-75 mb-0">Designation</p>
                                    <div className="me-2 flex  mt-lg-1"><i className="icon-prison text-white mx-1"></i> <p className='text-white'>{designationData?.name}</p></div>
                                </div>
                                <div>
                                    <p className="text-white-75 mb-0">Department</p>
                                    <div className="me-2 flex  mt-lg-1"><p className='text-white'>{departmentData?.name}</p></div>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div>
                        <Tabs className="profile-tabs">
                            <TabList className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14">
                                        <i className="icon-dashboard"></i>
                                        <span>Overview</span>
                                    </a>
                                </Tab>
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14">
                                        <i className='icon-medical'></i>
                                        <span>Basic Information</span>
                                    </a>
                                </Tab>
                                {!isEmployee &&
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14 ">
                                        <i className='icon-prison'></i>
                                        <span>User Information</span>
                                    </a>
                                </Tab>
                                }
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14 ">
                                        <i className='icon-transfer'></i>
                                        <span>Biometric Information</span>
                                    </a>
                                </Tab>
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14 ">
                                        <i className='icon-destination'></i>
                                        <span>Contact Information</span>
                                    </a>
                                </Tab>
                                <Tab className="nav-item">
                                    <a href='#' className="nav-link fs-14 ">
                                        <i className='icon-inquiry'></i>
                                        <span>Employee Information</span>
                                    </a>
                                </Tab>
                            </TabList>
                            <div className="tab-content pt-4 text-muted" style={{ marginTop: '20px' }}>
                                <TabPanel>
                                    <OverVeiwInformation
                                        details={employeeDetails}
                                        domicileData={domicileData}
                                        departmentData={departmentData}
                                        designationData={designationData}
                                        employmentType={employmentType}
                                        genderData={genderData}
                                        nationalityData={nationalityData}
                                        maritalStatus={maritalStatus}
                                        religionData={religionData}
                                        casteData={casteData}

                                    />

                                </TabPanel>
                                <TabPanel>
                                    <EmployeeBasicInfo
                                        details={employeeDetails}
                                        genderData={genderData}
                                        nationalityData={nationalityData}
                                        maritalStatus={maritalStatus}
                                        religionData={religionData}
                                        casteData={casteData}

                                    />
                                </TabPanel>
                               {!isEmployee && 
                               <TabPanel>
                                    <UserInformation UserInformation={employeeDetails} />
                                </TabPanel>
                                }
                                <TabPanel>
                                    <BioMatiricInfo biometricInfo={employeeDetails} />
                                </TabPanel>
                                <TabPanel>
                                    <ContactInfo contactInfo={employeeDetails} />
                                </TabPanel>

                                <TabPanel>
                                    <EmployeeInfo
                                        employeeInfo={employeeDetails}
                                        departmentData={departmentData}
                                        designationData={designationData}
                                        domicileData={domicileData}
                                        employmentType={employmentType} />
                                </TabPanel>

                            </div>
                        </Tabs>


                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeDetails