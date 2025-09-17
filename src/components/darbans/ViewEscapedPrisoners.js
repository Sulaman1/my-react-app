import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, validateDate } from "../../common/Helpers";
import { baseImageUrl, postData } from "../../services/request";
import swal from "sweetalert";
import AllSearch from "../admin/search/AllSearch";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";
import { useSelector } from 'react-redux';
import Print from "../admin/search/Print";
import ProfilePic from "../../../src/assets/images/users/1.jpg";

const ViewEscapedPrisoners = () => {
	const gridRef = useRef();
	const [darbanData, setDarbanData] = useState([]);
	const [newData, setNewData] = useState([]);
	const [pageLimit, setPageLimit] = useState(10);
	const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
	const show = useSelector((state) => state.language.urdu);

	const getColumns = () => [
		`Profile Pic`,
		`Prisoner Number`,
		`Year`,
		`Full Name${show ? ' (نام)' : ''}`,
		`Gender`,
		'Relationship Type',
		'Relationship Name',
		`Barrack`,
		`CNIC${show ? ' (شناختی کارڈ)' : ''}`,
		`Admission Date`,
		`Fir No`,
		`Undersections`,
		`High Profile`,
		`Has Many Cases`,
		`Checkout Reason`,
		`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`,
		`Actions${show ? ' (عملدرامد)' : ''}`,
	];

	const fetchData = async (url, payload) => {
		try {
			const result = await postData(url, payload);
			if (result && result.success) {
				setTotalNoOfRecords(result.result?.totalPrisoners)
				return result.result.data;
			} else {
				console.error("something went wrong");
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	const loadData = async () => {
		const rawData = sessionStorage.getItem("user");
		const parsedId = JSON.parse(rawData).userId;
		const obj = {
			maxResults: pageLimit,
			userId: parsedId,
			name: "",
			category: 0,
			prisonId: 0,
			year: 0,
			prsNumber: 0,
			relationshipName: "",
			relationshipTypeId: "",
			genderId: 0,
			policeStationId: 0,
			firYear: 0,
			prisonerStatusId: 0,
			searchTypeId: 0,
		};

		const data = await fetchData("/services/app/PrisonerSearch/SearchEscapedprisoner", obj);
		if (data.length > 0) {
			const filterdData = transformPrisonerData(data);
			setDarbanData(transformDataForTableGrid(filterdData));
			setNewData(data);
			const gridjsInstance = gridRef.current.getInstance();
			gridjsInstance.on("rowClick", (...args) => {
				// console.log("row: ", args);
			});
		} else {
			setDarbanData([]);
		}
	};

	const transformPrisonerData = (data) => {
		return data.map((e) => ({
			profilePic: _(
				<div className="profile-td profile-td-hover">
					<div className="pic-view">
						<img
							onError={(ev) => {
								ev.target.src = ProfilePic;
							}}
							className="avatar-xs rounded-circle "
							src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
								}`}
							width="50"
						/>
					</div>
					<img
						onError={(ev) => {
							ev.target.src = ProfilePic;
						}}
						className="avatar-xs rounded-circle "
						src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
							}`}
						width="50"
					/>
				</div>
			),
			prisonerNumber: e.prisonerNumber,
			year: e.year,
			fullName: e.fullName,
			gender: e.gender,
			relationshipType: e?.relationshipType,
			relationshipName: e.relationshipName,
			barrack: e.barrack,
			cnic: e.cnic,
			admissionDate: validateDate(e.admissionDate),
			firNo: e.firNo,
			underSection: e.underSection,
			highProfile: e.highProfile,
			hasManyCases: e.hasManyCases,
			checkoutReason: e.checkOutReason,
			lastModifiedBy: e.lastModifiedByUser,
			Actions: _(
				<div className="action-btns">
					<button
						id={"edit-btn"}
						type="button"
						onClick={() => handleEscaped(e)}
						className="tooltip btn btn-info waves-effect waves-light"
					>
						<i className="icon-edit"></i>
						<span>{`Capture`}</span>
					</button>
				</div>
			),
		}));
	};

	const handleEscaped = async (prisoner) => {
		const willDelete = await swal({
			title: 'Are you sure?',
			text: `You want to Capture: ${prisoner.fullName}`,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Capture!',
			cancelButtonText: 'No, cancel!',
	});

		if (willDelete) {
			const escaped = await postData(`/services/app/AddPrisonerAppServices/EscapedPrisoner?prisonerBasicInfoId=${prisoner.id}&escaped=false`);
			if (escaped.success) {
				swal("Prisoner has been marked as captured", "", "success");
				loadData();
			} else {
				swal("Error", escaped?.error?.message || "Something went wrong", "error");
			}
		}
	};

	useEffect(() => {
		loadData();
	}, [pageLimit]);

	const handleSubmit = async (payload) => {
		const { userId } = JSON.parse(sessionStorage.getItem("user"));
		const reqPayload = {
			relationshipName: payload.relationshipName,
			relationshipTypeId: payload.relationshipTypeId,
			firNo: payload.firNo,
			firYear: payload.firYear,
			genderId: payload.genderId,
			name: payload.name,
			policeStationId: payload.policeStationId,
			prsNumber: payload.prsNumber,
			userId,
			year: payload.year,
			maxResults: payload?.maxResults || pageLimit
		};

		const data = await fetchData("/services/app/PrisonerSearch/SearchDarbanEntries", reqPayload);
		if (data.length > 0) {
			const filterdData = transformPrisonerData(data);
			setDarbanData(transformDataForTableGrid(filterdData));
		} else {
			swal("No data found", "", "warning");
		}
	};

	const gridData = newData.map((e) => ({
		prisonerNumber: e.prisonerNumber,
		year: e.year,
		fullName: e.fullName,
		gender: e.gender,
		relationshipType: e?.relationshipType,
		relationshipName: e.relationshipName,
		barrack: e.barrack,
		cnic: e.cnic,
		admissionDate: validateDate(e.admissionDate),
		firNo: e.firNo,
		underSection: e.underSection,
		highProfile: e.highProfile,
		hasManyCases: e.hasManyCases,
		checkoutReason: e.checkOutReason,
		lastModifiedBy: e.lastModifiedByUser,
	}));

	return (
		<>
			<AllSearch handleSubmit={handleSubmit} />
			<div className="row gridjs">
				<Print data={gridData} filename={`Darban List${show ? ' (دربان کی فہرست)' : ''}`} />
				<div className="col-xl-12 p-0">
					<div className="card custom-card animation-fade-grids custom-card-scroll">
						<div className="row">
							<div className="col">
								<div className="float-end">
									<ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
								</div>
								<Grid
									ref={gridRef}
									data={darbanData}
									columns={getColumns()}
									search={true}
									sort={true}
									pagination={{
										enabled: true,
										limit: pageLimit,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewEscapedPrisoners;