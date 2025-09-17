import React, { useEffect, useRef, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../common/Helpers';
import { baseImageUrl, getData } from '../../services/request';
import ProfilePic from '../../../src/assets/images/users/1.jpg';
import Print from '../admin/search/Print';
import { useDispatch } from "react-redux";
import ShowNoOfRecords from '../../common/ShowNoOfRecords';
import { setLoaderOff, setLoaderOn } from '../../store/loader';


const GuestHistory = props => {
	const dispatch = useDispatch()
	const gridRef = useRef();
	const [guestsData, setGuestsData] = useState([]);
	const [csvData, setCsvData] = useState([]);
	const [pageLimit, setPageLimit] = useState(10);

	// TODO: Add get url when backend api is created.
	const loadData = () => {
        
		const objStringify = sessionStorage.getItem('LoggedInEmployeeInfo');
		const objParsed = JSON.parse(objStringify);
		const prisonId = objParsed?.prisons[0]?.prisonId;
		getData(
			'/services/app/Darban/GetAllDarbanGuestEntry?prisonId=' + prisonId +"&insidePrison=1",
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
								exitDate: validateDate(e.exitDate),
								exittime: validateDate(e.exitDate)
									? new Date(e.exitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
									: "",
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
		'Exit Date',
		'Exit Time',
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
								<ShowNoOfRecords setPageLimit={setPageLimit} />
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
										'Exit Date',
										'Exit Time'
									]}
									search={true}
									sort={true}
									pagination={{
										enabled: true,
										limit: pageLimit
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

export default GuestHistory;
