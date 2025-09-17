/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
	transformData,
	transformDataForTableGrid,
	validateDate,
} from "../../../../../common/Helpers";
import {
	baseImageUrl,
	getData,
	postData,
} from "../../../../../services/request";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import AllSearch from "../../../../admin/search/AllSearch";
import ProfileCard from "../profile/ProfileCard";
import InputWidget from "../../../../../droppables/InputWidget";
import ProfilePic from "../../../../../../src/assets/images/users/1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../../../../store/loader";
import Print from "../../../../admin/search/Print";
import FingerScanner from "../../../../../common/FingerScanner";
import InfoModal from "../../../../../modules/courtProduction/components/InfoModal";
import ProfileModal from "./ProfileModal";
import DynamicModal from "../../../../../modules/courtProduction/components/DynamicModal";
import PoliceOfficerDetailsModal from "./PoliceOfficerDetailsModal";
import DescriptionModal from "../../../../../common/DescriptionModal";
export const removeDuplicates = (arr1, arr2) => {
	if (!arr1 || !arr2) {
		return null;
	}
	return arr2.filter((item) => !arr1.includes(item));
};


const ViewCheckInCircleOffice = ({
	text,
	modalHeader,
	getURL,
	apiEndpoint,
	secondGetUrl,
	swalText,
	checkReasons,
	tabPos = 1,
	btnText,
	subTitle,
	subTitle2,
	tabTitle,
	releaseTitle,
	isReleaseGridShow,
	checkIn,
	policeOfficer,
	showEscaped,
	isSp,
	isShowHearingStats,
	headerTitle
}) => {
	const dispatch = useDispatch();
	const gridRef = useRef();
	// GRID 1
	const [entries, setEntries] = useState([]);
	//  GRID 2
	const [loadedEntries, setLoadedEntries] = useState([]);
	const [csvEntries, setCsvEntries] = useState([]);
	const [newUserData, setNewUserData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [fetchedPrisoner, setFetchedPrisoner] = useState(null);
	const [releaseEntries, setReleaseEntries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [formPayload, setFormPayload] = useState({});
	const [modalPayload, setModalPayload] = useState([]);
	const [releasePayload, setReleasePayload] = useState([]);
	const [prisonerId, setPrisonerId] = useState();
	const userMeta = useSelector((state) => state.user);
	const [isAdmin] = useState(userMeta?.role === "Super Admin");
	const [isCo] = useState(userMeta?.role === "Prison Circle Office");
	const [isDarban] = useState(userMeta?.role === "Darban");
	const [isUTP] = useState(userMeta?.role === "Prison UTP Branch");
	const [isConvict] = useState(userMeta?.role === "Prison Convict Branch");
	const [fingerIndex, setFingerIndex] = useState("");
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [showSelectModal, setShowSelectModal] = useState(false);
	const [viewModalIsVisible, setViewModalIsVisible] = useState(false);
	const [ProfileOverviewData, setProfileOverviewData] = useState({});
	const [getSelectedPrisoners, setGetSelectedPrisoners] = useState([]);
	const [showWomenModal, setShowWomenModal] = useState(false);
	const [lookups, setLookups] = useState({});
	const [showOfficerModal, setShowOfficerModal] = useState(false);
	const [policeOfficerData, setPoliceOfficerData] = useState([]);
	const [vehicleNumber, setVehicleNumber] = useState("");
	const [showDescModal, setShowDescModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [pageLimit, setPageLimit] = useState(10);

	const newLookups = useSelector((state) => state?.dropdownLookups)

	const handleShowDescModal = (description, title) => {
		const descriptionArray = description.split(',').map(item => item.trim());
		const formattedDescription = descriptionArray.map((item, index) => (
			<span key={index} style={{ padding: "0.5rem" }}>
				({index + 1}). {item}
				<br />
			</span>
		));
		setModalContent(formattedDescription);
		setModalTitle("Under Sections");
		setShowDescModal(description?.length > 30 ? true : false);
	};


	const handleSelectedOfficer = (officer, carNumber) => {
		setVehicleNumber(carNumber)
		setPoliceOfficerData(officer)
		setShowOfficerModal(true)
	}
	useEffect(() => {
		loadData();
		callAndHandleLookUps()
	}, []);

	useEffect(() => {
		loadEntries();
		callAndHandleLookUps()
	}, []);


	const callAndHandleLookUps = async () => {
		try {
			const lookup = {};

			const relationshipObj = transformData(newLookups?.Relationships);
			lookup["relationship"] = relationshipObj;
			setLookups(lookup);
		} catch (error) {
			console.error(error);
			alert("something went wrong in lookups api");
		}
	};

	const generateGridCols = () => {
		const gridCols = {
			"profile pic": "",
			"Prisoner Number": "",
			Year: "",
			"Full Name": "",
			"Relationship Type": "",
			"Relationship Name": "Abdullah",
			Barrack: "",
			CNIC: "17301-5838517-9",
			"Admission Date": "2022-04-14T00:00:00+05:00",
			"Fir No": "",
			"Under Section": "",
			"Has Opposition ": "",
			"condemend": "",
			"Escaped": "",
			"High Profile": "",
			"Multiple Case": "",
			"Check Reason": "",
		};

		if (isAdmin) {
			gridCols['Prison Name'] = '';
		}

		gridCols[isReleaseGridShow ? 'View' : 'Actions'] = '';
		const cols = isReleaseGridShow ? { select: "", ...gridCols } : gridCols;
		return cols;
	};

	const generateGridColsGridTwo = () => {
		const gridCols = {
			"profile pic": "",
			"Prisoner Number": "",
			Year: "",
			"Full Name": "",
			"Relationship Type": "",
			"Relationship Name": "Abdullah",
			Barrack: "",
			CNIC: "17301-5838517-9",
			"Admission Date": "2022-04-14T00:00:00+05:00",
			"Fir No": "",
			"Under Section": "",
			"Has Opposition": "",
			"condemend": "",
			"Escaped": "",
			"High Profile": "",
			"Multiple Case": "",
			"Check Reason": "",
		};
		if (isAdmin) {
			gridCols['Prison Name'] = '';
		}
		if (policeOfficer) {
			gridCols['Police Officer Details'] = "";
		}
		return gridCols;
	};



	const selectPrisonerHandler = (entry) => {
		const updatedAllData = releaseEntries
		if (entry) {
			if (entry.requireGuardian) {
				updatedAllData.forEach(record => {
					if (record.id !== entry.id) {
						record.isGuardian = true;
					}
				});
			}else{
				updatedAllData.forEach(record => {
					if (record.requireGuardian === true) {
						record.isGuardian = true;
					}
				});
			}
			// else if (entry.gender === 'Male') {
			// 	updatedAllData.forEach(record => {
			// 	if (record.gender === 'Female') {
			// 	  record.isGuardian = true;
			// 	}
			//   });
			// }
			setReleaseEntries(updatedAllData)
		}

		const newId = {};
		getData(
			`/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${entry.id}`,
			"",
			true
		)
			.then((response) => {
				console.log("FETCHED PRISONER", response);
				const prisoner = response.result.data;
				newId.id = prisoner.id;
				if (entry.checkOutReason == "Release") {
					const payload = {
						name: entry.fullName,
						id: newId.id,
						prisonerBasicInfoId: entry.id,
						gender: entry.gender,
						requireGuardian: entry.requireGuardian,
						prisonerBelongings: entry.prisonerBellongings
					};
					setReleasePayload((prevPayload) => [...prevPayload, payload]);
				}
				else {
					const payload = {
						id: newId.id,
						prisonerBasicInfoId: entry.id,
						policeOfficerName: "",
						checkVehicleNumber: "",
						otherDetails: "",
						checkPoliceOfficers: [],
						checkOutReason: entry.checkOutReason
					};
					setModalPayload((prevPayload) => [...prevPayload, payload]);
					const selectedPrisoners = [...getSelectedPrisoners, prisoner];
					setGetSelectedPrisoners(selectedPrisoners);
				}
			})
			.catch((err) => {
				console.log(err);
			});

	};

	const unselectPrisonerHandler = (entry) => {

		if (entry.checkOutReason == "Release") {
			const updatedAllData = releaseEntries
			setReleasePayload((prevPayload) => prevPayload.filter((payload) => payload.prisonerBasicInfoId !== entry.id));
			if (entry) {
				if (entry.requireGuardian) {
					updatedAllData.forEach(record => {
						if (record.id !== entry.id) {
							record.isGuardian = false;
						}
					});
				}else{
					updatedAllData.forEach(record => {
						if (record.requireGuardian === true) {
							record.isGuardian = false;
						}
					});
				}
				// else if (entry.gender === 'Male') {
				// 	updatedAllData.forEach(record => {
				// 	if (record.gender === 'Female') {
				// 	  record.isGuardian = false;
				// 	}
				//   });
				// }
				setReleaseEntries(updatedAllData)
			}
		}
		else {
			setGetSelectedPrisoners((prevPayload) => prevPayload && prevPayload.filter((payload) => payload.prisonerBasicInfoId !== entry.id));
			setModalPayload((prevPayload) => prevPayload && prevPayload.filter((payload) => payload.prisonerBasicInfoId !== entry.id));
		}
	};

	const openModal = () => {
		setShowSelectModal(true)
	}

	const submitHandler = async () => {
		const payload = {
			data: modalPayload,
		};
		let endpointName = tabTitle === "Checkin by Darban" ? "CreateUpdateMultipleCheckInDarban" : "CreateUpdateMultipleCheckOutDarban";
		let url = `/services/app/PrisonerCheckInOut/${endpointName}`;
		try {
			const res = await postData(url, payload);
			if (res.success && res.result?.isSuccessful) {
				setModalPayload([]);
				setGetSelectedPrisoners([])
				loadData();
				swal("Successfully Sent!", "", "success");
			} else {
				swal(
					!res.error.details ? "" : res.error.message,
					res.error.details ? res.error.details : res.error.message,
					"warning"
				);
			}
		} catch (error) {
			swal("Something went wrong!", "", "warning");
		}
		setShowSelectModal(false)
	};

	const handleReleaseSubmit = async () => {
		let textContent = "";
		releasePayload.forEach(person => {
			if (person.prisonerBelongings && person.prisonerBelongings.length > 0) {
				textContent += `${person.name}\n`;
				person.prisonerBelongings.forEach(item => {
					textContent += ` - ${item.itemName}: ${item.itemDescription}\n`;
				});
				textContent += '\n';
			}
		});

		if (textContent) {
			swal({
				title: "Prisoner Belongings",
				text: textContent,
				icon: "info",
				buttons: true
			}).then((value) => {
				if (value) {
					// ✅ User clicked OK
					console.log("Proceeding with release...");

					if (releasePayload?.[0]?.requireGuardian) {
						setShowWomenModal(true)
					} else {
						releaseSubmitHandler(releasePayload)
					}
				}
			});
		} else {
			// No belongings? Go ahead without confirmation
			if (releasePayload?.[0]?.requireGuardian) {
				setShowWomenModal(true)
			} else {
				releaseSubmitHandler(releasePayload)
			}
		}

	}

	async function releaseSubmitHandler(releasePayload) {
		const payload = {
			data: releasePayload,
		};
		let url = "/services/app/PrisonerCheckInOut/CreateUpdateMultipleCheckOutDarban";
		try {
			const res = await postData(url, payload);
			if (res.success && res.result?.isSuccessful) {
				loadData();
				setReleasePayload([])
				swal("Successfully Sent!", "", "success");
				onCloseWomenModal();
			} else {
				swal(
					!res.error.details ? "" : res.error.message,
					res.error.details ? res.error.details : res.error.message,
					"warning"
				);
			}
		} catch (error) {
			swal("Something went wrong!", "", "warning");
		}
	}


	//  GRID 1
	const loadData = () => {

		const rawData = sessionStorage.getItem("user");
		const parsedId = JSON.parse(rawData).userId;
		const obj = {
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
			underSection: 0,
			barrack: 0,
			checkOutReason: 0,
			prisonerStatusId: 0,
			searchTypeId: 0,
		};
		postData(`/services/app/PrisonerSearch/${getURL}`, obj)
			.then((result) => {
				if (result && result.success) {

					const data = result.result.data;
					if (data.length > 0) {
						if (isReleaseGridShow) {

							const filteredAllStatusData = data.filter(e => e.checkOutReason != "Release")
							const filteredHearingStatusData = data.filter(e => e.checkOutReason == "Release")
							setEntries(filteredAllStatusData);
							setReleaseEntries(filteredHearingStatusData)
						}
						else {
							setEntries(data);
						}
						setNewUserData(data);
						const gridjsInstance = gridRef.current.getInstance();
						gridjsInstance.on("rowClick", (...args) => {
						});
					} else {
						setEntries([]);
						setReleaseEntries([]);
					}
				} else {
					console.error("something went wrong");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSelectedPrisoner = (p) => {

		setShowModal(true);
		setLoading(true);
		getData(
			`/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${p.id}`,
			"",
			true
		)
			.then((response) => {
				setFetchedPrisoner(response.result.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
		sessionStorage.setItem("prisoner", JSON.stringify(p));
	};

	const declineRelease = (p) => {

		swal({
			title: 'Are you sure you want to decline the release for this prisoner?',
			text: 'This action cannot be undone',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Decline it!'
		}).then(async willDelete => {
			if (willDelete) {
				const caseId = p.cases?.[0]?.id;
				postData(`/services/app/PrisonerRelease/CompleteCaseRelease?caseId=${caseId}&approved=false`, {})
					.then((res) => {
						if (res.success && res.result.isSuccessful) {
							loadData();
							swal("Successfully Declined!", "", "success");
						} else {
							swal(res.error.message, res.error.details, "warning");
						}
					})
					.catch((err) => {
						console.log(err);
						swal("Something went wrong!", "", "warning");
					});
			}
		});
	}

	// GRID 2
	const loadEntries = () => {
		const rawData = sessionStorage.getItem("user");
		const parsedId = JSON.parse(rawData).userId;
		const obj = {
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
			underSection: 0,
			barrack: 0,
			checkOutReason: 0,
			prisonerStatusId: 0,
			searchTypeId: 0,
		};
		postData(`/services/app/PrisonerSearch/${secondGetUrl}`, obj)
			.then((result) => {
				if (result && result.success) {
					const data = result.result.data;
					if (data.length > 0) {

						const filterdData = data.map((e) => {
							const shortDescription =
								e?.underSection?.length > 50
									? `${e.underSection.substring(0, 50)}...`
									: e.underSection;

							if (userMeta?.role === "Super Admin") {
								return {
									profile: _(
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
									year: e.year === 0 ? "not admitted yet" : e.year,
									fullName: e.fullName,
									"relationshipType": e?.relationshipType,
									relationshipName: e.relationshipName,
									barrack: e.barrack || "not allocated yet",
									cnic: e.cnic,
									admissionDate: validateDate(e.admissionDate) || "",
									firNo: e.firNo,
									// underSection: e.underSection,
									underSection: _(
										<div className="cursor-pointer"
											onClick={() =>
												handleShowDescModal(e.underSection, e.underSection)
											}
										>
											{shortDescription || "not added yet"}
										</div>
									),
									hasOpposition: e.hasOpposition ? "Yes" : "No",
									condemend: _(
										<span style={{ color: e.condemend ? "red" : "inherit" }}>
											{e.condemend ? "Yes" : "No"}
										</span>
									),
									isEscaped: e.isEscaped ? "Yes" : "No",
									highProfile: e.highProfile ? "Yes" : "No",
									hasManyCases: e.hasManyCases ? "Yes" : "No",
									checkOutReason: e.checkOutSting,
									prisonName: e.prisonName,
								};
							} else {
								return {
									profile: _(
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
									year: e.year === 0 ? "not admitted yet" : e.year,
									fullName: e.fullName,
									"relationshipType": e?.relationshipType,
									relationshipName: e.relationshipName,
									barrack: e.barrack || "not allocated yet",
									cnic: e.cnic,
									admissionDate: validateDate(e.admissionDate) || "",
									firNo: e.firNo,
									underSection: _(
										<div className="cursor-pointer"
											onClick={() =>
												handleShowDescModal(e.underSection, e.underSection)
											}
										>
											{shortDescription || "not added yet"}
										</div>
									),
									hasOpposition: e.hasOpposition ? "Yes" : "No",
									condemend: _(
										<span style={{ color: e.condemend ? "red" : "inherit" }}>
											{e.condemend ? "Yes" : "No"}
										</span>
									),
									isEscaped: e.isEscaped ? "Yes" : "No",
									highProfile: e.highProfile ? "Yes" : "No",
									hasManyCases: e.hasManyCases ? "Yes" : "No",
									checkOutReason: e.checkOutSting,
									Action: _(
										<div className="action-btns">
											{policeOfficer &&
												<button
													id={"approve-btn"}
													type="button"
													onClick={() => handleSelectedOfficer(e?.policeOfficerCheckOut, e?.checkOutVehicleNumber)}
													className="btn btn-info waves-effect waves-light mx-1 tooltip"
												>
													<i className="icon-show-password"></i>
													<span>{"View Details"}</span>
												</button>}
										</div>
									)
								};
							}
						});
						setLoadedEntries(transformDataForTableGrid(filterdData));
						setCsvEntries(data);

					} else {
						setLoadedEntries([]);
					}
				} else {
					console.error("something went wrong");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	useEffect(() => {
		if (!showModal) {
			setIsDisabled(false);
		}
	}, [showModal]);

	const [isDisabled, setIsDisabled] = useState(false);

	const handleCheckout = (e) => {
		const hasPendingCase = fetchedPrisoner?.prisonerData?.hasUnderTrailCase;
		setIsDisabled(true);

		const rawData = sessionStorage.getItem("prisoner");
		const parsedId = JSON.parse(rawData).id;

		const payload = {
			data: {
				id: fetchedPrisoner.id,
				prisonerBasicInfoId: parsedId,
			},
		};

		if (tabPos === 1) {
			payload.data = { ...payload.data, ...formPayload };
		} else if (tabPos === 2) {
			payload.data = {
				...payload.data,
				CheckReason: fetchedPrisoner.CheckReason,
				checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
			};
		} else if (tabPos === 3) {
			payload.data = {
				...payload.data,
				CheckReason: fetchedPrisoner.CheckReason,
				checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
				checkOutDateTime: e.checkOutDateTime,
			};
		} else if (tabPos === 4) {
			payload.data = {
				...payload.data,
				CheckReason: fetchedPrisoner.CheckReason,
				checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
				checkOutDateTime: e.checkOutDateTime,
				checkOutDarbanDateTime: e.checkOutDarbanDateTime,
			};
		} else if (tabPos === 5) {
			payload.data = {
				...payload.data,
				CheckReason: fetchedPrisoner.CheckReason,
				checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
				checkOutDateTime: e.checkOutDateTime,
				checkOutDarbanDateTime: e.checkOutDarbanDateTime,
				checkInDarbanDateTime: e.checkInDarbanDateTime,
			};
		}
		if ((isUTP || isConvict) && hasPendingCase && fetchedPrisoner?.prisonerData?.checkOutReason === "Transfer") {
			swal({
				title: 'Are you sure you want to initiate the transfer for this prisoner?',
				text: 'This prisoner has a pending under trial case in this district',
				icon: 'warning',
				buttons: true,
				dangerMode: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Proceed it!'
			}).then(async willDelete => {
				if (willDelete) {
					postDataHandler(payload);
				} else {
					setIsDisabled(false);

				}
			});

		} else {
			postDataHandler(payload);
		}

		// 13
		//
	};
	const postDataHandler = async (payload) => {
		try {
			postData(`/services/app/PrisonerCheckInOut/${apiEndpoint}`, payload)
				.then((res) => {
					if (res.success && res.result.isSuccessful) {
						setShowModal(false);
						swal(swalText, "", "success");
						if (Object.keys(formPayload).length > 0) {
							setFormPayload({});
						}
						sessionStorage.removeItem("prisoner");
						// refetch
						// GRID 1
						loadData();
						// GRID 2
						loadEntries();
					} else {
						swal(res.error.message, res.error.details, "warning");
					}
				})
				.catch((err) => {
					swal("Something went wrong!", "", "warning");
				});
		} catch (error) {
			console.log(error);
		}
	};

	const gridMapData = (entries) => {
		const filterdData = entries.map((e) => {
			const shortDescription =
				e?.underSection?.length > 50
					? `${e.underSection.substring(0, 50)}...`
					: e.underSection;

			const obj = {}
			if ((userMeta?.role === "Super Admin" && isReleaseGridShow) || (userMeta?.role != "Super Admin" && isReleaseGridShow)) {
				obj['selected'] =
					_(
						<input
							className="form-check-input"
							type="checkbox"
							style={{ width: '1.7rem', height: '1.7rem', marginLeft: '11px' }}
							checked={e.selected}
							disabled={e.isGuardian}
							onChange={(event) => {
								const checked = event.target.checked;
								e.selected = checked
								if (checked) {
									selectPrisonerHandler(e);
								} else {
									unselectPrisonerHandler(e);
								}
							}}
						/>
					)
			}
			obj['profile'] = _(
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
			);
			obj['prisonerNumber'] = e.prisonerNumber;
			obj['year'] = e.year === 0 ? "not admitted yet" : e.year;
			obj['fullName'] = e.fullName;
			obj["relationshipType"] = e?.relationshipType;
			obj['relationshipName'] = e.relationshipName;
			obj['barrack'] = e.barrack || "not allocated yet";
			obj['cnic'] = e.cnic;
			obj['admissionDate'] = validateDate(e.admissionDate) || "";
			obj['firNo'] = e.firNo;
			obj['underSection'] = _(
				<div className="cursor-pointer"
					onClick={() =>
						handleShowDescModal(e.underSection, e.underSection)
					}
				>
					{shortDescription || "not added yet"}
				</div>
			),
				obj['hasOpposition'] = e.hasOpposition ? "Yes" : "No",
				obj["condemend"] = _(
					<span style={{ color: e.condemend ? "red" : "inherit" }}>
						{e.condemend ? "Yes" : "No"}
					</span>
				);
			obj['escaped'] = e.isEscaped ? "Yes" : "No",
				obj['highprofile'] = e.highProfile ? "Yes" : "No",
				obj['hasManyCases'] = e.hasManyCases ? "Yes" : "No",
				obj['checkOutReason'] = e.checkOutSting
			obj['prisonName'] = e.prisonName
			obj['Actions'] = _(
				<div className="action-btns">
					{e.appealInProgress == true && (
						<button
							id={"view-more-btn"}
							type="button"
							className="tooltip btn btn-danger waves-effect waves-light mx-1 "
						>
							<i className="icon-glamping"></i>
							<span>Appeal In process</span>
						</button>
					)}

					{!isReleaseGridShow &&
						<>
							<button
								id={"approve-btn"}
								type="button"
								onClick={() => handleSelectedPrisoner(e)}
								className="btn btn-success waves-effect waves-light mx-1 tooltip"
							>
								<i className="icon-active"></i>
								<span>{btnText || "Approve"}</span>
							</button>
						</>

					}
					<button
						id={"view-btn-four"}
						type="button"
						onClick={() => handleDetailsBtn(e)}
						className="tooltip btn btn-prim waves-effect waves-light"
					>
						<i className="icon-show-password"></i>
						<span>{"View more"}</span>
					</button>
					{showEscaped && (
						<button
							id={"add-btn-add"}
							type="button"
							onClick={() => {
								handleEscaped(e)
							}}
							className="tooltip btn btn-success waves-effect waves-light mx-1"
						>Escaped
						</button>
					)}

				</div>
			)
			if ((userMeta?.role != "Super Admin" && !isReleaseGridShow) || (userMeta?.role != "Super Admin" && isReleaseGridShow)) {
				delete obj.prisonName
			}
			return obj;
		});
		const data = transformDataForTableGrid(filterdData)
		return data;
	}


	const handleDetailsBtn = async (e) => {
		try {

			const res = await getData(
				`/services/app/AddPrisonerAppServices/GetOnePrisonerProfile?Prisonerid=${e?.id}`,
				"",
				true
			);
			if (res.result.isSuccessful) {
				const data = res.result.prisonerProfile;
				setProfileOverviewData(data);

			}
		} catch (error) {
			console.log(error);
		}
		setPrisonerId(e)
		setTimeout(() => {
			setViewModalIsVisible(true);

		}, 500);
	};
	const handleProfileModalClose = () => {
		setViewModalIsVisible(false);
	};
	const fetchLastPrisonerCheckinCheckout = (p) => {
		return new Promise(async (resolve, reject) => {
			try {
				setShowModal(true);
				setLoading(true);
				getData(
					`/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${p.id}`,
					"",
					true
				)
					.then((response) => {
						setFetchedPrisoner(response.result.data);
						setLoading(false);
						resolve(response.result.data)
					})
					.catch((err) => {
						console.log(err);
						setLoading(false);
						reject(false)
					});
				sessionStorage.setItem("prisoner", JSON.stringify(p));
			} catch (error) {
				console.log('fetch last prisoner checkin checkout', error)
			}
		})
	}
	const handleCheckoutPrisoner = async (prisonerData) => {
		const fetchedPastStatus = await fetchLastPrisonerCheckinCheckout(prisonerData)

	}

	const hideModal = () => {
		setShowModal(false);
		setShowOfficerModal(false)
	};

	const handleCloseModal = () => {
		setModalIsVisible(false);
	};

	const handleSubmit = (payload) => {
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
		};

		postData(`/services/app/PrisonerSearch/${getURL}`, reqPayload)
			.then((result) => {
				if (result && result.result.isSuccessful) {
					const data = result.result.data;
					const filterdData = data.map((e) => {
						if (userMeta?.role === "Super Admin") {
							return {
								profile: _(
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
								year: e.year === 0 ? "not admitted yet" : e.year,
								fullName: e.fullName,
								"relationshipType": e?.relationshipType,
								relationshipName: e.relationshipName,
								cnic: e.cnic,
								admissionDate: validateDate(e.admissionDate) || "",
								prisonName: e.prisonName,
								Actions: _(
									<div className="action-btns">
										{e.appealInProgress == true && (
											<button
												id={"view-more-btn"}
												type="button"
												className="tooltip btn btn-danger waves-effect waves-light mx-1 "
											>
												<i className="icon-glamping"></i>
												<span>Appeal In process</span>
											</button>
										)}
										<button
											id={"approve-btn-three"}
											type="button"
											onClick={() => handleSelectedPrisoner(e)}
											className="btn btn-success waves-effect waves-light mx-1 tooltip"
										>
											<span>{btnText || "Approve"}</span>
										</button>

									</div>
								),
							};
						} else {
							return {
								profile: _(
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
								year: e.year === 0 ? "not admitted yet" : e.year,
								fullName: e.fullName,
								"relationshipType": e?.relationshipType,
								relationshipName: e.relationshipName,
								cnic: e.cnic,
								admissionDate: validateDate(e.admissionDate) || "",
								Actions: _(
									<div className="action-btns">
										{e.appealInProgress == true && (
											<button
												id={"view-more-btn"}
												type="button"
												className="tooltip btn btn-danger waves-effect waves-light mx-1 "
											>
												<i className="icon-glamping"></i>
												<span>Appeal In process</span>
											</button>
										)}
										<button
											id={"approve-btn-four"}
											type="button"
											onClick={() => handleSelectedPrisoner(e)}
											className="btn btn-success waves-effect waves-light mx-1"
										>
											<span>{btnText || "Approve"}</span>
										</button>
									</div>
								),
							};
						}
					});
					setEntries(transformDataForTableGrid(filterdData));
				} else {
					swal(result.error.message, result.error.details, "warning");
				}
			})
			.catch((err) => {
				swal("Something went wrong!", "", "warning");
			});
	};

	const newData = newUserData.map((x) => {
		const csv = {
			"Prisoner Number": x.prisonerNumber,
			"Full Name": x.fullName,
			"Relationship Type": x?.relationshipType,
			"Relationship Name": x.relationshipName,
			barrack: x.barrack,
			cnic: x.cnic,
			"Admission Date": validateDate(x.admissionDate) || "",
			"Fir No": x.firNo,
			UnderSection: x.underSection,
			checkOutReason: x.checkOutSting,
		};
		if (isAdmin) {
			csv["Prison Name"] = x.prisonName;
		}
		return csv;
	});

	const newCsv = csvEntries.map((x) => {
		const csvTwo = {
			"Prisoner Number": x.prisonerNumber,
			"Full Name": x.fullName,
			"Relationship Type": x?.relationshipType,
			"Relationship Name": x.relationshipName,
			barrack: x.barrack,
			cnic: x.cnic,
			"Admission Date": validateDate(x.admissionDate) || "",
			"Fir No": x.firNo,
			UnderSection: x.underSection,
			checkOutReason: x.checkOutSting,
		};
		if (isAdmin) {
			csvTwo["Prison Name"] = x.prisonName;
		}
		return csvTwo;
	});
	if (isAdmin) {
		var file =
			tabPos == 1
				? "Generate Checkout Request List"
				: tabPos == 2
					? "Check Out By Circle Office List"
					: tabPos == 3
						? "Check Out By Darban"
						: tabPos == 4
							? " check-in "
							: tabPos == 5
								? "Check In By Circle Office"
								: "";
		var name =
			tabPos == 1
				? "Checkout Requests List"
				: tabPos == 2
					? "Checked Out by Circle Office List"
					: tabPos == 3
						? "Checked out by Darban List"
						: tabPos == 4
							? "Checked in by Darban List"
							: "";
	}
	if (isCo) {
		var file =
			tabPos == 1
				? "Check Out By Circle Office List"
				: tabPos == 2
					? "Check In By Circle Office List"
					: "";
		var name =
			tabPos == 1
				? "Checked Out By Circle Office List"
				: tabPos == 2
					? "Checked In By Circle Office List"
					: "";
	}
	if (isDarban) {
		var file =
			tabPos == 1
				? "Checkout By Darban List"
				: tabPos == 2
					? " check-in List"
					: "";

		var name =
			tabPos == 1
				? "Checked Out By Darban List"
				: tabPos == 2
					? "Checked In by Darban List"
					: "";
	}
	if (isUTP + isConvict) {
		var file = tabPos == 1 ? "Generate Checkout Requests List" : "";
		var name = tabPos == 1 ? "Checkout Requests List" : "";
	}

	const onCloseWomenModal = () => {
		setShowWomenModal(false)
	}

	const handleWomenReleaseSubmit = () => {
		const payload = {
			id: releasePayload[0].id,
			prisonerBasicInfoId: releasePayload[0].prisonerBasicInfoId,
			"womenCaretaker": {
				"personalInfo": {
					"fullName": releasePayload.fullName,
					"cnic": releasePayload.cnic,
				},
				"contactInfo": {
					"mobileNumber": releasePayload.phoneNumber
				}
			},
			"womenCaretakerRelationshipId": releasePayload.relationshipId
		}
		releaseSubmitHandler([payload])
	}

	const handleEscaped = (prionser) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to Escape: ' + prionser.fullName,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Escape it!',
			cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {

			if (willDelete) {
				const escaped = await postData(`/services/app/AddPrisonerAppServices/EscapedPrisoner?prisonerBasicInfoId=${prionser.id}&escaped=true`)
				if (escaped.success) {
					swal("Prisoner has been marked as escaped", "", "success");
					loadData();
				} else {
					swal("Error", escaped?.error?.message || "Something went wrong", "error");
				}
			}
		});

	}

	const closeInfoModel = () => {
		setModalPayload([]);
		setGetSelectedPrisoners([]);
		setShowSelectModal(false)
		setEntries(entries.map(entry => ({ ...entry, selected: false })))
	}

	return (
		<>
			<DescriptionModal
				show={showDescModal}
				handleClose={() => setShowDescModal(false)}
				description={modalContent}
				title={modalTitle}
			/>
			<PoliceOfficerDetailsModal
				show={showOfficerModal}
				onHide={() => setShowOfficerModal(false)}
				policeOfficerData={policeOfficerData}
				vehicleNumber={vehicleNumber}
			/>

			<DynamicModal
				showModal={showWomenModal}
				onClose={onCloseWomenModal}
				handleSubmit={handleWomenReleaseSubmit}
				releaseInfoPayLoad={releasePayload}
				setReleaseInfoPayload={setReleasePayload}
				lookups={lookups}
			/>
			<InfoModal
				onClose={closeInfoModel}
				visible={showSelectModal}
				setFormPayload={setModalPayload}
				formPayload={modalPayload}
				onSubmit={submitHandler}
				checkInOutModal={true}
				selectedPrisoners={getSelectedPrisoners}
				isShowHearingStats={isShowHearingStats}
				headerTitle={headerTitle}
			/>

			<AllSearch handleSubmit={handleSubmit} />
			<Print data={newData} filename={file} />
			<div className="card custom-card animation-fade-grids custom-card-scroll" style={{ position: "relative" }}>
				<h3 class="third-heading just-space">
					<span style={{ fontWeight: "bold" }}>{subTitle}</span>
					{checkIn && isDarban && (
						<button
							onClick={() => {
								setModalIsVisible(true);
								setFingerIndex("right thumb");
							}}
							type="button"
							className="btn btn-success btn-label bio-btn"
						>
							<i className="icon-search label-icon align-middle fs-16 me-2"></i>
							<span>
								{" "}
								{!checkIn ? "Biometric Checkin" : "Biometric Checkout"}
							</span>
						</button>
					)}
				</h3>
				<div className="row">
					<Grid
						ref={gridRef}
						data={gridMapData(entries)}
						columns={Object.keys(generateGridCols())}
						search={true}
						sort={true}
						pagination={{
							enabled: true,
							limit: 10,
						}}
					/>
				</div>
				<div className="btns just-center mb-5">
					{modalPayload.length > 0 && (
						<button
							id={"submit-btn"}
							className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1 mt-2"
							onClick={() => openModal()}
						>
							{tabTitle === "Checkin by Darban" ? "CheckIn" : "Checkout"}
						</button>
					)}
				</div>
			</div>
			{isReleaseGridShow && (
				<>
					<div className="card custom-card animation-fade-grids custom-card-scroll">
						<h3 class="third-heading">
							<span style={{ fontWeight: "bold" }}>{releaseTitle}</span>
						</h3>
						<div className="row">
							<Grid
								ref={gridRef}
								data={gridMapData(releaseEntries)}
								columns={Object.keys(generateGridCols())}
								search={true}
								sort={true}
								pagination={{
									enabled: true,
									limit: 10,
								}}
							/>
						</div>
					</div>
					<div className="btns just-center">
						{releasePayload.length > 0 && (
							<button
								id={"submit-btn"}
								className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1 mt-2"
								onClick={() => handleReleaseSubmit()}
							>
								send
							</button>
						)}
					</div>
				</>
			)}
			{tabPos !== 5 && (
				<div className="card custom-card animation-fade-grids custom-card-scroll">
					<h3 className="third-heading">
						<span style={{ fontWeight: "bold" }}>{subTitle2}</span>
					</h3>
					<div className="row">
						<Print data={newCsv} filename={name} />
						<div className="col">
							<Grid
								ref={gridRef}
								data={loadedEntries}
								columns={Object.keys(generateGridColsGridTwo())}
								search={true}
								sort={true}
								pagination={{
									enabled: true,
									limit: 10,
								}}
							/>
						</div>
					</div>
				</div>
			)}

			<ProfileModal
				visible={viewModalIsVisible}
				onClose={handleProfileModalClose}
				personalData={ProfileOverviewData}
				medicalData={ProfileOverviewData?.medicalInfo}
				prisonerId={prisonerId?.id}
			/>
			<Modal
				show={showModal}
				onHide={hideModal}
				size="custom-xl "
				class="modal-custom-xl"
			>
				<Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
					<h5 className="modal-title" id="exampleModalgridLabel">
						{modalHeader || "Approve Request"}
					</h5>
				</Modal.Header>
				<Modal.Body>
					<form className="bg-form">
						<>
							{loading ? (
								<p>Loading...</p>
							) : (
								<>
									<ProfileCard
										data={fetchedPrisoner?.prisonerData}
										tabTitle={tabTitle}
										tabPos={tabPos}
										extra={fetchedPrisoner}
									/>
								</>
							)}
							{tabPos === 1 &&
								tabTitle !== "Checkout Request by CO" &&
								tabTitle !== "Checkout Request by Darban" &&
								tabTitle !== "Checkin by sp" && (
									<div className="row">
										<div className="col-xxl-12">
											<form className="form simple-form">
												<div className="select select-close">
													<InputWidget
														type={"multiSelect"}
														inputType={"name"}
														label={"Checkout Reason"}
														id={"checkout-reason"}
														options={checkReasons}
														multiple={false}
														icon={"icon-operator"}
														setValue={(value) => {
															const payload = {
																...formPayload,
															};
															payload["checkReason"] = value.value;
															setFormPayload(payload);
														}}
													/>
												</div>
											</form>
										</div>
									</div>
								)}
						</>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button
						id={"cancel-btn"}
						className="btn btn-light"
						onClick={hideModal}
					>
						Cancel
					</button>
					<button
						disabled={isDisabled}
						id={"confirm-btn"}
						className="btn btn-primary"
						onClick={handleCheckout}
					>
						{text || "Confirm"}
					</button>
				</Modal.Footer>
			</Modal>

			<FingerScanner
				visible={modalIsVisible}
				title="Finger Print Scanner"
				onClose={handleCloseModal}
				fingerIndex={fingerIndex}
				scanType={"search"}
				globalSearch={false}
				isCheckout={true}
				handleCheckoutPrisoner={handleCheckoutPrisoner}
			/>
		</>
	);
};

export default ViewCheckInCircleOffice;
