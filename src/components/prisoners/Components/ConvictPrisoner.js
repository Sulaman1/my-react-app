import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewConvicted from './convict-prisoner/ViewConvicted';
import ViewBasicPrisoner from './release-prisoner/ViewBasicPrisoner';

const ManageConvictPrisoner = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Convict Prisoner</span>
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
							Convict Prisoner {show && (<label>(سزا یافتہ قیدی)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
						>
							Convicted {show && (<label>(سزا یافتہ)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewBasicPrisoner
									setActiveTab={setActiveTab}
									getURL='SearchToBeConvictedPrisoners'
									btnText='Convict'
									type='convicted'
									activeTab={1}
								/>
							</TabPanel>
							<TabPanel>
								<ViewConvicted setActiveTab={setActiveTab} />
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageConvictPrisoner;
