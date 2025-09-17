import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useSelector } from 'react-redux';
import ViewUpComingRetirements from './ViewUpComingRetirements';

const ManageUpcomingRetirements = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>UpComing Retirements{show &&(<label className='urdu-font'> (آنے والی ریلیز)</label>)}</span>
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
							UpComing Retirements List {show &&(<label className='urdu-font'>(آنے والی ریلیز کی فہرست)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewUpComingRetirements/>
							</TabPanel>
						</div>
					</div>
					
				</Tabs>
			</div>
		
		</>
	);
};

export default ManageUpcomingRetirements;
