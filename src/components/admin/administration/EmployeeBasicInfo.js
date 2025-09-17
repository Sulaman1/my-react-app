import React from 'react'
import moment from 'moment-mini';



const EmployeeBasicInfo = ({ details, genderData, nationalityData, maritalStatus, casteData, religionData }) => {
	return (
		<>

			<div className='table-main'>
				<div className="hover-card">
					<h4 className='third-heading heading'>
						User Personal Information
					</h4>
					<div id='pagination-list'>
						<div class='d-flex just-space mx-n3'>
							<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Full Name:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{details?.personalInfo?.fullName}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
											Relationship Type:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{details?.personalInfo?.relationshipType}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
											Relation Name:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{details?.personalInfo?.relationshipName}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Grand Father Name:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{details?.personalInfo?.grandFatherName}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Nationality:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{nationalityData?.name}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Marital Status:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{maritalStatus?.name}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Gender:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{genderData?.name}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												CNIC:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{details?.personalInfo?.cnic}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Cast:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{casteData?.name}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Date Of Birth:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{moment(new Date(details?.personalInfo?.dateOfBirth).toDateString()).format('L')}</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='fs-13 mb-1 dynamic-key'>
												Religion:{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>{religionData?.name}</p>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>


		</>
	)
}

export default EmployeeBasicInfo