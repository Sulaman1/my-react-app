import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { transfromStringArray, validateDate, getFormattedDate } from '../../../common/Helpers';
import { TabButton } from '../../../common/TabButton';
import InputWidget from '../../../droppables/InputWidget';
import { getData, postData } from '../../../services/request';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import { generateYears } from '../../../common/Common';


const PrisonerInfo = props => {

	const [lstPrisonObj, setLstPrisonObj] = useState({});
	const [lastPrsNo, setLastPrsNo] = useState();
	const [isUtp, setIsUtp] = useState();
	const [prisonID, setPrisonID] = useState(null);
	const userMeta = useSelector(state => state.user);
	//const [years, setYears] = useState(generateYears());



	const checkUserRole = () => {
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		const roles = objParsed?.user?.roleNames;
		let isUtp = false;
		if (roles?.length) {
			roles.forEach(element => {
				if (element.indexOf('UTP') > -1) {
					isUtp = true;
				}
			});
		}
		setIsUtp(isUtp);
		return isUtp;
	};

	const loadData = (obj, id) => {
		const currentYear = obj ? id :  props.formPayload?.prisonerNumber?.year || new Date().getFullYear();
		const isUtp = checkUserRole();
		const catId = isUtp ? 1 : 2;
		const prisonId = obj && obj.prison ? obj.prison : prisonID;
		if (!catId || !prisonId) {
			return false;
		}
		getData(
			'/services/app/AddPrisonerAppServices/GetLastPrisonerNumber?Category=' +
			catId +
			'&PrisonId=' +
			prisonId +
			'&year=' +
			currentYear
		)
			.then(res => {
				if (res.success) {
					setLastPrsNo(res.result.prsNumber);
				}
			})
			.catch(err => {
				console.log(err, 'Error while fetching last Prsion number');
				console.log(err,"getting error while fetching Last Prisoner Number in API {GetLastPrisonerNumber} & fileName is {PrisonerInfo.js}")

			});
	};
	useMemo(() => {
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		const roles = objParsed?.user?.roleNames;
		checkUserRole(roles);
		setPrisonID(objParsed?.prisons?.[0]['prisonId']);
		loadData('', objParsed?.prisons?.[0]['prisonId']);
	}, [props.formPayload?.prisonerNumber]);

	const handleBlur = (value) => {
		const isUtp = checkUserRole();
		const catId = isUtp ? 1 : 2;
		const data = {
			prisonerNumber: value,
			category: catId,
			prisonId: prisonID,
			year: props.formPayload?.prisonerNumber?.year || new Date().getFullYear()
		};
		postData('/services/app/AddPrisonerAppServices/CheckIfPrisonerNumberExists', data)
			.then(res => {
				if (res.success == true) {
					if (res.result == true) {
						swal(
							'Prisoner Number already exists!',
							'',
							'warning'
						);
					}
				}
			})
			.catch(err => {
				console.log(err,"getting error while checking Prisoner Number in API {CheckIfPrisonerNumberExists} & fileName is {PrisonerInfo.js}")
			});
	}

	const handleLastPrisonNumber = value => {
		loadData(lstPrisonObj, value);
	};

	return (
		<>
			<div className='tabs-wraper '>
				<ul className='custom-nav tabs-style'>
					{/* if prison only */}
					{!props.isDarban && !props.isEmployee && (
						<TabButton active={'active'} step={1} progress={'14.2'} title={'Prisoner Info'} props={props} />
					)}
					<TabButton step={props.isEmployee ? 1 : 2} progress={props.isEmployee ? '20' : '28.4'} title={'Basic Information'} props={props} />
					{/* employee only */}
					{props.isEmployee && (
						<TabButton step={2} progress={'40'} title={'User Information'} props={props} />
					)}
					{/* employee or prisoner */}
					{!props.isDarban && (
						<>
							{!props.isEmployee && (
								<TabButton step={3} progress={'42.6'} title={'Professional Information'} props={props} />
							)}
							<TabButton step={props.isEmployee ? 3 : 4} progress={props.isEmployee ? '60' : '58.6'} title={'Bio Metric Information'} props={props} />
							<TabButton step={props.isEmployee ? 4 : 5} progress={props.isEmployee ? '80' : '71'} title={'Contact Information'} props={props} />
							{!props.isEmployee && (
								<>
									<TabButton step={6} progress={'85.2'} title={'Prisoner Info'} props={props} />
								</>
							)}
							{props.isEmployee && (
								<TabButton step={5} progress={'100'} title={'Employee Information'} props={props} />
							)}

						</>
					)}
				</ul>
				<div className='tabs-panel'>
					<div className='row'>
						<h4 className='third-heading'>{props.title}</h4>
					</div>
					<div className='row'>
						{userMeta?.role == 'Super Admin' && (
							<>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Category (قیدی کی درجہ بندی)'}
										id={'category'}
										require={false}
										icon={'icon-planer'}
										options={props?.lookUps?.category || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.category,
												props?.formPayload
													?.prisonerNumber
													?.category,
												'category'
											) || []
										}
										setValue={value => {
											const payload = {
												...props.formPayload
											};
											const payl = {
												...lstPrisonObj
											};
											payl['category'] = value.value;
											setLstPrisonObj(payl);
											payload['prisonerNumber'][
												'category'
											] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Prison (جیل)'}
										id={'prison'}
										require={false}
										icon={'icon-prison'}

										options={props?.lookUps?.prison || []}

										defaultValue={
											transfromStringArray(
												props?.lookUps?.prison,
												props?.formPayload
													?.prisonerNumber?.prisonId
											) || []
										}
										setValue={value => {
											const payload = {
												...props.formPayload
											};
											const payl = {
												...lstPrisonObj
											};
											payl['prison'] = value.value;
											setLstPrisonObj(payl);
											payload['prisonerNumber'][
												'prisonId'
											] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
							</>
						)}
						<div className='col-lg-6 rel'>
							<span className='d-flex sub-title just-right'>
								{' '}
								<span style={{ color: 'red' }}>
									<b> Last {isUtp ? 'UTP' : 'Convict'} : </b>{' '}
									{lastPrsNo}
								</span>
							</span>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Prisoner Number (قیدی نمبر)'}
								id={'prisoner-number'}
								require={false}
								enableBlur={true}
								blurCallBack={handleBlur}
								apiURL='/services/app/AddPrisonerAppServices/CheckIfPrisonerNumberExists'
								onlyNumbers={true}
								icon={'icon-number'}
								defaultValue={
									props?.formPayload?.prisonerNumber
										?.prsNumber
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['prisonerNumber']['prsNumber'] =
										value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
							type={'multiSelect'}
							ismulti={false}
							inputType={'select'}
							label={'Crime Types (جرائم کی اقسام)'}
							id={'category'}
							require={false}
							icon={'icon-planer'}
							options={props?.lookUps?.crimeTypes || []}
							defaultValue={
								transfromStringArray(
								props?.lookUps?.crimeTypes,
								props?.formPayload?.crimeTypeId
								) || []
							}
							setValue={value => {
								const payload = {
								...props.formPayload
								};
								payload['crimeTypeId'] = value.value;
								props.setFormPayload(payload);
							}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								isMulti={false}
								inputType={'select'}
								label={'Year (سال)'}
								id={"years"}
								defaultValue={
									props.formPayload.prisonerNumber.year
										? {
											label: props.formPayload
												.prisonerNumber.year,
											value: props.formPayload
												.prisonerNumber.year
										}
										: years[0]
								}
								require={false}
								icon={'icon-event'}
								options={years}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									const payl = {
										...lstPrisonObj
									};
									payl['year'] = value.value;
									setLstPrisonObj(payl);

									handleLastPrisonNumber(value.value);
									payload['prisonerNumber']['year'] =
										value.value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<div className='inputs force-active'>
								<label>Admission Date (داخلہ کی تاریخ)</label>
								<DatePicker
									selected={validateDate(props?.formPayload?.prisonerAdmission?.admissionDate) ? getFormattedDate(props?.formPayload?.prisonerAdmission?.admissionDate) : new Date()}
									onChange={date => {
										const payload = {
											...props.formPayload
										};
										payload['prisonerAdmission'][
											'admissionDate'
										] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
										props.setFormPayload(payload);
									}}
									dateFormat='dd/MM/yyyy'

									maxDate={new Date()}
									icon={'icon-operator'}
									isClearable
									showYearDropdown
									className={'input-open'}
									id={'admission-date'}
									scrollableYearDropdown
									yearDropdownItemNumber={120}
									showMonthDropdown
								/>
							</div>
						</div>
						{userMeta?.role !== 'Prison UTP Branch' && (
							<div className='col-lg-6'>
								<div className='inputs force-active'>
									<label>Conviction Date (سزا کی تاریخ)</label>
									<DatePicker
										icon={'icon-calendar'}
										selected={validateDate(props?.formPayload?.prisonerAdmission?.convictionDate) ? getFormattedDate(props?.formPayload?.prisonerAdmission?.convictionDate) : new Date()}
										onChange={date => {
											const payload = {
												...props.formPayload
											};
											payload['prisonerAdmission'][
												'convictionDate'
											] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
											props.setFormPayload(payload);
										}}
										dateFormat='dd/MM/yyyy'
										maxDate={new Date()}
										isClearable={true}
										id={'convictionDate'}
										showYearDropdown
										scrollableYearDropdown
										yearDropdownItemNumber={120}
										showMonthDropdown
									/>
								</div>
							</div>
						)}

						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Belongings (سامان)'}
								require={false}
								icon={'icon-sports'}
								id={'belongings'}
								defaultValue={
									props?.formPayload?.prisonerAdmission
										?.belongings
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['prisonerAdmission']['belongings'] =
										value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
					</div>
					<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
						<button
							id="next-btn"
							onClick={() => {
								props.nextStep();
								props.setProgress('28.4');
							}}
							type='button'
							className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
						>
							Next <i className='icon-rightangle ml-2'></i>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default PrisonerInfo;
