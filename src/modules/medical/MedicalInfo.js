import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ViewListing from './components/ViewListing';

const MedicalInfo = props => {
	const [activetab, setActiveTab] = useState(0);

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Medical</span>
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
							Prisoner With Medical Info
						</Tab>

						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Prisoner Without Medical Info
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewListing getURL='SearchPrisonerWithMedicalInfo' />
							</TabPanel>
							<TabPanel>
								<ViewListing
									getURL='SearchPrisonerWithoutMedicalInfo'
									btnTitle='Add'
									navItem={2}
									setActiveTab={setActiveTab}
								/>
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default MedicalInfo;
