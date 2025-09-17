import React, { useEffect, useState, useRef } from 'react';
import ProfilePic from '../../../../src/assets/images/users/1.jpg'
import FingerPrint from '../../../../src/assets/images/users/1.gif'
import Logo from '../../../../src/assets/images/1.jpeg'
import $ from "jquery";
import { ICONS } from '../../../services/icons';
//import { useHistory } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

import { baseImageUrl } from '../../../services/request';
import { formatDate, transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import PrisonerCases from './PrisonerCases';
import BarrackHistory from './BarrackHistory';
import TransferHistory from './TransferHistory';
import VisitorHistory from './VisitorHistory';
import InPrisonEducation from './InPrisonEducation';
import OffenceManagementHistory from './OffenceManagementHistory';
import AppealHistory from './AppealHistory';
import { Grid, _ } from "gridjs-react";

const PrintDetails = (props) => {
	const [userData, setUserData] = useState('');
	console.log("USER DATA", userData)
	const [medicalData, setMedicalData] = useState('');
	const [loadedAppealEntries, setLoadedAppealEntries] = useState([]);
	const [isPrint] = useState(true);
	//const history = useHistory()
	const navigate = useNavigate();


	const myElementRef = useRef(null);
	
	const stateParamVal = useLocation().state?.stateParam;
	console.log("STATE PARAM", stateParamVal)
	useEffect(() => {

		if (stateParamVal?.personalData || stateParamVal?.medical) {
			setUserData(stateParamVal?.personalData)
			setMedicalData(stateParamVal?.medical)

		}
		else {
			return false;
		}
		loadAppealData()
		

	}, []);


	useEffect(() => {
		const timeout = setTimeout(() => {
			handlePrint();
		}, 200);
		return () => clearTimeout(timeout);
	}, [])

	const loadAppealData = () => {
		if (stateParamVal?.personalData?.appeals) {
		  const filteredData = stateParamVal?.personalData?.appeals?.map((e) => {
			return {
			  court: e?.court,
			  remarks: e?.remarks,
			  firNo: e?.case?.firNo,
			  appealDate: validateDate(e?.appealDate),
			  appealNo: e?.appealNumber,
			  preference: e?.preference,
			  appealType: e?.type,
			  appealDocument: _(
				<div className="profile-td profile-td-hover">
				  <img
					src={e?.appealDocument ? baseImageUrl + e?.appealDocument : ProfilePic}
					className="avatar-xs rounded-circle"
					alt=""
					style={{ cursor: 'pointer' }}
				  />
				</div>
			  ),
			};
		  });
		  setLoadedAppealEntries(transformDataForTableGrid(filteredData));
		} else {
		  setLoadedAppealEntries([]);
		}
	  };


	const handlePrint = () => {
		var restorepage = $('body').html();
		var printcontent = $('#my-element').clone();
		$('body').empty().html(printcontent);
		window.print();
		$('body').html(restorepage);
		// onafterprint = function () {
		// 	// window.location.href = "index.html";
		// 	console.log(stateParamVal,'userData!!!')
		// }
		// history.goBack()
	}

	const formatCustomDateTime = (date) => {
		const pad = (num) => num.toString().padStart(2, '0');
		
		const day = pad(date.getDate());
		const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
		const year = date.getFullYear();
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
	
		return {
		  date: `${month}-${day}-${year}`,
		  time: `${hours}:${minutes}`
		};
	  };

	  const currentDateTime = formatCustomDateTime(new Date());

	  
	return (

		<>

			<button type="button" className="btn btn-success btn-label print-btn" onClick={handlePrint}>
				<i className='custom-icon-white' dangerouslySetInnerHTML={{ __html: ICONS.print }}></i>
			</button>
			<div id="my-element" ref={myElementRef}>
				<style>
					{
						`
						body {
						   -webkit-print-color-adjust: exact;
							print-color-adjust: exact;
							background: none !important; }
						.print-prisnor {
						color: #000 !important;
						background: #fff !important; }
						.personal-b-heading h5{
						font-size: 18px !important;
						font-weight: bold;
						}
						.print-prisnor p {
							margin-bottom: 0 !important; }
						.print-prisnor .container {
							width: 100%;
							padding:3%;
							margin:0;
							box-sizing: border-box;
							max-width: inherit; }
							 .section-heading {
								text-align: center;
								font-weight: bold;
								margin-top: 20px;
								font-size: 25px;
								color: #000
							}
								.section-heading-main{
									text-align: center;
									font-weight: bold;
									margin-top: 8px;
									padding: 9px 0;
									border-top: 1px solid #000;
									border-bottom: 1px solid #000;
									color: #000;
									font-size: 26px;
								}
								.permanent-h{
									font-size: 16px !important;
									white-space: nowrap;
									width: 100%;
									max-width: 310px;
									color: #000 !important;
									text-overflow: ellipsis;
									overflow: hidden;

								}
						.print-prisnor .top {
							box-sizing: border-box;
							background: #fff !important;
							 }
							.print-prisnor .top .text {
								color: #000 !important; }
								.print-prisnor .top .text i {
									margin-right: 10px; }
							.print-prisnor .top .container {
								display: flex;
								justify-content: space-between;
								align-items: center; }
							.print-prisnor .top .inner {
								width: 100%;
								display: flex; }
							.print-prisnor .top .logo {
								display: flex;
								justify-content: flex-start;
								align-items: center;
								gap: 10px; }
								.print-prisnor .top .logo img {
									width: 100px;
									height: 100px; }
								.print-prisnor .top .logo .text {
									color: #000 !important; }
									.print-prisnor .top .logo .text p {
										width: 300%;
										font-size: 22px;
										margin: 0; }
									.print-prisnor .top .logo .text span {
										width: 100%;
										font-size: 30px;
										clear: both; }
						.print-prisnor .light-header {
							box-sizing: border-box;
							background: #f5f5f5;
							padding: 0px 0;
							width: 100%; }
							.print-prisnor .light-header .inner {
								display: flex;
								justify-content: space-between;
								align-items: center; }
							.print-prisnor .light-header .text h2 {
								margin-bottom: 0; }
								.print-prisnor .light-header .text h2 label {
									margin-bottom: 0; }
							.print-prisnor .light-header .text span {
								font-size: 18px; }
						.print-prisnor h5 {
							padding: 0; }
						.print-prisnor .photos {
							box-sizing: border-box;
							padding: 0px 0;
							width: 100%; }
							.print-prisnor .photos .left::after {
								content: "";
								position: absolute;
								width: 0;
								top: 0;
								right: -100px;
								height: 0;
								border-bottom: 245px solid transparent;
								border-right: 100px solid transparent;
						}
						.gridjs-footer {
							display:none;
						}
							.print-prisnor .photos .left {
								background: transparent !important;
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 5rem;
								padding: 20px 20px;
								position: relative;
								margin-bottom: 2rem;
								}
							.print-prisnor .photos .right {
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 10rem;
								padding: 30px 20px 100px 20px; }
							.print-prisnor .photos .single-photo {
								position: relative;
								width: 200px;
								height: 200px;
								padding-top: 0px;
								box-sizing: border-box; }
								.print-prisnor .photos .single-photo img {
									width: 200px;
									height: 200px;
									border: 2px solid #e9e9e9;
									border-radius: 5px;
									z-index: 99;
									position: absolute;
									top: 10%;
									left: 0px;
									object-fit: cover; }
									.gridjs-search {
										display:none;
									}
									.gridjs-head {
										display:none;
									}
								.print-prisnor .photos .single-photo .text {
									color: black;
									position: absolute;
									width: 100%;
									top: 120%;
									text-align: center;
									text-transform: capitalize;
									font-size: 14px; }
							.print-prisnor .photos .sub-header {
								display: grid;
								align-items: center;
								grid-template-columns: 100%;
								justify-content: space-between; }
								.print-prisnor .photos .sub-header h1 {
									font-size: 120px;
									color: #ef4f4c; }
						.print-prisnor .heading {
							background: #e9e9e9;
							padding: 10px !important;
							border-bottom: 1px solid #9ba3af;
							margin-bottom: 10px;
							font-size: 22px; }
					
					.print-marasla {
						background: #fff; }
						.print-marasla p {
							margin-bottom: 0 !important; }
						.print-marasla .container {
							width: 100%;
							padding: 3%;
							box-sizing: border-box;
							max-width: inherit; }
						.print-marasla .top {
							box-sizing: border-box;
							background: #405189; }
							.print-marasla .top .text {
								color: #fff; }
								.print-marasla .top .text i {
									margin-right: 10px; }
							.print-marasla .top .container {
								display: flex;
								justify-content: space-between;
								align-items: center; }
							.print-marasla .top .inner {
								width: 100%;
								display: flex; }
							.print-marasla .top .logo {
								display: flex;
								justify-content: flex-start;
								align-items: center;
								gap: 10px; }
								.print-marasla .top .logo img {
									width: 100%;
									height: 100%; }
								.print-marasla .top .logo .text {
									color: #fff; }
									.print-marasla .top .logo .text p {
										width: 100%;
										font-size: 12px;
										margin: 0; }
									.print-marasla .top .logo .text span {
										width: 100%;
										font-size: 24px;
										clear: both; }
						.print-marasla .light-header {
							box-sizing: border-box;
							background: #f5f5f5;
							padding: 0px 0;
							width: 100%; }
							.print-marasla .light-header .single-photo {
								position: relative;
								width: 25%;
								height: 150px;
								padding-top: 150px;
								box-sizing: border-box; }
								.print-marasla .light-header .single-photo img {
									width: 150px;
									height: 150px;
									border: 5px solid #e9e9e9;
									border-radius: 50%;
									z-index: 99;
									position: absolute;
									top: 10%;
									left: 0px;
									object-fit: cover; }
								.print-marasla .light-header .single-photo .text {
									color: #fff;
									position: absolute;
									width: 100%;
									top: 120%;
									text-align: center;
									text-transform: capitalize; }
							.print-marasla .light-header .inner {
								display: flex;
								justify-content: space-between;
								align-items: center; }
							.print-marasla .light-header .profile {
								display: flex;
								align-items: center;
								justify-content: flex-start;
								gap: 20px; }
							.print-marasla .light-header .text h2 {
								margin-bottom: 0; }
								.print-marasla .light-header .text h2 label {
									margin-bottom: 0; }
							.print-marasla .light-header .text span {
								font-size: 18px; }
						.print-marasla .photos {
							box-sizing: border-box;
							background: #e9e9e9;
							padding: 0px 0;
							width: 100%;
							background: #3972c7; }
							.print-marasla .photos .left {
								background: #f5f5f5;
								display: flex;
								align-items: center;
								justify-content: space-between;
								gap: 30px;
								padding: 0;
								position: relative; }
							.print-marasla .photos .single-photo {
								position: relative;
								width: 25%;
								height: 150px;
								padding-top: 150px;
								box-sizing: border-box; }
								.print-marasla .photos .single-photo img {
									width: 100%;
									height: 100%;
									border: 5px solid #e9e9e9;
									border-radius: 50%;
									z-index: 99;
									position: absolute;
									top: 10%;
									left: 0px;
									object-fit: cover; }
								.print-marasla .photos .single-photo .text {
									color: #fff;
									position: absolute;
									width: 100%;
									top: 120%;
									font-size: 18px;
									text-align: center;
									text-transform: capitalize; }
							.print-marasla .photos .sub-header {
								display: grid;
								align-items: center;
								grid-template-columns: 48% 48%;
								justify-content: space-between; }
								.print-marasla .photos .sub-header h1 {
									font-size: 120px;
									color: #ef4f4c; }
						.print-marasla .heading {
							background: #e9e9e9;
							padding: 10px !important;
							border-bottom: 1px solid #9ba3af;
							margin-bottom: 10px;
							font-size: 22px; }
					
					.third-heading {
						background-color: #fff;
						padding: 10px !important;
						color: black; }
					
					.list-group-flush {
						padding: 10px;
						box-sizing: border-box; }
						.list-group-flush > .list-group-item:last-child {
							border-bottom: none!important; }
					
					.list-group-item {
						color: black;
						list-style: none;
						border: none!important; }
						.list-group-item .pagi-list {
							display: flex;
							justify-content: space-between;
							align-items: center; }
							.list-group-item .pagi-list .flex-shrink-0 h3 {
								min-width: 280px;
								font-weight: bold;
								text-align: left !important; }
					
					.dynamic-value {
						white-space: nowrap;
						width: 100%;
						font-size: 16px !important;
						font-weight: 500 !important;
						max-width: 310px;
						margin-bottom: 0;
						color: #0e0e0e !important;
						text-overflow: ellipsis;
						text-align: left;
						min-width: 280px;
						overflow: hidden; }
					
					.dynamic-key {
						white-space: nowrap;
						width: 100%;
						max-width: 310px;
						font-size: 14px !important;
						color: #393939 !important;
						text-overflow: ellipsis;
						color: #7a869a;
						overflow: hidden; }
					
					/*# sourceMappingURL=app.css.map */
					
					body {
						font-family: 'Open Sans', sans-serif;
					}
				
					h5 {
						padding: 0 !important;
						margin: 0;
					}
				
					.badge {
						padding: 10px;
						border-radius: 3px;
					}
					.list-box .value {
						font-size:22px !important;
					}
				
				
					.badge-soft-info {
						color: #299cdb;
						background-color: rgba(41, 156, 219, .1);
					}
				
					.badge-soft-warning {
						color: #f7b84b;
						background-color: rgba(247, 184, 75, .1);
					}
				
					.badge-soft-success {
						color: #0ab39c;
						background-color: rgba(10, 179, 156, .1);
					}
				
					.card {
						width: 30%;
						height: auto;
						border-radius: 5px;
						padding: 15px;
						box-sizing: border-box;
						border: 1px solid rgb(232, 232, 232);
						border-left: 5px solid rgb(200, 200, 200);
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				
					.profile-project-danger {
						border-left: 5px solid #f06548;
					}
				
					.profile-project-warning {
						border-left: 5px solid #f7b84b;
					}
				
					.profile-project-success {
						border-left: 5px solid #0ab39c;
					}
				
					.card a {
						text-decoration: none;
						color: rgb(59, 59, 59);
				
					}
				
				
				
					.row {
						--vz-gutter-x: 0rem;
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						padding:10px 0;
					}`
					}
				</style>

				<div class='print-prisnor'>
					<section class='top container' style={{backgroundColor: '#fff !important'}}>
						<div class='container '>
							<div class="logo">
								<img src={Logo} alt="" height="17" />
								<h3 class='text'>
									<p>Prisons Department of </p>
									<span>{process.env.REACT_APP_PRISON_NAME}</span>
								</h3>
							</div>
							<h3 class='text'>
								<p style={{fontWeight: 'bold', fontSize: '30px' , marginTop: '-10px' , paddingBottom: '10px'}}>Prisoner Profile </p>
								<span style={{borderRight: "1px solid black", paddingRight: '10px'}}>{currentDateTime?.date}</span>
								<span className='ms-2 '>{currentDateTime?.time}</span>
							</h3>
						</div>
					</section>
					<section class='photos' >
						<div class='container '>
								<h4 className='section-heading'>Visual Information</h4>
							<div class=' sub-header'>
								<div class='left'>
									<div class='single-photo'>
										<h3 class='text'>Left Photo</h3>
										<img src={
											userData?.biometricInfo?.leftPic
												? baseImageUrl + userData?.biometricInfo?.leftPic
												: ProfilePic
										} alt='' />
									</div>
									<div class='single-photo'>
										<h3 class='text'>Front Photo</h3>
										<img src={
											userData?.biometricInfo?.frontPic
												? baseImageUrl + userData?.biometricInfo?.frontPic
												: ProfilePic
										} alt='' />
									</div>
									<div class='single-photo'>
										<h3 class='text'>Right Photo</h3>
										<img src={
											userData?.biometricInfo?.rightPic
												? baseImageUrl + userData?.biometricInfo?.rightPic
												: ProfilePic
										} alt='' />
									</div>	
								</div>
								
							</div>
						</div>
					</section>
					{/* <section class='statics'>
						<div class='container' style={{ "padding-bottom": "0px" }}>
							<div class='row '>
								<div class="card list-box profile-project-danger" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>
									<h5 class="key">
										<a href="#" class="text-dark">Number Of Cases</a><br />
										<span></span>
									</h5>
									<div class="value badge badge-soft-info">{userData?.prisonerCase?.length || 'N/A'}</div>
								</div>
								<div class="card list-box profile-project-warning" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>
									<h5 class="key">
										<a href="#" class="text-dark">Number Of Dependents</a>
										<span></span>
									</h5>
									<div class="value badge badge-soft-info">{userData?.dependents?.length || 'N/A'}</div>
								</div>
								<div class="card list-box profile-project-success" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>
									<h5 class="key">
										<a href="#" class="text-dark">Barracks Alloted</a>
										<span></span>
									</h5>
									<div class="value badge badge-soft-info">{userData?.prisonerAccommodation?.length || 'N/A'}</div>
								</div>
							</div>
							<div className='row'>
								<h4 class="third-heading heading" style={{
									"backgroundColor": "#405189", "padding": "10px !important",

								}}>Prisoner Education Details</h4>
							</div>

							<div class='row'>
								<div class="card list-box profile-project-danger" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>
									<h5 class="key">
										<a href="#" class="text-dark">Formal Education :</a>
										<span class="fw-semibold text-dark"> </span>
									</h5>
									<div class="badge badge-soft-info fs-15">{userData?.professionalInfo?.formalEducation || 'N/A'}</div>

								</div>

								<div class="card list-box profile-project-card shadow-none profile-project-warning" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>


									<h5 class="key">
										<a href="#" class="text-dark">Religious Education :</a>
										<span class="fw-semibold text-dark"> </span>
									</h5>


									<div class="flex-shrink-0 ms-2">
										<div class="badge badge-soft-warning ">{userData?.professionalInfo?.religiousEducation || 'N/A'}</div>
									</div>

								</div>


								<div class="card list-box profile-project-card shadow-none profile-project-success" style={{ "display": "flex", "flex-direction": " row", "height": "90px" }}>

									<div class="flex-grow-1 text-muted overflow-hidden">
										<h5 class="key">
											<a href="#" class="text-dark">Technical Education :</a>
										</h5>
										<p class="text-muted text-truncate mb-0">
											<span class="fw-semibold text-dark"> </span>
										</p>
									</div>
									<div class="flex-shrink-0 ms-2">
										<div class="badge badge-soft-success fs-15">{userData?.professionalInfo?.technicalEducation || 'N/A'}</div>
									</div>
								</div>
							</div>
						</div>
					</section> */}
					<div class='container' style={{ "padding-top": "0px" }}>
						<section class='table'>
							<div className='row'>
								<div>
								<h4 className='section-heading-main'>Personal Information</h4>
								{/* new */}
								<div className='d-flex justify-content-between container'>
									<ul class="list col-xl-6 list-group list-group-flush  mb-0 personal-b-heading">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key personal-b-heading">Name </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.prisonerBasicInfo?.fullName || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key personal-b-heading">Admission Date </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{validateDate(
															userData?.prisonerAdmission?.admissionDate
														) || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key personal-b-heading">D.O.B </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{validateDate(
															userData?.personalInfo?.dateOfBirth
														) || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">CNIC </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.prisonerBasicInfo?.cnic || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Gender </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.gender || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>



										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Marital Status </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.maritalStatus || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Caste </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.caste || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Religion </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.religion || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Sect </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.sect || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>


									</ul>
									<ul class="list col-xl-6 list-group list-group-flush  mb-0 personal-b-heading">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Grand Father Name </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.grandFatherName || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Location </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.city || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Brother Name </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.brotherName || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Nationality </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.nationality || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">High Profile </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.highProfile ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>



										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Occupation </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.professionalInfo?.occupation || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Mobile Number </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.contactInfo?.mobileNumber || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Offical Id </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.personalInfo?.passportNumber || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Emergency No </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.contactInfo?.phoneNumber || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>

									</ul>
									</div>

								</div>
								<div>
								<h4 className='section-heading-main'>Prisoner Information</h4>

								<div className='d-flex justify-content-between container'>

									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prison Name </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.prisonerNumber?.prison || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Crime type </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.crimeType || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prisoner Sub Type </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.prisonerSubType || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Opposition </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.hasOpposition ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Habitual Offender </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.habitualOffender ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Banned Organizations </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.bannedOrganizations || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prisoner Class </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.prisonerClass || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Legal Assistance Details </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.legalAssistanceDetails || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
									</ul>

									
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prison Category </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.prisonerNumber?.category || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prisoner Type </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.advancedInfo?.prisonerType || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">UTP Number </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.prisonerNumber?.category + userData?.prisonerNumber?.prsNumber || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Appeal in progress: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.appealInProgress ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">PWID </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.medicalInfo?.pwid ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Admission Date </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{validateDate(
															userData?.prisonerAdmission?.admissionDate
														) || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Legal assistance </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.legalAssistance ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
									</ul>
									</div>

								</div>
								<div>
								<h4 className='section-heading-main'>Physical Information</h4>

								<div className='d-flex justify-content-between container'>

									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Height: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.height || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Weight: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.weight || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">First Mark of Identification: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.markOfIdentification || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>

									</ul>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Addicted: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.addicted ? 'Yes' : 'No' || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">1st Mark of Identification: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.markOfIdentification || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
									</ul>
									</div>
								</div>

								<div className='container photos gap-4'>
								<h4 className='section-heading-main'>Biometric Information</h4>

								<div class='right  '>
									<div class='single-photo'>
										<img src={
											userData?.biometricInfo?.leftThumbImg
												? baseImageUrl + userData?.biometricInfo?.leftThumbImg
												: FingerPrint
										} alt='' />
										<h3 class='text'>Left thumb</h3>
									</div>
									<div class='single-photo'>
										<img src={
											userData?.biometricInfo?.leftIndexImg
												? baseImageUrl + userData?.biometricInfo?.leftIndexImg
												: FingerPrint
										} alt='' />
										<h3 class='text'>Left Index Finger</h3>
									</div>
									<div class='single-photo'>
										<img src={
											userData?.biometricInfo?.rightThumbImg
												? baseImageUrl + userData?.biometricInfo?.rightThumbImg
												: FingerPrint
										} alt='' />
										<h3 class='text'>Right Thumb</h3>
									</div>
									
									<div class='single-photo'>
										<img src={
											userData?.biometricInfo?.leftIndexImg
												? baseImageUrl + userData?.biometricInfo?.leftIndexImg
												: FingerPrint
										} alt='' />
										<h3 class='text'>Right Index Finger</h3>
									</div>
								</div>

								</div>

								<div>
									<h4 className='section-heading-main'>Medical Information</h4>
									<div className='d-flex justify-content-between container'>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Covid Vaccination: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.vaccinations?.length > 0 ? 'Yes' : 'No'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">First Covid Vaccine Date: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">
															{validateDate(
																medicalData?.vaccinations?.[medicalData?.vaccinations?.length - 1]?.vaccinationDate
															) || 'N/A'}
														</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Second Covid Vaccine Date: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">
															{validateDate(
																medicalData?.vaccinations?.[medicalData?.vaccinations?.length - 1]?.vaccinationDate2
															) || 'N/A'}
														</p>
													</div>
												</div>
											</div>
										</li>
									
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Diseases: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">
															{medicalData?.diseases?.length > 0
																? medicalData?.diseases
																	.map(disease => disease.name)
																	.slice(0, 5)
																	.join(", ") + (medicalData?.diseases?.length > 5 ? ", ..." : "")
																: "N/A"}
														</p>
													</div>
												</div>
											</div>
										</li>
									</ul>

									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Booster Dose Date: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">
															{validateDate(
																medicalData?.vaccinations?.[medicalData?.vaccinations?.length - 1]?.vaccinationDate3
															) || 'N/A'}
														</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Medical Treatment: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.medicalTreatment || "N/A"}</p>
													</div>
												</div>
											</div>
										</li>

										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">medical Issue: </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{medicalData?.medicalIssue || "N/A"}</p>
													</div>
												</div>
											</div>
										</li>

									
									</ul>
									</div>
								</div>
								<div>

								<h4 className='section-heading-main'>Prisoner Address Information</h4>
								<div className='d-flex justify-content-between container'>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1  permanent-h">Prisoner Present Address </h5>
												</div>
												
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Country </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.country || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Province </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.country || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">City</h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.city || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">District </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.district || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">street Address </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.presentAddress?.streetAddress || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>

									</ul>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1  permanent-h">Prisoner Permanent Address </h5>
												</div>
											
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Country </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.permanentAddress?.country || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Province </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.permanentAddress?.country || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">City </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.permanentAddress?.city || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">District </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.permanentAddress?.district || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">street Address</h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{userData?.permanentAddress?.streetAddress || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
									</ul>
									</div>
								</div>


								<h4 className='section-heading-main'>Barracks History</h4>

								
								<BarrackHistory cases={stateParamVal?.personalData} isPrint={isPrint}  />

								<h4 className='section-heading-main'>Transfers History</h4>
								<TransferHistory cases={stateParamVal?.personalData} isPrint={isPrint} />

								<h4 className='section-heading-main'>Visitors History</h4>

								<VisitorHistory visitor={stateParamVal?.personalData} isPrint={isPrint} />

								<h4 className='section-heading-main'>Prisoner Cases</h4>

								<PrisonerCases cases={userData || stateParamVal?.personalData} isPrint={isPrint} lookups={stateParamVal?.lookups}  />

								<h4 className='section-heading-main'>In-prison Education</h4>
								<InPrisonEducation education={stateParamVal?.personalData}  />

								<h4 className='section-heading-main'>In-prison Offence Management</h4>
								<OffenceManagementHistory offence={stateParamVal?.personalData}  />

								<h4 className='section-heading-main'>Appeal History</h4>
								<AppealHistory loadedAppealEntries={loadedAppealEntries}  />
							</div>
						</section>
					</div>
				</div>

			</div>
		</>
	);
};
export default PrintDetails;
