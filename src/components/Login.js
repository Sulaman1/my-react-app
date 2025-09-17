import React, { useState, useRef, useEffect } from 'react';
import { getData, getDataTest, postData } from '../services/request';
import InputWidget from '../droppables/InputWidget';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ changed
import swal from "sweetalert";
import { Device } from '@capacitor/device';
import { useSelector, useDispatch } from 'react-redux';
import data from '../assets/data.json';
import {
  setPermissionsInRedux,
  setRoleInRedux,
  setUserAccessRights,
} from '../store/userMeta';
import Loader2 from '../common/Loader2';
import { fetchLookupsFromAPI } from '../store/dropdownLookupApi';
import TimezoneAlert from '../common/TimezoneAlert';
import RoleSelectionModal from './RoleSelectionModal';
import {
  setAvailableRoles,
  setRoleModalOpen,
  setAuthData,
} from '../store/roleSlice';
import unodcLogo from "../assets/images/footerlogo/1.png";
import logoImage from '../assets/images/1.png';
import usFlagImage from '../assets/images/1.png';

const Login = (props) => {
  const [logo, setLogo] = useState('');
  const [timezone, setTimezone] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ changed
  const formEl = useRef();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const { availableRoles } = useSelector((state) => state.role);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      navigate('/admin/dashboard'); // ✅ changed
    } else {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('email');
    }
  }, [navigate]);

  useEffect(() => {
    (async () => {
      const zone = new Date()
        .toLocaleDateString(undefined, {
          day: '2-digit',
          timeZoneName: 'long',
        })
        .substring(4);
      if (!zone?.toLowerCase().includes('pakistan')) {
        setTimezone(false);
      }
      const result = await getDataTest();
      if (result) {
        //window.open(process.env.REACT_APP_FINGERBASEURL, '_blank');
        window.open("https://pmis-bl:4502/", '_blank');
      }
    })();
  }, []);

  const Logo = () => {
    // import(process.env.REACT_APP_LOGO).then((module) => {
    //   setLogo(module.default);
    // });
    return (
      <img src={logoImage} alt="" height="20" style={{ borderRadius: '30px' }} />
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);

    let username = e.target.elements.username?.value;
    let password = e.target.elements.password?.value;
    let loginPayload = {
      userNameOrEmailAddress: username.trim(),
      password: password.trim(),
    };

    postData('http://pmis-bl:4502/api/TokenAuth/Authenticate', loginPayload, false, false)
      .then(async (result) => {
        if (result && result.success && result.result) {
          result['isLoggedIn'] = true;
          result['userName'] = username;
          setLoginData(result);
          const roles = result.result.employee.user.roles;
          if (!roles.length) {
            swal('Missing roles', '', 'error');
            setIsAuthLoading(false);
            return;
          }
          let rolesString = roles.map((item) => item.displayName);
          dispatch(setAuthData(result));
          if (rolesString.length > 1) {
            dispatch(setAvailableRoles(rolesString));
            dispatch(setRoleModalOpen(true));
            setIsAuthLoading(false);
          } else {
            const newResult = {
              ...result,
              result: {
                ...result.result,
                employee: {
                  ...result.result.employee,
                  user: {
                    ...result.result.employee.user,
                    roleNames: rolesString,
                  },
                },
              },
            };
            await processLogin(newResult);
          }
        }
        if (result && result.success === false) {
          swal(
            result?.error?.message === 'Login failed!'
              ? 'Incorrect Credentials!'
              : result?.error?.message,
            '',
            'error'
          );
          setIsAuthLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsAuthLoading(false);
        console.log(error);
      });
  };

  const handleRoleSelect = async (selectedRole) => {
    setShowRoleModal(false);
    const updatedLoginData = {
      ...loginData,
      result: {
        ...loginData.result,
        employee: {
          ...loginData.result.employee,
          user: {
            ...loginData.result.employee.user,
            roleNames: [selectedRole],
          },
        },
      },
    };
    await processLogin(updatedLoginData);
  };

  const processLogin = async (result) => {
    try {
      await setSessionValues(result);
      navigate('/admin/dashboard'); // ✅ changed
      const lookupAction = await fetchLookupsFromAPI();
      dispatch(lookupAction);
    } catch (error) {
      console.error('Error during login process:', error);
      swal('Error', 'An error occurred during the login process.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const setLocalStorageValue = (data) => {
    const result = data?.result;
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result));
    localStorage.setItem('isLoggedIn', data.isLoggedIn);
  };

  const setSessionValues = async (result) => {
    const { accessToken, encryptedAccessToken } = result.result;
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('encryptedAccessToken', encryptedAccessToken);
    sessionStorage.setItem('userName', result.userName);
    sessionStorage.setItem('user', JSON.stringify(result.result));
    sessionStorage.setItem('isLoggedIn', result.isLoggedIn);
    sessionStorage.setItem(
      'selectedRole',
      result.result.employee.user.roleNames[0]
    );
    try {
      sessionStorage.setItem(
        'LoggedInEmployeeInfo',
        JSON.stringify(result?.result?.employee)
      );
      localStorage.setItem(
        'LoggedInEmployeeInfo',
        JSON.stringify(result?.result?.employee)
      );

      setLocalStorageValue(result);
      const permissions = data.filter(
        (item) =>
          item.role === result?.result?.employee?.user?.roleNames[0]
      );
      if (permissions.length > 0) {
        dispatch(setUserAccessRights(permissions[0]?.allowedUrls || []));
        dispatch(setPermissionsInRedux(permissions[0].accessRight));
        dispatch(
          setRoleInRedux(result?.result?.employee?.user?.roleNames[0])
        );
      }
    } catch (error) {
      if (result) {
        navigate('/admin/dashboard'); // ✅ changed
      } else if (sessionStorage.getItem('history')) {
        window.location.href = sessionStorage.getItem('history');
        sessionStorage.removeItem('history');
      } else {
        window.location.href = '/';
        console.error('Error in setSessionValues:', error);
        throw error;
      }
    }
  };

  return (
    <>
      {isAuthLoading && <Loader2 />}
      {!timezone && <TimezoneAlert />}
      <div className="auth-page-wrapper login-page pt-5">
        {/* … your login form markup … */}
        <form ref={formEl} onSubmit={handleFormSubmit}>
          <InputWidget
            id={'username'}
            type={'input'}
            inputType={'name'}
            class={'force-active'}
            label={'User name'}
            name={'username'}
            require={true}
          />
          <InputWidget
            id={'password'}
            type={'password'}
            class={'force-active'}
            inputType={'password'}
            label={'Password'}
            name={'password'}
            require={true}
          />
          <button className="btn btn-prim w-100" type="submit">
            Sign In
          </button>
        </form>
        <RoleSelectionModal
          show={showRoleModal}
          onHide={() => setShowRoleModal(false)}
          roles={availableRoles}
          onRoleSelect={handleRoleSelect}
        />
      </div>
    </>
  );
};

export default Login;
