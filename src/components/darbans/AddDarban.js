import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../services/request';
import swal from 'sweetalert';
import BasicInfo from '../admin/administration/adduser/BasicInfo';
import { transformData } from '../../common/Helpers';
import { validateDarbanFields } from "../../common/FormValidator";
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderOff, setLoaderOn } from '../../store/loader';

const AddDarban = props => {
	const [formPayload, setFormPayload] = useState({
		personalInfo: {},
		prisonerNumber: {},
		prisonerAdmission: {},
	});
	const [lookups, setLookups] = useState({});
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	const dispatch = useDispatch()

	useEffect(() => {
		callAndHandleLookUps();
		loadData();
	}, []);

	const callAndHandleLookUps = async () => {
		try {
		  const lookupsToFetch = {
			category: 'prisonerCategory',
			nationlities: 'Nationality',
			genders: 'gender',
			marital: 'MaritalStatus',
			caste: 'caste',
			section: 'sections',
			religion: 'religion',
			crimeTypes: 'crimeTypes',
			relationshipTypes: 'relationshipTypes'
		  };
		  const lookup = {};
	  
		  for (const lookupKey in lookupsToFetch) {
			try {
			  const lookupData = newLookups?.[lookupsToFetch[lookupKey]];
			  const transformedData = transformData(lookupData);
			  lookup[lookupKey] = transformedData;
			} catch (error) {
			  console.error(`Error fetching lookup ${lookupsToFetch[lookupKey]}:`, error);
			}
		  }
	  
		  setLookups(lookup);
		} catch (error) {
		  console.error(error);
		  alert('something went wrong in lookups api');
		}
	  };
	  

	const handleSubmit = async e => {
		e.preventDefault();
		if (!validateDarbanFields(formPayload)) {
			return false
		}
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		const payload = {
			...formPayload,
			legalAssistance: true
		};
		if (formPayload?.personalInfo?.foundCnic) {
			swal('Prisoner already exists in system');
			return
		}

		// if (!/^\d{5}-\d{7}-\d{1}$/.test(formPayload?.personalInfo?.cnic)) {
		// 	swal('', "Please enter a valid CNIC with 13 numbers", "warning");
		// 	return;
		//   }

		if (!formPayload?.prisonerNumber?.prisonId) {
			const prsionId = objParsed?.prisons[0]?.prisonId;
			payload['prisonerNumber']['prisonId'] = prsionId;

		} else {
			payload['prisonerNumber']['prisonId'] =
				formPayload.prisonerNumber.prisonId;
		}
		if(!formPayload?.personalInfo?.genderId)
		{
			swal('please select the gender','','warning')
			return
		}
		if(!formPayload?.prisonerNumber?.noOfWarrantsUponAdmission || formPayload?.prisonerNumber?.noOfWarrantsUponAdmission == 0)
		{
			swal('please add number of warrants','','warning')
			return
		}
		delete payload['personalInfo']['casteId'];
		
		postData(
			'/services/app/AddPrisonerAppServices/CreateOrEditPrisoner?darban=' +
			true,
			payload
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

	const loadData = () => {
		const rawData = sessionStorage.getItem('selectedDarban');
		if (rawData) {
			const parsedId = JSON.parse(rawData).id;
			getData(
				'/services/app/AddPrisonerAppServices/GetOnePrisoner?edit=true&id=' +
				parsedId
			)
				.then(res => {
					if (res.result.isSuccessful) {
						setFormPayload(res.result.data);
						sessionStorage.removeItem('selectedDarban');
					}
				})
				.catch(e => {
					console.log(e, 'Error while fetching darban');
				});
		}
	};

	return (
		<div className='row p-4 bg-white'>
			<form className='col-lg-12 pt-0 justify-content-center'>
				<BasicInfo
					title='Basic Information'
					formPayload={formPayload}
					setFormPayload={setFormPayload}
					isDarban
					handleSubmit={handleSubmit}
					lookUps={lookups}
				/>
			</form>
		</div>
	);
};

export default AddDarban;
