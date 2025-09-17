import moment from 'moment-mini';
import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import StepWizard from 'react-step-wizard';
import swal from 'sweetalert';
import { transformData, validateDate } from '../../common/Helpers';
import { postData, getData } from '../../services/request';
import BasicInfo from '../admin/administration/adduser/BasicInfo';
import BiometricInfo from '../admin/administration/adduser/BiometricInfo';
import ContactInfo from '../admin/administration/adduser/ContactInfo';
import PrisonerContact from './Components/PrisonerContact';
import PrisonerInfo from './Components/PrisonerInfo';
import ProfessionalInfo from './Components/ProfessionalInfo';
import { scrollToTop } from '../../common/Helpers.js';
import { useDispatch, useSelector } from "react-redux";

const AddPrisoner = props => {

	// let history = useHistory();
	const navigate = useNavigate();

	const [lookups, setLookups] = useState({});
	const dispatch = useDispatch();
	const [formPayload, setFormPayload] = useState({
		personalInfo: {},
		biometricInfo: {
			prisonerGallery: []
		},
		prisonerAdmission: {},
		prisonerNumber: {},
		permanentAddress: {},
		presentAddress: {},
		professionalInfo: {},
		contactInfo: {},
	});
	const [progres, setProgress] = useState('20');
	const userMeta = useSelector((state) => state.user);
	const isUTP = userMeta?.role === "Prison UTP Branch";
	const isConvict = userMeta?.role === "Prison Convict Branch";

	const newLookups = useSelector((state) => state?.dropdownLookups)

	const getDefaultNationalityOption = (nationlities) => {
		const defaultNationality = nationlities?.find(option => option.name === 'Pakistan');
		return defaultNationality || {}; // Return the found option or an empty object as a fallback
	};

	const handleAddressPayload = () => {

		const cleanAddress = (address) => {
			if (address?.countryId && !address?.cityId) {
				address?.id == 0 && delete address?.id
				address.cityId = null;
				address.countryId = null
			} else {
				if (address?.isPakistan || address.countryId === 167 || address.countryId === 0) {
					delete address?.countryId;
				} else {
					delete address?.cityId;
				}
			}
			delete address?.provinceId;
			delete address?.districtId;

		};
		cleanAddress(formPayload?.presentAddress);
		cleanAddress(formPayload?.permanentAddress);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// if (!validateEducationFields(formPayload?.professionalInfo)) {
		// 	return false;
		// }
		if (!formPayload?.prisonerNumber?.prsNumber || formPayload?.prisonerNumber?.prsNumber == 0) {
			swal('Please enter the prisoner number', '', 'warning');
			return
		}
		if (!formPayload?.personalInfo?.nationalityId) {
			const defaultNationality = getDefaultNationalityOption(newLookups?.Nationality);
			formPayload['personalInfo']['nationalityId'] = defaultNationality?.id; //set the default nationality as pakistani in the payload
		}

		if (formPayload?.personalInfo?.foundCnic) {
			swal('Prisoner already exists in system', '', 'warning');
			return
		}
		// if (!/^\d{5}-\d{7}-\d{1}$/.test(formPayload?.personalInfo?.cnic)) {
		// 	swal('', "Please enter a valid CNIC with 13 numbers", "warning");
		// 	return;
		//   }
		if (!formPayload?.personalInfo?.genderId) {
			swal('Please Select the Gender', '', 'warning');
			return
		}
		if (!formPayload?.personalInfo?.maritalStatusId) {
			swal('Please Select the Marital Status', '', 'warning');
			return
		}
		if (Object.keys(formPayload.presentAddress).length === 0 || Object.keys(formPayload.permanentAddress).length === 0) {
			swal('Both Present and Permanent address fields are required.', '', 'warning');
			return false;
		}

		handleAddressPayload();

		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);

		if (!formPayload?.prisonerNumber?.prisonId) {
			const prsionId = objParsed.prisons[0].prisonId;
			formPayload['prisonerNumber']['prisonId'] = prsionId;
		}
		if (!formPayload?.prisonerNumber?.category) {
			const catId =
				objParsed.user.roleNames[0] &&
					objParsed.user.roleNames[0] === 'Prison UTP Branch'
					? 1
					: 2;
			formPayload['prisonerNumber']['category'] = catId;
		}
		if (!validateDate(formPayload?.prisonerAdmission?.admissionDate)) {
			formPayload['prisonerAdmission']['admissionDate'] = moment(new Date()).format(
				'YYYY-MM-DD'
			);
		}
		if (formPayload?.prisonerNumber?.category === 2 && !validateDate(formPayload?.prisonerAdmission?.convictionDate)) {
			swal('Please Select the Conviction Date', '', 'warning');
			return
		}
		if (!validateDate(formPayload?.personalInfo?.dateOfBirth)) {
			formPayload['personalInfo']['dateOfBirth'] = moment(new Date()).format(
				'YYYY-MM-DD'
			);
		}
		if (!formPayload?.prisonerNumber?.year || !formPayload?.prisonerNumber?.year === 0) {
			formPayload['prisonerNumber']['year'] = new Date().getFullYear();
		}

		postData(
			`/services/app/AddPrisonerAppServices/CreateOrEditPrisoner${(props?.isEdit) && (isUTP || isConvict) && !formPayload?.isReleaseOrTransferred ? "?BranchUpdate=true" : ""}`,
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
					if (sessionStorage.getItem('isEdit')) {
						sessionStorage.removeItem("isEdit");
					}
					sessionStorage.setItem(
						'selectedPrisoner',
						JSON.stringify(res.result.data)
					);
					swal('Successfully Saved!', '', 'success').then(
						willSuccess => {
							if (willSuccess) {
								navigate(
									'/admin/prisoner/add-prisoner-detail'
								);
							}
						}
					);
					props.setActiveTab(0);
				}
			})
			.catch(err => {
				swal('Something went wrong!', '', 'warning');
				console.error(err)
				console.log(err, 'getting error while fetching API {CreateOrEditPrisoner} & fileName is {AddPrisoner.js}');
			});
	};
	useEffect(() => {
		const data = sessionStorage.getItem('selectedPrisoner');
		handleLookups();
		if (data) {
			const parsedData = JSON.parse(data);
			getData(
				'/services/app/AddPrisonerAppServices/GetOnePrisoner?id=' +
				parsedData.id
			)
				.then(async res => {
					if (res.result.isSuccessful) {
						const lookup = {};
						const preProvince =
							res.result.data.presentAddress.provinceId;
						// Temp: addition
						//res.result.data['biometricInfo']['prisonerGallery'] = []
						// const filteredDistricts = newLookups.district.filter(item => item.provinceId === preProvince)
						// const districts = transformData(filteredDistricts);
						
						setFormPayload(res.result.data);
						const preCountry =
							res.result.data.presentAddress.countryId;

						const per_Province = newLookups.province.filter(item => item.countryId === preCountry)
						const per_ProvinceObj = transformData(
							per_Province
						);
						lookup['per-province'] = per_ProvinceObj;
					}
				})
				.catch(err => {
					console.error(err)
					console.log(err, 'getting error while fetching API {GetOnePrisoner} & fileName is {AddPrisoner.js}');
				});
		}
	}, []);

	const handleLookups = () => {
		// TODO: convert to redux store
		callAndHandleLookUps();
	};

	const callAndHandleLookUps = async () => {
		try {

			const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
			const objParsed = objStringify && JSON.parse(objStringify);
			const allotedPrisons =
				objParsed &&
				objParsed.prisons.map(e => ({
					id: e.prisonId,
					name: e.prisonName
				}));
			const lookup = {};
			const nationalityObj = transformData(newLookups?.Nationality);
			lookup['nationlities'] = nationalityObj;

			const gendersObj = transformData(newLookups?.gender);
			lookup['genders'] = gendersObj;

			const maritalObj = transformData(newLookups?.MaritalStatus);
			lookup['marital'] = maritalObj;

			const casteObj = transformData(newLookups?.caste);
			lookup['caste'] = casteObj;


			const sectionObj = transformData(newLookups?.sections);
			lookup['section'] = sectionObj;

			const religionObj = transformData(newLookups?.religion);
			lookup['religion'] = religionObj;

			const districtObj = newLookups?.district;
			lookup['allDistricts'] = districtObj;

			const countriesObj = newLookups?.country;
			lookup['countries'] = countriesObj;

			const provincesObj = newLookups?.province;
			lookup['allProvinces'] = provincesObj;


			const citiesObj = newLookups?.city;
			lookup['cities'] = citiesObj;

			const relationshipTypesObj = transformData(newLookups?.relationshipTypes)
			lookup['relationshipTypes'] = relationshipTypesObj;

			const eduObj = newLookups?.EducationTypeLkpt;
			const fls = eduObj?.filter(dt => dt.name === 'Technical Education')[0];

			const techanical = await getData(
				'/services/app/EducationLkpt/GetAllEducationLkpt?educationTypeId=' +
				fls.id,
				'',
				true
			);
			const techanicalObj = transformData(techanical.result.data);
			lookup['techanical'] = techanicalObj;


			const pls = eduObj?.filter(dt => dt.name === 'Formal Education')[0];

			const formal = await getData(
				'/services/app/EducationLkpt/GetAllEducationLkpt?educationTypeId=' +
				pls.id,
				'',
				true
			);
			const formalObj = transformData(formal.result.data);
			lookup['formal'] = formalObj;

			const mls = eduObj?.filter(dt => dt.name === 'Religious Education')[0];

			const religious = await getData(
				'/services/app/EducationLkpt/GetAllEducationLkpt?educationTypeId=' +
				mls.id,
				'',
				true
			);
			const religiousObj = transformData(religious.result.data);
			lookup['religious'] = religiousObj;

			const prisonObj = allotedPrisons.length
				? transformData(allotedPrisons)
				: transformData(newLookups?.prison);
			lookup['prison'] = prisonObj;

			const categoryObj = transformData(newLookups?.prisonerCategory);
			lookup['category'] = categoryObj;

			const occupationObj = transformData(newLookups?.occupation);
			lookup['occupation'] = occupationObj;

			const countryObj = transformData(newLookups?.country);
			lookup['country'] = countryObj;

			const provinces = transformData(newLookups?.province);
			lookup['provinces'] = provinces;

			const cities = transformData(newLookups?.city);
			lookup['cities'] = cities;


			const prisonerTypeObj = transformData(newLookups?.prisonerType);
			lookup['prisonerstype'] = prisonerTypeObj;


			const bannedOrgsObj = transformData(newLookups?.bannedOrganizations);
			lookup['bannedorgs'] = bannedOrgsObj;


			const sectObj = transformData(newLookups?.sect);
			lookup['sect'] = sectObj;

			const allSectObj = newLookups?.sect;
			lookup['allSect'] = allSectObj;

			const allReligionObj = newLookups?.religion;
			lookup['allReligion'] = allReligionObj;

			const crimeTypeObj = transformData(newLookups?.crimeTypes);
			lookup['crimeTypes'] = crimeTypeObj;

			const languagesObj = transformData(newLookups?.Language);
			lookup['languages'] = languagesObj;
			setLookups(lookup);
		} catch (error) {
			console.error(error);
			console.log(error, 'getting error while fetching API {callAndHandleLookUps FTN} & fileName is {AddPrisoner.js}')
		}
		finally {

		}
	};

	return (
		<>
			<div className='row p-2'>
				<form className='col-lg-12 justify-content-center'>
					<div className='row'>
						<div className='col-lg-12 '>
							<div class='progress'>
								<div
									class='progress-bar progress-bar-striped bg-success'
									role='progressbar'
									style={{ width: progres + '%' }}
									aria-valuenow={progres}
									aria-valuemin='0'
									aria-valuemax='100'
								></div>
							</div>
						</div>
					</div>
					<StepWizard
						onStepChange={() => {
							scrollToTop();
						}}
					>
						<PrisonerInfo
							title={'Registration Info'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
						/>
						<BasicInfo
							title={'Basic Information'}
							formPayload={formPayload}
							isPrisoner={true}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
						/>
						<ProfessionalInfo
							title={'Professional Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							lookUps={lookups}
						/>
						<BiometricInfo
							title={'Bio Metric Information'}
							isPrisoner={true}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							isEdit={props.isEdit}
						/>
						<ContactInfo
							title={'Contact Information'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							handleSubmit={handleSubmit}
							setProgress={setProgress}
							lookUps={lookups}
						/>
						<PrisonerContact
							title={'Prisoner Info'}
							formPayload={formPayload}
							setFormPayload={setFormPayload}
							setProgress={setProgress}
							handleSubmit={handleSubmit}
							lookUps={lookups}
						/>
					</StepWizard>
				</form>
			</div>
		</>
	);
};

export default AddPrisoner;
