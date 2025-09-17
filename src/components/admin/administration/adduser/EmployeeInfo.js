import moment from 'moment-mini';
import React, { useEffect, useMemo, useState } from 'react';
import StepWizard from 'react-step-wizard';
import { getFormattedDate, transfromStringArray, validateDate } from '../../../../common/Helpers';
import { TabButton } from '../../../../common/TabButton';
import InputWidget from '../../../../droppables/InputWidget';
import { getData } from '../../../../services/request';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EmployeeInfo = props => {

	useEffect(() => {
		// setting the default domicile balochistan or kpk when creating employee
		const defaultDomicile = process.env.REACT_APP_DOMICILE_NAME;

		if (defaultDomicile && props?.lookUps?.domicile) {

			const matchingItem = props?.lookUps?.domicile?.find(item => item.label === defaultDomicile);
			if (matchingItem) {
				const payload = {
					...props?.formPayload,
					domicileId: matchingItem.value,
				};
				props.setFormPayload(payload);
			}
		}
	}, [props?.lookUps?.domicile]);


	const [selectedDate, setSelectedDate] = useState(null);
	return (
		<>
			<div className='tabs-wraper'>
				{!props.isVisitor && (
					<ul className='custom-nav tabs-style'>
						{/* if prison only */}
						{!props.isDarban && !props.isEmployee && (
							<TabButton step={1} progress={'14.2'} title={'Prisoner Info'} props={props} />
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
										<TabButton step={props.isEmployee ? 6 : 7} progress={'100'} title={'Address'} props={props} />
									</>
								)}
								{props.isEmployee && (
									<TabButton active={'active'} step={5} progress={'100'} title={'Employee Information'} props={props} />
								)}

							</>
						)}
					</ul>
				)}
				<div className='tabs-panel'>
					<div className='row p-2'>
						<div className='row mt-4'>
							<div className='row'>
								<h4 className='third-heading'>{props.title}</h4>
							</div>

							<div className='row'>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'number'}
										label={'Employee Number'}
										require={false}
										icon={'icon-number'}
										defaultValue={props?.formPayload?.employeeNumber}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['employeeNumber'] = value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										isMulti={false}
										inputType={'select'}
										label={'Employment Type'}
										require={false}
										icon={'icon-operator'}
										options={props?.lookUps?.empTypes || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.empTypes,
												props?.formPayload?.employmentTypeId
											) || []
										}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['employmentTypeId'] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Domicile'}
										require={false}
										icon={'icon-corporate'}
										options={props?.lookUps?.domicile || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.domicile,
												props?.formPayload?.domicileId
											) || []
										}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['domicileId'] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<div className='inputs force-active'>
										<label>Joining Date</label>
										<DatePicker
											icon={'icon-calendar'}
											selected={validateDate(props?.formPayload?.joiningDate) ? getFormattedDate(props?.formPayload?.joiningDate) : null}
											onChange={date => {
												setSelectedDate(date)
												const payload = {
													...props.formPayload
												};
												payload['joiningDate'] = date;
												props.setFormPayload(payload);
											}}
											dateFormat='dd/MM/yyyy'
											maxDate={new Date()}
											showYearDropdown
											scrollableYearDropdown
											yearDropdownItemNumber={120}
											showMonthDropdown

										/>
									</div>
								</div>
								<div className='col-lg-6'>
									<div className='inputs force-active'>
										<label>Retirement Date</label>
										<DatePicker
											icon={'icon-calendar'}
											selected={validateDate(props?.formPayload?.retirementDate) ? getFormattedDate(props?.formPayload?.retirementDate) : null}
											onChange={date => {
												setSelectedDate(date)
												const payload = {
													...props.formPayload
												};
												payload['retirementDate'] = date;
												props.setFormPayload(payload);
											}}
											dateFormat='dd/MM/yyyy'
											minDate={new Date()}
											showYearDropdown
											scrollableYearDropdown
											yearDropdownItemNumber={120}
											showMonthDropdown

										/>
									</div>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Department'}
										require={false}
										icon={'icon-building'}
										options={props?.lookUps?.department || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.department,
												props?.formPayload?.departmentId
											) || []
										}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['departmentId'] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Designation'}
										require={false}
										icon={'icon-operator'}
										options={props?.lookUps?.designation || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.designation,
												props?.formPayload?.designationId
											) || []
										}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['designationId'] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'tel'}
										label={'BPS (Basic Pay Scale 1-22)'}
										id={'bps'}
										pattern={'^(?!-)([1-9]|1[0-9]|2[0-2])$'}
										maxlength={2}
										min={0}
										onlyNumbers={true}
										require={false}
										icon={'icon-number'}
										defaultValue={props?.formPayload?.bps}
										setValue={(value) => {
											if (value > 0 && value < 23) {
												const payload = {
													...props.formPayload,
												};

												payload['bps'] = value;
												props.setFormPayload(payload);
											} else if (!value) {
												const payload = {
													...props.formPayload,
												};

												payload['bps'] = value;
												props.setFormPayload(payload);
											}

										}}
									/>

								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'multiSelect'}
										ismulti={false}
										inputType={'select'}
										label={'Employment Status'}
										require={false}
										icon={'icon-building'}
										options={props?.lookUps?.hrServiceStatus || []}
										defaultValue={
											transfromStringArray(
												props?.lookUps?.hrServiceStatus,
												props?.formPayload?.serviceStatusId
											) || []
										}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload['serviceStatusId'] = value.value;
											props.setFormPayload(payload);
										}}
									/>
								</div>

								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'Disciplinary Action'}
										id={'bps'}
										require={false}
										icon={'icon-operator'}
										defaultValue={props?.formPayload?.disciplinaryAction}
										setValue={(value) => {
										const payload = {
											...props.formPayload,
										};
										payload['disciplinaryAction'] = value;
										props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'Complaint Record'}
										id={'complaint record'}
										require={false}
										icon={'icon-prison'}
										defaultValue={props?.formPayload?.complaintRecord}
										setValue={(value) => {
										const payload = {
											...props.formPayload,
										};
										payload['complaintRecord'] = value;
										props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'promotions'}
										id={'promotions'}
										require={false}
										icon={'icon-corporate'}
										defaultValue={props?.formPayload?.promotions}
										setValue={(value) => {
										const payload = {
											...props.formPayload,
										};
										payload['promotions'] = value;
										props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'Previous Posting'}
										id={'previousPosting'}
										require={false}
										icon={'icon-corporate'}
										defaultValue={props?.formPayload?.previousPosting}
										setValue={(value) => {
										const payload = {
											...props.formPayload,
										};
										payload['previousPosting'] = value;
										props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'Seniority'}
										id={'seniority'}
										require={false}
										icon={'icon-corporate'}
										defaultValue={props?.formPayload?.seniority}
										setValue={(value) => {
										const payload = {
											...props.formPayload,
										};
										payload['seniority'] = value;
										props.setFormPayload(payload);
										}}
									/>
								</div>
							</div>
						</div>
						<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
							<button
								onClick={() => {
									props.previousStep();
									props.setProgress('80');
								}}
								type='button'
								className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'>
								<i className='icon-leftangle ml-2'></i> Back
							</button>
							<button
								onClick={props?.handleSubmit}
								className='btn rounded-pill w-lg btn-prim waves-effect waves-light'>
								<i className='icon-file ml-2'></i> SAVE
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EmployeeInfo;
