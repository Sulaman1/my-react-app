import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import nodataImage from "../../../assets/images/1.jpg";
import {
	transformDataForTableGrid,
	transformData,
	transfromStringArray
} from '../../../common/Helpers';
import {
	deleteLookupData,
	onLoadData,
	postAdd,
	onLoadDropData
} from '../../../store/lookups';
import Modal from 'react-bootstrap/Modal';
import InputWidget from '../../../droppables/InputWidget';
import { deleteLookupName, lookupName, saveLookupName } from './lookupNames';
import swal from 'sweetalert';
import { getData } from '../../../services/request';
import Print from '../search/Print';
import { fetchLookupsFromAPI } from '../../../store/dropdownLookupApi';
import Loader2 from '../../../common/Loader2';
import ShowNoOfRecords from '../../../common/ShowNoOfRecords';
//import useBreadcrumbs from "use-react-router-breadcrumbs";
import { exceptions } from './LookupHeading';

/*
- api call and dynamics of the call for lookup data
- 
*/

const routes = [
	{ path: "/", breadcrumb: "Home" },
	{ path: "/admin/administration", breadcrumb: "Dashboard" },
	{ path: "/tourist/", breadcrumb: "Dashboard" },
	{ path: "/admin/dashboard/over-view", breadcrumb: "Overview" },
	{ path: "/tourist/dashboard/over-view", breadcrumb: "Dashboard" },
	{ path: "admin/employee-new-view/over-view", breadcrumb: "Overview" },
	{
	  path: "/tourist/Employee-new-view/over-view",
	  breadcrumb: "Employee-New-view",
	},
  ];
  
const MetaLookups = props => {
	const { search, pathname } = useLocation();
	const tp = pathname.split('/');
	const type = tp[tp.length - 1];
	
	const lookupData = new URLSearchParams(search).get('filter');
	const lookupId = new URLSearchParams(search).get('id');
	const lookupDataTwo = new URLSearchParams(search).get('filterTwo');
	const lookupIdTwo = new URLSearchParams(search).get('idTwo');
	const isBarrack = new URLSearchParams(search).get('isBarrack');
	const isCap = new URLSearchParams(search).get('isCap');
	const [circleOffice, setCircelOffice] = useState([])
	const [header, setHeader] = useState('');
	const [pageLimit, setPageLimit] = useState(10);


	const [barrackType, setBarrackType] = useState([
		{ label: 'barrack', value: 1 },
		{ label: 'cell', value: 2 }
	]);
	const lookupType = type;
	const handleEditBtn = (item, event) => {
		let firsDropDown = "";
		let secondDropDown = "";
		const pl = {
			...item
		};

		if (lookupId) {
			firsDropDown = dropDownData.filter(ele => ele.id === item[lookupId])[0] || '';
			pl['lookup'] = { value: firsDropDown.id, label: firsDropDown.name } || '';
		}
		if (lookupIdTwo) {
			secondDropDown = dropDownDataTwo.filter(ele => ele.id === item[lookupIdTwo])[0] || '';
			pl['lookupTwo'] = { value: secondDropDown.id, label: secondDropDown.name } || '';
		}
		console.log('plllll', pl)
		setPayload(pl);
		showModal();
	};

  const breadcrumbs = useBreadcrumbs(routes, { excludePaths: ["/admin", "/", " Dashboard", "system-settings"] });
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
 
  const getCustomHeading = (breadcrumb) => {
    const lowerCaseBreadcrumb = breadcrumb.toLowerCase();
    return exceptions[lowerCaseBreadcrumb] || breadcrumb;
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
				dispatch(deleteLookupData(deleteLookupName[type], item.id));
				swal('Deleted!', '', 'success').then(result => {
					dispatch(onLoadData(lookupName[type]));
				});
			}
		});
	};

	const getLookupInfo = (id, data) => {

		const filterdLookup = data.filter(item => item.id === id)[0];
		return filterdLookup?.name || "N/A";
	}

	const countryData = useSelector(state => {
		const _state = state;

		console.log('_state', _state)
		const filterdData = state?.lookups?.countries.map(e => {
			let item = {
				name: e.name,
				description: e.description,
			};
			
			item[lookupType == 'medicine' ? 'generic name' :'abbreviation'] = e?.abbreviation || null
		
			if (isBarrack) {
				item['prisonBarrackTypes'] = e.prisonBarrackTypes
				item['Enclosure'] = e.circle;
			}
			if (isCap) {
				item['capacity'] = e.capacity
			}
			if (lookupId && _state?.lookups?.lookupData[lookupData]?.length > 0) {
				item[lookupData] = getLookupInfo(e[lookupId], _state.lookups.lookupData[lookupData])
			}
			
			if (lookupIdTwo && _state?.lookups?.lookupData[lookupDataTwo]?.length > 0 && isBarrack !== "true") {
				item[lookupDataTwo] = getLookupInfo(e[lookupId], _state.lookups.lookupData[lookupDataTwo]);
			}
			item['Action'] = _(
				<div className=' action-btns'>
					<button
						type='button'
						onClick={() => {
							handleEditBtn(e);
						}}
						class='btn btn-warning waves-effect waves-light tooltip'
					>
						<i class='icon-edit'></i>
						<span>Edit</span>
					</button>
				</div>
			)
			return item;
		});
		console.log('filterdData', filterdData[0])
		return filterdData;
	});

	const dropDownData = useSelector(
		state => state?.lookups?.lookupData[lookupData]
	);
	const dropDownDataTwo = useSelector(
		state => state?.lookups?.lookupData[lookupDataTwo]
	);
	const isLoading = useSelector(
		state => state?.lookups?.loading || false
	);
	const [payload, setPayload] = useState({});
	const [isOpen, setIsOpen] = React.useState(false);


	const gridRef = useRef();
	const dispatch = useDispatch();


	useEffect(() => {
		console.log(type);
		dispatch(onLoadData(lookupName[type]));
		if (lookupData) {
			dispatch(onLoadDropData(lookupName[lookupData], lookupData));
		}
		if (lookupDataTwo) {
			dispatch(onLoadDropData(lookupName[lookupDataTwo], lookupDataTwo));
		}
	}, [dispatch]);





	const showModal = () => {

		setIsOpen(true);
	};

	const hideModal = () => {
		setIsOpen(false);
	};

	const handleSave = async event => {
		event.preventDefault();
		console.log(payload);
		if(!payload.name){
			swal('Error!', 'Name is required', 'error');
			return;
		}
		if (payload.lookup) {
			delete payload.lookup
		}
		if (payload.lookupTwo) {
			delete payload.lookupTwo
		}
		if (isBarrack) {
			payload.barrackTypeId = payload?.barrackTypeId?.value || 0
		}
		dispatch(postAdd(saveLookupName[type], { data: payload }));
		
		hideModal();
		try {
            const lookupAction = await fetchLookupsFromAPI();
            dispatch(lookupAction);
          } catch (error) {
            console.error('error in lookups while saving in metalookups component::: ', error);
          }
		setTimeout(() => {
			dispatch(onLoadData(lookupName[type]));
			if (lookupData) {
				dispatch(onLoadDropData(lookupName[lookupData]));
			}
		}, 1000);
	};


	const loadData = (countryData) => {
		console.log('loadData', countryData)
		const keys = Object.keys(countryData[0])
		const titles = keys.map(item => {
			if (item.toLowerCase() === "judgetype") {
				return 'Judge Type'
			}
			if (item.toLowerCase() === "prisonertype") {
				return 'Prisoner Type'
			}
			return item;
		});
		setHeader(titles)
	}

	useEffect(() => {
		console.log('countryDataUseEffect', countryData)
		if (countryData && countryData.length > 0) {
			loadData(countryData)
		} else {
			dispatch(onLoadData(lookupName[type]));
		}
	}, [])

	const csvData = countryData.map(e => {
		const { Action, ...rest } = e;
		return rest;
	});
	const modifiedHeaders = header?.slice(0, -1) || header;
	
	return (
		<>
		{isLoading && (

				<Loader2 />
			)}
			<div className='row gridjs card p-3'>
				<div className='col-xl-12 p-0'>
					<div className=' custom-card'>
						<div className='row mt-2'>

										<h2><b> {getCustomHeading(lastBreadcrumb?.breadcrumb?.props.children)}</b></h2>
										
							<div className='col' >
									<div className='row justify-content-between' style={{marginBottom: "-2rem"}}>
											<div className='d-flex justify-content-between'>
										<Print 
											data={transformDataForTableGrid(csvData)}
											headers={modifiedHeaders}
											filename={"system setting"}
										/>
										<button
											type='button'
											onClick={() => { setPayload({}); showModal() }}
											class='btn btn-primary float-end'
											style={{height: "3rem", width: "4rem"}}
										>
											Add
										</button>
										</div>
									</div>

								{countryData.length && (
									<>
											<div className='animation-fade-grids'>
									<div className="float-end">
									<ShowNoOfRecords setPageLimit={setPageLimit} />
									</div>
									<Grid
										ref={gridRef}
										data={transformDataForTableGrid(
											countryData
										)}
										columns={header}
										search={true}
										sort={true}
										pagination={{
											enabled: true,
											limit: pageLimit

										}}
									/>
									</div>
									</>
								)}

								{!countryData.length && <div className='no-data'>
									<div>
											<img src={nodataImage} alt="" />
											<span>No data found</span>
										</div>
										</div>}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal show={isOpen} onHide={hideModal} className="modal-inner-lg">
				<Modal.Header
					closeButton
					style={{ padding: '1.25rem 1.25rem' }}
				>
					<h5 class='modal-title' id='exampleModalgridLabel'>
						Add Record
					</h5>
				</Modal.Header>
				<Modal.Body>
					<form className='col-lg-12  justify-content-center'>
						<div class='row g-3'>
							<div class='col-xxl-12'>
								<div>
									<InputWidget
										type={'input'}
										inputType={'text'}
										label={'Name'}
										require={false}
										icon={'icon-user'}
										setValue={value => {
											const pd = { ...payload };
											pd['name'] = value;
											setPayload(pd);
										}}
										defaultValue={payload?.name || ''}
									/>
								</div>
							</div>

							{lookupData && (
								<div class='col-xxl-12'>
									<div>
										<InputWidget
											type={'multiSelect'}
											ismulti={false}
											inputType={'select'}
											label={lookupData}
											require={false}
											icon={'icon-building'}
											defaultValue={payload?.lookup || []}
											options={transformData(
												dropDownData
											)}
											setValue={value => {
												const pd = { ...payload };

												if (isBarrack === 'true') {
													pd['lookupTwo'] = '';
													const filteredCircel = dropDownDataTwo.filter(item => item.prisonId === value.value);
													setCircelOffice(filteredCircel);
												}
												pd['lookup'] = value;
												pd[lookupId] = value.value;
												setPayload(pd);
											}}

										/>
									</div>
								</div>
							)}

							{lookupDataTwo && (
								<div class='col-xxl-12'>
									<div>
										<InputWidget
											type={'multiSelect'}
											ismulti={false}
											inputType={'select'}
											label={lookupDataTwo}
											require={false}
											icon={'icon-building'}
											options={transformData(
												circleOffice?.length > 0 ? circleOffice : dropDownDataTwo
											)}
											defaultValue={payload?.lookupTwo || []}
											setValue={value => {
												const pd = { ...payload };
												pd['lookupTwo'] = value;
												pd[lookupIdTwo] = value.value;
												setPayload(pd);
											}}

										/>
									</div>
								</div>
							)}
							{isBarrack && (
								<div class='col-xxl-12'>
									<div>
										<InputWidget
											type={'multiSelect'}
											inputType={'name'}
											label={'Barrack Types'}
											require={false}
											icon={'icon-planer'}
											options={barrackType}
											defaultValue={payload?.barrackTypeId}
											//onlyLetters={true}
											setValue={value => {
												const pd = { ...payload };
												pd['barrackTypeId'] = value;
												setPayload(pd);
											}}

										/>
									</div>
								</div>
							)}
							{isCap && (
								<div class='col-xxl-12'>
									<div>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={'Capacity'}
											require={false}
											icon={'icon-menu-bar'}
											onlyNumbers={true}
											setValue={value => {
												const pd = { ...payload };
												pd['capacity'] = value;
												setPayload(pd);
											}}
											defaultValue={
												payload?.capacity || ''
											}
										/>
									</div>
								</div>
							)}
								<div class='col-xxl-12'>
									<div>
										<InputWidget
											type={'input'}
											inputType={'name'}
											label={lookupType === 'medicine' ? 'Generic Name' : 'Abbrevation'}
											require={false}
											icon={'icon-chat'}
											onlyLetters={false}
											setValue={value => {
												const pd = { ...payload };
												pd['abbreviation'] = value;
												setPayload(pd);
											}}
											defaultValue={
												payload?.abbreviation || ''
											}
										/>
									</div>
								</div>

							<div className='col-xxl-12'>
								<div>
									<InputWidget
										type={'textarea'}
										inputType={'name'}
										label={'Description'}
										require={false}
										icon={'icon-chat'}
										onlyLetters={false}
										setValue={value => {
											const pd = { ...payload };
											pd['description'] = value;
											setPayload(pd);
										}}
										defaultValue={
											payload?.description || ''
										}
									/>
								</div>
							</div>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					{type === 'policeStation' && (
						<span className="text-danger fw-bold">Note: When adding a police station, also add the name of the District in the Police Station name field.</span>
					)}
					<button className='btn btn-light' onClick={hideModal}>
						Cancel
					</button>
					<button className='btn btn-primary' onClick={handleSave}>
						Save
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default MetaLookups;
