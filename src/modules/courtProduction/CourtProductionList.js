import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewCPHistory from './components/ViewCPHistory';

import ViewCPListing from './components/ViewCPListing';

//import { handleUrlRedirect } from "../../common/Common";

const CourtProductionList = props => {
	const [activetab, setActiveTab] = useState(0);
	const userMeta = useSelector((state) => state.user);
	const show = useSelector((state) => state.language.urdu)
	const [isDarban] = useState(userMeta?.role === 'Darban');
	const [isAdmin] = useState(userMeta?.role === 'Super Admin');
	const showFinalised = false;
	const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";
	const isSp = userMeta?.role === "Prison Superintendent";
	const isDSP = userMeta?.role === "Prison DSP";

	// useEffect(() => {
	// 	// simple handle of tab when click from notification
	// 	const tabIndex = handleUrlRedirect();
	// 	setActiveTab(tabIndex);
	//   }, []);

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Court Production List</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						{!(isDarban || isIG || isDig || isSp || isDSP) && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(0);
								}}
							>
								Marasla {show && (<label className='urdu-font'>(مراسلہ)</label>)}
							</Tab>
						)}
						{!(isDarban || isIG || isDig || isSp || isDSP) && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(1);
								}}
							>
								Return List {show && (<label className='urdu-font'>(فہرست برائے واپسی)</label>)}
							</Tab>
						)}
						{!isDarban && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									if(!isIG && !isDig && !isSp && !isDSP){
										setActiveTab(2);
									}
								}}
							>
								Court Production History {show && (<label className='urdu-font'>(تفصیل برائے گزشتہ پیشیاں)</label>)}
							</Tab>
						)}
						{!isDarban && !isIG && !isDig && !isSp && !isDSP && showFinalised && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(3);
								}}
							>
								Finalized Maraslas {show && (<label className='urdu-font'>(تفصیل برائے گزشتہ پیشیاں)</label>)}
							</Tab>
						)}
					</TabList>
					<div className='card '>
						<div className='card-body'>
							{(isIG || isDig || isSp || isDSP) && (
							<TabPanel>
								<ViewCPHistory
								/>
							</TabPanel>)}
							{!isDarban && (
								<TabPanel>
									<ViewCPListing
										getURL1='SearchTomorowsMarasla'
										btnTitle='Special guard'
										picker
										tab={1}
										submitButton='Create Marasla'
									/>
								</TabPanel>
							)}
							<TabPanel>
								<ViewCPListing
									getURL1='SearchTodaysReturnCourtProductionList'
									tab={3}
									picker
									btnTitle='Add Hearing'
									returnList={true}
								/>
							</TabPanel>
							<TabPanel>
								<ViewCPHistory />
							</TabPanel>
							<TabPanel>
								<ViewCPListing
									getURL1='SearchTomorowsMaraslaFinalized'
									tab={4}
									finalized
									picker
									btnTitle='Finalized'
									noAction
									returnList={true}
								/>
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default CourtProductionList;
