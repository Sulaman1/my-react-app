import { Grid } from 'gridjs-react';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { transformDataForTableGrid } from '../../../../common/Helpers';
import { getData } from '../../../../services/request';

const HistoryDetailModal = ({
	showModal,
	prisonerId,
	onClose,
	userType,
	userId
}) => {
	const [historyData, setHistoryData] = useState([]);

	const getGridCols = () => {
		const cols = {
			"Username": "",
			"Message": ""
		};
		return Object.keys(cols);
	};

	const gridDataMap = (e) => {
		const mapObj = {
			userName: e.userName,
			message: e.message,
		};
		return mapObj;
	};
	useEffect(() => {
		loadData()
	}, [prisonerId,userId]);

	const loadData = () => {
		try {
				const type = userType == 'prisoner' ? 'GetPrisonerHistory?PrisonerId='+prisonerId : 'GetEmployeeHistory?UserId='+userId;
			if (prisonerId || userId) {
				getData(`/services/app/Historian/${type}`)
					.then(res => {
						if (res.success) {
							setHistoryData(res?.result);
						}
					})
					.catch(e => {
						console.log(e, 'Error while fetching prisoner/user history detail and fileName is {HistoryDetailModal}');
					});
			}
		} catch (error) {
			console.log(error, 'Error in loadData funtion and fileName is {HistoryDetailModal}');
		}
	};

	return (
		<Modal show={showModal} onHide={onClose} size="lg">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					History Details
				</h5>
			</Modal.Header>
			<Modal.Body>
				<Grid
					data={transformDataForTableGrid(
						historyData?.map((e) => {
							return gridDataMap(e);
						})
					)}
					columns={getGridCols()}
					search={true}
					pagination={{
						enabled: true,
						limit: 10,
					}}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button
					id={'cancel-btn'}
					className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={onClose}
				>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default HistoryDetailModal;
