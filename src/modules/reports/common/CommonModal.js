import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import TableGrid from "./../components/TableGrid";
import { baseImageUrl, postData } from "../../../services/request";
import { formatDate, validateDate } from "../../../common/Helpers";
import Print from '../../../components/admin/search/Print';


const CommonModal = ({
	typeTitle,
	data,
	selectedRawData,
	visible,
	onClose
}) => {
	const [caseChildsData, setCaseChildsData] = useState([])
	const [caseChildsTitle, setCaseChildsTitle] = useState("")

	const [isChildShow, setIsChildShow] = useState(false)
	useEffect(() => {

	}, [selectedRawData]);

	function getTDs(ele) {
		return Object.keys(data[0]).map((key, index) => {
			return <td className="gridjs-td">
				{`${ele[key]}`.indexOf('#') > -1 ?
					<a className="button" href="#" onClick={() => { filteredSubData(ele, key) }}>{ele[key].split('#')[1]}</a> :
					ele[key]}
			</td>
		})
	}

	function filteredSubData(data, key) {
		const id = data.Id;
		let childData = []
		const filtered = selectedRawData.filter((obj) => obj.id === id)
		childData = key == 'Hearings' ? filtered[0]['hearings'] : key == 'Remissions' ? filtered[0]['prisonerRemissions'] : []
		if (childData.length > 0) {
			const mappedData = childData.map(ele => {
				if (key == 'Hearings') {
					return {
						'Court': ele.court || "", 'Remanding Court': ele.remandingCourt || '', 'Judge': ele.judge || "",
						'Sentence': ele.sentence || "", 'Next Hearing Date': validateDate(ele.nextHearingDate) || '', 'Last Hearing Date':  validateDate(ele.lastHearingDate)
						? new Date(ele.lastHearingDate).toDateString() : '',
						'Appearing Remarks': ele.appearingRemarks || '', 'Appearing Control Tower Remarks': ele.appearingCtrlTwrRemarks || '', 'specialGuard': ele.specialGuard || '',
					}
				} else {
					return {
						'Type': ele.name || "", 'Remission Days Earned': ele.remissionDaysEarned || '', 'Remission Date': validateDate(ele.remissionDate) || ''
					}
				}
			});
			setCaseChildsData(mappedData);
			setIsChildShow(true)
			setCaseChildsTitle(key);
		} else {
			setCaseChildsData([]);
			setIsChildShow(false)
			setCaseChildsTitle("");
		}
	}

	function getChildTDs(ele) {
		return Object.keys(caseChildsData[0]).map((key, index) => {
			return <td className="gridjs-td">
				{`${ele[key]}`.indexOf('#') > -1 ?
					<a className="button" href="#" onClick={() => { filteredSubData(ele, key) }}>{ele[key].split('#')[1]}</a> :
					ele[key]}
			</td>
		})
	}
	const Data = selectedRawData.map(e => {
		const { hearings, prisonerRemissions, releaseType, zone,
			 courtOrder, authorityLetter,id,
			frontPic, checkups, hospitalAdmissionId, prisonToId, transferId,
			 ...rest } = e;
		return rest;
	});
	return (
		<Modal show={visible} onHide={onClose} size="xl" backdrop="static">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					{typeTitle}
				</h5>
			</Modal.Header>
			<Modal.Body>
			<div className="card custom-card animation-fade-grids custom-card-scroll">
				<TableGrid thArr={data?.length ? Object.keys(data[0]) : []} tdArr={data} getTDs={getTDs} />
				{isChildShow && caseChildsData.length > 0 ?
					<>
						<h5 class="modal-title" id="exampleModalgridLabel">
							{caseChildsTitle}
						</h5>
						<TableGrid thArr={caseChildsData?.length ? Object.keys(caseChildsData[0]) : []} tdArr={caseChildsData} getTDs={getChildTDs} />
					</>
					: ""
				}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Print data={Data} filename={typeTitle}/>
				<button
					id={'cancel-btn'}
					className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={()=> {setIsChildShow(false);onClose();}}
				>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default CommonModal;
