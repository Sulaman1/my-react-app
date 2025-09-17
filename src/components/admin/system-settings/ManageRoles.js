
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { useSelector, useDispatch } from "react-redux";
import nodataImage from "../../../assets/images/1.jpg";
import {
	Link, useParams, useLocation, useNavigate 
} from "react-router-dom";
import { transformDataForTableGrid } from "../../../common/Helpers";
import {
	deleteLookupData,
	onLoadData,
	postAdd
} from "../../../store/lookups";

import Modal from "react-bootstrap/Modal";
import InputWidget from '../../../droppables/InputWidget';
import { deleteLookupName, lookupName, saveLookupName } from './lookupNames';
import swal from 'sweetalert';
import ShowNoOfRecords from '../../../common/ShowNoOfRecords';
/*
- api call and dynamics of the call for lookup data
- 
*/
const ManageRoles = (props) => {
	const handleEditBtn = (item, event) => {
		setPayload(item);
		showModal();
	}
	const handleDelBtn = (item, event) => {
		swal({
			title: 'Are you sure?',
			text: "You want to delete: " + item.name,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (willDelete) => {
			if (willDelete) {
				dispatch(deleteLookupData(deleteLookupName[type], item.id));
				swal(
					'Deleted!',
					'',
					'success'
				).then(result => {
					dispatch(onLoadData(lookupName[type]))
				})

			}
		})
	}
	const Roles = useSelector((state) => {
		const filterdData = state?.lookups?.countries.map(e => {
			return {
				id: e.id,
				name: e.name,
				'display Name': e.displayName,
				description: e.description,
				Action: _(<div className='action-btns'>
					<button type="button" onClick={() => { handleEditBtn(e) }} class="btn btn-warning waves-effect waves-light mx-1"><i class="icon-edit"></i></button>
					<button type="button" onClick={() => { handleDelBtn(e) }} class="btn btn-danger waves-effect waves-light mx-1"><i class="icon-delete"></i></button>
				</div>)
			}
		});
		return filterdData
	});
	const [payload, setPayload] = useState({});
	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams();
	const location = useLocation()
	const { search } = useLocation();
	let query = location.pathname.split('/')
	let type = query[query.length - 1]
	const gridRef = useRef();
	const dispatch = useDispatch();
	const filterType = [
		{ value: 5, label: 5 },
		{ value: 10, label: 10 },
		{ value: 20, label: 20 },
		{ value: 50, label: 50 }
	]
	const [pageLimit, setPageLimit] = useState(10);
	const dummyRoles = [
		{ value: "RolesPages", label: "RolesPages" },
		{ value: "Users", label: "Users" }
	]


	useEffect(() => {
		dispatch(onLoadData(lookupName[type]));
	}, [dispatch]);

	const showModal = () => {
		setIsOpen(true);
	};

	const hideModal = () => {
		setIsOpen(false);
	};

	const handleSave = (event) => {
		event.preventDefault();
		console.log(payload);
		dispatch(postAdd(saveLookupName[type], payload));
		hideModal();
		dispatch(onLoadData(lookupName[type]))
	}


	return (
		<div className='card'>
			<div className='card-body'>
				<div className="row gridjs">
					<div className="col-xl-12 p-0">
						<div className="card custom-card animation-fade-grids custom-card-scroll">
							<div className='row '>
								<div className='col'>
									<form className="col-lg-12 justify-content-center">
										<div className="row">
											<div className="col-3">
												<div className="select select-close">
													<InputWidget
														id={'select-count'}
														type={'multiSelect'}
														inputType={'multiSelect'}
														label={'Show Entries'}
														require={false}
														isMulti={false}
														options={filterType}
														setValue={(value) => {
															const pl = {
																...payload,
															};
															pl['filterRecords'] = value.value;
															setPayload(pl);
														}}
														icon={'icon-search'}
													/>
												</div>
											</div>
											<div className="col-md-9 col-sm-12">
												<button type='button' onClick={showModal} class="btn btn-primary float-end">Add</button>
											</div>
										</div>

									</form>
									{Roles.length && (
										<>
							                <div className="float-end">
											<ShowNoOfRecords setPageLimit={setPageLimit} />
											</div>
											<Grid
												ref={gridRef}
												data={transformDataForTableGrid(Roles)}
												columns={Object.keys(Roles[0])}
												search={true}
												sort={true}
												pagination={{
													enabled: true,
													limit: pageLimit,
												}}
											/>
										</>
									)}

									{!Roles.length && (
										<div className='no-data'>
											<img src={nodataImage} alt="" />
											<span>No data found</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				<Modal show={isOpen} onHide={hideModal}>
					<Modal.Header closeButton style={{ "padding": "1.25rem 1.25rem" }}>
						<h5 class="modal-title" id="exampleModalgridLabel">Grid Modals</h5>
					</Modal.Header>
					<Modal.Body>
						<form className='col-lg-12  justify-content-center'>
							<div class="row g-3">
								<div class="col-xxl-6">
									<div>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Name'}
											require={false}
											icon={'add-icon'}
											onlyLetters={true}
											setValue={value => {
												const pd = { ...payload };
												pd['name'] = value;
												setPayload(pd);
											}}
											defaultValue={payload?.name || ""}
										/>
									</div>
								</div>
								<div class="col-xxl-6">
									<div>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Description'}
											require={false}
											icon={'add-icon'}
											onlyLetters={true}
											setValue={value => {
												const pd = { ...payload };
												pd['description'] = value;
												setPayload(pd);
											}}
										/>
									</div>
								</div>
							</div>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-light" onClick={hideModal}>Cancel</button>
						<button className="btn btn-primary" onClick={handleSave}>Save</button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	)
}

export default ManageRoles;