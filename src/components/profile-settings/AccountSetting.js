import React, { useEffect, useState } from 'react';

import InputWidget from '../../droppables/InputWidget';
import Profile from '../../assets/images/users/1.jpg';
import { getData, postData, baseImageUrl } from '../../services/request';
import swal from 'sweetalert';
import { transformData, transfromStringArray } from '../../common/Helpers';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from 'date-fns';
import ChangePassword from './ChangePassword';
import { useSelector } from 'react-redux';

const AccountSetting = props => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const newLookups = useSelector((state) => state?.dropdownLookups);
	const [isTextShow, setIsTextShow] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [match, setMatch] = useState('');
	const { personalInfo, joiningDate, biometricInfo, user, designationId, userId, contactInfo } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
	const [designations, setDesignations] = useState([]);
	const [selectDesignation, setSelectedDesgination] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [lookups, setLookups] = useState({});

	console.log(
		'LoggedInEmployee',
		JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'))
	);

	

	const fetchLookUps = async () => {
		try {
		  
		  const lookup = {};

		  const relationshipTypesObj = transformData(newLookups?.relationshipTypes);
		  lookup['relationshipTypes'] = relationshipTypesObj;
		  setLookups(lookup);
		} catch (error) {
		  console.error(error);
		  alert('Something went wrong in lookups api');
		}
	  };

	  useEffect(() => {
		fetchLookUps();
	  }, []);

	useEffect(() => {
		if (!designationId) return;
		getData('/services/app/AdminLkpt/GetAllDesignation')
			.then(res => {
				const transformedDesignations = transformData(res.result.data);
				setDesignations(transformedDesignations);
				setSelectedDesgination(
					transformedDesignations.find(x => x.value === designationId)
				);
			})
			.catch(err => {
				console.error(
					err,
					'Error while fetching Get single employee info'
				);
			});
	}, [designationId]);

	const changePasswordHandler = event => {
		event.preventDefault();

		if (confirmPassword !== newPassword) {
			return alert('Passwords do not match');
		}

		postData('/services/app/User/ChangePassword', {
			currentPassword: oldPassword,
			newPassword
		})
			.then(result => {
				if (result.success) {
					swal('Password changed', '', 'success').then(() => {
						console.log('CHANGED PASSWORD ->', result);
					});
				} else {
					swal('', result?.error?.message, 'error').then(() => {
						console.log('CHANGED PASSWORD ->', result);
					});
				}

			})
			.catch(console.err);
	};

	const handleFrontUpload = value => {
		if (!value) return;


		const data = {
			image: value.substring(23),
			prisoner: false,
			imageName: 'UserPicture'
		};
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				const filePath = res.result.imagePath;
				if (res.success == true) {
					postData('/services/app/EmployeeAppServices/UpdateEmployeePic', { 'UserId': userId, 'UserPicture': filePath })
						.then(res => {
							biometricInfo.UserPicture = filePath;

							swal("Photo Updated", "Changes will be visible on your next login", "success")
							setIsTextShow(true);
							setTimeout(() => {
								setIsTextShow(false);

							}, 3000);
						})
						.catch(err => {

							console.error(
								err,
								'Error while fetching Get single employee info'
							);
						});
				}
			})
			.catch(err => {

				console.log('getting error while uploading');
			});
	};

	return (
		<>
			<div className='position-relative mx-n4 mt-n4 mt-20'>
				<div className='profile-wid-bg profile-setting-img'>
					<img
						src='assets/images/1.jpg'
						className='profile-wid-img'
						alt=''
					/>
					<div className='overlay-content'>
						<div className='text-end p-3'>
							<div className='p-0 ms-auto rounded-circle profile-photo-edit'>
								<input
									id='profile-foreground-img-file-input'
									type='file'
									className='profile-foreground-img-file-input'
								/>
								{/* <label
									htmlFor='profile-foreground-img-file-input'
									className='profile-photo-edit btn btn-light'
								>
									<i className='ri-image-edit-line align-bottom me-1'></i>{' '}
									Change Cover
								</label> */}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-xxl-3'>
					<div className='card mt-n5'>
						<div className='card-body p-4'>
							<div className='text-center'>
								<div className='profile-user position-relative d-inline-block mx-auto  mb-4'>
									<InputWidget
										id={'user'}
										type={'editImage'}
										inputType={'file'}
										upload={'icon-upload'}
										allowCompression={true}
										take={'icon-photographers'}
										require={false}
										Photo={
											biometricInfo.leftPic
												? baseImageUrl + biometricInfo.leftPic
												: Profile
										}
										setValue={value => {
											handleFrontUpload(value);
										}}
									/>
									{isTextShow && <span style={{ lineHeight: '30px' }}>Updation will be reflect on next login</span>}
								</div>
								<h5 className='fs-16 mb-1'>{`${personalInfo.fullName}`}</h5>
								<p className='text-muted mb-0'>
									{user.roleNames.toString()}
								</p>
							</div>
						</div>
					</div>
					<div className='card'>
						<ChangePassword />
					</div>
				</div>
				<div className='col-xxl-9'>
					<div className='card mt-xxl-n5'>
						<div className='card-header'>
							<h3 className='text-left'>Personal Details</h3>
						</div>
						<div className='card-body p-4'>
							<div className='tab-content'>
								<div
									className='tab-pane active'
									id='personalDetails'
									role='tabpanel'
								>
									<form action='javascript:void(0);'>
										<fieldset disabled={true}>
											<div className='row'>
												<div className='col-lg-6'>
													<InputWidget
														type={'input'}
														inputType={'name'}
														label={'Full Name'}
														require={false}
														readOnly={true}
														defaultValue={
															personalInfo?.fullName
														}
														icon={'icon-operator'}
														setValue={value => { }}
													/>
												</div>
												<div className='col-lg-6'>
													<InputWidget
														type={'multiSelect'}
														ismulti={false}
														inputType={'select'}
														label={'Relationship Type'}
														id={'relation'}
														require={false}
														icon={'icon-web'}
														options={
															lookups['relationshipTypes'] || []
														}
														defaultValue={
															transfromStringArray(
																lookups['relationshipTypes'],
																personalInfo?.relationshipType
															) || []
														}
														setValue={value => { }}
													/>
												</div>
												<div className='col-lg-6'>
													<InputWidget
														type={'input'}
														inputType={'name'}
														label={'Relationship Name'}
														defaultValue={
															personalInfo?.relationshipName
														}
														require={false}
														readOnly={true}
														icon={'icon-operator'}
														setValue={value => { }}
													/>
												</div>
												<div className='col-lg-6'>
													<InputWidget
														type={'input'}
														inputType={'number'}
														label={'Phone Number'}
														require={false}
														readOnly={true}
														defaultValue={
															contactInfo?.mobileNumber
														}
														icon={'icon-phone'}
														setValue={value => { }}
													/>
												</div>
												<div className='col-lg-6'>
													<InputWidget
														type={'input'}
														inputType={'email'}
														label={'Email'}
														require={false}
														readOnly={true}
														icon={'icon-email'}
														defaultValue={
															user.emailAddress
														}
														setValue={value => { }}
													/>
												</div>
												<div className='col-lg-6 '>
													<div className='inputs force-active'>
														<label>Date of birth</label>
														<DatePicker
															icon={'icon-calendar'}
															onChange={date => {
																setSelectedDate(date)

															}}
															selected={
																new Date(personalInfo?.dateOfBirth)
															}
															dateFormat='dd/MM/yyyy'
															minDate={new Date()}
															maxDate={addMonths(new Date(), 5)}
														/>

													</div>
												</div>

												<div className='col-lg-6'>
													<InputWidget
														options={designations}
														type={'multiSelect'}
														ismulti={true}
														inputType={'select'}
														label={'Designation'}
														readOnly={true}
														isDisabled={true}
														require={false}
														icon={'icon-file'}
														defaultValue={
															selectDesignation
														}
														setValue={value => {
															setSelectedDesgination(
																value
															);
														}}
													/>
												</div>
												{/* Not taking information at employee registration so for the time being hiding these fields */}
												{/* <div className='col-lg-4'>
												<InputWidget
													type={'multiSelect'}
													ismulti={false}
													inputType={'select'}
													label={'city'}
													require={false}
													icon={'icon-building'}
													isDisabled={true}
													setValue={value => { }}
												/>
											</div>
											<div className='col-lg-4'>
												<InputWidget
													type={'multiSelect'}
													ismulti={false}
													inputType={'select'}
													label={'Country'}
													require={false}
													icon={'icon-building'}
													isDisabled={true}
													setValue={value => { }}
												/>
											</div>
											<div className='col-lg-4'>
												<InputWidget
													type={'input'}
													ismulti={false}
													inputType={'number'}
													label={'Zip Code'}
													require={false}
													icon={'icon-number'}

													setValue={value => { }}
												/>
											</div> */}
											</div>
										</fieldset>
										{/* <div class='col-lg-12'>
											<div class='hstack gap-2 justify-content-end'>
												<button
													type='submit'
													class='btn btn-primary'
												>
													Request Update
												</button>
												<button
													type='button'
													class='btn btn-soft-success'
												>
													Cancel
												</button>
											</div>
										</div> */}
									</form>
								</div>
							</div>
						</div>
						{/* <div className='card-header'>
							<h5 className='text-left'>Login History</h5>
						</div>
						<div className='card-body p-4'>
							<div className='d-flex align-items-center mb-3'>
								<div className='flex-shrink-0 avatar-sm'>
									<div className='avatar-title bg-light text-primary rounded-3 fs-18'>
										<i className='ri-smartphone-line'></i>
									</div>
								</div>
								<div className='flex-grow-1 ms-3'>
									<h6 className='text-left'>iPhone 12 Pro</h6>
									<p className='text-muted mb-0 text-left'>
										Los Angeles, United States - March 16 at
										2:47PM
									</p>
								</div>
								<div>
									<a href='javascript:void(0);'>Logout</a>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default AccountSetting;
