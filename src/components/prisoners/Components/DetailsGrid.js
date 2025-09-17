import React, { useRef, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import {
	transformDataForTableGrid,
	validateDate
} from '../../../common/Helpers';
import ProfilePic from '../../../assets/images/users/1.png';
import { baseImageUrl, postData } from '../../../services/request';
import Modal from 'react-bootstrap/Modal';
import DescriptionModal from '../../../common/DescriptionModal';

const DetailsGrid = props => {
	const gridRef = useRef();
	const [showDocImage, setShowDocImage] = useState(false)
	const [viewDoc, setViewDoc] = useState("")
	const [showDescModal, setShowDescModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [modalTitle, setModalTitle] = useState("");

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
		setShowDescModal(true);
	};


	const closeDocImage = () => {
		setShowDocImage(!showDocImage)
	}

	const download = async () => {
		const nameSplit = viewDoc.split("Admin");
		const duplicateName = nameSplit.pop();
		const link = document.createElement('a');
		link.href = viewDoc;
		const newString = duplicateName.replace(/\\/g, '');
		link.download = newString;
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link)
	};

	// Function to handle showing short description
	const getShortDescription = (e, props) => {
		const underSections = props.courtProduction ? (props.returnList ? e?.underSections : e?.cases[0]?.underSections) : e?.underSections;
		return underSections?.length > 50 ? `${underSections.substring(0, 50)}...` : underSections;
	};

	// Define Actions based on props.status and e.appealInProgress
	const appealInProgressButton = (
		<button
			id={"view-more-btn"}
			type="button"
			className="tooltip btn btn-danger waves-effect waves-light mx-1 "
		>
			<i className="icon-glamping"></i>
			<span>Appeal In process</span>
		</button>
	);




	const gridDataMap = (e, isUTP) => {
		const hearingLength = e?.hearings?.length;
		let viewDocPic = ProfilePic; // Default value
		if (!props?.casesOnly || !props?.courtProduction) {
			if (e?.hearings?.length > 0 && e.hearings[hearingLength - 1]?.hearingDocuments) {
				viewDocPic = baseImageUrl + e.hearings[hearingLength - 1].hearingDocuments;
			} else if (e?.hearingDocuments) {
				viewDocPic = baseImageUrl + e.hearingDocuments;
			}
		}

		const mapObj = {
			prisonName: e?.prisonName || "",
			firNo: e?.firNo,
			firDate: validateDate(e?.firDate) || "",
			firYear: props?.courtProduction ? props.returnList ? e?.firYear : e?.cases[0].firYear : e.firYear,
			status: e?.status,
			policeStation: props?.courtProduction ? props.returnList ? e?.policeStation : e?.cases[0].policeStation : e?.policeStation,
			underSection: _(
				<div className="cursor-pointer"
					onClick={() =>
						handleShowDescModal(props.courtProduction ? props.returnList ? e?.underSections : e?.cases[0].underSections : e?.underSections, e.underSections)
					}
				>
					{getShortDescription(e, props) || "not added yet"}
				</div>
			),
		};

		if (props?.status === "Profile") {
			mapObj["attestedDocumentRelease"] = _(
				<div
					className="profile-td profile-td-hover form-check-label"
					onClick={() => {
						setShowDocImage(true),
							setViewDoc(e?.attestedDocumentRelease ? baseImageUrl + e?.attestedDocumentRelease : ProfilePic);
					}}
				>
					<img
						onError={(ev) => {
							ev.target.src = ProfilePic;
						}}
						className="avatar-xs rounded-circle "
						src={`${e?.attestedDocumentRelease ? baseImageUrl + e?.attestedDocumentRelease : ProfilePic}`}
						width="50"
					/>
				</div>
			);
		}


		if (props?.caseWarrant) {
			mapObj["hearingDocuments"] = _(
				<div
					className="profile-td profile-td-hover form-check-label"
					onClick={() => {
						setShowDocImage(true),
							setViewDoc(viewDocPic);
					}}
				>
					<img
						onError={(ev) => {
							ev.target.src = ProfilePic;
						}}
						className="avatar-xs rounded-circle "
						src={`${viewDocPic}`}
						width="50"
					/>
				</div>
			);
		}
		if (props.vakalatnama) {
			mapObj["vakalatnama"] = _(
				<div
					className="profile-td profile-td-hover form-check-label"
					onClick={() => {
						setShowDocImage(true),
							setViewDoc(e?.vakalatnama ? baseImageUrl + e?.vakalatnama : ProfilePic);
					}}
				>
					<img
						onError={(ev) => {
							ev.target.src = ProfilePic;
						}}
						className="avatar-xs rounded-circle "
						src={`${e?.vakalatnama ? baseImageUrl + e?.vakalatnama : ProfilePic}`}
						width="50"
					/>
				</div>
			);
		}

		if (!mapObj.prisonName) {
			delete mapObj.prisonName;
		}

		if (!isUTP) {
			mapObj['decisionAuthority'] = e.decisionAuthority;
			mapObj['sentenceDate'] = validateDate(e.sentenceDate) || "";
		}
		if (isUTP) {
			if (props.courtProduction && props.casesOnly) {
				mapObj['hearingDate'] = validateDate(props.returnList ? e?.nextHearingDate : e?.cases[0]?.nextHearingDate) || "";
			} else if (props.status === "Profile" || props.casesOnly) {
				mapObj['hearingDate'] = validateDate(e?.hearings[hearingLength - 1]?.nextHearingDate) || "";	
			} else {
				mapObj['hearingDate'] = validateDate(e?.nextHearingDate) || "";
			}

		}
		mapObj['Actions'] = _(
			<div className='action-btns'>
				{appealInProgressButton}
			</div>
		);

		if (props.status === 'Profile') {
			mapObj['Actions'] = _(
				<div className='action-btns'>
					<button
						id={'view-more=details-btn'}
						type='button'
						onClick={() => {
							props.handleDetailsBtn(e);
						}}
						className='tooltip btn btn-prim waves-effect waves-light mx-1'
					>
						<i className='icon-show-password'></i>
						<span>View More</span>
					</button>
					{props?.handleEditBtn && (e?.status != "Released in case") && (
					<button
						id={'edit-btn-diff'}
						type='button'
						className='tooltip btn btn-secondary waves-effect waves-light mx-1'
						onClick={() => props.handleEditBtn(e)}
					>
						<i className='icon-edit'></i>
							<span>Edit</span>
						</button>
					)}
					{e.appealInProgress === "Yes"  && appealInProgressButton}
				</div>
			);
		} else if (props.status === 'Remission' || props.status === 'Hearing') {

			mapObj['Actions'] = _(
				<div className='action-btns'>
					{e.appealInProgress && appealInProgressButton}
					{(e.status === 'Convicted case' ||
						props.status === 'Hearing') && (
							<button
								id={'add-btn-h-r'}
								type='button'
								onClick={() => {
									props.onClick(e, true);
								}}
								className={`${props.status === 'Hearing' && 'tooltip'
									} btn btn-success waves-effect waves-light mx-1`}
							>
								{/* {props.btnTitle || 'Remission'} */}
								{props.status === 'Hearing' ? (
									<>
										<i className='icon-file'></i>
										<span>{props.btnTitle}</span>
									</>
								) : (
									'Remission'
								)}
							</button>
						)}
					<button
						id={'view-more-diff'}
						type='button'
						onClick={() => {
							props.handleDetailsBtn(e);
						}}
						className='tooltip btn btn-prim waves-effect waves-light'
					>
						<i className='icon-show-password'></i>
						<span>View More</span>
					</button>
					{props.returnList && (
						<>
							{props?.utp && (
								<button className='tooltip btn btn-prim  waves-effect waves-light' type='button' onClick={() => handleConvict(e)}>
									<i className='icon-toolkit'></i>
									<span>Convicted</span>
								</button>
							)}
							{!props?.utp && (
								<>
									{e.appealInProgress && (
										<button className='tooltip btn btn-prim  waves-effect waves-light' type='button' onClick={() => handleDeclineAppeal(e)}>
											<i className='icon-toolkit'></i>
											<span>Deny Appeal</span>
										</button>)}
									<button className='tooltip btn btn-prim  waves-effect waves-light' type='button' onClick={() => handleRetrial(e)}>
										<i className='icon-toolkit'></i>
										<span>Start Retrail</span>
									</button>
								</>
							)}

							<button className='tooltip btn btn-prim waves-effect waves-light' type='button' onClick={() => handleRelease(e)}>
								<i className='icon-release'></i>
								<span>Released</span>
							</button>
						</>
					)}
				</div>
			);
		} else {
			mapObj['Actions'] = _(
				<div className='action-btns'>
					{e.appealInProgress && appealInProgressButton}
					{e.status != "Released in case" && e.status != "Convicted Case" && (
						<>
						{props?.handleEditBtn && (
							<button
								id={'edit-btn-diff'}
								type='button'
								className='tooltip btn btn-secondary waves-effect waves-light mx-1'
								onClick={() => props.handleEditBtn(e)}
							>
								<i className='icon-edit'></i>
								<span>Edit</span>
							</button>
						)}
							<button
								id={'delete-btn-diff'}
								type='button'
								onClick={() => {
									props.handleDelBtn(e);
								}}
								className='tooltip btn btn-success waves-effect waves-light mx-1'
							>
								<i className='icon-delete'></i>
								<span>Delete</span>
							</button>
						</>
					)}
					<button
						id={'view-more-btn-diff'}
						type='button'
						onClick={() => {
							props.handleDetailsBtn(e);
						}}
						className='tooltip btn btn-prim waves-effect waves-light mx-1'
					>
						<i className='icon-show-password'></i>
						<span>View More</span>
					</button>
				</div>
			);
		}
		return mapObj;
	};


	const handleConvict = (prionser) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to Convict this prisoner',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Convicted it!',
			cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {
			if (willDelete) {
				try {
					const escaped = await postData(`/services/app/CourtProduction/ConvictAfterHearing?prisonerId=${prionser.prisonerId}&hearingId=${prionser.hearingId}`)
					if(escaped.success){
						swal("Prisoner has been convicted", "", "success");
						props.loadRealtimeCases();
					}else{
						swal("Error", escaped?.error?.message || "Something went wrong", "error");	
					}
				} catch (error) {
					swal("Error", error.message || "Something went wrong", "error");

				}
			}
		});

	}

	const handleDeclineAppeal = (prionser) => {
		const appealId = prionser?.currentAppeal?.id;
		swal({
			title: 'Are you sure?',
			text: 'You want to Decline the Appeal of this prisoner',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Declined it!',
			cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {
			if (willDelete) {
				try {
					const declineResponse = await postData(`/services/app/PrisonerRelease/FinishAppealInCase?appealId=${appealId}&caseId=${prionser.caseId}&apprroved=false`)
					if (!declineResponse.success) {
						swal("Error", declineResponse.error.message || "Something went wrong", "error");
					}else{
						swal("Prisoner Appeal has been declined", "", "success");
						props.loadRealtimeCases();
					}
					
				} catch (error) {
					swal("Error", error.message || "Something went wrong", "error");

				}
			}
		});

	}

	const handleRelease = (prionser) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to Release this prisoner',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Released it!',
			cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {
			if (willDelete) {
				try {
					const escaped = await postData(`/services/app/CourtProduction/ReleaseAfterHearing?prisonerId=${prionser.prisonerId}&hearingId=${prionser.hearingId}`)
					if(escaped.success){
						swal("Prisoner has been released", "", "success");
						props.loadRealtimeCases();
					}else{
						swal("Error", escaped?.error?.message || "Something went wrong", "error");	
					}
				} catch (error) {
					swal("Error", error.message || "Something went wrong", "error");

				}


			}
		});

	}

	const handleRetrial = (prionser) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to Start Retrial of this prisoner',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Start it!',
			cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {
			if (willDelete) {
				try {
					const escaped = await postData(`/services/app/CourtProduction/RetrialAfterHearing?prisonerId=${prionser.prisonerId}&hearingId=${prionser.hearingId}`)
					if(escaped.success){
						swal("Prisoner retrial has started", "", "success");
						props.loadRealtimeCases();
					}else{
						swal("Error", escaped?.error?.message || "Something went wrong", "error");	
					}
				} catch (error) {
					swal("Error", error.message || "Something went wrong", "error");
				}
			}
		});

	}

	return (
		<>
			<DescriptionModal
				show={showDescModal}
				handleClose={() => setShowDescModal(false)}
				description={modalContent}
				title={modalTitle}
			/>
			<Modal show={showDocImage} size='lg'>
				<Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
				</Modal.Header>
				<Modal.Body>
					<div className="profile-td profile-td-hover">
						<img
							onError={(ev) => {
								ev.target.src = ProfilePic;
							}}
							src={`${viewDoc
								}`}
							width="500"
							height="500"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
						Download
					</button>
					<button
						id={'cancel-btn'}
						className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
						onClick={closeDocImage}
					>
						Close
					</button>
				</Modal.Footer>
			</Modal>
			<div className='row gridjs'>
				<div className='col-xl-12 p-0'>
					<div className=' '>
						<div className='row '>
							<div
								className='col'
								style={{ height: 'auto', width: '100%' }}
							>
								<Grid
									ref={gridRef}
									data={
										props?.dependents
											? props.data
											: transformDataForTableGrid(
												props?.data?.map(e =>
													gridDataMap(
														e,
														props?.utp
													)
												)
											)
									}
									columns={Object.keys(props?.columnData)}
									search={true}
									sort={true}
									pagination={{
										enabled: true,
										limit: 10
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

export default DetailsGrid;
