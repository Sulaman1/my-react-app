import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewBasicPrisoner from '../../components/prisoners/Components/release-prisoner/ViewBasicPrisoner';
import ViewInPrisonEducation from './ViewInPrisonEducation';

const ManageInPrisonEducation = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)
	const userMeta = useSelector((state) => state.user);
	const isSp = userMeta?.role === "Prison Superintendent";
	const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Inside Prison Education Management</span>
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
							Prisoners {show && (<label>(سزا یافتہ قیدی)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
						>
							Manage in-prison Education {show && (<label>(جیل میں تعلیم کا انتظام کریں۔)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewBasicPrisoner
									setActiveTab={setActiveTab}
									getURL={`${isSp || isDig || isIG ?"SearchPrisonersWithEducation":"SearchPrisonersWithoutEducation"}`}
									btnText={`${isSp || isDig || isIG ?"View":"Manage"}`}
									type='inPrisonEducation'
									activeTab={1}
								/>
							</TabPanel>
							<TabPanel>
								{/* <ViewConvicted setActiveTab={setActiveTab} /> */}
								<ViewInPrisonEducation setActiveTab={setActiveTab} isHighAuth={(isSp || isDig || isIG)} />
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageInPrisonEducation;
