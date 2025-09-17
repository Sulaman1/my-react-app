import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import { handleUrlRedirect } from "../../../../common/Common";
import ViewVisitorListing from './ViewVisitorListing';
import RetrialApprovalPrisonerList from '../../../../modules/retrialManagement/RetrialApprovalPrisonerList';

const ManageVisitors = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	// useEffect(() => {
	// 	// simple handle of tab when click from notification
	// 	const tabIndex = handleUrlRedirect();
	// 	setActiveTab(tabIndex);
	//   }, []);

	  const userMeta = useSelector((state) => {
		return state.user;
	  });
	  
	  const restrictedRoles = [
		"Prison Superintendent",
		"DIG Prisons",
		"Inspector General Prisons",
		"Prison DSP"
	  ];
	  
	  const isRestricted = restrictedRoles.includes(userMeta?.role);
	 
	
	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Manage Visitors {show &&(<label>(ملاقاتوں کا انتظام)</label>)}</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(0);
							}}
						>
							Meeting Awaited {show && (<label>(ملاقاتیوں کی فہرست)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							In Meeting {show && (<label>(چلتی ملاقاتوں کی فہرست)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(2);
							}}
						>
							Declined Meetings {show && (<label>(چلتی ملاقاتوں کی فہرست)</label>)}
						</Tab>
						{!isRestricted &&
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(3);
								}}
							>
								Pending Approval
							</Tab>
						}
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewVisitorListing
									setActiveTab={setActiveTab}
									type='visitor'
									getURL='SearchVisitAwaiting'
									btnTitle='Start Meeting'
									apiEndpoint='StartVisit'
									swalText='You want to start this meeting'
									successMsg='Meeting Started.'
									activetab={0}
									tabSequence="1"
									visitorStatus="41"
									hide={isRestricted}
								/>
							</TabPanel>
							<TabPanel>
								<ViewVisitorListing
									setActiveTab={setActiveTab}
									type='visitor'
									getURL='SearchInVisitMeeting'
									btnTitle='Complete Meeting'
									apiEndpoint='CompleteVisit'
									swalText='You want to complete this meeting'
									successMsg='Meeting Completed.'
									tabSequence="2"
									visitorStatus="42"
									hide={isRestricted}
								/>
							</TabPanel>
							<TabPanel>
								<ViewVisitorListing
									setActiveTab={setActiveTab}
									type='visitor'
									getURL='SearchVisitCancelled'
									btnTitle='Complete Meeting'
									apiEndpoint='CompleteVisit'
									swalText='You want to decline this meeting'
									successMsg='Meeting Declined.'
									tabSequence="3"
									visitorStatus="44"
									hide={isRestricted}
								/>
							</TabPanel>
							{!isRestricted &&
								<TabPanel>
									<RetrialApprovalPrisonerList setActiveTab={setActiveTab} isVisit={true} getUrl={`/services/app/PrisonerSearch/SearchVisitDspPending`} noAction={true} showOnlyVisitor={true} />
								</TabPanel>
							}
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageVisitors;
