import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AllPrisonerSearch from './AllPrisonerSearch';
import GlobalSearch from './GlobalSearch';

const PrisonersSearch = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	const userMeta = useSelector((state) => state.user);
	const isIG = userMeta?.role === 'Inspector General Prisons';
	const isDIG = userMeta?.role === 'DIG Prisons';
	const isSp = userMeta?.role === 'Prison Superintendent';

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Prisoner Search {show &&(<label className='urdu-font'>(قیدی کی تلاش)</label>)}</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
					{!(isIG || isDIG) &&(
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(0);
							}}
						>
							All Prisoner Search {show &&(<label className='urdu-font'>(اس جیل کے قیدیوں کی سرچ)</label>)}
						</Tab>)}
						{!isSp && (
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Global Search {show &&(<label className='urdu-font'>(گلوبل سرچ)</label>)}
						</Tab>
						)}

					</TabList>
					<div className='card'>
						<div className='card-body'>
							{!(isIG || isDIG) &&(
								<TabPanel>
								<AllPrisonerSearch />
							</TabPanel>)}
							{!isSp &&(
							<TabPanel>
								<GlobalSearch />
							</TabPanel>
							)}
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};
export default PrisonersSearch;
