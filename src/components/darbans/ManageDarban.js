import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AddDarban from './AddDarban';
import ViewDarbans from './ViewDarbans';

const ManageDarban = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Manage Prisoners {show &&(<label className='urdu-font'>(قیدی کا انتظام کریں)</label>)}</span>
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
							prisoners with pending admission {show &&(<label className='urdu-font'>(  قیدی وتھ  پینڈنگ ایڈمشن)</label>)}
						
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Add Prisoner {show &&(<label className='urdu-font'>(قیدی شامل کریں)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewDarbans setActiveTab={setActiveTab} />
							</TabPanel>
							<TabPanel>
								<AddDarban setActiveTab={setActiveTab} />
							</TabPanel>
						</div>
					</div>
					
				</Tabs>
				
			</div>
			
		</>
	);
};

export default ManageDarban;
