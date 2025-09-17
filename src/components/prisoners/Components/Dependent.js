import React, { useEffect, useState } from 'react';
import { _ } from 'gridjs-react';
import {
	scrollToTop,
	transformDataForTableGrid,
	transfromStringArray,
	validateDate,
	getFormattedDate
} from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl, deleteData, getData, postData } from '../../../services/request';
import DatePicker from 'react-datepicker';
import swal from 'sweetalert';
import DetailsGrid from './DetailsGrid';
import PrisonerInfoCard from './release-prisoner/PrisonerInfoCard';
import { useDispatch } from 'react-redux';
import ProfilePic from '../../../../src/assets/images/users/1.jpg'
const Dependent = props => {
	const [formPayload, setFormPayload] = useState({
		data: {}
	});
	const [userData, setUserData] = useState([]);
	const [prisonerId, setPrisonerId] = useState(null);
	const dependentData = [
		{
			"Profile Pic": 21,
			'Name': 21,
			'Relationship': 'Bother',
			'Age Category': '12',
			'Date of Birth': '12/12/2021',
			'Gender': 'Male',
			'Other Details': '',

			'Actions': ''
		}
	];

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		const data = sessionStorage.getItem('selectedPrisoner');

		if (data) {
			const parsedId = JSON.parse(data).id;
			setPrisonerId(parsedId);
			getData(
				'/services/app/PrisonerDetailInformation/GetAllDependents?prisonerId=' +
				parsedId
			)
				.then(res => {
					// if (res && res.result.isSuccessful) {
					const data = res.result.data;
					if (data.length > 0) {
						const filterdData = data.map(e => {
							return {
								profile: _(
									<>
										<img
											onError={(ev) => {
												ev.target.src = ProfilePic;
											}}
											className='avatar-xs rounded-circle '
											src={`${e.frontPicture ?
												baseImageUrl + e.frontPicture :
												ProfilePic
												}`}
											width='50'
										/>
									</>
								),
								name: e?.name,
								relationship: e?.relationship,
								ageCategory: e?.ageCategory,
								dateOfBirth: validateDate(e?.dateOfBirth) || "",
								gender: e?.gender,
								otherDetails: e?.otherDetails,
								Action: _(
									<div className='action-btns'>
										<button
											id={'edit-btn'}
											type='button'
											className='btn btn-secondary waves-effect waves-light mx-1'
											onClick={() => handleEditBtn(e)}
										>
											<i className='icon-edit'></i>
										</button>
										<button
											id={'delete-btn'}
											type='button'
											onClick={() => {
												handleDelBtn(e);
											}}
											className='btn btn-success waves-effect waves-light mx-1'
										>
											<i className='icon-delete'></i>
										</button>
									</div>
								)
							};
						});
						setUserData(transformDataForTableGrid(filterdData));
					} else {
						setUserData([]);
					}
				})
				.catch(err => {
					console.log(err, 'getting error while fetching API {GetAllDependents} & fileName is {Dependent.js}');
				});
		}
	};

	const handleEditBtn = item => {
		scrollToTop();
		getData(
			'/services/app/PrisonerDetailInformation/GetOneDependent?id=' +
			item.id
		)
			.then(res => {
				if (res.result.isSuccessful) {
					setFormPayload({ data: { ...res.result.data } });
				}
			})
			.catch(err => {
				console.log(err, 'getting error while fetching API {GetOneDependent} & fileName is {Dependent.js}');
			});
	};

	const handleDelBtn = (item, event) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to delete: ' + item.name,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async willDelete => {

			if (willDelete) {
				
				postData(
					'/services/app/PrisonerDetailInformation/DeleteDependent?dependentId=' +
					item.id
				)
					.then(res => {
						if (res.success == true) {
							swal('Deleted!', '', 'success').then(result => {
								loadData();
							});

						}
					})
					.catch(err => {
						swal(err.message, err.details ?? '', 'warning');
						// console.log(err, 'getting error while deleting API {DeleteDependent} & fileName is {Dependent.js}');
					});

			}
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();

		let isValid = true;
		let invalidErrors = [];

		// ageCategoryId

		if (!formPayload['data']['relationshipId']) {
			isValid = false;
			invalidErrors.push('Relationship missing');
		}

		if (!formPayload['data']['dateOfBirth']) {
			isValid = false;
			invalidErrors.push('Age Category missing');
		}

		if (!formPayload['data']['genderId']) {
			isValid = false;
			invalidErrors.push('Gender missing');
		}

		if (!isValid) {
			swal({
				button: true,
				icon: 'error',
				title: 'Missing Required fields',
				text: invalidErrors.toString()
			});
		} else {
			formPayload['data']['prisonerBasicInfoId'] = prisonerId;
			postData(
				'/services/app/PrisonerDetailInformation/CreateUpdateDependents',
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
						setFormPayload({
							data: { name: '', otherDetails: '' }
						});
						loadData();
					}
				})
				.catch(err => {
					swal('Something went wrong!', err, 'warning');
					console.log(err, 'getting error while upserting API {CreateUpdateDependents} & fileName is {Dependent.js}');
				});
		}
	};

	const handleImageUpload = async (value) => {
		if (!value) return;
		const data = {
			image: value.split(',')[1],
			prisoner: false,
			imageName: "frontPicture"
		};	
		try {
			const res = await postData('/services/app/BasicInfo/uploadBase64', data);
			if (res.success) {
				const payload = {
					...formPayload,
				};
				payload['data']['frontPicture'] = res.result.imagePath;
				setFormPayload(payload);
			} else {
				swal('Getting error while uploading', '', 'warning');
			}
		} catch (err) {
			console.log(err, ' errerrerr');
			swal('Getting error while uploading', '', 'warning');
		}
	};

	return (
		<>
			<PrisonerInfoCard prisoner={props?.prisoner} />
			<div className='row p-2'>
				<div className='row'>
					<h4 className='third-heading'>{props.title}</h4>
				</div>
				<form>
					<div className='row'>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								id={'name'}
								label={'Name'}
								require={false}
								icon={'icon-operator'}
								defaultValue={formPayload.data.name}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['data']['name'] = value;
									setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								isMulti={false}
								inputType={'select'}
								id={'relationship'}
								label={'Relationship'}
								require={false}
								icon={'icon-planer'}
								options={props?.lookUps?.relationship || []}
								defaultValue={
									transfromStringArray(
										props?.lookUps?.relationship,
										formPayload?.data?.relationshipId
									) || []
								}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['data']['relationshipId'] =
										value.value;
									setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<div className='inputs force-active'>
								<label>Date Of Birth (تارخ پیدائش)</label>
								<DatePicker
									dateFormat='dd/MM/yyyy'
									maxDate={new Date()}
									icon={'icon-operator'}
									isClearable
									showYearDropdown
									scrollableYearDropdown
									yearDropdownItemNumber={120}
									showMonthDropdown
									placeholderText={''}
									id={'date-of-birth'}
									selected={validateDate(formPayload?.data?.dateOfBirth) ? getFormattedDate(formPayload?.data?.dateOfBirth) : null}
									onChange={date => {
										const payload = {
											...formPayload
										};
										payload['data']['dateOfBirth'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
										setFormPayload(payload);
									}}
								/>
							</div>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								isMulti={false}
								inputType={'select'}
								label={'Gender'}
								id={'gender'}
								require={false}
								icon={'icon-gender'}
								options={props?.lookUps?.gender || []}
								defaultValue={
									transfromStringArray(
										props?.lookUps?.gender,
										formPayload?.data?.genderId
									) || []
								}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['data']['genderId'] = value.value;
									setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Other Details'}
								require={false}
								id={'other-details'}
								icon={'icon-file'}
								defaultValue={formPayload.data.otherDetails}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['data']['otherDetails'] = value;
									setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
						</div>
						<div className='row mb-3'>
							<h3 className='sub-heading text-center just-center mb-3'>
								Dependent Picture
							</h3>
							<InputWidget
									id={'front-pic'}
									type={'editImage'}
									inputType={'file'}
									upload={'icon-upload'}
									take={'icon-photographer'}
									allowCompression={true}
									require={false}
									Photo={
										formPayload?.data?.frontPicture
											? baseImageUrl +
											formPayload?.data?.frontPicture
											: ProfilePic
									}
									setValue={value => {
										handleImageUpload(value);
									}}
								/>
						</div>
					</div>
					<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
						<button
							id={'save-btn'}
							type='button'
							onClick={handleSubmit}
							className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
						>
							Save Dependent <i className='icon-add ml-2'></i>
						</button>
					</div>
				</form>
			</div>
			<DetailsGrid
				columnData={dependentData[0]}
				data={userData}
				dependents={true}
			/>
		</>
	);
};

export default Dependent;
