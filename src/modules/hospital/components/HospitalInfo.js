import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { transformData, validateDate, getFormattedDate } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { useSelector } from 'react-redux';
import { getData } from '../../../services/request';

const HospitalInfo = props => {
	const [lookups, setLookups] = useState({});
	const [isOutside, setIsOutside] = useState('');
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	const [lastTreatmentNo, setLastTreatmentNo] = useState(0);

	useEffect(() => {
		
		fetchLookUps();
	}, []);

	const fetchLookUps = async () => {
		try {
			const lookup = {};
		
			const hospitalAdmissionTypeObj = transformData(
				newLookups?.hospitalAdmissionTypes
			);
			lookup['hospitalAdmissionTypes'] = hospitalAdmissionTypeObj;
			
			const outHospitalsObj = transformData(newLookups?.outsideHospitals);
			lookup['outsideHospitals'] = outHospitalsObj;

			const diseasesObj = transformData(newLookups?.disease);
			lookup['diseases'] = diseasesObj;

			setLookups(lookup);
		} catch (error) {
			console.error(error);
			console.log(error, 'getting error while fetching Lookups in fileName is {HospitalInfo.js}')
		}
	};

	
	const loadData = (admissionTypeId) => {
		const prisoner = JSON.parse(
			sessionStorage.getItem('prisonerAdmissionEntry')
		  );
		getData(
			'/services/app/PrisonerMedicalInfo/GetLastHospitalAdmissionNumber?prisonerBasicInfoId='+ prisoner?.id +
			'&hospitalAdmissionType=' + admissionTypeId
		)
			.then(res => {
				if (res.success) {
					setLastTreatmentNo(res.result.data);
				}
			})
			.catch(err => {
				console.log(err, 'Error while fetching last Prsion number');
				console.log(err,"getting error while fetching Last Prisoner Number in API {GetLastPrisonerNumber} & fileName is {PrisonerInfo.js}")

			});
	}; 

	const handleLastTreatmentNumber = value => {
		loadData(value);
	};

	return (
		<div className='row p-2'>
			<div className='row'>
				<h4 className='third-heading'>{props.title}</h4>
			</div>
			<div className='row'>
			
				<div className='col-lg-6'>
					<InputWidget
						type={'multiSelect'}
						inputType={'name'}
						label={'Treatment Type (علاج کی قسم)'}
						id={'hospital-admission-type'}
						multiple={false}
						require={true}
						icon={'icon-hospital'}
						options={lookups.hospitalAdmissionTypes || []}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							handleLastTreatmentNumber(value.value);
							payload['hospitalAdmissionType'] = value.value;
							setIsOutside(value.label);
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
				<span className='d-flex sub-title just-right'>
								{' '}
								<span style={{ color: 'red' }}>
									<b> Last Treatment No: </b>{' '}
									{lastTreatmentNo}
								</span>
							</span>
					<InputWidget
						type={'input'}
						inputType={'number'}
						label={'Treatment Number (علاج نمبر)'}
						id={'treatment-number'}
						require={true}
						icon={'icon-number'}
						defaultValue={props?.formPayload?.treatmentNumber}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['treatmentNumber'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				{isOutside === 'Outside hospital' && (
					<div className='col-lg-6'>
						<InputWidget
							type={'multiSelect'}
							inputType={'name'}
							label={'Hospitals (ہسپتال)'}
							id={'hospital'}
							multiple={false}
							icon={'icon-hospital'}
							options={lookups.outsideHospitals || []}
							setValue={value => {
								const payload = {
									...props.formPayload
								};
								payload['hospitalId'] = value.value;
								props.setFormPayload(payload);
							}}
						/>
					</div>
				)}
				<div className='col-lg-6'>
					<div className='inputs force-active'>
						<label>Treatment Date (علاج کی تاریخ)</label>
						<DatePicker
							selected={validateDate(props?.formPayload?.admissionDate) ? getFormattedDate(props?.formPayload?.admissionDate) : null}
							onChange={date => {
								const payload = {
									...props.formPayload
								};
								payload['admissionDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
								props.setFormPayload(payload);
							}}
							dateFormat='dd/MM/yyyy'
							maxDate={new Date()}
							icon={'icon-operator'}
							id={'treatment-date'}
							isClearable
							showYearDropdown
							scrollableYearDropdown
							yearDropdownItemNumber={120}
							showMonthDropdown
						/>
					</div>
				</div>

				{isOutside === 'Outside hospital' && ( 
					<div className='col-lg-6'>
					<div className='inputs force-active'>
						<label>Outside hospital date (علاج کی تاریخ)</label>
						<DatePicker
							selected={validateDate(props?.formPayload?.OutsideHospitalAdmissionDate) ? getFormattedDate(props?.formPayload?.OutsideHospitalAdmissionDate) : null}
							onChange={date => {
								const payload = {
									...props.formPayload
								};
								payload['OutsideHospitalAdmissionDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
								props.setFormPayload(payload);
							}}
							dateFormat='dd/MM/yyyy'
							maxDate={new Date()}
							icon={'icon-operator'}
							id={'treatment-date'}
							isClearable
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
						type={'multiSelect'}
						label={'Disease (بیماریاں)'}
						multiple={false}
						id={'diseases'}
						require={true}
						icon={'icon-medical'}
						options={lookups.diseases || []}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['diseaseId'] = value.value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Known Case Of (معلوم کیس)'}
						require={false}
						id={'known-case-of'}
						icon={'icon-court'}
						defaultValue={props?.formPayload?.knownCaseOf}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['knownCaseOf'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Diagnosis (تشخیص)'}
						id={'diagnosis'}
						require={false}
						icon={'icon-file'}
						defaultValue={props?.formPayload?.diagnosis}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['diagnosis'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Presently Complaining (فی الحال شکایت)'}
						id={'presently-complaining'}
						require={false}
						icon={'icon-file'}
						defaultValue={props?.formPayload?.presentlyComplaining}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['presentlyComplaining'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Special Diet(خصوصی خوراک)'}
						id={'special-diet'}
						require={false}
						icon={'icon-toolkit'}
						defaultValue={props?.formPayload?.specialDiet}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['specialDiet'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Investigations (تحقیقات)'}
						id={'investigations'}
						require={false}
						icon={'icon-report'}
						defaultValue={props?.formPayload?.investigations}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['investigations'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				<div className='col-lg-6'>
					<InputWidget
						type={'input'}
						label={'Treatment (علاج)'}
						id={'Treatment'}
						require={false}
						icon={'icon-operator'}
						defaultValue={props?.formPayload?.treatment}
						setValue={value => {
							const payload = {
								...props.formPayload
							};
							payload['treatment'] = value;
							props.setFormPayload(payload);
						}}
					/>
				</div>
				
			</div>
		</div>
	);
};

export default HospitalInfo;
