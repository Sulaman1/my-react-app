import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import CaseInfoCard from './CaseInfoCard';
import HearingInfoCard from './HearingInfoCard';
import { transformData } from "../../../common/Helpers";
import { useSelector } from "react-redux";

const CaseModal = ({ visible, title, onClose, caseDetails, utp, remission, data }) => {
	const newLookups = useSelector((state) => state?.dropdownLookups) 

	const [fetchedData, setData] = useState({
		
	});
	const fetchApiData = async () => {
		try {
		const data = {};
			let courtObj = transformData(newLookups?.court);
			data["courts"] = courtObj;
			data["remandingCourts"] = courtObj;

			const policeStationsObj = transformData(newLookups?.policeStation);
			data["policeStations"] = policeStationsObj;

			let sectionObj = transformData(newLookups?.sections);
			data["sections"] = sectionObj;
		setData(data);
		} catch (err) {
			alert("An error occured");
		}
	};

	useEffect(() => {
		fetchApiData();
	}, []);
	return (
		<Modal show={visible} onHide={onClose} size='xxl'  >
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class='modal-title' id='exampleModalgridLabel'>
					{title}
				</h5>
			</Modal.Header>
			<Modal.Body>
				{Object.keys(caseDetails).length > 0 && (
					<>
						<CaseInfoCard isUTP={utp} caseInfo={caseDetails} />
						<HearingInfoCard isUTP={utp} caseInfo={caseDetails} fetchedData={fetchedData} remission={remission} data={data} />
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button
					id={'cancel-btn'}
					className='btn btn-prim my-4 lg-btn submit-prim  waves-effect waves-light mx-1'
					onClick={onClose}
				>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default CaseModal;
