import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { transformData } from '../../../../common/Helpers';
import { getData } from '../../../../services/request';
//import ViewBasicAllocation from '././ViewBasicAllocation';
import ViewAllocation from './ViewAllocation';
//import { handleUrlRedirect } from '../../../../common/Common';

const ManageAllocation = props => {
	const [activetab, setActiveTab] = useState(0);
	const [lookups, setLookups] = useState({});
	const [barrackPrisonerId, setBarrackPrisonerId] = useState('')
	const show = useSelector((state) => state.language.urdu)
	const loggedUser = sessionStorage.getItem('LoggedInEmployeeInfo');
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	
	const callAndHandleLookUps = () => {
    try {
      const userParse = JSON.parse(loggedUser);
      const lookup = {};
      const prisonIds = userParse?.prisons?.map((item) => item.prisonId);
      let filteredCircleData = newLookups?.Enclosure?.filter(
        (item) => prisonIds.indexOf(item.prisonId) > -1
      );
      const circleData = transformData(filteredCircleData);

      lookup["prisonCircle"] = circleData;
      lookup["barracksData"] = newLookups?.PrisonBarracks;

      const barracksTypesData = transformData(newLookups?.PrisonBarrackTypes);
      lookup["barracksTypes"] = barracksTypesData;

      setLookups(lookup);
    } catch (error) {
      console.error(error);
      alert("something went wrong in lookups api");
    }
  };
	// useEffect(() => {
	// 	callAndHandleLookUps()
	// 	// simple handle of tab when click from notification
	// 	const tabIndex = handleUrlRedirect();
	// 	setActiveTab(tabIndex);
	// }, [])
	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space'>
						<span>Allocations {show && (<label className='urdu-font'>(بیرک مختصگی)</label>)}</span>
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
							UnAllocated {show && (<label className='urdu-font'>(غیر مختص شدہ)</label>)}
						</Tab>
						<Tab
							className='nav-item nav-link'
							onClick={() => {
								setActiveTab(1);
							}}
						>
							Allocated {show && (<label className='urdu-font'>(مختص شدہ)</label>)}
						</Tab>
						<Tab
							className='nav-item nav-link'
							disabled={true}

						>
							Allocation Hisotry {show && (<label className='urdu-font'>(گزشتہ مختصگیاں)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewAllocation
									setActiveTab={setActiveTab}
									url={'/services/app/PrisonerSearch/SearchUnallocatedPrisoners'}
									lookUps={lookups}
									tabPos={1}
								/>
							</TabPanel>
							<TabPanel>
								<ViewAllocation
									setActiveTab={setActiveTab}
									url={'/services/app/PrisonerSearch/SearchAllocatedPrisoners'}
									lookUps={lookups}
									tabPos={2}
									setBarrackPrisonerId={setBarrackPrisonerId}
								/>
							</TabPanel>
							<TabPanel>
								<ViewAllocation
									setActiveTab={setActiveTab}
									url={'/services/app/PrisonerDetailInformation/GetAllBarracks'}
									prisonerId={barrackPrisonerId}
									lookUps={lookups}
									tabPos={3}
								/>
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default ManageAllocation;
