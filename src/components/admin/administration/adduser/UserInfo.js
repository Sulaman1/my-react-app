import React, { useEffect, useMemo, useState } from 'react';
import swal from 'sweetalert';
import { useSelector } from "react-redux"
import { getIds, transfromStringArray } from '../../../../common/Helpers';
import { TabButton } from '../../../../common/TabButton';
import InputWidget from '../../../../droppables/InputWidget';

const UserInfo = props => {
	const specialRoles = ['Admin', 'Inspector General Prisons', 'DIG Prisons'];
	const userMeta = useSelector((state) => state.user);
	const isHr = userMeta?.role === "HR Branch";
	const [isUser, setIsUser] = useState(false);
	useEffect(() => {
		setIsUser(props?.formPayload?.user?.userName != undefined ? true : false)
	}, [props?.formPayload?.user?.userName])
	const [password, setPassword] = useState('');
	const [facilityTypes, setFacilityTypes] = useState([
		{ value: 0, label: 'Prison' },
		{ value: 1, label: 'Office' }
	]);
	useEffect(()=> {
		if(isHr){
			setFacilityTypes([{ value: 0, label: 'Prison' }])
		}
	},[isHr])
			
	const genPassword = () => {
		var randomstring = Math.random().toString(36).slice(-13);
		setPassword(randomstring)
		const payload = {
			...props.formPayload,
		};
		payload['user']['password'] = randomstring;
		props.setFormPayload(payload);
	}

	const passwordCopy = () => {
		if(!password) {
			swal({
				title: 'Generate Password First',
				icon: 'error',
				html: '',
				timer: 1000,
			})
			return false
		}
		swal({
			title: 'Password Copied Successfully',
			icon: 'success',
			html: '',
			timer: 1000,
		})
		navigator.clipboard.writeText(password);
	}

	const formatRoleNames = (hrRoles, roleNames) => {
		if (!hrRoles || !roleNames) return [];
		return hrRoles.filter(role => roleNames.includes(role.label)).map(role => ({
			value: role.value,
			label: role.label
		}));
	};

	const handleRoleChange = (selectedOptions) => {
		let newRoles = selectedOptions;
		const isOffice = props.formPayload?.facilityTypeId === 1;

		// Check if facility type is selected
		if (props.formPayload?.facilityTypeId === undefined) {
			swal({
				title: "Select Facility Type",
				text: "Please select a facility type (Prison/Office) before selecting roles",
				icon: "warning"
			});
			return;
		}

		// For Office, only allow special roles
		if (isOffice && !selectedOptions.every(role => specialRoles.includes(role.label))) {
			swal({
				title: "Invalid Role Selection",
				text: "For Office facility, only Admin, Inspector General Prisons, or DIG Prisons roles can be selected",
				icon: "warning"
			});
			return;
		}

		// For Prison, don't allow special roles
		if (!isOffice && selectedOptions.some(role => specialRoles.includes(role.label))) {
			swal({
				title: "Invalid Role Selection",
				text: "Special roles (Admin, IG, DIG) can only be assigned to Office facility",
				icon: "warning"
			});
			return;
		}

		// Existing special role logic
		const addedSpecialRole = newRoles.find(role => specialRoles.includes(role.label));
		if (addedSpecialRole) {
			newRoles = [addedSpecialRole];
		} else {
			newRoles = newRoles.filter(role => !specialRoles.includes(role.label));
		}

		const payload = {
			...props.formPayload
		};
		payload['user']['roleNames'] = newRoles.map(item => item.label);
		props.setFormPayload(payload);

		if (addedSpecialRole) {
			swal({
				title: "Role Selection Limited",
				text: `You've selected ${addedSpecialRole.label}. No additional roles can be selected.`,
				icon: "info",
			});
		}
	};

	return (
		<>
		<div className='tabs-wraper'>
				{/* REFACTOR IS IMPORTANT Abdullah */}
				{!props.isVisitor && (
						<ul className='custom-nav tabs-style'>
						{/* if prison only */}
						{!props.isDarban && !props.isEmployee && (
							<TabButton  step={1} progress={'14.2'} title={'Prisoner Info'} props={props} />
						)}
						<TabButton step={props.isEmployee ? 1 : 2} progress={props.isEmployee ? '20' : '28.4'} title={'Basic Information'} props={props} />
						{/* employee only */}
						{props.isEmployee && (
						<TabButton active={'active'} step={2} progress={'40'} title={'User Information'} props={props} />
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
									<TabButton step={props.isEmployee ? 6 : 7}progress={'100'} title={'Address'} props={props} />
									</>
								)}
								{props.isEmployee && (
									<TabButton step={5} progress={'100'} title={'Employee Information'} props={props} />
								)}
								
							</> 
						)}
					</ul>
				)}
				<div className='tabs-panel '>
					
					<div className='row p-2'>
				<div className='row'>
					<div className='row'>
						<h4 className='third-heading'>{props.title}</h4>
					</div>
					<div className='col-lg-6'>
						<InputWidget
							type={'multiSelect'}
							ismulti={false}
							inputType={'select'}
							label={'Facility Type'}
							require={false}
							icon={'icon-operator'}
							options={facilityTypes}
							defaultValue={
								props?.formPayload?.facilityTypeId !== undefined ? 
								facilityTypes.find(type => type.value === props.formPayload.facilityTypeId) 
								: null
							}
							setValue={(value) => {
								const payload = {
									...props.formPayload,
								};
								
								// Check if roles were previously selected and facility type is changing
								if (props.formPayload?.user?.roleNames?.length > 0 && 
									props.formPayload.facilityTypeId !== value.value) {
									swal({
										title: "Roles Reset",
										text: "Changing the facility type has reset the selected roles. Please select the appropriate roles again.",
										icon: "info"
									});
									
									// Reset roles
									payload['user']['roleNames'] = [];
								}
								
								payload['facilityTypeId'] = value.value;
								props.setFormPayload(payload);
							}}
						/>
					</div>
					<div className='col-lg-6'>
						<InputWidget
							type={'multiSelect'}
							isMulti={true}
							inputType={'select'}
							label={'Prison'}
							require={false}
							icon={'icon-prison'}
							options={props?.isHr ? props?.prison : props?.lookUps?.prison || []}
							defaultValue={
								transfromStringArray(
									props?.isHr ? props?.prison : props?.lookUps?.prison,
									props?.formPayload?.prisonIds,
									''
								) || []
							}
							setValue={(value) => {
								const filteredVal = value.map((e) => {
									return e.value;
								});
								const payload = {
									...props.formPayload,
								};
								payload['prisonIds'] = filteredVal;
								props.setFormPayload(payload);
							}}
						/>
					</div>
					
					<div className='row'>
						<div className='col-lg-6'>
						<span className='text-danger'><b>Note: To convert a PMIS user to Non-PMIS user, please use the deactivate feature under Approvals in Admin Module.</b></span>
							<InputWidget
								type={'switch'}
								ismulti={false}
								inputType={'select'}
								label={'PMIS User'}
								require={false}
								icon={'icon-employee'}
								defaultValue={isUser ? true : false}
								disabled={props.formPayload?.userId}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									setIsUser(value);
									props?.setEmpUser(value);
									payload['user']['IsUser'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
					</div>
					<div className='row'>
						<div className={`col-lg-6 ${!isUser ? 'invisible' : ''}`}>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'User Name'}
								require={false}
								icon={'icon-operator'}
								enableBlur={true}
								foruserName={true}
								defaultValue={
									props?.formPayload?.user?.userName
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['user']['userName'] = value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div className={`col-lg-6 ${!isUser ? 'invisible' : ''}`}>
							<InputWidget
							id={'email'}
								type={'input'}
								inputType={'email'}
								label={'Email Address'}
							
								require={false}
								enableBlur={true}
								forEmail={true}
								icon={'icon-email'}
								defaultValue={
									props?.formPayload?.user
										?.emailAddress
								}
								
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['user']['emailAddress'] =
										value;
									props.setFormPayload(payload);
								}}
							/>
						</div>
						<div
							className={`col-lg-6 ${!isUser ? 'invisible' : ''}`}
						>
							<InputWidget
								type={'multiSelect'}
								isMulti={true}
								inputType={'select'}
								label={'Role Names'}
								require={false}
								icon={'icon-visitor'}
								options={props?.lookUps?.hrRoles || []}
								defaultValue={formatRoleNames(props?.lookUps?.hrRoles, props?.formPayload?.user?.roleNames)}
								setValue={handleRoleChange}
							/>
							{/* <InputWidget
								type={'multiSelect'}
								ismMulti={true}
								inputType={'select'}
								label={'Role Names'}
								require={false}
								icon={'icon-visitor'}
										options={props?.lookUps?.hrRoles || []}
								defaultValue={
									transfromStringArray(
										props?.lookUps?.hrRoles,
										props?.formPayload?.user?.roleNames,
										'array'
									) || []
								}
								setValue={value => {
									const payload = {
										...props.formPayload
									};
									payload['user']['roleNames'] = [
										value.label
									];
									props.setFormPayload(payload);
								}}
								/> */}
						</div>
						{!props?.formPayload?.userId &&
							<div className={`col-lg-6 ${!isUser ? 'invisible' : ''}`}>
								<InputWidget
									type={'input'}
									inputType={'text'}
									label={'Password'}
									require={false}
									icon={'icon-password'}
									defaultValue={password}
									setValue={value => {
										const payload = {
											...props.formPayload,
										};
										payload['user']['password'] = password;
										props.setFormPayload(payload);
									}}
								/>
								<div className='btns just-right'>
								<button type='button' className='btn rounded-pill w-lg btn-prim waves-effect waves-light p-2' onClick={genPassword}>Generate Password</button>
								<button type='button' className='btn rounded-pill  w-lg  btn-prim waves-effect waves-light p-2' onClick={passwordCopy}><i className='icon-file'></i>Copy to clipboard</button>
							</div>
							</div>
						}
					</div>
				</div>
				<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
					<button
						onClick={() => {
							props.previousStep();
							props.setProgress(props.isEmployee ? '20' : '25');
						}}
						type='button'
						className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'
					>
						<i className='icon-leftangle ml-2'></i> Back
					</button>
					<button
						onClick={() => {
							props.nextStep();
							props.setProgress(props.isEmployee ? '60' : '56.8');
						}}
						type='button'
						className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
					>
						Next <i className='icon-rightangle ml-2'></i>
					</button>
				</div>
			</div>
				</div>
			</div>
		{/* Copy */}
		
		</>
	);
};

export default UserInfo;
