import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Carousel from 'react-bootstrap/Carousel';
import ViewPrisonersListing from '../hospital/components/ViewAdmissions';
import ManageHearing from './components/ManageHearing';

const AddHearing = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Add Hearing</span>
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
							Search Prisoners {show && (<label className='urdu-font'>(تلاش برائے قیدیان)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
						>
							Manage Hearing {show && (<label className='urdu-font'>(انتظام برائے پیشیاں)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewPrisonersListing
									setActiveTab={setActiveTab}
									redirectTab={1}
									item='prisonerHearingEntry'
									getURL='searchPrisonerWithCasesForHearing'
									btnTitle='Add Hearing'
									navItem={1}
								/>
							</TabPanel>
							<TabPanel>
								<ManageHearing  AddHearing={true}/>
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default AddHearing;
