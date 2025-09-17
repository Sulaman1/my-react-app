const PrisonerAddress = ({ address }) => {
	const isPakistanPermanent = !address?.permanentAddress?.cityId ? false : true
	const isPakistanPresent = !address?.presentAddress?.cityId ? false : true

	return (
		<>
		<div className='table-main'>
				<div className='hover-card'>
					<h4 class="third-heading heading">Prisoner Permanent Address</h4>
					<div id='pagination-list'>
						<div class='d-flex just-space mx-n3'>
							<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Country :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														address?.permanentAddress?.country
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												District :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPermanent ? 'other' : address?.permanentAddress?.district
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Street Address :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPermanent ? 'other' : address?.permanentAddress?.streetAddress
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Province :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPermanent ? 'other' : address?.permanentAddress?.province
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												City :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPermanent ? 'other' : address?.permanentAddress?.city
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
			</div>
			<div className='table-main'>
				<div className='hover-card'>
					<h4 class="third-heading heading">Prisoner Present Address</h4>
					<div id='pagination-list'>
						<div class='d-flex just-space mx-n3'>
							<ul class='list col-xl-12 list-group list-group-flush colm-2-tabel mb-0'>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Country :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														address?.presentAddress?.country
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												District :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPresent ? 'other' : address?.presentAddress?.district
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Street Address :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPresent ? 'other' : address?.presentAddress?.streetAddress
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												Province :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPresent ? 'other' : address?.presentAddress?.province
													}
												</p>
											</div>
										</div>
									</div>
								</li>
								<li class='list-group-item'>
									<div class='d-flex align-items-center pagi-list'>
										<div class='flex-grow-1 overflow-hidden'>
											<h5 class='dynamic-key'>
												City :{' '}
											</h5>
										</div>
										<div class='flex-shrink-0 ms-2'>
											<div>
												<p class='dynamic-value'>
													{
														isPakistanPresent ? 'other' : address?.presentAddress?.city
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
			</div>
			
		</>
	);
};

export default PrisonerAddress;
