import React, { useState } from 'react';
import { getData, postData } from '../../services/request';
import swal from 'sweetalert';
import BasicInfo from './GuestBasicInfo';
import { useEffect } from 'react';
import moment from 'moment-mini';
import { validateGuestFields } from '../../common/FormValidator';
import { useDispatch } from 'react-redux';
import { setLoaderOff, setLoaderOn } from '../../store/loader';
const AddGuest = props => {
	const dispatch = useDispatch()
	const [formPayload, setFormPayload] = useState({
		data: {}
	});
	const [guestId, setGuestId] = useState(0);
	const handleSubmit = async e => {
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		e.preventDefault();
		if (!validateGuestFields(formPayload?.data)) {
			return false
		}
		if (!formPayload.data.visitDate) {
			formPayload['data']['visitDate'] = moment(new Date()).format(
				'YYYY-MM-DD'
			);
		}

		formPayload['data']['prisonId'] = objParsed.prisons[0].prisonId;
		formPayload['data']['id'] = guestId;
		
		postData(
			'/services/app/Darban/CreateUpdateDarbanGuestEntry',
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
					
					swal('Successfully Added!', '', 'success');
					props.setActiveTab(0);
				}
			})
			.catch(err => {
				
				swal('Something went wrong!', '', 'warning');
			});
	};

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		const rawData = sessionStorage.getItem('selectedGuest');
		if (rawData) {
			const parsedData = JSON.parse(rawData);
			const id = parsedData.id;
			setFormPayload({data:parsedData});
			setGuestId(id);
			sessionStorage.removeItem('selectedGuest');
		}
	};

	return (
		<div className='row p-4 bg-white'>
			<form className='col-lg-12 pt-0 justify-content-center'>
				<BasicInfo
					title='Basic Information'
					formPayload={formPayload}
					setFormPayload={setFormPayload}
					handleSubmit={handleSubmit}
				/>
			</form>
		</div>
	);
};

export default AddGuest;
