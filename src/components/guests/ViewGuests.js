import React, { useEffect, useRef, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { formatDateAndTime, transformDataForTableGrid, validateDate } from '../../common/Helpers';
import { baseImageUrl, deleteData, getData, postData } from '../../services/request';
import ProfilePic from '../../../src/assets/images/users/1.jpg';
import swal from 'sweetalert';
import InputWidget from '../../droppables/InputWidget';
import Print from '../admin/search/Print';
import { useDispatch } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../store/loader";
import ShowNoOfRecords from '../../common/ShowNoOfRecords';


const ViewGuets = props => {
	const dispatch = useDispatch()
	const gridRef = useRef();
	const [guestsData, setGuestsData] = useState([]);
	const [csvData, setCsvData] = useState([]);
	// const [pageLimit, setPageLimit] = useState(10);
	// const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

	// TODO: Add get url when backend api is created.
	const loadData = () => {
		
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		const prisonId = objParsed?.prisons[0]?.prisonId;
		getData(
			'/services/app/Darban/GetAllDarbanGuestEntry?prisonId=' + prisonId +"&insidePrison=0",
			'',
			true
		)
			.then(result => {
				if (result && result.success) {
					const data = result.result.data;
					if (data.length > 0) {
                        
						const filterdData = data.map(e => {
							return {
								profile: _(
									<div className='profile-td profile-td-hover'>
										<div className='pic-view'>
											<img
												onError={(ev) => {
													ev.target.src = ProfilePic;
												}}
												className='avatar-xs rounded-circle '
												src={`${e.frontPic ?
													baseImageUrl + e.frontPic :
													ProfilePic
													}`}
												width='50'
											/>
										</div>
										<img
											onError={(ev) => {
												ev.target.src = ProfilePic;
											}}
											className='avatar-xs rounded-circle '
											src={`${e.frontPic ?
												baseImageUrl + e.frontPic :
												ProfilePic
												}`}
											width='50'
										/>
									</div>
								),
								fullName: e.fullName,
								designation: e.designation,
								organization: e.organization,
								otherRemarks: e.otherRemarks,
								visitDate: validateDate(e.visitDate),
								time: validateDate(e.visitDate)
									? new Date(e.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
									: "",
								Actions: _(
									<div className='action-btns'>
										<button
											type='button'
											onClick={() => {
												handleEditBtn(e);
											}}
											className='tooltip  btn btn-warning waves-effect waves-light'
										>
											<span>Edit</span>
											<i className='icon-edit'></i>
										</button>
										{e?.insidePrison && (
										<button
											type='button'
											onClick={() => {
												handleExitBtn(e);
											}}
											className='tooltip  btn btn-danger waves-effect waves-light'
										>
											<span>Exit</span>
											<i className='icon-exit'></i>
										</button>)}
									</div>
								)
							};
						});
						setGuestsData(transformDataForTableGrid(filterdData));
						setCsvData(filterdData);
						const gridjsInstance = gridRef.current.getInstance();
						gridjsInstance.on('rowClick', (...args) => {
						});
					} else {
                        
						setGuestsData([]);
					}
				} else {
					
					console.error('something went wrong');
				}
			})
			.catch(error => {
				
				console.log(error);
			});
	};

	const handleEditBtn = item => {
		sessionStorage.setItem('selectedGuest', JSON.stringify(item));
		props.setActiveTab(1);
	};

	const handleDelBtn = (item, event) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to delete: ' + item.name,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async willDelete => {
			if (willDelete) {
				swal('Deleted!', '', 'success').then(result => {
					let url = '';
					deleteData(url + item.id)
						.then(res => {
							if (res.success == true) {
								loadData();
							}
						})
						.catch(err => {
							console.log('error while deleting guest', err);
						});
				});
			}
		});
	};

	const handleExitBtn = (item, event) => {
		swal({
			title: 'Are you sure?',
			text: 'You want to Exit: ' + item.fullName+ '? This action is not reversable, neither will allow you to edit the details.',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async willDelete => {
			if (willDelete) {
				
				swal('Processing...', {
					buttons: false,
					closeOnClickOutside: false,
					closeOnEsc: false,
				});
				let url = '/services/app/Darban/ExitGuest';
				postData(url +"?id="+ item.id)
					.then(res => {
						swal.close();
						if (res?.result?.isSuccessful) {
							loadData();
							
							swal('Exited!', '', 'success');
						} else {
							
							swal('Failed to Exit!', '', 'error');
						}
					})
					.catch(err => {
						
						swal.close();
						console.log('error while deleting guest', err);
						swal('Error!', 'Failed to Exit.', 'error');
					});
			}
		});
	};
	

	useEffect(() => {
		loadData();
	}, []);

	const csvGridData = csvData.map(e => {
		const { Actions,profile,
			...rest } = e;
		return rest;
	});
	
	const modifiedHeaders = [
		'Name',
		'Designation',
		'Organization',
		'Other Remarks',
		'Date',
		'Time',
	];
	return (
		<>

			<div className='row gridjs'>
				<div className='col-xl-12 p-0'>
					<div className='card custom-card animation-fade-grids custom-card-scroll'>
						<div className='row '>
						<Print 
							data={transformDataForTableGrid(csvGridData)}
							headers={modifiedHeaders}
							filename={"Guest List"}
							/>
							<div className='col'>
							<div className="float-end">
								{/* <ShowNoOfRecords setPageLimit={setPageLimit} /> */}
								</div>
								<Grid
									ref={gridRef}
									data={guestsData}
									columns={[
										'Profile pic',
										'Name',
										'Designation',
										'Organization',
										'Other Remarks',
										'Date',
										'Time',
										'Action'
									]}
									search={true}
									sort={true}
									pagination={{
										enabled: true,
										limit: 10
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewGuets;
