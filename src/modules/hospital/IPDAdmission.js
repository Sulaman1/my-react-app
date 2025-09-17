import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { transformData } from '../../common/Helpers';
import { getData } from '../../services/request';
import AdmissionDetails from './AdmissionDetails';
import ViewAdmissions from './components/ViewAdmissions';

const IPDAdmission = props => {
	const [activetab, setActiveTab] = useState(0);
	const [lookups, setLookups] = useState({});
	const newLookups = useSelector((state) => state?.dropdownLookups) 
	const show = useSelector((state) => state.language.urdu)

	useEffect(() => {
		async function fetchLookups() {
			const lookup = {};
		
			const diseasesObj = transformData(newLookups?.disease);
			lookup['diseases'] = diseasesObj;
			setLookups(lookup);
		}

		fetchLookups();
	}, []);

	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>IPD Admission</span>
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
							List of Admissions {show && (<label className='urdu-font'>(داخلوں کی فہرست)</label>)}
						</Tab>
						<Tab
							className='nav-item  nav-link'
						>
							Admission Details {show && (<label className='urdu-font'>(داخلہ کی تفصیلات)</label>)}
						</Tab>
					</TabList>
					<div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewAdmissions
									setActiveTab={setActiveTab}
									redirectTab={1}
									getURL='SearchIPDAdmissions'
									btnTitle='Checkup/Discharge'
									navItem={3}
								/>
							</TabPanel>
							<TabPanel>
								<AdmissionDetails lookups={lookups} setActiveTab={setActiveTab} />
							</TabPanel>
						</div>
					</div>
				</Tabs>
			</div>
		</>
	);
};

export default IPDAdmission;
