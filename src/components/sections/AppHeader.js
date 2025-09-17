import React, { useEffect, useState } from 'react';
import Bradcurms from './Bradcurms';
import RightProfileDrp from './Components/RigthProfileDrp';
import {
	useLocation
} from "react-router-dom";;
import RightNotification from './Components/RightNotification';
import ChangeLanguage from './Components/ChangeLanguage';
import TimezoneAlert from '../../common/TimezoneAlert';
import { SiSubversion } from "react-icons/si";
import { renderToStaticMarkup } from 'react-dom/server';
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineNumber } from "react-icons/ai";
import { TbFileDescription } from "react-icons/tb";
import { BsCardHeading } from "react-icons/bs";
import { useSelector } from 'react-redux';
const AppHeader = props => {
	const { currentRole } = useSelector((state) => state.role);
	const [timezone, setTimezone] = useState(true);

// swal(
			// 	`Version Updated!`,
			// 	`Version: ${tag}\n Title: ${title}\n Issue Number ${issueNumbers}\n New Features: ${description}`,
			// 	"success"
			// 	);
	const location = useLocation()
	const isTrue = sessionStorage.getItem('isLoggedIn');
	const [firstCap, setFirstCap] = useState('');
	if (!isTrue) {
	window.location.href = '/';
	}
	const userObj = sessionStorage.getItem('user');
	const user = JSON.parse(userObj);
	var prisonName = " ";

	useEffect(() => {

		//prisonName THIS CODE NEEDS A REVISIT

		// 1. first extract the info from localstorage
		// 2. validate the token access 
		// 3. if not valid redirect to login else
		// 4. set values into session
		const prisonObj = sessionStorage.getItem('LoggedInEmployeeInfo');
		if (prisonObj == null) {
			sessionStorage.clear();
			localStorage.clear();
			window.location.href = '/';
		}
		else {
			const prisonObj = sessionStorage.getItem('LoggedInEmployeeInfo');
			const prisons = JSON.parse(prisonObj)?.prisons;
			if(prisons.length > 1) {
				setFirstCap('')
			}
			else {
			var counter = prisons[0];
			prisonName = counter?.prisonName;
				setFirstCap("- " + prisonName?.charAt(0)?.toUpperCase() + prisonName?.slice(1));
			}
		}

		const zone = new Date().toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'long' }).substring(4)
		if(!zone?.toLowerCase().includes('pakistan')) {
		setTimezone(false)
		}
	}, [])

	const getRoleDisplay = () => {
		// If user is Prison Superintendent, always show as "Superintendent/DSP"
		if (currentRole === "Prison Superintendent" || 
			user?.employee?.user?.roleNames?.toString() === "Prison Superintendent") {
			return "Superintendent/DSP";
		}

		// If currentRole exists, use it
		if (currentRole) {
			return currentRole;
		}

		// Fallback to user's role name if it exists
		if (user?.employee?.user?.roleNames) {
			return user.employee.user.roleNames.toString();
		}

		// Default empty string if no role found
		return "";
	};

	return (
		<>
			<header id="page-topbar">
			{!timezone && (
						<TimezoneAlert />
					)}
				<div className="layout-width">
					<div className="navbar-header">
						<div className="d-flex">
							<button type="button" onClick={() => { props.handleBurger() }} className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger" id="topnav-hamburger-icon">
								<span className="hamburger-icon">
									<span></span>
									<span></span>
									<span></span>
								</span>
							</button>
							{/* <h3 className='third-heading'>(PMIS) - {user?.employee?.user?.roleNames?.toString() === "Prison Superintendent" ? "Superintendent/DSP" :  user?.employee?.user?.roleNames?.toString() }  {firstCap?.toString()} */}
							<h3 className='third-heading'>
								(
									PMIS) - {getRoleDisplay()} {firstCap?.toString()}
							</h3>
						</div>
						<div className="d-flex align-items-center">
							<ChangeLanguage/>
							<RightNotification />
							<RightProfileDrp />
						</div>
					</div>
					<Bradcurms location={location} />
					
				</div>
				
			</header>
		</>
	);
};

export default AppHeader;
