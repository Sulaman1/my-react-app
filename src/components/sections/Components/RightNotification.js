import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {  getData, postData } from '../../../services/request';
import { useDispatch, useSelector } from 'react-redux';
import { storeNotifications } from '../../../store/notificationSlice';
import moment from 'moment-mini';
//import { useHistory } from 'react-router';
import { useNavigate } from "react-router-dom";

import {  BsInfoSquareFill } from "react-icons/bs";
import { resetRoleChanged } from '../../../store/roleSlice';
import '../../../assets/components/sections/Components/RightNotification.css';
//src\assets\components\sections\Components\RightNotification.css
import Polygonpoint from '../../../assets/images/notification images/1.svg';

let useClickOutside = (handler) => {
	let outside = useRef();
	useEffect(() => {
		let maybeHandler = (event) => {
			if (!outside.current.contains(event.target)) {
				handler();
			}
		};
		document.addEventListener("mousedown", maybeHandler);
		return () => {
			document.removeEventListener("mousedown", maybeHandler);
		};
	});
	return outside;
};
function RightNotification() {
	const { roleChanged } = useSelector((state) => state.role);
	const [show, setShow] = useState('');
	const [notifications, setNotifications] = useState([]);
	const [activeTab, setActiveTab] = useState('primary');
	const dispatch = useDispatch();
	//const history = useHistory();
	const navigate = useNavigate();

	const notes = useSelector((state) => state.notification.notifications);
	const handleLogout = () => {
		sessionStorage.clear();
		localStorage.clear();
		window.location.href = '/'
	}
	const { personalInfo, joiningDate, biometricInfo, user, designationId } =
		JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
	let outside = useClickOutside(() => {
		setShow(false);
	});
	// Call the api to fetch user's notifications

	useEffect(() => {
		fetchNotifications();
	  }, []);
	  
	useEffect(() => {
		if (roleChanged) {
			fetchNotifications();
			dispatch(resetRoleChanged());
		}
	}, [roleChanged, dispatch]);
	const fetchNotifications = async () => {
		const user = JSON.parse(sessionStorage.getItem('user'));

		// --- always pick a role ---
		// 1. If selectedRole exists, find by displayName
		// 2. Otherwise fallback to the Admin role
		const selectedRole = sessionStorage.getItem('selectedRole');
		
		let activeRole =
			user.employee.user.roles.find(
			(role) => role.displayName === selectedRole
			) ||
			user.employee.user.roles.find(
			(role) => role.displayName === 'Admin'
			);

		//const activeRole = user.employee.user.roles.find(role => role.displayName === selectedRole);
		console.log("USER : ", user);
		console.log(activeRole, 'activeRole');
		
		
		if(activeRole?.id) {
			const notes = await getData('/services/app/Notification/GetNotificationsByRole?roleId='+activeRole?.id, null, true, false);
			if (notes?.result?.data?.length > 0) {
				setNotifications(notes?.result?.data); // store the notifications locally.
				dispatch(storeNotifications(notes?.result?.data));
			}
		}
	};
	const navigateToNotifications = () => {
		setShow(false);
		navigate('/admin/notifications/notifications-list')
	}
	const markAsRead = async () => {
		fetchNotifications();
		const userObj = sessionStorage.getItem('user');
		const user = JSON.parse(userObj);
		const { userId } = user;
		await postData(`/services/app/Notification/ReadNotifications?userId=${userId}`, {}, false);
	}
	const getFilteredNotifications = () => {
		if (!notifications) return [];
		
		const typeMap = {
			'primary': 0,
			'secondary': 1,
		};

		return notifications.filter(note => note.notificationType === typeMap[activeTab]);
	};
	const handleTabChange = (tabName) => {
		setActiveTab(tabName);
	};
	const handleRedirect = async (item) => {
		try {
			let redirectURL = item?.redirectUrl;
			
			console.log('Notification type:', item.notificationType);
			console.log('Redirect URL:', redirectURL);

			if (redirectURL?.indexOf('id') > -1) {
				const id = redirectURL.split('id=')[1];
				const prisonerData = await getData('/services/app/AddPrisonerAppServices/GetOnePrisonerData?prisonerBasicInfoId=' + id);
				const { result } = prisonerData;
				const { data } = result;
				if (data) sessionStorage.setItem('selectedPrisoner', JSON.stringify(data));
			}
			
			if (redirectURL) {
				navigate(redirectURL);
				setShow(false);
			}
		} catch (error) {
			console.error('Error handling notification redirect:', error);
		}
	};
	const getUnreadCount = (type) => {
		if (!notifications) return 0;
		
		const typeMap = {
			'primary': 0,
			'secondary': 1
		};
		
		return notifications.filter(note => 
			note.notificationType === typeMap[type] && 
			!note.isRead
		).length;
	};
	return (
		<div className="dropdown topbar-head-dropdown ms-1 header-item" ref={outside}>
			<button type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" 
				onClick={() => { setShow(show ? '' : 'show'); markAsRead(); }}>
				<i className='icon-notification'></i>
				{notes?.length > 0 && (
					<span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
						{notes?.filter((x) => x.isRead === false).length > 99 ? "99+" : notes?.filter((x) => x.isRead === false).length}
						<span className="visually-hidden">unread messages</span>
					</span>
				)}
			</button>
			<img src={Polygonpoint} alt="Polygonpoint" className={` ${show}`} />
			<div className={`dropdown-menu notification-box dropdown-menu-end ${show}`}>
				<h2 className="notification-text">Notifications</h2>
				<div className="line"></div>

				<div className="notification-tabs">
					<input 
						type="radio" 
						id="tab-primary" 
						name="tab" 
						className="tab-input" 
						checked={activeTab === 'primary'}
						onChange={() => handleTabChange('primary')}
					/>
					<input 
						type="radio" 
						id="tab-secondary" 
						name="tab" 
						className="tab-input"
						checked={activeTab === 'secondary'}
						onChange={() => handleTabChange('secondary')}
					/>
					
					<label htmlFor="tab-primary" className={`column-P ${activeTab === 'primary' ? 'active' : ''}`}>
						Actions
						{getUnreadCount('primary') > 0 && (
							<span className="unread-badge">{getUnreadCount('primary')}</span>
						)}
					</label>
					<label htmlFor="tab-secondary" className={`column-S ${activeTab === 'secondary' ? 'active' : ''}`}>
						Information
						{getUnreadCount('secondary') > 0 && (
							<span className="unread-badge">{getUnreadCount('secondary')}</span>
						)}
					</label>
				</div>

				<div className={`notification-content ${activeTab}`}>
					<div className="notifications-list">
						{getFilteredNotifications().map((item, index, array) => {
							const isLastUnread = !item.isRead && 
								(index === array.length - 1 || array[index + 1]?.isRead);
							
							return (
								<div key={item.id} 
									className={`row-notification-${item.isRead ? 'read' : isLastUnread ? 'unread-last' : 'unread'}-${getNotificationTypeClass(item.notificationType)}`}
									onClick={() => handleRedirect(item)}>
									<div className="noti-row">
										<div className="notification-tab-content">
											{/* <h4>{getNotificationTitle(item.notificationType)}</h4> */}
											<h4 className='mt-1'>{item.message}</h4>
										</div>
										<div className="notification-tab-timestamp">
											<span>{moment(item.createTime).fromNow()}</span>
										</div>
									</div>
								</div>
							);
						})}
						
						{getFilteredNotifications().length === 0 && (
							<div className="no-notifications">
								<p>No {activeTab} notifications</p>
							</div>
						)}
					</div>
				</div>

				<div className="my-3 btns just-center">
					<button type="button" onClick={navigateToNotifications} 
						className="btn btn-soft-success waves-effect waves-light">
						View All Notifications <i className="icon-rightangle"></i>
					</button>
				</div>
			</div>
		</div>
	);
}

// Helper functions
function getNotificationTypeClass(type) {
	switch (type) {
		case 0: return 'P'; // primary
		case 1: return 'S'; // secondary
		case 2: return 'I'; // secondary
		case 3: return 'A'; // Alert
		default: return 'P';
	}
}

function getNotificationTitle(type) {
	switch (type) {
		case 0: return 'primary Notification';
		case 1: return 'secondary Notification';
		case 2: return 'secondary Notification';
		case 3: return 'Alert Notification';
		default: return 'Notification';
	}
}

export default RightNotification;

