import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import './interceptor';

import Login from './components/Login';
import AdminSide from './components/admin/AdminSide';
import Loader2 from './common/Loader2';
import NavigatorValidator from './hooks/NavigatorValidator';
import '@fortawesome/fontawesome-free/css/all.min.css';

const HomeRoutes = () => {
  if (sessionStorage.getItem('isLoggedIn') === "true") {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<AdminSide />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

function App() {
  const { isRoleModalOpen } = useSelector((state) => state.role);
  const navigate = useNavigate();   // ✅ useNavigate
  const location = useLocation();
  const isValidUrl = NavigatorValidator();
  const isLoading = useSelector((state) => state?.loader?.loading || false);

  useEffect(() => {
    const stateParamVal = location.state?.stateParam;
    if (stateParamVal?.e?.ignoreRedirect || location.state?.ignoreRedirect) {
      return;
    }

    if (localStorage.getItem('isLoggedIn') === "true") {
      const user = localStorage.getItem('user');
      sessionStorage.setItem('isLoggedIn', true);
      sessionStorage.setItem('user', user);
      sessionStorage.setItem(
        'LoggedInEmployeeInfo',
        JSON.stringify(JSON.parse(user).employee)
      );
      sessionStorage.setItem('accessToken', localStorage.getItem('accessToken'));

      if (window.location.pathname !== '/admin/dashboard') {
        let path =
          window.location.pathname === '/' || !isValidUrl
            ? '/admin/dashboard'
            : window.location.pathname;

        if (window.location.search) {
          path = path + window.location.search;
        }

        navigate(path, { replace: true }); // ✅ navigate instead of history.push
      }
    } else if (
      window.location.pathname === '/admin/dashboard' ||
      window.location.pathname === '/admin'
    ) {
      navigate('/', { replace: true });
      sessionStorage.clear();
      localStorage.clear();
    }
  }, [location.pathname, isValidUrl, navigate]);

  return (
    <div className={`App ${isRoleModalOpen ? 'role-selection-modal' : ''}`}>
      {isLoading && <Loader2 />}
      <HomeRoutes />
    </div>
  );
}

export default App;
