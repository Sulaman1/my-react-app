import React, { useEffect, useRef, useState } from 'react'
//import { useHistory } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

import { validateDate } from '../../common/Helpers';
import { ICONS } from '../../services/icons';
import $ from "jquery";
import moment from 'moment-mini';


// import Logo from '../../../../src/assets/images/1.png'




const UserActivityPrint = () => {
	const stateParamVal = useLocation().state?.stateParam;
	//const history = useHistory()
	const navigate = useNavigate();

	const [userActivityData, setUserActivityData] = useState([])
	const [isPrint] = useState(true);
	const myElementRef = useRef(null);

	useEffect(() => {

		if (stateParamVal?.activityData) {
			setUserActivityData(stateParamVal.activityData)
		}
		else {
			return false;
		}

		const timeout = setTimeout(() => {
			handlePrint();
		}, 200);
		return () => clearTimeout(timeout);

	}, []);








	const handlePrint = () => {
		var restorepage = $('body').html();
		var printcontent = $('#my-element').clone();
		$('body').empty().html(printcontent);
		window.print();
		$('body').html(restorepage);
		// history.goBack()
	}

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
							background: none !important; }
						.print-prisnor {
						background: #fff; }
						.print-prisnor p {
							margin-bottom: 0 !important; }
						.print-prisnor .container {
							width: 100%;
							padding:3%;
							margin:0;
							box-sizing: border-box;
							max-width: inherit; }
						.print-prisnor .top {
							box-sizing: border-box;
							background: #405189; }
							.print-prisnor .top .text {
								color: #fff; }
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
									color: #fff; }
									.print-prisnor .top .logo .text p {
										width: 100%;
										font-size: 12px;
										margin: 0; }
									.print-prisnor .top .logo .text span {
										width: 100%;
										font-size: 24px;
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
								justify-content: space-between;
								gap: 30px;
								padding: 20px 20px;
								position: relative; }
							.print-prisnor .photos .right {
								display: flex;
								align-items: center;
								justify-content: space-between;
								gap: 30px;
								padding: 100px 20px; }
							.print-prisnor .photos .single-photo {
								position: relative;
								width: 220px;
								height: 220px;
								padding-top: 0px;
								box-sizing: border-box; }
								.print-prisnor .photos .single-photo img {
									width: 220px;
									height: 220px;
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
						background-color: #405189;
						padding: 10px !important;
						color: white; }
					
					.list-group-flush {
						padding: 10px;
						box-sizing: border-box; }
						.list-group-flush > .list-group-item:last-child {
							border-bottom-width: 1px; }
					
					.list-group-item {
						list-style: none;
						border-bottom: 1px solid #e9e9e9; }
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
				<section class='p-4'>
					<h3>User Activity Report</h3>
					<h4>{stateParamVal?.formPayload?.userId?.label}</h4>
				</section>

				<div class='print-prisnor'>
					<div className="gridjs gridjs-container">
						<div className="gridjs-wrapper">
							<table className="gridjs-table">
								<thead className="gridjs-thead">
									<tr className="gridjs-tr" style={{ color: '#0000' }}>
										<th className="gridjs-th"><div className="gridjs-th-content">DATE</div></th>
										<th className="gridjs-th"><div className="gridjs-th-content">TIME</div></th>
										<th className="gridjs-th"><div className="gridjs-th-content">ACTIVITY</div></th>
										<th className="gridjs-th"><div className="gridjs-th-content">ACTIVITY DESCRIPTION</div></th>
									</tr>
								</thead>
								<tbody className="gridjs-tbody fixed-table">
									{userActivityData.map((item) => {
										return (
											<tr>
												<td>{moment(new Date(item?.creationDate).toDateString()).format('L')}</td>
												<td>{moment(new Date(item?.creationDate)).format('LT')}</td>
												<td>{item?.methodName}</td>
												<td>{item?.parameters}</td>
											</tr>

										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

export default UserActivityPrint