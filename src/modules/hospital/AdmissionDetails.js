import { useEffect, useState } from 'react';
import { baseImageUrl, getData } from '../../services/request';
import PrisonerInfoCard from '../../components/prisoners/Components/release-prisoner/PrisonerInfoCard';
import { Grid, _ } from 'gridjs-react';
import AdmissionInfoCard from './components/AdmissionInfoCard';
import { transformDataForTableGrid, validateDate } from '../../common/Helpers';
import CheckupModal from './components/CheckupModal';
import ProfilePic from '../../assets/images/users/1.png';

const generateGridCols = () => {
	const entries = {
		'Special Diet (خصوصی تاریخ)': '',
		'Investigations (تحقیقات)': '',
		'Treatment (علاج)': '',
		'Pulse (نبض)': 0,
		'Blood Pressure (بلڈ پریشر)': 0,
		'Temperature (درجہ حرارت)': 0,
		'Health Improved ': 0,
		'check-Up Date (چیک اپ کی تاریخ)': '',
		'Investigations ': '',
	};
	return Object.keys(entries);
};

const AdmissionDetails = ({ lookups, setActiveTab }) => {
	const [gridCheckups, setGridCheckups] = useState([]);
	const [fetchedData, setFetchedData] = useState({
		prisonerData: {},
		admissionData: {},
		payload: {}
	});
	const [showModal, setShowModal] = useState(false);
	const [type, setType] = useState('');
	const [showDocImage, setShowDocImage] = useState(false)
	const [viewDoc, setViewDoc] = useState("")

	useEffect(() => {
		if (sessionStorage.getItem('prisonerAdmissionEntry')) {
			loadData();
		}
	}, []);

	const loadData = async () => {
		const prisoner = JSON.parse(
			sessionStorage.getItem('prisonerAdmissionEntry')
			);
		const hospitalId =	prisoner?.hopitalAdmission?.hospitalAdmissionId;
		try {
			const res = await getData(
				`/services/app/PrisonerMedicalInfo/GetOneHospitalAdmission?prisonerBasicInfoId=${prisoner.id}&hospitalAdmissionId=${hospitalId}`,
				'',
				true
			);
			const data = res.result;
			if (res.result.isSuccessful) {
				const loadedData = {
					prisonerData: data.prisonerData,
					admissionData: {
						admissionDate: data.hospitalAdmission.admissionDate,
						dischargeDate: data.hospitalAdmission.dischargeDate,
						specialDiet: data.hospitalAdmission.specialDiet,
						disease: lookups['diseases']?.find(
							dis =>
								dis.value === data.hospitalAdmission.diseaseId
						)?.label
					},
					payload: { ...data.hospitalAdmission }
				};
				if (gridCheckups.length === 0) {
					setFetchedData(loadedData);
				}
				if (data.hospitalAdmission?.checkups.length > 0) {
					setGridCheckups(data.hospitalAdmission.checkups);
				} else {
					setGridCheckups([]);
				}
			}
		} catch (err) {
			console.error(err);
      console.log(err, 'getting error while fetching API {GetOneHospitalAdmission} & fileName is {AdmissionDetails.js}');
		}
	};

	const gridDataMap = entry => {
		const mappedObj = {
			specialDiet: entry.specialDiet,
			investigations: entry.investigations,
			treatment: entry.treatment,
			pulse: entry.pulse,
			bloodPressure: entry.bloodPressure,
			temperature: entry.temperature,
			healthImproved: entry?.healthImproved ? "Yes" : "No",
			checkUpDate: validateDate(entry.checkUpDate),
			Investigations: _(
				<div
			className="profile-td profile-td-hover form-check-label"
			onClick={() => {
				setShowDocImage(true),
				setViewDoc(entry?.clinicalTest ? baseImageUrl + entry?.clinicalTest : ProfilePic);
			}}
			>
			<img
				onError={(ev) => {
				ev.target.src = ProfilePic;
				}}
				className="avatar-xs rounded-circle "
				src={entry?.clinicalTest
					? baseImageUrl + entry?.clinicalTest
					: ProfilePic}
				width="50"
			/>
			</div>
			)
		};
		return mappedObj;
	};

	const clickHandler = type => {
		setType(type);
		setShowModal(true);
	};

	return (
		<>
			<CheckupModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				title={type === 'add' ? 'Add Checkup' : 'Discharge'}
				admissionData={fetchedData.payload}
				refetch={loadData}
				type={type}
				setActiveTab={setActiveTab}
			/>
			<PrisonerInfoCard prisoner={fetchedData.prisonerData} />
			<AdmissionInfoCard
				data={fetchedData.admissionData}
				title='Hospital Admission Information'
			/>
			<div className='card custom-card animation-fade-grids custom-card-scroll mt-2'>
				<div className='btns just-right'>
					<button
						id={'checkup-btn'}
						onClick={clickHandler.bind(this, 'add')}
						className='btn btn-prim btn-label lg-btn '
					>
						<i className='icon-add label-icon align-middle fs-16 me-2'></i>{' '}
						Checkup
					</button>
					<button
						id={'discharge-btn'}
						onClick={clickHandler.bind(this, 'discharge')}
						className='btn btn-danger lg-btn'
						style={{ marginLeft: '8px' }}
					>
						<i className='icon-next label-icon align-middle fs-16 me-2'></i>
						Discharge
					</button>
				</div>
				<div className='row'>
					<Grid
						data={transformDataForTableGrid(
							gridCheckups.map(entry => gridDataMap(entry))
						)}
						columns={generateGridCols()}
						search={true}
						sort={true}
						pagination={{
							enabled: true,
							limit: 10
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default AdmissionDetails;
