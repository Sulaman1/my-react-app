import { useEffect, useRef, useState } from 'react';
import { Grid } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';

const WarrantsTable = ({ prisonerCases }) => {
	const caseGridRef = useRef();
	const remissionGridRef = useRef();
	const [caseEntries, setCaseEntries] = useState([]);
	const [remissionEntries, setRemissionEntries] = useState([]);

	useEffect(() => {
		loadCaseData();
		loadRemissionData();
	}, [prisonerCases]);

	const generateCaseGridCols = () => {
		return {
			"Fir No": "",
			"Fir Date": "",
			"Fir Year": "",
			"Case Status": "",
			"Police Station": "",
			"Under Sections": "",
			"Decision Authority": "",
			"Sentence Date": "",
			"Last Hearing Date": "",
		};
	};

	const generateRemissionGridCols = () => {
		return {
			"Case Fir No": "",
			"Remission Name": "",
			"Remission Date": "",
			"Days Earned": "",
		};
	};

	const getLastHearingDate = (hearings) => {
		if (hearings && hearings.length > 0) {
			const sortedHearings = hearings.sort((a, b) => 
				new Date(b.lastHearingDate) - new Date(a.lastHearingDate)
			);
			return sortedHearings[0].lastHearingDate;
		}
		return null;
	};

	const loadCaseData = () => {
		try {
			if (prisonerCases?.length > 0) {
				const filteredData = prisonerCases.map((caseData) => ({
					"Fir No": caseData.firNo || "",
					"Fir Date": validateDate(caseData.firDate)
						? new Date(caseData.firDate).toDateString()
						: "",
					"Fir Year": caseData.firYear || "",
					"Case Status": caseData.status || "",
					"Police Station": caseData.policeStation || "",
					"Under Sections": caseData.underSections || "",
					"Decision Authority": caseData.decisionAuthority || "",
					"Sentence Date": validateDate(caseData.sentenceDate),
					"Last Hearing Date": validateDate(getLastHearingDate(caseData.hearings)),
				}));
				setCaseEntries(transformDataForTableGrid(filteredData));
			} else {
				setCaseEntries([]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const loadRemissionData = () => {
		try {
			const allRemissions = prisonerCases.flatMap((caseData) => 
				(caseData.prisonerRemissions || []).map((remission) => ({
					"Case Fir No": caseData.firNo || "",
					"Remission Name": remission.name || "",
					"Remission Date": validateDate(remission.remissionDate),
					"Days Earned": remission.remissionDaysEarned || "",
				}))
			);
			setRemissionEntries(transformDataForTableGrid(allRemissions));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='table-main'>
		<div className='card-body print-section'>
		  <div className="row">
			<h3 className="third-heading">
			  Cases Information
			  <span style={{ fontWeight: 'bold' }}></span>
			</h3>
			<Grid
			  ref={caseGridRef}
			  data={caseEntries}
			  columns={Object.keys(generateCaseGridCols())}
			  search
			  sort
			  pagination={{
				enabled: true,
				limit: 10,
			  }}
			/>
		  </div>
		</div>
		
		<div className='card-body print-section'>
		  <div className="row">
			<h3 className="third-heading mt-5">
			  Remissions Information
			  <span style={{ fontWeight: 'bold' }}></span>
			</h3>
			<Grid
			  ref={remissionGridRef}
			  data={remissionEntries}
			  columns={Object.keys(generateRemissionGridCols())}
			  search
			  sort
			  pagination={{
				enabled: true,
				limit: 10,
			  }}
			/>
		  </div>
		</div>
	</div>
	);
};

export default WarrantsTable;