import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewBasicPrisoner from './release-prisoner/ViewBasicPrisoner';
import ViewReleasePrisonerDetails from './release-prisoner/ViewReleasePrisonerDetails';

const ManageReleasePrisoner = props => {
	const [activetab, setActiveTab] = useState(0);
	const show = useSelector((state) => state.language.urdu)

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Release Prisoner</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						<Tab
							className='nav-item nav-link'
							onClick={() => {
								setActiveTab(0);
							}}
						>
							Release Prisoner {show && (<label className='urdu-font'>(رہائیاں)</label>)}
						</Tab>
						<Tab
							className='nav-item nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Release In Process {show && (<label className='urdu-font'>(قیدی کی رہائی)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link disabled-tabs'
						>
							Release From Cases {show && (<label className='urdu-font'>(کیسوں کی فہرست)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewBasicPrisoner
									setActiveTab={setActiveTab}
									getURL='SearchUnreleasedPrisoners'
									btnText='Release'
									type='released'
									renderCheckbox
									activeTab={2}
								/>
							</TabPanel>
							<TabPanel>
								<ViewBasicPrisoner
									setActiveTab={setActiveTab}
									getURL='SearchInReleaseProcessPrisoners'
									tab={2}
									showAction={true}
									redButton={true}
								/>
							</TabPanel>
							<TabPanel>
								<ViewReleasePrisonerDetails
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

export default ManageReleasePrisoner;
