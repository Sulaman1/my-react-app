import React, {  useEffect, useState } from 'react';
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, getItemFromList, validateDate, transformData } from "../../../common/Helpers";
import { baseImageUrl } from '../../../services/request';
import { useSelector } from 'react-redux';
import ProfilePic from '../../../assets/images/users/1.png';
import Modal from 'react-bootstrap/Modal';


const HearingInfoCard = ({ caseInfo, isUTP, fetchedData, remission, data }) => {
	const [lookups, setLookups] = useState({});
	const newLookups = useSelector((state) => state?.dropdownLookups)
	const [showDocImage, setShowDocImage] = useState(false)
	const [viewDoc, setViewDoc] = useState("")
	useEffect(() => {
		async function fetchLookups() {
			const lookup = {};

			const courtObj = transformData(newLookups?.court);
			lookup["court"] = courtObj;

			const judgeObj = transformData(newLookups?.judge);
			lookup["judge"] = judgeObj;

			setLookups(lookup);
		}
		fetchLookups();
	}, []);

	const HearingEntries = {
		"Court (عدالت)": "",
		"Remanding Court (ریمانڈ عدالت)": "",
		"Judge (جج)": "",
		"Last Hearing Date (آخری پیشی کی تاریخ)": "",
		"Next Hearing Date (اگلی پیشی کی تاریخ)": "",
		"warrant (اگلی پیشی کی تاریخ)": "",
		"Warrant Reason (وارنٹ کا سبب)": "",
		// Actions: ''
	};
	const remissionEntries = {
		'Remission Type (معافی کی قسم)': '',
		'Remission Date (معافی کی تاریخ)': '',
		'Remission Days Earned (معافی کے کتنے دن کمائے گئے)': '',
	};

	const appealEntries = {
		'court (عدالت)': '',
		'remarks (ریمارکس)': '',
		'Appeal Date (اپیل کی تاریخ)': '',
	};
	const gridAppealDataMap = (e) => {
		const mapObj = {
			court: e.court,
			remarks: e.remarks,
			appealDate: validateDate(e.appealDate) || "",
		};
		return mapObj;
	};
	const gridHeaingsDataMap = (e) => {
		const mapObj = {
			court: getItemFromList(fetchedData['courts'], parseInt(e.courtId)),
			remandingCourt: getItemFromList(fetchedData['remandingCourts'], parseInt(e.remandingCourtId)),
			judge:  e.judge,
			lastHearingDate: validateDate(e.lastHearingDate) || "",
			nextHearingDate: validateDate(e.nextHearingDate) || "",
		};

		mapObj["warrant"] = _(
			<div
			className="profile-td profile-td-hover form-check-label"
			onClick={() => {
				setShowDocImage(true),
				setViewDoc(e.hearingDocuments ? baseImageUrl + e?.hearingDocuments : ProfilePic);
			}}
			>
			<img
				onError={(ev) => {
				ev.target.src = ProfilePic;
				}}
				className="avatar-xs rounded-circle "
				src={e?.hearingDocuments
					? baseImageUrl + e?.hearingDocuments
					: ProfilePic}
				width="50"
			/>
			</div>
		);
		mapObj["Warrant Reason"] = e.warrantReason;
		return mapObj;
	};

	const download = async () => {
		const nameSplit = viewDoc.split("Admin");
		const duplicateName = nameSplit.pop();
		const link = document.createElement('a');
		link.href = viewDoc;
		const newString = duplicateName.replace(/\\/g, ''); 
		link.download = newString; 
		link.target ='_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const closeDocImage = () => {
		setShowDocImage(!showDocImage)
	}
	return (
		<>
			<div className='table-main'>
				<div className=''>
					<h4 className='third-heading db-heading mb-2'>Hearing Information</h4>
					<div id='pagination-list'>
						{console.log('caseInfo caseInfo', caseInfo)}
						<Grid
							data={Array.isArray(caseInfo.Allhearings) ? transformDataForTableGrid(
								caseInfo.Allhearings?.map((entry) => gridHeaingsDataMap(entry))
							) : []}
							columns={Object.keys(HearingEntries)}
							search={true}
							sort={true}
							pagination={{
								enabled: true,
								limit: 10,
							}}
						/>
					</div>
				</div>
			</div>
			
			{(remission && !isUTP) && (
				<div className='table-main'>
					<div className=''>
						<h4 className='third-heading db-heading mb-2'>Remission Information</h4>
						<div id='pagination-list'>
							<Grid
								data={remission}
								columns={Object.keys(remissionEntries)}
								search={true}
								sort={true}
								pagination={{
									enabled: true,
									limit: 10,
								}}
							/>
						</div>
					</div>
				</div>)}

				{!isUTP && data &&  (
					<>
					<div className='table-main'>
					<div className=''>
						<h4 className='third-heading db-heading mb-2'>Appeal Information</h4>
							<div id='pagination-list'>
								<Grid
									data={Array.isArray(data?.caseAppeals) ? transformDataForTableGrid(data.caseAppeals.map((e) => gridAppealDataMap(e))) : []}
									columns={Object.keys(appealEntries)}
									search={true}
									sort={true}
									pagination={{
										enabled: true,
										limit: 10,
									}}
								/>
							</div>
						</div>
					</div>
					</>
				)}
		 {/*------------------ Show Documents in Modal ---------------*/}
		 <Modal show={showDocImage} size='lg'>
        <Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-td profile-td-hover">

            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              src={`${viewDoc}`}
              width="500"
              height="500"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
            Download
          </button>
          {/* <a href={viewDoc} download={true} className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1'>Download</a> */}
          <button
            id={'cancel-btn'}
            className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
            onClick={closeDocImage}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
		</>
	);
};

export default HearingInfoCard;
