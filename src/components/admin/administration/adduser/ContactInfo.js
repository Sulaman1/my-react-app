import React, { useEffect, useState } from 'react';
import { TabButton } from '../../../../common/TabButton';
import InputWidget from '../../../../droppables/InputWidget';
//import AddressInfo from '../../../prisoners/Components/Address';
import AddressLookup from '../../system-settings/addressLookup';
import PermanentAddress from '../../../prisoners/Components/PermanentAddress';
import {
	transformData
  } from '../../../../common/Helpers';

  
const ContactInfo = props => {
	const [sameAddress, setSameAddress] = useState(props?.formPayload?.sameAsAbove || false);
	useEffect(() => {
		const {formPayload} = props;
		if (formPayload?.sameAsAbove) {
        	setSameAddress(true);
      }
	},[props.formPayload?.sameAsAbove])
	const handleToggleClick = (value) => {
		setSameAddress(value);
			const {formPayload}=props
		if (value === true) {
				const payload = {
					...formPayload,
				};
				let filterPayload = payload['presentAddress']
				if(filterPayload.id && !sessionStorage.getItem('isEdit')){
					delete filterPayload.id
				}
				payload.permanentAddress.countryId = filterPayload.countryId;
				payload.permanentAddress.provinceId = filterPayload.provinceId;
				payload.permanentAddress.districtId = filterPayload.districtId;
				payload.permanentAddress.cityId = filterPayload.cityId;
				payload.permanentAddress.streetAddress = filterPayload.streetAddress; 
				props.setFormPayload(payload)
		}
	  }

	return (
		<>

			<div className="tabs-wraper">
				<div className="tabs-panel hover-card">
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
									<TabButton active={'active'} step={props.isEmployee ? 4 : 5} progress={props.isEmployee ? '80' : '71'} title={'Contact Information'} props={props} />
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
					)}
					<div>
						<div className='tabs-wraper '>
							<div className=' hover-card '>
								<div className='row'>
									<div className='col-lg-6'>
										<InputWidget
											type={'input'}
											inputType={'tel'}
											label={'Emergency Phone Number (ایمرجنسی فون نمبر)'}
											id={'phone-number'}
											pattern={'[0-9]*'}
											maxlength={11}
											onlyNumbers={true}
											require={false}
											icon={'icon-phone'}
											defaultValue={
												props?.formPayload?.contactInfo?.phoneNumber || ''
											}
											setValue={value => {
												const payload = {
													...props.formPayload
												};
												payload['contactInfo']['phoneNumber'] =
													value;
												props.setFormPayload(payload);
											}}
										/>
									</div>
									{!props.isVisitor && (
										<>
											<div className='col-lg-6'>
												<InputWidget
													type={'input'}
													inputType={'tel'}
													label={'Mobile Number (موبائل نمبر)'}
													onlyNumbers={true}
													maxlength={11}
													id={'mobile-number'}
													pattern={'[0-9]*'}
													require={false}
													icon={'icon-phone'}
													defaultValue={
														props?.formPayload?.contactInfo
															?.mobileNumber
													}
													setValue={value => {
														const payload = {
															...props.formPayload
														};
														payload['contactInfo'][
															'mobileNumber'
														] = value;
														props.setFormPayload(payload);
													}}
												/>
											</div>
										</>
									)}
								</div>
							</div>
						</div>

						{(!props.isVisitor && !props.isEmployee) && (
							<>
							<AddressLookup
								payload={props.formPayload} 
								setPayload={props.setFormPayload} 
								countryData={props.lookUps.country || transformData(props.lookUps.countries)} 
								showSameAddressOption={true}
								lookUps={props.lookUps}
							/>
							 <>
								<div className='row'>
												<div className='col-lg-4 row d-flex'>
													<h4 className='third-heading'>Permanent Address مستقل پتہ</h4>
													<div className=''>
														<InputWidget
															type={'switch'}
															inputType={'checkbox'}
															label={'Same as above (ایضاَ)'}
															id={'same-address'}
															require={false}
															defaultValue={sameAddress}
															setValue={(value) => {
																handleToggleClick(value);
															}}
														/>
													</div>
												</div>
											</div>
								</>
								{!sameAddress && (
									<PermanentAddress
										payload={props.formPayload} 
										setPayload={props.setFormPayload} 
										countryData={props.lookUps.country || transformData(props.lookUps.countries)} 
										lookUps={props.lookUps}
									/>
								)}
							
							</>
						)}
						{!props.isVisitor && (
							<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
								<button
									id="back-btn"
									onClick={() => {
										props.previousStep();
										props.setProgress(props.isEmployee ? '60' : '56.8');
									}}
									type='button'
									className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'
								>
									<i className='icon-leftangle ml-2'></i> Back
								</button>
								<button
									id="next-btn"
									onClick={() => {
										props.nextStep();
										props.setProgress(props.isEmployee ? '100' : '85.2');
									}}
									type='button'
									className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
								>
									Next <i className='icon-rightangle ml-2'></i>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>


		</>
	);
};

export default ContactInfo;
