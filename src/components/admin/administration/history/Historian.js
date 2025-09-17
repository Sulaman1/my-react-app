import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AllPrisonersHistory from './AllPrisonersHistory';
import AllSearch from '../../search/AllSearch';
import AllEmployeesHistory from './AllEmployeesHistory';

const Historian = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	const [searchData, setSearchData] = useState([]);
	const addSearchDataHandler = searchData => {
		setSearchData(searchData);
	};
	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Search History {show &&(<label className='urdu-font'>(قیدی کی تلاش)</label>)}</span>
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
							Prisoner Wise History {show &&(<label className='urdu-font'>("")</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Employee Wise History {show &&(<label className='urdu-font'>(""))</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
                                <AllSearch onAddSearchData={addSearchDataHandler} componentType={"history"}/>
                                <AllPrisonersHistory searchData={searchData} />
							</TabPanel>
							<TabPanel>
								<AllEmployeesHistory />
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};
export default Historian;
