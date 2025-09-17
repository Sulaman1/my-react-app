/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment-mini';
import InputWidget from '../../../../droppables/InputWidget';
import { baseImageUrl, getData, postData } from '../../../../services/request';
import {
	transformData,
	transfromStringArray,
	validateDate,
} from '../../../../common/Helpers';
import ProfilePic from '../../../../assets/images/users/1.jpg';
import swal from 'sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateTransferFormFields } from '../../../../common/FormValidator';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

const TransferModal = (props) => {
	const [infoPayload, setInfoPayload] = useState({});
	const [fileUploads, setFileUploads] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [isActiveLoading, setIsActiveLoading] = useState(false);
	const newLookups = useSelector((state) => state?.dropdownLookups) 

	const closeModal = () => {
		setFileUploads([]);
		props.setShowModal(false);
	};
	const [fetchedData, setData] = useState({});
	useEffect(() => {
		const prisonerId = props.prisonerObj?.id;
		if (props.apiEndPoint3 && prisonerId) {
			fetchInfoPayload(prisonerId);
		}
		setInfoPayload({ 
			prisonerId: prisonerId,
			transferDate: moment().format('YYYY-MM-DD')
		});
		fetchReleaseData();
	}, [props.prisonerObj]);

	const fetchInfoPayload = async (prisonerId) => {
		try {
			
			const result = await getData(
				`/services/app/PrisonerTransfer/${props.apiEndPoint3}?prisonerId=${prisonerId}`,
			);
			if (result && result.success) {
				const courtOrder = result?.result?.data?.courtOrder || '';
				if (courtOrder) {
					setFileUploads(courtOrder.split(','));
				}
				setInfoPayload(result.result.data);
			}
		} catch (err) {
			
			console.log(err);
		}
		
	};

	const fetchReleaseData = async () => {
		try {
			
			const data = {};
			const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
			const objParsed = JSON.parse(objStringify);
			const prisonName = objParsed.prisons[0].prisonName;
			const filteredPrisons = newLookups?.prison?.filter(
				(p) => p.name !== prisonName,
			);
			const courtsObj = transformData(filteredPrisons);
			data['transferPrison'] = courtsObj;
			setData(data);
			
		} catch (err) {
			
			alert('An error occured');
		}
		
	};


	const handleFrontUpload = (value, court) => {
		if(!value) return;
		const data = {
			image: value.split(',')[1],
			prisoner: false,
			imageName: 'doc'
		};
		setIsActiveLoading(true)
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const pd = {
						...infoPayload
					};

					if (court) {
						pd['courtOrder'] = res.result.imagePath;
					} else {
						pd['authorityLetter'] = res.result.imagePath;
					}
					setInfoPayload(pd);
					setIsActiveLoading(false);
				}
			})
			.catch(err => {
				console.log('getting error while uploading');
			});
	};

	const handleSubmit = async (ele) => {
		

		
		let obj = {};
		if (!validateTransferFormFields(infoPayload) && props.apiEndpoint != 'CancelTransferRequest' && props.apiEndpoint2 != 'RejectTransferRequest') {
			
			return false;
		}
		const endpoint = props.apiEndpoint2 === 'RejectTransferRequest' ? props.apiEndpoint2 : props.apiEndpoint;
		if (props.apiEndpoint === 'CancelTransferRequest' || props.apiEndpoint2 === 'RejectTransferRequest') {
			if (!infoPayload.cancelReason) {
				swal(
					'Required Fields',
					'Reason is Required',
					'warning',
				);
				
				return false;

			}
			obj = {
				cancelReason: infoPayload.cancelReason,
				transferId: props.prisonerObj?.transferId,
			};
		} else {
			obj = {
				prisonerId: infoPayload.prisonerId,
				transferId: props.prisonerObj?.transferId,
				prisonToId: infoPayload.prisonToId,
				transferDate: infoPayload.transferDate || moment().format('YYYY-MM-DD'),
				authority: infoPayload.authority,
				remarks: infoPayload.remarks,
				reason: infoPayload.reason,
				authorityLetter: infoPayload.authorityLetter,
				courtOrder: infoPayload.courtOrder,
			};
		}
		console.log(obj);

		try {
			
			if (props.apiEndpoint === 'CancelTransferRequest') {
				const willCancel = await swal({
					title: 'Are you sure?',
					text: 'You want to cancel',
					icon: 'warning',
					buttons: true,
					dangerMode: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, cancel it!',
				});
				if (willCancel) {
					
					postApiRequest(
						`/services/app/PrisonerTransfer/${props.apiEndpoint2 ? props.apiEndpoint2 : props.apiEndpoint}?reInitiate=${props.reInitiate}`,
						obj,
						'cancelled',
					)

				}

			} else {
				const willProceed = await swal({
					title: 'Are you sure?',
					text: 'You want to proceed',
					icon: 'warning',
					buttons: true,
					dangerMode: true,
					confirmButtonColor: '#0000FF',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes',
				});
				if (willProceed) {
					
					postApiRequest(
						`/services/app/PrisonerTransfer/${endpoint}?reInitiate=${props.reInitiate}`,
						obj,
					);
					props.setShowModal(false);
				}
			}
		} catch (err) {
		
			console.log(err);
		}
	
	};
	const postApiRequest = async (url, obj, type = 'success') => {
		try {
			
			const result = await postData(url, obj);
			if (result.success) {
			
				setInfoPayload({});
				props.setShowModal(false);
				if (type === 'success' && props.apiEndpoint2 !== 'RejectTransferRequest') {
					swal('Transfer Successfully Initiated', '', 'success');
				} else {
					swal('Cancelled!', '', 'success').then((_) => {
						setInfoPayload({});
					});
				}
				props.loadData();
			} else {
			
				swal(
					!result.error.details ? '' : result.error.message,
					result.error.details ?
						result.error.details :
						result.error.message,
					'warning',
				);
			}
		} catch (err) {
			
			console.log(err);
		}
	};

	// Add moment to format date consistently
	const defaultDate = moment().format('YYYY-MM-DD');

	return (
		<Modal show={props.showModal} onHide={closeModal} size='lg'>
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 className='modal-title' id='exampleModalgridLabel'>
					Transfer Information
				</h5>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className='col-12 px-0 mt-5'>
						<div className='row'>
							{props.apiEndpoint === 'CancelTransferRequest' ||
								props.apiEndpoint2 === 'RejectTransferRequest' ? (
								<div className='col-lg-12'>
									<InputWidget
										type={'input'}
										inputType={'name'}
										label={'Reason'}
										id={'reason'}
										require={true}
										icon={'icon-operator'}
										defaultValue={infoPayload?.cancelReason}
										setValue={(value) => {
											console.log('cancelReason', value);
											const pd = {
												...infoPayload,
											};
											pd['cancelReason'] = value;
											setInfoPayload(pd);
										}}
									/>
								</div>
							) : (
								<>
									{' '}
									<div className='col-lg-12'>
										<InputWidget
											type={'multiSelect'}
											inputType={'name'}
											label={'Prison To'}
											id={'prison-to'}
											require={true}
											icon={'icon-prison'}
											options={
												fetchedData.transferPrison || []
											}
											multiple={false}
											defaultValue={
												transfromStringArray(
													props?.prisonerList,
													infoPayload.prisonToId,
												) || []
											}
											setValue={(value) => {
												console.log(
													'prisonToId',
													value,
												);
												const pd = {
													...infoPayload,
												};
												pd['prisonToId'] = value.value;
												setInfoPayload(pd);
											}}
										/>
									</div>
									<div className='col-lg-12'>
										<div className='inputs force-active'>
											<label>Transfer Date</label>
											<DatePicker
												icon={'icon-calendar'}
												selected={
													infoPayload?.transferDate ? 
													new Date(infoPayload.transferDate) : 
													new Date(defaultDate)
												}
												onChange={(date) => {
													setSelectedDate(date);
													const pd = {
														...infoPayload,
													};
													pd['transferDate'] = date ? 
														`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : 
														defaultDate;
													setInfoPayload(pd);
												}}
												dateFormat='dd/MM/yyyy'
												// minDate={new Date()}
												maxDate={new Date()}
												isClearable
												showYearDropdown
												scrollableYearDropdown
												yearDropdownItemNumber={120}
												showMonthDropdown
												placeholderText={''}
												id={'tranfer-date'}
											/>
										</div>

									</div>
									<div className='col-lg-12'>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Authority'}
											id={'authority'}
											require={true}
											icon={'icon-court'}
											defaultValue={
												infoPayload?.authority
											}
											setValue={(value) => {
												console.log('authority', value);
												const pd = {
													...infoPayload,
												};
												pd['authority'] = value;
												setInfoPayload(pd);
											}}
										/>
									</div>
									<div className='col-lg-12'>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Remarks'}
											id={'remarks'}
											require={false}
											icon={'icon-chat'}
											defaultValue={infoPayload?.remarks}
											setValue={(value) => {
												console.log('remarks', value);
												const pd = {
													...infoPayload,
												};
												pd['remarks'] = value;
												setInfoPayload(pd);
											}}
										/>
									</div>
									<div className='col-lg-12'>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Reason'}
											id={'reason-t'}
											require={true}
											icon={'icon-activate'}
											defaultValue={infoPayload?.reason}
											setValue={(value) => {
												console.log('reason', value);
												const pd = {
													...infoPayload,
												};
												pd['reason'] = value;
												setInfoPayload(pd);
											}}
										/>
									</div>
									<div className='row' style={{ 'overflow': 'hidden' }}>

										<div className='col-lg-6'>
											<h4 className='sub-heading text-center just-center mb-3'>
												Authority Letter
											</h4>
											<InputWidget
												id={'Authority-letter'}
												type={'editImage'}
												inputType={'file'}
												upload={'icon-upload'}
												noCropping={true}
												onlyUploadFile={true}
												take={'icon-photographers'}
												require={false}
												Photo={
													infoPayload?.authorityLetter
														? baseImageUrl +
														infoPayload?.authorityLetter
														: ProfilePic
												}
												setValue={value => {
													handleFrontUpload(value);
												}}
											/>
										</div>

										<div className='col-lg-6'>
											<h4 className='sub-heading text-center just-center mb-3'>
												Court Order
											</h4>
											<InputWidget
												id={'Court-Order'}
												type={'editImage'}
												inputType={'file'}
												upload={'icon-upload'}
												noCropping={true}
												onlyUploadFile={true}
												take={'icon-photographers'}
												require={false}
												Photo={
													infoPayload?.courtOrder
														? baseImageUrl +
														infoPayload?.courtOrder
														: ProfilePic
												}
												setValue={value => {
													handleFrontUpload(
														value,
														'court'
													);
												}}
											/>
											{isActiveLoading && (
											<Spinner variant='primary' animation="border" style={{position: "relative", top: "-8rem", right: "1.5rem"}}/>
											)} 
										</div>

									</div>

								</>
							)}
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
			<button
					id={'cancel-btn'}
					className='btn btn-light lg-btn submit-prim waves-effect waves-light mx-1'
					onClick={closeModal}
				>
					Cancel
				</button>
				<button
					id={'submit-btn'}
					className='btn btn-success lg-btn submit-prim waves-effect waves-light mx-1'
					onClick={handleSubmit}
				>
					{props.apiEndpoint2 === 'RejectTransferRequest' ?
						'Reject Transfer' :
						props.apiEndpoint === 'CancelTransferRequest' ?
							'Cancel Transfer' :
							'Initiate Transfer'}
				</button>
			
			</Modal.Footer>
		</Modal>
	);
};

export default TransferModal;
