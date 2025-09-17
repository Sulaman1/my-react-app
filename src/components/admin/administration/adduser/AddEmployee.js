import React, { useEffect, useMemo, useState } from 'react';
import StepWizard from 'react-step-wizard';
import BasicInfo from './BasicInfo';
import UserInfo from './UserInfo';
import BiometricInfo from './BiometricInfo';
import EmployeeInfo from './EmployeeInfo';
import { getData, postData } from '../../../../services/request';
import swal from 'sweetalert';
import { transformData } from '../../../../common/Helpers';
import moment from 'moment-mini';
import ContactInfo from './ContactInfo';
import { scrollToTop } from '../../../../common/Helpers.js';
import { useSelector } from 'react-redux';

const AddEmployee = props => {
	const [formPayload, setFormPayload] = useState({
		personalInfo: {},
		biometricInfo: {},
		user: {},
		contactInfo: {},
		facilityTypeId: 0
	});
	const userMeta = useSelector((state) => state.user);
	const isHr = userMeta?.role === 'HR Branch';
	const [active, setActive] = useState(true);
	const [empUser, setEmpUser] = useState(false);
	const [isHrRole, setIsHrRole] = useState(isHr ? true : false);
	const [prisons, setPrisons] = useState([]);
	const newLookups = useSelector((state) => state?.dropdownLookups) 

	useEffect(() => {
		if (
			Object.keys(formPayload.personalInfo).length > 0 ||
			Object.keys(formPayload.biometricInfo).length > 0 ||
			Object.keys(formPayload.user).length > 0
		) {
			localStorage.setItem('employeeForm', JSON.stringify(formPayload));
		}

	}, [formPayload]);

	useEffect(() => {
		if (isHr) {
			setActive(false)
			const rawData = sessionStorage.getItem("user");
			const employee = JSON.parse(rawData)?.employee;
			const prisonObj = employee?.prisons.map((e) => { return ({ "value": e.prisonId, "label": e.prisonName }) });
			setPrisons(prisonObj)
		}
	}, []);

	const [lookups, setLookups] = useState({});
	const [progres, setProgress] = useState('20');
	const getDefaultNationalityOption = (nationlities) => {
		const defaultNationality = nationlities?.find(option => option.name === 'Pakistan');
		return defaultNationality || {}; 
	  };

	const handleSubmit = async e => {
		e.preventDefault();
		
		let isTrue = formPayload?.user?.IsUser
			? formPayload?.user?.IsUser
			: false;
		if (isTrue) {
			formPayload['user']['isActive'] = true;
		}
		if (formPayload.userId) {
			isTrue = formPayload?.user?.isActive || false;
		}
		if (!formPayload?.joiningDate) {
			formPayload['joiningDate'] = moment(new Date()).format(
				'YYYY-MM-DD'
			);
		}
		if (!/^\d{5}-\d{7}-\d{1}$/.test(formPayload?.personalInfo?.cnic)) {
			swal('', "Please enter a valid CNIC with 13 numbers", "warning");
			return;
		  }
		if (empUser && !formPayload?.user?.userName) {
			swal('Please Enter the user Name','','warning');
			return
		}
		if (!formPayload?.personalInfo?.fullName) {
			swal('Please Enter the full Name','','warning');
			return
		}
		if (!formPayload?.personalInfo?.fullName) {
			swal('Please Enter the full Name','','warning');
			return
		}
		if (!formPayload?.personalInfo?.genderId) {
			swal('Please Select the Gender','','warning');
			return
		}
		if (!formPayload?.designationId) {
			swal('Please Select Designation','','warning');
			return
		}
		if (!formPayload?.personalInfo?.cnic) {
			swal('Please Enter the cnic','','warning');
			return
		}
		if (!formPayload?.personalInfo?.nationalityId) {
			const defaultNationality = getDefaultNationalityOption(newLookups?.Nationality);
			formPayload['personalInfo']['nationalityId'] = defaultNationality?.id; //set the default nationality as pakistani in the payload
		  }
		if (!formPayload?.personalInfo?.nationalityId) {
			swal('Please Select the Nationality','','warning');
			return
		}
		if (empUser && !formPayload?.user?.emailAddress) {
			swal('Please Enter the email','','warning');
			return
		}
		if (empUser && !formPayload?.user?.roleNames?.length > 0) {
			swal('Please Enter the Role Name','','warning');
			return
		}
		if (empUser && !formPayload?.user?.password) {
			swal('Please Enter the Password','','warning');
			return
		}
		if (!formPayload?.departmentId) {
			swal('Please Select the department','','warning');
			return
		}
		if (!formPayload?.serviceStatusId) {
			swal('Please Select the Employment Status','','warning');
			return
		}
	
			delete formPayload?.address
		postData(
			`/services/app/EmployeeAppServices/CreateOrEditEmployee?IsUser=${isTrue}&isActive=${active}`, 
			formPayload
		)
			.then(res => {
				if (res.success == false) {
					swal(
						!res.error.details ? '' : res.error.message,
						res.error.details
							? res.error.details
							: res.error.message,
						'warning'
					);
				} else {
					swal('Successfully Saved!', '', 'success');
					localStorage.removeItem('employeeForm');
					props.setActiveTab(0);
				}
			})
			.catch(err => {
				swal('Something went wrong!', '', 'warning');
			});
	};
	useEffect(() => {
		const data = sessionStorage.getItem('selectedEmp');
		handleLookups();
		
		if (data) {
			const parsedData = JSON.parse(data);
			const con = parsedData?.userId == 0 ? 'employeeId='+parsedData.id : 'userId='+parsedData.userId
			getData(
				'/services/app/EmployeeAppServices/GetOneEmployee?'+con
			)
				.then(res => {
					if (res.result.isSuccessful) {
						const result = res?.result?.data || {};

						// if (!result.personalInfo) {
						// 	result['presonalInfo'] = {}
						// }
						// if (!result.biometricInfo) {
						// 	result['biometricInfo'] = {}
						// }
						if (!result.user) {
							result['user'] = {
								roleNames: []
							}
						}
						
						// if (!result.contactInfo) {
						// 	result['contactInfo'] = {}
						// }
						// if (!result.permanentAddress) {
						// 	result['permanentAddress'] = {}
						// }

						// if (!result.presentAddress) {
						// 	result['presentAddress'] = {}
						// }
						setFormPayload(result);
						sessionStorage.removeItem('selectedEmp');
					}
				})
				.catch(err => { });
		}
	}, []);

	const handleLookups = () => {
		// TODO: convert to redux store
		callAndHandleLookUps();
	};

	const callAndHandleLookUps = async () => {
		try {
			const lookup = {};
		
			const nationalityObj = transformData(newLookups?.Nationality);
			lookup['nationlities'] = nationalityObj;
		
			const gendersObj = transformData(newLookups?.gender);
			lookup['genders'] = gendersObj;
			
			const maritalObj = transformData(newLookups?.MaritalStatus);
			lookup['marital'] = maritalObj;
			
			const casteObj = transformData(newLookups?.caste);
			lookup['caste'] = casteObj;
			
			const sectionObj = transformData(newLookups?.sections);
			lookup['section'] = sectionObj;
			
			const religionObj = transformData(newLookups?.religion);
			lookup['religion'] = religionObj;

			
			const roleObj = transformData(newLookups?.roles);
			lookup['roles'] = roleObj;
		
			const getRoles = await getData(
				`/services/app/Role/GetAllRoles?HR=${isHrRole}`,
				'',
				true
				);
			const getRoleObj = transformData(getRoles.result.items);
			lookup['hrRoles'] = getRoleObj;

		
			const domicileObj = transformData(newLookups?.domicile);
			lookup['domicile'] = domicileObj;

			
			const depObj = transformData(newLookups?.departments);
			lookup['department'] = depObj;

			
			const prisonObj = transformData(newLookups?.prison);
			lookup['prison'] = prisonObj;

			
			const destinationObj = transformData(newLookups?.designation);
			lookup['designation'] = destinationObj;

			
			const empObj = transformData(newLookups?.employementType);
			lookup['empTypes'] = empObj;

			
			const countryObj = transformData(newLookups?.country);
			lookup['country'] = countryObj;

			
			const sectObj = transformData(newLookups?.sect);
			lookup['sect'] = sectObj;
			
			const allSectObj = newLookups?.sect;
			lookup['allSect'] = allSectObj;

			const allReligionObj = newLookups?.religion;
			lookup['allReligion'] = allReligionObj;

			const hrServicesObj = transformData(newLookups?.hrServiceStatus);
			lookup['hrServiceStatus'] = hrServicesObj;

			const facilityTypeObj = transformData(newLookups?.facilityType);
			lookup['facilityType'] = facilityTypeObj;

			const relationshipTypesObj = transformData(newLookups?.relationshipTypes)
			lookup['relationshipTypes'] = relationshipTypesObj;

			const languagesObj = transformData(newLookups?.Language);
			lookup['languages'] = languagesObj;

			setLookups(lookup);
		} catch (error) {
			console.error(error);
			alert('something went wrong in lookups api');
		}
	};

	return (
		<>
			<div className='row p-2'>
				<form
					className='col-lg-12 justify-content-center'
					onSubmit={e => {
						e.preventDefault();
					}}
				>
					<div className='row'>
						<div className='col-lg-12 px-4 pxr-4'>
							<div class='progress'>
								<div
									class='progress-bar progress-bar-striped bg-success'
									role='progressbar'
									style={{ width: progres + '%' }}
									aria-valuenow={progres}
									aria-valuemin='0'
									aria-valuemax='100'
								></div>
							</div>
						</div>
					</div>
					<StepWizard onStepChange={() => { scrollToTop() }}>
						<BasicInfo
							title={'Basic Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
							isEmployee
						/>
						<UserInfo
							title={'User Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
							isEmployee
							setEmpUser={setEmpUser}
							prison={prisons}
							isHr={isHr}

						/>
						<BiometricInfo
							title={'Bio Metric Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
							isEmployee
						/>
						<ContactInfo
							title={'Contact Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							handleSubmit={handleSubmit}
							setProgress={setProgress}
							isEmployee
							lookUps={lookups}
						/>
						<EmployeeInfo
							title={'Employee Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							handleSubmit={handleSubmit}
							setProgress={setProgress}
							lookUps={lookups}
							isEmployee
							prison={prisons}
							isHr={isHr}
						/>
					</StepWizard>
				</form>
			</div>
		</>
	);
};

export default AddEmployee;
