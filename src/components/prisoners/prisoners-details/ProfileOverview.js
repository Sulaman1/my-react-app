import React, { useState } from 'react';
import FingerSlider from './FingerSlider';
import PrisonerPersonal from './PrisonerPersonal';
import { validateDate } from '../../../common/Helpers';
import { Link } from 'react-router-dom';
import PrisonerGallery from '../Components/PrisonerGallery';
const ProfileOverview = ({ personalData, lookups }) => {
	const medical = personalData?.medicalInfo
	const educationn = personalData.professionalInfo
	const previousImages = personalData?.biometricInfo?.prisonerGallery || [];
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			{previousImages?.length && (
			<PrisonerGallery showModal={showModal} setShowModal={setShowModal}  viewDoc={previousImages}/>
			)}
			<div className="row">
				<div className="col-xxl-3">
					<div className="card pb-5">
						<div className="card-body">
							<h3 className="card-title mb-3">Biometric Information</h3>
							<div className="row g-4 just-center">
								<div className="col-auto">
									<div className="avatar-xl">
										<FingerSlider prisonerData={personalData} />
										<a className="bio-view-gallery" style={{textAlign: "center",display: "block" ,width: "120px",padding: "20px 0", fontSize: "15px", cursor: "pointer", marginTop: "10px"}} onClick={()=>{setShowModal(!showModal)}}>View Gallery</a>

									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<h5 className="card-title mb-3">Basic Information</h5>
							<div className="table-responsive">
								<table className="table table-borderless mb-0">
									<tbody>
										<tr>
											<th className="ps-0" scope="row">Full Name :</th>
											<td className="text-muted">{personalData?.prisonerBasicInfo?.fullName}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Grand Father Name :</th>
											<td className="text-muted">{personalData?.personalInfo?.grandFatherName}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Relationship Type :</th>
											<td className="text-muted">{personalData?.prisonerBasicInfo?.relationshipType}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Relationship Name :</th>
											<td className="text-muted">{personalData?.prisonerBasicInfo?.relationshipName}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Emergency Phone No:</th>
											<td className="text-muted">{personalData?.contactInfo?.phoneNumber}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Location :</th>
											<td className="text-muted">{personalData?.presentAddress?.city}</td>
										</tr>
										<tr>
											<th className="ps-0" scope="row">Admission Date</th>
											<td className="text-muted">{validateDate(personalData?.prisonerAdmission?.admissionDate) || 'N/A'}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div className='btns flex'>
					<Link
						to={{
							pathname: "/admin/print-details",
							state: { stateParam: { personalData, medical, lookups, ignoreRedirect: true } }
						}}
					>
						<button type="button" className="btn btn-info btn-label my-2">
							<i className="icon-file label-icon align-middle fs-16 me-2"></i> print
						</button>
						
					</Link>
					{personalData?.prisonerNumber?.category === "Convict" &&(
					<Link
						to={{
							pathname: "/admin/history-ticket",
							state: { stateParam: { personalData, medical, lookups } }
						}}
					>
						<button type="button"  className="btn btn-info btn-label my-2">
							<i className="icon-file label-icon align-middle fs-16 me-2"></i> History Ticket
						</button>
					</Link>
					)}
					
					</div>

				</div>
				<div className="col-xxl-9">
					<div className="card">
						<div className="card-body">
							<div className='row'>
								<div className="col-xxl-4 col-sm-6">
									<div className="card list-box profile-project-card shadow-none profile-project-danger">
										<div className="card-body p-4">
											<div className="d-flex">
												<div className="flex-grow-1 text-muted overflow-hidden">
													<h5 className="fs-14 text-truncate"><a href="#" className="text-dark">Number Of Cases</a></h5>
													<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"> </span></p>
												</div>
												<div className="flex-shrink-0 ms-2">
													<div className="badge badge-soft-info fs-20">{personalData?.prisonerCase?.length}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xxl-4 col-sm-6">
									<div className="card list-box profile-project-card shadow-none profile-project-warning">
										<div className="card-body p-4">
											<div className="d-flex">
												<div className="flex-grow-1 text-muted overflow-hidden">
													<h5 className="fs-14 text-truncate"><a href="#" className="text-dark">Number of dependents</a></h5>
													<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"></span></p>
												</div>
												<div className="flex-shrink-0 ms-2">
													<div className="badge badge-soft-warning fs-20">{personalData?.dependents?.length}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xxl-4 col-sm-6">
									<div className="card list-box profile-project-card shadow-none profile-project-success">
										<div className="card-body p-4">
											<div className="d-flex">
												<div className="flex-grow-1 text-muted overflow-hidden">
													<h5 className="fs-14 text-truncate"><a href="#" className="text-dark">Barracks Alloted</a></h5>
													<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"> </span></p>
												</div>
												<div className="flex-shrink-0 ms-2">
													<div className="badge badge-soft-success fs-20">{personalData?.prisonerAccommodation?.length}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<h4 className='third-heading heading'>
									Prisoner Education Details
								</h4>
								<div className='row'>
									<div className="col-xxl-4 col-sm-6">
										<div className="card list-box profile-project-card shadow-none profile-project-danger">
											<div className="card-body p-4">
												<div className="d-flex">
													<div className="flex-grow-1 text-muted overflow-hidden">
														<h5 className="fs-16 text-truncate"><a href="#" className="text-dark">Formal Education :</a></h5>
														<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"> </span></p>
													</div>
													<div className="flex-shrink-0 ms-2">
														<div className="badge badge-soft-info fs-15">{
															educationn?.formalEducation
														}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xxl-4 col-sm-6">
										<div className="card list-box profile-project-card shadow-none profile-project-warning">
											<div className="card-body p-4">
												<div className="d-flex">
													<div className="flex-grow-1 text-muted overflow-hidden">
														<h5 className="fs-16 text-truncate"><a href="#" className="text-dark">Religious Education :</a></h5>
														<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"></span></p>
													</div>
													<div className="flex-shrink-0 ms-2">
														<div className="badge badge-soft-warning fs-15">{
															educationn?.religiousEducation
														}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xxl-4 col-sm-6">
										<div className="card list-box profile-project-card shadow-none profile-project-success">
											<div className="card-body p-4">
												<div className="d-flex">
													<div className="flex-grow-1 text-muted overflow-hidden">
														<h5 className="fs-16 text-truncate"><a href="#" className="text-dark">Technical Education :</a></h5>
														<p className="text-muted text-truncate mb-0"><span className="fw-semibold text-dark"> </span></p>
													</div>
													<div className="flex-shrink-0 ms-2">
														<div className="badge badge-soft-success fs-15">{
															educationn?.technicalEducation
														}</div>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>

							</div>

						</div>
					</div>
					<div className="row">



						<PrisonerPersonal data={personalData} medical={medical} lookups={lookups} />

					</div>
				</div>
			</div>

		</>
	);
	
};
export default ProfileOverview;
