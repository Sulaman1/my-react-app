/* eslint-disable react/prop-types */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import InputWidget from '../../../droppables/InputWidget';
import moment from 'moment-mini';
import { baseImageUrl } from '../../../services/request';
import { validateDate } from '../../../common/Helpers';
//import { useHistory } from 'react-router';
import { useNavigate } from "react-router-dom";

import { validateGloabalActionButtons } from './common/ValitdateActionButtons';

const CnicProfile = props => {
	const { personalInfo, joiningDate, biometricInfo, user, designationId, prisons } = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
	const [actionButton, setActionButton] = useState({edit: false, view: false, add: false});
	const prisonNames = prisons.map(item => item.prisonName);
	const hideModal = () => {
		props.setIsOpen(false);
		if (props.globalSearch) {
			props.resetFingerModal();
		}
	};
	// const history = useHistory();
	const navigate = useNavigate();

	const Id = props.data.id;

	const handlesDetails = id => {
		if (props?.data?.id) {
			navigate(`/admin/prisoner/prisoner-details/${props.data.id}`,{
				state: {
				  ignoreRedirect: true,
				},
			  });
		} else {
			swal('prisoner data is invalid', '', 'error');
		}
	};



	useEffect(()=> {
		if (props.globalSearch) {
			validateGloabalActionButtons(user, prisons, props.data, setActionButton);
		}
	},[props.data])

	const handleEditBtn = () => {
		sessionStorage.setItem('selectedPrisoner', JSON.stringify(props.data));
		sessionStorage.setItem('entryType', 'fromSearch');
		navigate('/admin/prisoner/manage-prisoners',{
			state: {
				response: 'success',
				ignoreRedirect: true
			},
		});
		// props.setActiveTab(1);
	};

	return (
		<>
			<Modal
				show={props.isOpen}
				onHide={hideModal}
				size="custom-xl" className=""
			>
				<Modal.Header
					closeButton
					style={{ padding: '1.25rem 1.25rem' }}
				>
					<h5 class='modal-title' id='exampleModalgridLabel'>
						Prisoner Info
					</h5>
				</Modal.Header>
				<Modal.Body style={{ height: 'auto' }} className='p-0'>
					<form>
						<div className='row card-row g-0'>
							<div className='inner row d-flex'>
								<div className='col-lg-8 '>
									<h2 className='user-name text-left'>
										{props.data.fullName}
										{' '}
										<span className="text-danger">{props.data.relationshipType}</span> {props.data.relationshipName}
									</h2>
									<p className="text-muted mb-4">
										<div className='inner-content'>
											<div className='row no-wrap'>
												<p className='dynamic-key col-lg-6'>
													Prison Name{' '}
												</p>{' '}
												<p className='dynamic-value col-lg-6'>
													{' '}
													{props.data.prisonName}
												</p>
											</div>
											<div className='row no-wrap'>
												<p className='dynamic-key col-lg-6'>
													{' '}
													Prisoner Number{' '}
												</p>{' '}
												<p className='dynamic-value col-lg-6'>
													{' '}
													{
														props.data
															.prisonerNumber
													}
												</p>
											</div>
											<div className='row no-wrap'>
												<p className='dynamic-key col-lg-6'>CNIC </p>{' '}
												<p className='dynamic-value col-lg-6'>
													{' '}
													{props.data.cnic}
												</p>
											</div>
											{/* <div className='row no-wrap'>
												<p className='dynamic-key col-lg-6'>
													{' '}
													Prisoner Number{' '}
												</p>{' '}
												<p className='dynamic-value col-lg-6'>
													{' '}
													{
														props.data
															.prisonerNumber
													}
												</p>
											</div> */}
										</div>
									</p>
								</div>
								<div className="col-lg-4 card-slider  h-50">
									<Carousel>
										<Carousel.Item className="slide-item">
											<div className="subscribe-modals-cover ">
												<img
													alt='image'
													src={
														baseImageUrl +
														props?.data?.frontPic
													}
												/>
											</div>
										</Carousel.Item>
										<Carousel.Item className="slide-item">
											<div className="subscribe-modals-cover">
												<img
													alt='image'
													src={
														baseImageUrl +
														props?.data?.leftPic
													}
												/>
											</div>
										</Carousel.Item>
										<Carousel.Item className="slide-item">
											<div className="subscribe-modals-cover">
												<img
													alt='image'
													src={
														baseImageUrl +
														props?.data?.rightPic
													}
												/>
											</div>
										</Carousel.Item>
									</Carousel>


								</div>
							</div>
							<div className='card-footer'>
								<div className='row'>
									<p className='key'>
										ADMISSION DATE:{' '}
										{validateDate(props?.data?.admissionDate) || "Not Admitted Yet"}
									</p>
								</div>
							</div>
						</div>
						{props.circleOffice &&
							<div className='card'>
								<div className='card-body'>
									<h4 className='third-heading'>Check in details</h4>
									<form className='row d-flex just-space'>
										<div className='col-lg-6'>
											<InputWidget
												id={'chaeckin'}
												type={'input'}
												inputType={'date'}
												label='Checkin'
												icon={'icon-event'}
												require={false}
												setValue={value => { }}
											/>
											<InputWidget
												id={'chackout'}
												type={'input'}
												inputType={'date'}
												label='chackout'
												icon={'icon-event'}
												require={false}
												setValue={value => { }}
											/>
										</div>
										<div className='col-lg-6'>
											<InputWidget
												type={'multiSelect'}
												ismulti={false}
												inputType={'select'}
												label={'Reason'}
												require={true}
												icon={'icon-web'}
												options={
													props?.lookUps?.nationlities || []
												}
												defaultValue={[]}
											/>
										</div>
										<div className='col-lg-6'>
											<InputWidget
												id={'chaeckin'}
												type={'textarea'}
												inputType={'date'}
												label='Remarks'
												icon={'icon-event'}
												require={false}
												setValue={value => { }}
											/>
										</div>
									</form>
								</div>
							</div>
						}
					</form>
				</Modal.Body>
				<Modal.Footer>
					{props?.isCheckout ? (
						<>
							<button className='btn btn-primary' onClick={() => {
props?.checkoutPrisoner(props.data); hideModal();
}}>
								Approve Checkout
							</button>
						</>
					) :
						<>
							{user.roleNames.indexOf('Darban') == -1 && (
								<>
									<button className='btn btn-primary' onClick={props.isRedirect ? handlesDetails : hideModal}>
										ok
									</button>
									{(actionButton.edit && props.globalSearch) && (
										<button className='btn btn-warning' onClick={handleEditBtn}>
											Edit Prisoner
										</button>
									)}
									{(actionButton.add && props.globalSearch) && (
									<button className='btn btn-warning' onClick={handleEditBtn}>
										Add Prisoner
									</button>
									)}

									
								</>
							)}
							<button className='btn btn-success' onClick={handlesDetails}>
								View Details
							</button>
						</>
					}


				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CnicProfile;
