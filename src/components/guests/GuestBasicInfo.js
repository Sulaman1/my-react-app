import React, { useEffect, useState } from 'react';
import InputWidget from '../../droppables/InputWidget';
import moment from 'moment-mini';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import { getFormattedDate } from '../../common/Helpers';

const BasicInfo = props => {
	const [date, setDate] = useState(null);

	const currentTime = new Date();
	const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	const [time, setTime] = useState({
		hour: formattedTime.substring(0, 2),
		minute: formattedTime.substring(3, 5),
		meridiem: formattedTime.substring(6, 8)
	});


	const handleTimeChange = (newTime) => {
		if (date) {
			const payload = {
				...props.formPayload,
				data: {
					...props.formPayload?.data,
					visitDate: date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${newTime.hour || 12}:${newTime.minute} ${newTime.meridiem}` : ''
				},
			};
			props.setFormPayload(payload);
		}
		setTime(newTime);
	};

	useEffect(() => {
		if (!props.formPayload?.data?.visitDate) {
		  const currentDate = new Date();
		  setDate(currentDate);
		  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${time.hour || 12}:${time.minute} ${time.meridiem}`;
		  const initialPayload = {
			...props.formPayload,
			data: {
			  ...props.formPayload?.data,
			  visitDate: formattedDate
			}
		  };
		  props.setFormPayload(initialPayload);
		} else {
		  setDate(new Date(props.formPayload.data.visitDate));
		}
	  }, [props.formPayload]);

	  const handleDateChange = (date) => {
		const currentDate = date || new Date();
		const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${time.hour || 12}:${time.minute} ${time.meridiem}`;
		const updatedPayload = {
		  ...props.formPayload,
		  data: {
			...props.formPayload?.data,
			visitDate: formattedDate
		  }
		};
		setDate(currentDate);
		props.setFormPayload(updatedPayload);
	  };


	return (
		<>
			<div className='row p-2'>
				<div className='row '>
					<div className='row '>
						<h4 className='third-heading'>{props.title}</h4>
					</div>
					<div className='row '>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Name نام'}
								require={false}
								icon={'icon-user'}
								defaultValue={
									props?.formPayload?.data?.fullName
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['data']['fullName'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'text'}
								label={'Designation عہدہ'}
								require={false}
								icon={'icon-operator'}
								defaultValue={
									props?.formPayload?.data?.designation
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['data']['designation'] = value;

									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'text'}
								label={'Organization تنظیم'}
								require={false}
								icon={'icon-building'}
								defaultValue={
									props?.formPayload?.data?.organization
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['data']['organization'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'text'}
								label={'Other Remarks دیگر ریمارکس'}
								require={false}
								icon={'icon-chat'}
								defaultValue={
									props?.formPayload?.data?.otherRemarks
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['data']['otherRemarks'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6 row'>
							<div className='col-lg-6'>
								<div className='inputs force-active'>
									<label>Date تاریخ</label>
									<DatePicker
										icon={'icon-calendar'}
										  selected={date}
      									 onChange={handleDateChange}
										maxDate={new Date()}
										dateFormat="dd/MM/yyyy"
										isClearable
										showYearDropdown
										scrollableYearDropdown
										yearDropdownItemNumber={120}
										showMonthDropdown
									/>

								</div>
							</div>
							<div className='col-lg-6' style={{zIndex: "9999"}}>

								<TimePicker
									time={`${time.hour}:${time.minute} ${time.meridiem}`}
									theme="material"
									timeMode="12"
									minuteStep={1}
									onTimeChange={handleTimeChange}
								/>

							</div>

						</div>
					</div>
				</div>
				<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
					<button
						type='submit'
						onClick={props?.handleSubmit}
						className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
					>
						<i className='icon-add ml-2'></i>{props?.formPayload?.data?.fullName ? 'Update Guest مہمان اپ ڈیٹ کریں۔' :  'Add Guest مہمان شامل کریں۔' }
					</button>
				</div>
			</div>
		</>
	);
};
export default BasicInfo;
