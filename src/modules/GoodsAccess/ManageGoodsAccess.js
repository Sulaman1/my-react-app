import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AddGoods from './AddGoods';
const ManageGoodsAccess = props => {
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
						<span>Goods Access</span>
					</h4>
				</div>
				<Tabs selectedIndex={activetab}>
					<TabList className='nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0'>
						{!isSp && !isDig && !isIG &&
							<Tab
								className='nav-item  nav-link'
								onClick={() => {
									setActiveTab(0);
								}}
							>
								Add Goods {show && (<label>(رسائی شدہ سامان کی فہرست)</label>)}
							</Tab>
						}
						<Tab
							className='nav-item  nav-link'
                            onClick={() => {
								let num = !isSp && !isDig && !isIG ? 1 : 0;
								setActiveTab(num);
							}}
						>
							All Goods Access {show && (<label>(نئے سامان تک رسائی)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
                            onClick={() => {
								let num = !isSp && !isDig && !isIG ? 2 : 1;
								setActiveTab(num);
							}}
						>
							List of Goods Exited {show && (<label>(سامان کی فہرست خارج ہو گئی۔)</label>)}
						</Tab>
						{/* <Tab
							className='nav-item  nav-link'
                            onClick={() => {
								setActiveTab(3);
							}}
						>
							New Goods Exit {show && (<label>(نئے سامان سے باہر نکلیں۔)</label>)}
						</Tab> */}
					</TabList>
					<div className='card'>
						<div className='card-body'>
							{!isSp && !isDig && !isIG &&
								<TabPanel>
									<AddGoods
										tab={1}
										api={"GetListOfTodaysGoodsEntry"}
									/>
								</TabPanel>
							}
							<TabPanel>
							<AddGoods
							tab={2}
							api={"GetListOfAllGoodsAccessed"}
							/>	
							</TabPanel>

							<TabPanel>
							<AddGoods
							tab={3}
							api={"GetListOfTodaysGoodsExit"}
							/>	
							</TabPanel>

						
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageGoodsAccess;
