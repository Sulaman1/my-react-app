import { getItemFromList, validateDate } from "../../../common/Helpers";

const PrisonerPersonal = ({ data, medical, lookups }) => {
	const {
		personalInfo,
		prisonerAdmission,
		contactInfo,
		prisonerNumber,
		professionalInfo
	} = data;
	

	const medicalData = medical
	console.log('data: ', data);
	const utpNumber = `${prisonerNumber?.category}-${prisonerNumber?.prsNumber}`;
	return (
		<>
			<div className='table-main'>
				<div className="hover-card">
					<h4 className='third-heading heading'>
						Personal Information
					</h4>
					<div id='pagination-list'>
						<div class='d-flex just-space mx-n3'>
							<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Prisoner Name:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														data?.prisonerBasicInfo?.fullName || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Grand Father Name:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{personalInfo?.grandFatherName ||
														'N/A'}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												DOB:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{validateDate(personalInfo?.dateOfBirth) || 'N/A'}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												CNIC:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														data?.prisonerBasicInfo?.cnic || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Gender:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.gender || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Marital Status:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.maritalStatus || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Caste:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.caste || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Religion:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.religion || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Sect:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{personalInfo?.sect ||
														'N/A'}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Relationship
												Type:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														data?.prisonerBasicInfo?.relationshipType || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Relationship
												Name:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														data?.prisonerBasicInfo?.relationshipName || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Brother's Name:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.brotherName || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Nationality:
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.nationality || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												High Profile:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{data?.highProfile === true ? "Yes" : "No" || "N/A"}
												</p>
											</div>
										</div>
									</div>
								</li>

								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Occupation:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														professionalInfo?.occupation || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Mobile Number:{' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														contactInfo?.mobileNumber || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex justify-content-between  w-100 pagi-list'>
										<div class=' overflow-hidden w-50'>
											<h5 class='fs-13 mb-1 dynamic-key'>
											Official ID No: (For Foreigners Only){' '}
											</h5>
										</div>
										<div class='ms-2 w-50'>
											<div>
												<p class='dynamic-value text-left'>
													{
														personalInfo?.passportNumber || 'N/A'
													}
												</p>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="hover-card">
					<h4 className='third-heading heading'>
						Prisoner Information
					</h4>
					<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='dynamic-key'>
										Prison Name:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{
												prisonerNumber?.prison || 'N/A'
											}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Prisoner
										Category:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{
												prisonerNumber?.category || 'N/A'
											}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
									Crime Type:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{
												data?.crimeType
												|| 'N/A'
											}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Prisoner Type:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.prisonerType ||
												'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Prisoner Sub
										Type:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.prisonerSubType ||
												'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										UTP Number
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{utpNumber || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Has Opposition
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.hasOpposition ? "Yes" : "No" || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
									Appeal In Progress
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.appealInProgress ? "Yes" : "No" || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Habbitual
										Offender:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.habitualOffender ? 'Yes' : 'No' || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										PWID:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.medicalInfo?.pwid ? 'Yes' : 'No' || "N/A"}
										</p>
									</div>
								</div>
							</div>
						</li>
						{prisonerNumber?.category === "Convict" && (
							<li class='list-group-item'>
								<div class='d-flex justify-content-between  w-100 pagi-list'>
									<div class=' overflow-hidden w-50'>
										<h5 class='fs-13 mb-1 dynamic-key'>
											Conviction Date:{' '}
										</h5>
									</div>
									<div class='ms-2 w-50'>
										<div>
											<p class='dynamic-value text-left'>
												{prisonerAdmission?.convictionDate?.slice(
													0,
													10
												) || 'N/A'}
											</p>
										</div>
									</div>
								</div>
							</li>
						)}
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Banned Outfit:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.bannedOrganizations?.trim() ||
												'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Admission Date:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{validateDate(prisonerAdmission?.admissionDate) || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Prisoner Class:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.prisonerClass || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Legal
										Assistance:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.advancedInfo?.legalAssistance == true ? 'Yes' : 'No' || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Legal Assistance
										Details:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{
												data?.advancedInfo?.legalAssistanceDetails || "N/A"
											}
										</p>
									</div>
								</div>
							</div>
						</li>
						
					</ul>
				</div>
				<div className="hover-card">
					<h4 className='third-heading heading'>
						Physical Information
					</h4>
					<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Height:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{medicalData?.height || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Weight:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{medicalData?.weight || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Mark of
										Identification
										1:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{medicalData?.markOfIdentification ||
												'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Addict:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{data?.medicalInfo?.addict ? "Yes" : "No" || 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
						<li class='list-group-item'>
							<div class='d-flex justify-content-between  w-100 pagi-list'>
								<div class=' overflow-hidden w-50'>
									<h5 class='fs-13 mb-1 dynamic-key'>
										Mark of
										Identification
										2:{' '}
									</h5>
								</div>
								<div class='ms-2 w-50'>
									<div>
										<p class='dynamic-value text-left'>
											{medicalData?.markOfIdentification2 ||
												'N/A'}
										</p>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>


				{/* //dependents */}
				{data?.dependents && data.dependents.length > 0 && (
					<div className="hover-card border-0">
						<h4 className='third-heading heading'>
							Dependents Information
						</h4>
						{data.dependents.map((dependent, index) => (
							<div key={index} className=" border-0">
								<ul className='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Name:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.name || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Relationship:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.relationship || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Age Category:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.ageCategoryString || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Date of Birth:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.dateOfBirth || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Gender:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.gender || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='d-flex justify-content-between w-100 pagi-list'>
											<div className='overflow-hidden w-50'>
												<h5 className='fs-13 mb-1 dynamic-key'>
													Other Details:{' '}
												</h5>
											</div>
											<div className='ms-2 w-50'>
												<div>
													<p className='dynamic-value text-left'>
														{dependent.otherDetails || 'N/A'}
													</p>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</div>
						))}
					</div>
				)}

			</div>
		</>
	);
};

export default PrisonerPersonal;
