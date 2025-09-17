import React, { useEffect, useState, useRef } from 'react';
import { Grid, _ } from 'gridjs-react';
import {
	scrollToTop,
	transformDataForTableGrid,
} from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { getData, postData } from '../../../services/request';
import swal from 'sweetalert';
import PrisonerInfoCard from './release-prisoner/PrisonerInfoCard';

const PrisonerBelongings = props => {
	const gridRef = useRef();
	const [formPayload, setFormPayload] = useState({
	});
	const [userData, setUserData] = useState([]);
	const [prisonerId, setPrisonerId] = useState(null);
	const belongingData = [
		{
			"Serial No": 21,
			"Item Name": 21,
			'Description': 21,
			'Actions': ''
		}
	];

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		const data = sessionStorage.getItem('selectedPrisoner');

		if (data) {
			const parsedId = JSON.parse(data).id;
			setPrisonerId(parsedId);
			getData(
				'/services/app/PrisonerDetailInformation/GetPrisonerBellongings?PrisonerId=' +
				parsedId
			)
				.then(res => {
					// if (res && res.result.isSuccessful) {
					const data = res.result.data;
					if (data.length > 0) {
						const filterdData = data.map(e => {
							return {
								serialNo: e?.id,
								itemName: e?.itemName,
								itemDescription: e?.itemDescription,
								Action: _(
									<div className='action-btns'>
										<button
											id={'edit-btn'}
											type='button'
											className='btn btn-secondary waves-effect waves-light mx-1'
											onClick={() => handleEditBtn(e)}
										>
											<i className='icon-edit'></i>
										</button>
										<button
											id={'delete-btn'}
											type='button'
											onClick={() => {
												handleDelBtn(e);
											}}
											className='btn btn-success waves-effect waves-light mx-1'
										>
											<i className='icon-delete'></i>
										</button>
									</div>
								)
							};
						});
						setUserData(transformDataForTableGrid(filterdData));
					} else {
						setUserData([]);
					}
				})
				.catch(err => {
					console.log(err, 'getting error while fetching API {GetAllBelonging} & fileName is {PrisonerBelonging.js}');
				});
		}
	};

	const handleEditBtn = item => {
		scrollToTop();
		setFormPayload({ ...item });
	};

	const handleDelBtn = (item, event) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to delete: ' + item.itemName,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async willDelete => {

			if (willDelete) {
				
				postData(
					'/services/app/PrisonerDetailInformation/DeletePrisonerBellongings?BellongingsId=' +
					item.id
				)
					.then(res => {
						if (res.success == true) {
							swal('Deleted!', '', 'success').then(result => {
								loadData();
							});

						}
					})
					.catch(err => {
						swal(err.message, err.details ?? '', 'warning');
						// console.log(err, 'getting error while deleting API {DeleteDependent} & fileName is {Dependent.js}');
					});

			}
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!formPayload.itemName) {
			swal('Please enter Item Name', '', 'warning');
			return;
		}
		formPayload['prisonerBasicInfoId'] = prisonerId;
		postData(
			'/services/app/PrisonerDetailInformation/CreateUpdatePrisonerBellongings',
			formPayload
		)
			.then(res => {
				if (res.success == false) {
					swal(
						!res.error.details ? '' : res.error.message,
						res.error.details
							? res.error.details
							: res.error.message,
						'warning'
					);
				} else {
					setFormPayload({
						"itemName": "",
						"itemDescription": ""
					});
					swal('Successfully Saved!', '', 'success');
					loadData();
				}
			})
			.catch(err => {
				swal('Something went wrong!', err, 'warning');
				console.log(err, 'getting error while upserting API {CreateUpdatePrisonerBellongings} & fileName is {PrisonerBelongings.js}');
			});

	};

	return (
		<>
			<PrisonerInfoCard prisoner={props?.prisoner} />
			<div className='row p-2'>
				<div className='row'>
					<h4 className='third-heading'>Add Belonging's</h4>
				</div>
				<form>
					<div className='row'>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								id={'name'}
								label={'Item Name'}
								require={false}
								icon={'icon-operator'}
								defaultValue={formPayload.itemName}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['itemName'] = value;
									setFormPayload(payload);
								}}
							/>
						</div>
						<div className='col-lg-6'>
							<InputWidget
								type={'input'}
								inputType={'name'}
								label={'Description'}
								require={false}
								id={'description'}
								icon={'icon-file'}
								defaultValue={formPayload.itemDescription}
								setValue={value => {
									const payload = {
										...formPayload
									};
									payload['itemDescription'] = value;
									setFormPayload(payload);
								}}
							/>
						</div>
					</div>
					<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
						<button
							id={'save-btn'}
							type='button'
							onClick={handleSubmit}
							className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
						>
							Save <i className='icon-add ml-2'></i>
						</button>
					</div>
				</form>
			</div>
			<Grid
				ref={gridRef}
				data={transformDataForTableGrid(userData)}
				columns={Object.keys(belongingData[0])}
				search={true}
				sort={true}
				pagination={{
					enabled: true,
					limit: 10,
				}}
			/>
		</>
	);
};

export default PrisonerBelongings;
