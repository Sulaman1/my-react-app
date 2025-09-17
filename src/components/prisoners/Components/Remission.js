import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewRemissionPrisonerDetails from './remission/ViewRemissionPrisonerDetails';
import ManagePrisonersRemission from './remission/ManagePrisonersRemission'

const Remission = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Remission</span>
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
							Manage Remission {show && (<label className='urdu-font'>()</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Manage Deduction {show && (<label className='urdu-font'>()</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ManagePrisonersRemission
									key="remission-tab"
									setActiveTab={setActiveTab}
									getURL='SearchPrisonerRemissions'
									createUrl='CreateOrEditRemissionsInfo'
									btnText='Add Remission'
									type='remission'
									activeTab={0}
									isDeduct={false}
								/>
							</TabPanel>
							<TabPanel>
								<ManagePrisonersRemission
									key="deduction-tab"
									setActiveTab={setActiveTab}
									getURL='SearchPrisonerRemissions'
									createUrl='CreateOrEditRemissionsInfo'
									btnText='Deduct Remission'
									type='remission'
									activeTab={1}
									isDeduct={true}
								/>
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default Remission;
