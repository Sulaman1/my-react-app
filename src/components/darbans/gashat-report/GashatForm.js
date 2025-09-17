import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../services/request';
import swal from 'sweetalert';
import BasicInfo from '../../admin/administration/adduser/BasicInfo';
import { getFormattedDate, transformData, validateDate } from '../../../common/Helpers';
import { validateDarbanFields } from "../../../common/FormValidator";
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderOff, setLoaderOn } from '../../../store/loader';
import DatePicker from 'react-datepicker';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl } from '../../../services/request';
import letter from '../../../assets/images/users/1.png';



const GashatForm = ({formPayload, setFormPayload}) => {
	const [loading, setloading] = useState(false);

	const handleFrontUpload = (value) => {
		if (!value) return;
		const data = {
			image: value.split(',')[1],
			prisoner: false,
			imageName: 'doc'
		};
		setloading(true);
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const pd = {
						...formPayload
					};

					pd['reportAttachments'] = res.result.imagePath;
					setFormPayload(pd);
					setloading(false);
				}
			})
			.catch(err => {
				console.log(err, 'getting error while uploading');
				setloading(false);
			});
	};

	return (
		<div className='row p-4 bg-white'>
			<form className='col-lg-12 pt-0 justify-content-center'>
				<div className='row'>
					<div className='col-lg-6'>
						<InputWidget
							type={'input'}
							inputType={'name'}
							label={'Report Title (گشت رپورٹ کا عنوان)'}
							id={'title'}
							require={false}
							icon={'icon-operator'}
							defaultValue={
								formPayload?.reportTitle
							}
							setValue={value => {
								const payload = {
									...formPayload
								};
								payload['reportTitle'] =
									value;
								setFormPayload(payload);
							}}
						/>
					</div>
					<div className='col-lg-6'>
						<div className='inputs force-active'>
							<label>Report Date</label>
							<DatePicker
								selected={validateDate(formPayload?.reportDate) ?
									getFormattedDate(
										formPayload?.reportDate
									) : null}
								onChange={(date) => {
									const payload = {
										...formPayload,
									};
									payload['reportDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
									setFormPayload(payload);
								}}
								dateFormat="dd/MM/yyyy"
								maxDate={new Date()}
								icon={'icon-operator'}
								isClearable
								showYearDropdown
								scrollableYearDropdown
								yearDropdownItemNumber={120}
								showMonthDropdown
								placeholderText={''}
								id={'gashat-report-date'}
							/>
						</div>
					</div>
				</div>
				<div className='row'>
				<div className='col-lg-6'>
						<InputWidget
							type={'textarea'}
							inputType={'text'}
							label={'Report Description (گشت رپورٹ کی تفصیل)'}
							id={'description'}
							require={false}
							icon={'icon-operator'}
							defaultValue={
								formPayload?.reportDescription
							}
							setValue={value => {
								const payload = {
									...formPayload
								};
								payload['reportDescription'] =
									value;
								setFormPayload(payload);
							}}
						/>
					</div>
					
				</div>
				<div className='row mb-3'>
					<h3 className='sub-heading text-center just-center mb-3'>
						Report Attachment
					</h3>
					<InputWidget
						id={'user'}
						type={'editImage'}
						inputType={'file'}
						upload={'icon-upload'}
						noCropping={true}
						onlyUploadFile={true}
						take={'icon-photographers'}
						require={false}
						Photo={
							formPayload?.reportAttachments
								? baseImageUrl +
								formPayload?.reportAttachments
								: letter
						}
						setValue={value => {
							handleFrontUpload(value);
						}}
					/>
				</div>
			</form>
		</div>
	);
};

export default GashatForm;
