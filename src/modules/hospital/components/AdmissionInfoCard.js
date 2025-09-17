import { validateDate } from '../../../common/Helpers';

const AdmissionInfoCard = ({ data, title }) => {

	return (
		<>
			<div className='card'>
				<div className='card-body'>
					<h4 className='third-heading'>{title}</h4>
					<div className='row d-flex '>
						<div class='col-lg-12'>
							<div class='card-body'>
								<div id='pagination-list'>
									<div class='d-flex just-space mx-n3'>
										<ul class='list col-xl-12 list-group list-group-flush grid-5-5 mb-0'>
											<li class='list-group-item'>
												<div class='d-flex align-items-center pagi-list'>
													<div class='flex-grow-1 overflow-hidden'>
														<p className='dynamic-key'>
															Admission Date (داخلہ کی تاریخ)
														</p>
													</div>
													<div class='flex-shrink-0 ms-2'>
														<div>
															<h3 class='dynamic-value'>
																{validateDate(
																	data.admissionDate
																)}
															</h3>
														</div>
													</div>
												</div>
											</li>
											<li class='list-group-item'>
												<div class='d-flex align-items-center pagi-list'>
													<div class='flex-grow-1 overflow-hidden'>
														<p className='dynamic-key'>
															Discharge Date (باہر نکلنے کی تاریخ)
														</p>
													</div>
													<div class='flex-shrink-0 ms-2'>
														<div>
															<h3 class='dynamic-value'>
																{validateDate(
																	data.dischargeDate
																)}
															</h3>
														</div>
													</div>
												</div>
											</li>
											<li class='list-group-item'>
												<div class='d-flex align-items-center pagi-list'>
													<div class='flex-grow-1 overflow-hidden'>
														<p className='dynamic-key'>
															Disease (بیماریاں)
														</p>
													</div>
													<div class='flex-shrink-0 ms-2'>
														<div>
															<h3 class='dynamic-value'>
																{data.disease}
															</h3>
														</div>
													</div>
												</div>
											</li>
											<li class='list-group-item'>
												<div class='d-flex align-items-center pagi-list'>
													<div class='flex-grow-1 overflow-hidden'>
														<p className='dynamic-key'>
															Special Diet (خصوصی خوراک)
														</p>
													</div>
													<div class='flex-shrink-0 ms-2'>
														<div>
															<h3 class='dynamic-value'>
																{
																	data.specialDiet
																}
															</h3>
														</div>
													</div>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdmissionInfoCard;
