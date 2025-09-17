import React, { useEffect, useMemo, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ViewEmployee from '../admin/administration/ViewEmployee';
import AddPrisoner from './AddPrisoner';

// import { useHistory } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Prisoners = props => {
	const [activetab, setActiveTab] = useState(0);
	const userMeta = useSelector((state) => state.user);
	const show = useSelector((state) => state.language.urdu)
	const isUTP = userMeta?.role === 'Prison UTP Branch';
	const isConvict = userMeta?.role === 'Prison Convict Branch';


	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Manage Prisoners {show &&(<label>(قیدی کا انتظام کریں)</label>)}</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab} >
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						{!props?.location?.state && (
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(0);
								}}
							>
								Prisoners List {show &&(<label>(قیدی کی فہرست)</label>)}
							</Tab>
						)}
						{/* {!isUTP && !isConvict && */}
						<Tab
							className='nav-item  nav-link'
							onClick={() => {
								{(!isUTP && !isConvict) &&  setActiveTab(1)};
							}}
						>
							Add Prisoner {show &&(<label>(قیدی داخل کریں)</label>)}
						</Tab>
						{/* } */}
					</TabList>
					<div className='card card-add-prisoner'>
						<div className='card-body'>
							{!props?.location?.state && (
								<TabPanel>
									<ViewEmployee
										setActiveTab={setActiveTab}
										isPrisoner={true}
									/>
								</TabPanel>
							)}
							<TabPanel>
								<AddPrisoner setActiveTab={setActiveTab} isEdit={props?.location?.state?.isEdit}/>
							</TabPanel>
						</div>
					</div>
					
				</Tabs>
			</div>
		
		</>
	);
};

export default Prisoners;
