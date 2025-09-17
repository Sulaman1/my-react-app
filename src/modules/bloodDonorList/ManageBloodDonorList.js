import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useSelector } from 'react-redux';
import ViewBloodDonorList from './ViewBloodDonorList';

const ManageBloodDonorList = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	const userMeta = useSelector((state) => state.user);
	const isSp = userMeta?.role === "Prison Superintendent";
	const isIG = userMeta?.role === 'Inspector General Prisons';
	const isDIG = userMeta?.role === 'DIG Prisons';
	const isDSP = userMeta?.role === 'Prison DSP';
	const hideSp = isSp || isIG || isDIG || isDSP

	return (
		<>
			<div className='row'>
				<div className='row flex'>
					<h4 className='third-heading  just-space '>
						<span>Blood Donor List{show && (<label className='urdu-font'> (خون کے عطیہ دہندگان کی فہرست)</label>)}</span>
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
							Non Blood Donors {show && (<label className='urdu-font'>(نان بلڈ ڈونرز)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Blood Donors {show && (<label className='urdu-font'>(خون کے عطیہ دہندگان)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewBloodDonorList isBloodDonorOnly={false} hideSp={hideSp} />
							</TabPanel>
							<TabPanel>
								<ViewBloodDonorList isBloodDonorOnly={true} hideSp={hideSp} />
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageBloodDonorList;
