import React, { Fragment, useState } from 'react';

import { formatDate, validateDate } from '../../../common/Helpers';
import DescriptionModal from '../../../common/DescriptionModal';

const CaseInfoCard = ({ caseInfo, isUTP }) => {
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState({ title: '', description: '' });

	const handleShowMore = (title, description) => {
		setModalContent({ title, description });
		setShowModal(true);
	};

	const truncateText = (text, limit = 100) => {
		if (!text) return '';
		if (text.length <= limit) return text;
		return text.slice(0, limit) + '...';
	};

	return (
		<>
			<div className='table-main'>
				<div className=''>
					<h4 className='third-heading db-heading mb-2'>Basic Information</h4>
					<div id='pagination-list'>
						<ul class='ui-table-card'>
							<li class='single-card'>
								<div className='icon'><i className='icon-office'></i></div>
								<div>
									<h3 class='fs-16 dynamic-value mb-1'>
										{
											caseInfo.policeStationId
										}
									</h3>
									<p className='born dynamic-key fs-14 timestamp md-0'>
										Police Stations
									</p>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-file'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										FIR No:
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{caseInfo.firNo}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-event'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										FIR Year:
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{
											caseInfo.firYear
										}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-event'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										FIR Date:
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{validateDate(caseInfo?.firDate)}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-historical'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Production/ warrant date:
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{validateDate(caseInfo?.firDate)}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-historical'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Sections:
									</p>
									{/* {caseInfo.sections?.map(
										s => (
											<h3
												key={
													s +
													Math.random().toString()
												}
												class='fs-16 mb-1 dynamic-value'
											>
												{s}
											</h3>
										)
									)} */}
									<h3 class='fs-16 mb-1 '>
										{
											caseInfo?.underSections
										}
									</h3>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className=''>
					<h4 className='third-heading db-heading mb-2 mt-5'>Prisoner Case Information</h4>
					<div id='pagination-list'>
						<ul class='ui-table-card'>
							{!isUTP && (
								<Fragment>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Decision
												Authority:
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{
													caseInfo.decisionAuthorityId
												}
											</h3>
										</div>
									</li>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Decision
												Date:{' '}
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{validateDate(caseInfo?.decisionDate)}
											</h3>
										</div>
									</li>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Sentence:{' '}
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{
													caseInfo.sentenceString
												}
											</h3>
										</div>
									</li>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Sentence
												Date:{' '}
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{validateDate(caseInfo?.sentenceDate)}
											</h3>
										</div>
									</li>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Probable
												Release
												Date:{' '}
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{validateDate(caseInfo?.probableDateOfRelase)}
											</h3>
										</div>
									</li>
									<li class='single-card'>
										<div className='icon'><i className='icon-historical'></i></div>
										<div>
											<p className='dynamic-key fs-14 timestamp md-0'>
												Court Fine:{' '}
											</p>
											<h3 class='fs-16 mb-1 dynamic-value'>
												{
													caseInfo.courtFine
												}
											</h3>
										</div>
									</li>
								</Fragment>
							)}
							<li class='single-card'>
								<div className='icon'><i className='icon-court'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Remanding Court:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{caseInfo?.hearings?.remandingCourt}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-court'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Trial Court:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{caseInfo?.hearings?.court}
									</h3>
								</div>
							</li>
							{isUTP && <li class='single-card'>
								<div className='icon'><i className='icon-chat'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Remarks:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{truncateText(caseInfo?.remarks)}
										{caseInfo?.remarks?.length > 100 && (
											<button 
												className="btn btn-link p-0 ms-2"
												onClick={() => handleShowMore('Remarks', caseInfo.remarks)}
											>
												Show More
											</button>
										)}
									</h3>
								</div>
							</li>}
							<li class='single-card'>
								<div className='icon'><i className='icon-manager'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Judge:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{caseInfo?.hearings?.judge}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-event'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Last Hearing Date:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{validateDate(caseInfo?.hearings?.lastHearingDate)}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-event'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Next Hearing Date:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{validateDate(caseInfo?.hearings?.nextHearingDate) || "Next hearing not added yet"}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-event'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Release Date:{' '}
									</p>
									<h3 class='fs-16 mb-1 dynamic-value'>
										{validateDate(caseInfo?.dateOfRelase) || "Not Released Yet"}
									</h3>
								</div>
							</li>
							<li class='single-card'>
								<div className='icon'><i className='icon-file'></i></div>
								<div>
									<p className='dynamic-key fs-14 timestamp md-0'>
										Other remarks (Sentence Changes/Remarks):{' '}
									</p>
									<h3 class='fs-16 mb-1 text-dark'>
										<b>
											{truncateText(caseInfo?.remarks)}
											{caseInfo?.remarks?.length > 100 && (
												<button 
													className="btn btn-link p-0 ms-2"
													onClick={() => handleShowMore('Other Remarks', caseInfo.remarks)}
												>
													Show More
												</button>
											)}
										</b>
									</h3>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<DescriptionModal
				show={showModal}
				handleClose={() => setShowModal(false)}
				description={modalContent.description}
				title={modalContent.title}
			/>
		</>
	);
};

export default CaseInfoCard;
