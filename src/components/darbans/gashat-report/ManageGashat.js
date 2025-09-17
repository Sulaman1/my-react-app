import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import EmployeeListing from '../../../modules/medical/components/Employee/EmployeeListing';
import EmployeeDetails from '../../../modules/hr/Leave/EmployeeDetails';
import GashatGrid from './GashatGrid';

const ManageGashat = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	const userMeta = useSelector((state) => state.user);
	const isSp = userMeta?.role === "Prison Superintendent";
	const isIG = userMeta?.role === 'Inspector General Prisons';
	const isDIG = userMeta?.role === 'DIG Prisons';
	const renderSp = isSp || isIG || isDIG
	const renderIg =  isIG || isDIG

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Gasht Report {show && (<label className='urdu-font'>(قیدی کا انتظام کریں)</label>)}</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						{!renderSp && <>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(0);
							}}
						>
							Employee List {show && (<label className='urdu-font'>(ملازمین کی فہرست)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							// onClick={() => {
							// 	setActiveTab(1);
							// }}
						>
							Add Gasht Report {show && (<label className='urdu-font'>(گشت رپورٹ شامل کریں)</label>)}
						</Tab>
						</>}
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(2);
							}}
						>
							Gasht Report History {show && (<label className='urdu-font'>(گشت رپورٹ کی تاریخ)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							{!renderSp && <>
							<TabPanel>
								<EmployeeListing
									setActiveTab={setActiveTab}
									btnTitle="Add Report"
									getURL="GetAllEmployee"
								/>
							</TabPanel>
							<TabPanel>
								<EmployeeDetails isGashatEnable setActiveTab={setActiveTab}  />
							</TabPanel>
							</>}
							<TabPanel>
								<GashatGrid data={[]} refetch={""}  allReport  renderIg={renderIg} />
							</TabPanel>
						</div>
					</div>

				</Tabs>

			</div>

		</>
	);
};

export default ManageGashat;
