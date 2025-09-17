import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate  } from 'react-router-dom';
import RoleSelectionModal from '../../RoleSelectionModal';
import { setAvailableRoles, setCurrentRole, setRoleModalOpen } from '../../../store/roleSlice';
import ProfilePic from "../../../assets/images/users/1.jpg";
import { baseImageUrl, postData } from '../../../services/request';
import dummyPic from '../../../assets/images/users/1.jpg';
import { setPermissionsInRedux, setRoleInRedux, setUserAccessRights } from '../../../store/userMeta';
import data from '../../../assets/data.json';
import { fetchLookupsFromAPI } from '../../../store/dropdownLookupApi';
import { FiSettings } from 'react-icons/fi';
import { MdOutlineSwapHoriz } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { storeNotifications } from '../../../store/notificationSlice';

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

function RightProfileDrp() {
	const dispatch = useDispatch();
	//const history = useHistory();
	const navigate = useNavigate();
	const { currentRole, availableRoles, isRoleModalOpen, authData } = useSelector((state) => state.role);
	const [show, setShow] = useState('');
	const { personalInfo, joiningDate, biometricInfo, user, designationId } =
	JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));
	const handleLogout = () => {
		sessionStorage.clear();
		localStorage.clear();
		window.location.href = '/';
		
		dispatch(setCurrentRole(''));
		dispatch(setAvailableRoles([]));
		dispatch(storeNotifications([]));
	};

	const handleChangeRole = () => {
		dispatch(setRoleModalOpen(true));
		setShow('');
	};

	const handleRoleSelect = async (selectedRole) => {
		dispatch(setRoleModalOpen(false));
		
		try {
			if (!authData) {
				throw new Error('Authentication data not found. Please log in again.');
			}

			// Update the auth data with the new role
			const updatedAuthData = {
				...authData,
				result: {
					...authData.result,
					employee: {
						...authData.result.employee,
						user: {
							...authData.result.employee.user,
							roleNames: [selectedRole]
						}
					}
				}
			};

			// Update session storage
			sessionStorage.setItem('selectedRole', selectedRole);
			sessionStorage.setItem('user', JSON.stringify(updatedAuthData.result));

			// Update Redux state
			dispatch(setCurrentRole(selectedRole));
			dispatch(setRoleInRedux(selectedRole));
			dispatch(storeNotifications([]));
                        // const lookupAction = await fetchLookupsFromAPI();
                        // dispatch(lookupAction);
			// Update permissions
			const permissions = data.filter(item => item.role === selectedRole);
			if (permissions.length > 0) {
				dispatch(setUserAccessRights(permissions[0]?.allowedUrls || []));
				dispatch(setPermissionsInRedux(permissions[0].accessRight));
			}
			navigate('/admin/dashboard');

		} catch (error) {
			console.error('Error changing role:', error);
			swal("Error", error.message, "error");
		}
	};

	return (
		<div className="dropdown ms-sm-3 header-item">
			<button type="button" className="btn" id="page-header-user-dropdown" onClick={() => { setShow(show ? '' : 'show') }} data-bs-toggle="dropdown"
					aria-haspopup="true" aria-expanded="false">
				<span className="d-flex gap-10 align-items-center">
					<img className="rounded-circle header-profile-user" src={biometricInfo?.leftPic ? baseImageUrl + biometricInfo?.leftPic : dummyPic} />
					<span className="text-start ms-xl-2">
						<span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user?.userName || " "}</span>
					</span>
				</span>
			</button>
			<div className={`dropdown-menu dropdown-menu-end ${show}`}>
				<h6 className="dropdown-header">Welcome {user?.userName || ""}!</h6>
				<Link className="dropdown-item" to="/admin/profile-setting/account-setting">
					<FiSettings className="me-2" /> <span className="align-middle">Account Settings </span>
				</Link>
				
				<div className="dropdown-divider"></div>
				{availableRoles?.length > 0 && <>
					<a className="dropdown-item" onClick={handleChangeRole}>
						<MdOutlineSwapHoriz className="me-2" /> <span className="align-middle cursor-pointer">Switch Role</span>
					</a>
					<div className="dropdown-divider"></div>
				</>}
				<a className="dropdown-item" onClick={handleLogout}>
					<FiLogOut className="me-2" /> <span className="align-middle cursor-pointer">Logout</span>
				</a>
			</div>
			<RoleSelectionModal
				show={isRoleModalOpen}
				onHide={() => dispatch(setRoleModalOpen(false))}
				roles={availableRoles}
				onRoleSelect={handleRoleSelect}
			/>
		</div>
	);
}

export default RightProfileDrp;

