import React, { useEffect, useState } from 'react';
import { transfromStringArray } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { getData } from '../../../services/request';

const PrisonerContact = props => {
	const [subTypes, setSubTypes] = useState([]);
	const [defaultSubVal, setDefaultSubVal] = useState('');
	const [prisonerClass, setPrisonerClass] = useState([
		{ label: "A", value: 0 },
		{ label: "B", value: 1 },
		{ label: "C", value: 2 },
	]);
	const handleSubType = val => {
		getData(
			'/services/app/PrisonerLkpt/GetAllPrisonerSubType?prisonerTypeId=' +
			val.value,
			'',
			true
		)
			.then(result => {
				let proObj = result.result.data.map(e => {
					return {
						label: e.name,
						value: e.id
					};
				});
				setSubTypes(proObj);
				// for edit purpose
				if (props?.formPayload?.prisonerSubTypeId) {
					let val = props.formPayload.prisonerSubTypeId;
					var newArray = proObj.filter(function (el) {
						return el.value === val;
					});
					setDefaultSubVal(newArray.length ? newArray[0] : '');
				}
			})
			.catch(err => {
				console.log(err, 'getting error while fetching API {GetAllPrisonerSubType} & fileName is {PrisonerContact.js}');

			});
	};

	useEffect(() => {
		if(props?.formPayload?.prisonerTypeId) {
			handleSubType({value: props?.formPayload?.prisonerTypeId});
		}
	},[])

	// TODO: we should remove this code
	if (
		props.isActive &&
		props.formPayload &&
		props.formPayload.prisonerTypeId &&
		!subTypes.length
	) {
		setTimeout(() => {
		}, 100);
	}

	return (
		<>
			<div className='tabs-wraper'>
				<ul className='custom-nav tabs-style'>
					<button type="button" onClick={() => { props.goToStep(1); props.setProgress('14.2'); }} className='btn' ><p>Prisoner Info</p></button>
					<button type="button" onClick={() => { props.goToStep(2); props.setProgress('28.4'); }} className='btn' ><p>Basic Information</p></button>
					<button type="button" onClick={() => { props.goToStep(3); props.setProgress('42.6'); }} className='btn ' ><p>Professional Information</p></button>
					<button type="button" onClick={() => { props.goToStep(4); props.setProgress('56.8'); }} className='btn ' ><p>Bio Metric Information</p></button>
					<button type="button" onClick={() => { props.goToStep(5); props.setProgress('71'); }} className='btn' ><p>Contact Information</p></button>
					<button type="button" onClick={() => { props.goToStep(6); props.setProgress('85.2'); }} className='btn active' ><p>Prisoner Info</p></button>
				</ul>
				<div className='tabs-panel'>
					<div className='row'>
						<h4 className='third-heading'>{props.title}</h4>
					</div>
					<div className='row'>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								ismulti={false}
								inputType={'select'}
								label={'Prisoner Type (قیدی کی قسم)'}
								id={'prisoner-type'}
								require={false}
								icon={'icon-prisoner'}
								options={props?.lookUps?.prisonerstype || []}
								defaultValue={
									transfromStringArray(
										props?.lookUps?.prisonerstype,
										props?.formPayload?.prisonerTypeId
									) || []
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									handleSubType(value);
									payload['prisonerTypeId'] = value.value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								ismulti={false}
								inputType={'select'}
								label={'Prisoner Sub Type (قیدی کی چھوٹی قسم)'}
								id={'prisoner-sub-type'}
								require={false}
								icon={'icon-prisoner'}
								options={subTypes}
								defaultValue={defaultSubVal}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['prisonerSubTypeId'] = value.value;
									setDefaultSubVal(value);
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								ismulti={false}
								inputType={'select'}
								label={'Banned Organizations (کالعدم تنظیمیں)'}
								id={'banned-cross'}
								require={false}
								icon={'icon-web'}
								options={props?.lookUps?.bannedorgs || []}
								defaultValue={
									transfromStringArray(
										props?.lookUps?.bannedorgs,
										props?.formPayload
											?.bannedOrganizationsId
									) || []
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['bannedOrganizationsId'] =
										value.value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'multiSelect'}
								ismulti={false}
								inputType={'select'}
								label={'Prisoner Class (قیدی کی کلاس)'}
								id={'prisoner-class'}
								require={false}
								icon={'icon-prisoner'}
								options={prisonerClass}
								defaultValue={
									props.formPayload?.prisonerClass !== undefined
										? prisonerClass.find(item => item.value === props.formPayload?.prisonerClass)
										: ''
								}

								setValue={(value) => {
									const payload = {
										...props.formPayload,
									};
									payload['prisonerClass'] = value.value;
									props.setFormPayload(payload);
								}}

							/>
						</div>
						<div className='col-lg-6 flex mb-3'>
							<div className='me-5'>
							<InputWidget
								type={'switch'}
								inputType={'checkbox'}
								label={'High Profile (خطرناک قیدی)'}
								id={'high-profile'}
								require={false}
								defaultValue={props?.formPayload?.highProfile}
								setValue={checked => {
									const payload = {
										...props.formPayload
									};
									payload['highProfile'] = checked;
									props.setFormPayload(payload);
								}}
							/>
							</div>
							<InputWidget
								type={'switch'}
								inputType={'checkbox'}
								label={'Legal Assistance (قانونی امداد)'}
								id={'legal-assistance'}
								require={false}
								defaultValue={
									props?.formPayload?.legalAssistance ?? true
								}
								setValue={checked => {
									const payload = {
										...props.formPayload
									};
									payload['legalAssistance'] = checked;
									props.setFormPayload(payload);
									payload['legalAssistanceDetails'] = ""
								}}
							/>
						</div>
						{!props?.formPayload?.legalAssistance &&
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Legal Assistance Details (قانونی مدد کی تفصیلات)'}
								id={'legal-assistance-details'}
								require={false}
								icon={'icon-operator'}
								defaultValue={
									props?.formPayload?.legalAssistanceDetails
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['legalAssistanceDetails'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>}

						

						<div className='col-lg-6'>
						<InputWidget
								type={'switch'}
								inputType={'checkbox'}
								label={'Habitual Offender (عادی مجرم)'}
								id={'habitual-offender'}
								require={false}
								defaultValue={
									props?.formPayload?.habitualOffender
								}
								setValue={checked => {
									const payload = {
									...props?.formPayload
									};
									payload['habitualOffender'] = checked;
									props?.setFormPayload(payload);
								}}
							/>
						</div>
					</div>
					<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
						<button
							id="back-btn"
							onClick={() => {
								props.previousStep();
								props.setProgress('71');
							}}
							type='button'
							className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'
						>
							<i className='icon-leftangle ml-2'></i> Back
						</button>
						<button
							id="add-prisoner-btn"
							onClick={props?.handleSubmit}
							className='btn rounded-pill w-lg btn-prim waves-effect waves-light'>
							<i className='icon-add ml-2'></i> Save Prisoner
						</button>
					</div>
				</div>

			</div>
		</>
	);
};
export default PrisonerContact;
