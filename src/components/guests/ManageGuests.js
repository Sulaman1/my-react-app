import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewGuests from './ViewGuests';
import AddGuest from './AddGuest';
import { useSelector } from 'react-redux';
import GuestHistory from './GuestHistory';

const ManageDarban = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Manage Guests{show &&(<label className='urdu-font'> (ملازم کا انتظام کریں)</label>)}</span>
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
							Guest List {show &&(<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Add Guest {show &&(<label className='urdu-font'>(مہمان شامل کریں۔)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(2);
							}}
						>
							Guest History {show &&(<label className='urdu-font'>(مہمان کی تاریخ)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewGuests setActiveTab={setActiveTab} />
							</TabPanel>
							<TabPanel>
								<AddGuest setActiveTab={setActiveTab} />
							</TabPanel>
							<TabPanel>
								<GuestHistory setActiveTab={setActiveTab} />
							</TabPanel>
						</div>
					</div>
					
				</Tabs>
			</div>
		
		</>
	);
};

export default ManageDarban;
