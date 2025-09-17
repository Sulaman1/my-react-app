// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
//import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { transformData } from '../../../common/Helpers';
import { getData } from '../../../services/request';
import { lookupName } from '../../admin/system-settings/lookupNames';
import ViewCheckInOut from './circleoffice/checkinout/ViewCheckInOut';
//import { handleUrlRedirect } from '../../../common/Common';
/*
	Add missing fields check usama video
*/
const ManageCheckoutCheckin = () => {
	const [activetab, setActiveTab] = useState(0);
	const [checkReasons, setCheckReasons] = useState([]);
	const userMeta = useSelector(state => state.user);
	const isAdmin =
		userMeta.role === 'Admin' || userMeta.role === 'Super Admin';
	const isSp = userMeta.role === 'Prison Superintendent'
	const show = useSelector((state) => state.language.urdu)
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	const isDSP = userMeta.role === "Prison DSP";

	// useEffect(() => {
	// 		const reasons = transformData(newLookups?.checkReason);
	// 		console.log('reasons: ', reasons);
	// 		setCheckReasons(reasons);
	// 		// simple handle of tab when click from notification
	// 		const tabIndex = handleUrlRedirect();
	// 		setActiveTab(tabIndex);
	// }, []);



	return (
		<>
			<div className='row'>
				<div className='row flex'>
					<h4 className='third-heading  just-space '>
						{!(isSp || isDSP) && <span>Checkin/Checkout</span>}
						{(isSp || isDSP) &&<span>Approvals</span>}
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						{(isAdmin ||
							userMeta.role === 'Prison UTP Branch' ||
							userMeta.role === 'Prison Convict Branch') && (
								<Tab
									className='nav-item  nav-link'
									onClick={() => {
										setActiveTab(0);
									}}
								>
									Generate Checkout Request {show && (<label className='urdu-font'>(درخواست برائے چیک آوٹ)</label>)}
								</Tab>
							)}

						{(isAdmin ||
							userMeta.role === 'Prison Circle Office') && (
								<Tab
									className='nav-item  nav-link'
									onClick={() => {
										setActiveTab(isAdmin ? 1 : 0);
									}}
								>
									Check Out By Circle Office {show && (<label className='urdu-font'>(سرکل آفس سے چیک آؤٹ کریں۔)</label>)}
								</Tab>
							)}

						{(isAdmin || userMeta.role === 'Darban') && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(isAdmin ? 2 : 0);
								}}
							>
								Check Out By Darban {show && (<label className='urdu-font'>(دربان سے چیک آوٹ کریں)</label>)}
							</Tab>
						)}
						{(isAdmin || userMeta.role === 'Darban') && (
							<Tab
								className='nav-item nav-link'
								onClick={() => {
									setActiveTab(isAdmin ? 3 : 1);
								}}
							>
								 check-in {show && (<label className='urdu-font'>(دربان سے چیک ان کریں)</label>)}
							</Tab>
						)}
						{(isAdmin ||
							userMeta.role === 'Prison Circle Office') && (
								<Tab
									className='nav-item  nav-link'
									onClick={() => {
										setActiveTab(isAdmin ? 4 : 1);
									}}
								>
									Check In By Circle Office {show && (<label className='urdu-font'>(سرکل آفس  سے چیک ان کریں۔)</label>)}
								</Tab>
							)}
						{(isSp || isDSP || isAdmin) && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab( isAdmin ? 5 : 1);
								}}
							>
								{isAdmin ? (
									<>
										<span>Sp Approvals</span>  {show && (<label className='urdu-font'>(ایس پی کی منظوری)</label>)}
									</>
								) :
									<>
										<span>Approvals</span>  {show && (<label className='urdu-font'>(منظوری)</label>)}
									</>
								}
							</Tab>
						)}
					</TabList>
					<div className='card'>
						<div className='card-body'>
							{(isAdmin ||
								userMeta.role === 'Prison UTP Branch' ||
								userMeta.role === 'Prison Convict Branch') && (
									<TabPanel>
										<ViewCheckInOut
											class='custom-moadal'
											checkReasons={checkReasons}
											setActiveTab={setActiveTab}
											getURL='SearchCheckedInEntries'
											secondGetUrl='SearchCheckedOutRequestedEntries'
											apiEndpoint='CreateUpdateCheckOutRequest'
											swalText='Successfully generated request for checkout.'
											text='Generate'
											btnText='Request Checkouts'
											subTitle='Available Prisoners'
											subTitle2='Other Checkout Requests'
											modalHeader='Generate Checkout Request'
											tabTitle='Generate Checkout Request'
										/>
									</TabPanel>
								)}

							{(isAdmin ||
								userMeta.role === 'Prison Circle Office') && (
									<TabPanel>
										<ViewCheckInOut
											tabPos={isAdmin ? 2 : 1}
											setActiveTab={setActiveTab}
											getURL='SearchToBeCheckOutByCircleOffice'
											secondGetUrl='SearchCheckedOutByCircleOffice'
											apiEndpoint='CreateUpdateCheckOut'
											swalText='Successfully checked out by circle office.'
											subTitle='Other Checkout Requests'
											subTitle2='Checked Out'
											tabTitle='Checkout Request by CO'
										/>
									</TabPanel>
								)}
							{(isAdmin || userMeta.role === 'Darban') && (
								<TabPanel>
									<ViewCheckInOut
										tabPos={isAdmin ? 3 : 1}
										setActiveTab={setActiveTab}
										getURL='SearchToBeCheckOutByDarbanEntries'
										secondGetUrl='SearchCheckedOutByDarban'
										apiEndpoint='CreateUpdateCheckOutDarban'
										swalText='Successfully checked out by darban.'
										subTitle='Other Checkout Requests'
										subTitle2='Checked Out'
										tabTitle='Checkout Request by Darban'
										releaseTitle='Release Checkout Requests'
										isReleaseGridShow={true}
										checkIn={true}
										isShowHearingStats={true}
										headerTitle="Checkout Information"
										policeOfficer
									/>
								</TabPanel>
							)}
							{(isAdmin || userMeta.role === 'Darban') && (
								<TabPanel>
									<ViewCheckInOut
										tabPos={isAdmin ? 4 : 2}
										setActiveTab={setActiveTab}
										getURL='SearchToBeCheckInByDarbanEntries'
										secondGetUrl='SearchCheckedInByDarbanEntries'
										apiEndpoint='CreateUpdateCheckInDarban'
										swalText='Successfully checked in by darban.'
										subTitle='Other Checkin Requests'
										subTitle2='Checked In'
										isReleaseGridShow={true}
										tabTitle='Checkin by Darban'
										policeOfficer
										showEscaped={true}
										isShowHearingStats={true}
										headerTitle="Checkin Information"
									/>
								</TabPanel>
							)}
							{(isAdmin ||
								userMeta.role === 'Prison Circle Office') && (
									<TabPanel>
										<ViewCheckInOut
											tabPos={isAdmin ? 5 : 2}
											setActiveTab={setActiveTab}
											getURL='SearchCheckedInByDarbanEntries'
											secondGetUrl={'SearchCheckedInEntries'}
											apiEndpoint='CreateUpdateCheckIn'
											swalText='Successfully checked in by circle office.'
											subTitle='Other Checkin Requests'
											subTitle2='Checked In'
											tabTitle='Checkin by CO'
										/>
									</TabPanel>
								)}
							{(isSp || isDSP || isAdmin) && (
								<TabPanel>
									<ViewCheckInOut
										tabPos={isAdmin ? 6 : 1 }
										setActiveTab={setActiveTab}
										getURL='SearchToBeApprovedBySp'
										secondGetUrl='SearchApprovedBySP'
										apiEndpoint='ApproveSp'
										swalText='Successfully Approved'
										subTitle='To Be Approved'
										subTitle2='Approved'
										tabTitle='Checkin by sp'
										isSp={true}
									/>
								</TabPanel>
							)}
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageCheckoutCheckin;
