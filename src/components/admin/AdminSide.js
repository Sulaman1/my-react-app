import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from '../sections/AppHeader';
import AppMenu from '../sections/AppMenu';
import Dashboard from '../admin/dashboard/Dashboard';
//import Users from '../admin/users/Users'; // ← make sure this file exists
import { useDispatch, useSelector } from 'react-redux';
import AppFooter from '../sections/AppFooter';
import { socketBaseUrl } from '../../services/request';
import { setNotificationItem } from '../../store/notificationSlice';
import { v4 } from 'uuid';
import { resetRoleChanged } from '../../store/roleSlice';
// import { HubConnectionBuilder } from '@microsoft/signalr';

const AdminSide = () => {
  const [closePanel, setClosePanel] = useState('');
  const { roleChanged } = useSelector((state) => state.role);
  const dispatch = useDispatch();

  // ✅ Our route definitions (array of objects)
  const menuRoutes = [
    { path: '/dashboard', element: <Dashboard /> },
    //{ path: '/users', element: <Users /> },
    // add more routes here…
  ];

  const handleBurger = () => {
    setClosePanel(closePanel ? '' : 'close-panel');
  };

  // ✅ RealTimeNotificationSetup
  const RealTimeNotificationSetup = () => {
    console.log('setting up realtime notifications...');
    const accessToken = sessionStorage.getItem('accessToken');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const selectedRole = sessionStorage.getItem('selectedRole');
    if (!user) return;

    const activeRole = user.employee.user.roles.find(
      (role) => role.displayName === selectedRole
    );
    sessionStorage.setItem('activeRoleId', JSON.stringify(activeRole?.id));
    console.log(activeRole, 'activeRole');

    // Uncomment if you actually use SignalR
    /*
    const connection = new HubConnectionBuilder()
      .withUrl(`${socketBaseUrl}?role=${activeRole?.name}`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('Connected!');
        connection.on('ReceiveMessage', (message) => {
          console.log(message, 'socketsss');
          dispatch(
            setNotificationItem({
              id: v4(),
              message: message?.message || '',
              type: 'SUCCESS',
              isRead: false,
            })
          );
        });
      })
      .catch((e) => {
        console.log('Connection failed: ', e);
      });
    */
  };

  useEffect(() => {
    RealTimeNotificationSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roleChanged) {
      RealTimeNotificationSetup();
      dispatch(resetRoleChanged());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleChanged]);

  const isVisitorRoute =
    window.location.pathname === '/admin/vistors/show-visitors-queue';

  return (
    <div className={`panel ${closePanel}`}>
      {!isVisitorRoute && (
        <>
          <AppHeader handleBurger={handleBurger} />
          <AppMenu />
        </>
      )}

      <div className={`${isVisitorRoute ? '' : 'main-content'}`}>
        <div className="page-content">
          <div className="container-fluid">
            <Routes>
              {menuRoutes.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              {/* Default / fallback route */}
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
        {!isVisitorRoute && <AppFooter />}
      </div>
    </div>
  );
};

export default AdminSide;



// import React, { useEffect, useMemo, useState, Suspense } from 'react';
// import { Switch, Route } from 'react-router-dom';
// import AppHeader from '../sections/AppHeader';
// import AppMenu from '../sections/AppMenu';
// import Dashboard from '../admin/dashboard/Dashboard';
// import Routes from './Routes';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import AppFooter from '../sections/AppFooter';
// //import { HubConnectionBuilder } from '@microsoft/signalr';
// import { socketBaseUrl } from '../../services/request';
// import { setNotificationItem } from '../../store/notificationSlice';
// import {v4} from 'uuid';
// import { resetRoleChanged } from '../../store/roleSlice';

// const AdminSide = props => {
// 	const [closeNav, setCloseNav] = useState('');
// 	const [data, setData] = useState('');
// 	const [closePanel, setClosePanel] = useState('');
// 	const { roleChanged } = useSelector((state) => state.role);
// 	const dispatch = useDispatch();
// 	const _handleClose = e => {
// 		if (closeNav === 'close-panel') {
// 			setCloseNav('');
// 		} else {
// 			setCloseNav('close-panel');
// 		}
// 	};

// 	const menu = Routes.map((route, index) => {
// 		return route.component ? (
// 			<Route
// 				key={index}
// 				path={route.path}
// 				exact={route.exact}
// 				name={route.name}
// 				render={props => <route.component {...props} />}
// 			/>
// 		) : null;
// 	});
// 	const handleBurger = () => {
// 		setClosePanel(closePanel ? '' : 'close-panel')
// 	}


// 	const RealTimeNotificationSetup = () => {
// 		console.log('setting up realtime notifications...');
// 		const accessToken = sessionStorage.getItem('accessToken');
// 		const user = JSON.parse(sessionStorage.getItem('user'));
// 		const selectedRole = sessionStorage.getItem('selectedRole');
// 		const activeRole = user.employee.user.roles.find(role => role.displayName === selectedRole);
// 		sessionStorage.setItem('activeRoleId', JSON.stringify(activeRole?.id));
// 		console.log(activeRole, 'activeRole');
// 		const connection = new HubConnectionBuilder()
// 			.withUrl(`${socketBaseUrl}?role=${activeRole?.name}`, { accessTokenFactory: () => accessToken })
// 			.withAutomaticReconnect()
// 			.build();

// 		connection.start()
// 			.then(result => {
// 				console.log('Connected!');
// 				connection.on('ReceiveMessage', (message, param1, param2) => {
// 					console.log(message, 'socketsss');
// 					dispatch(setNotificationItem({
// 						id: v4(),
// 						message: message?.message || "",
// 						type: 'SUCCESS',
// 						isRead: false,
// 					}));
// 				});
// 			})
// 			.catch(e => {
// 				console.log('Connection failed: ', e)
// 			});
// 		return null
// 	}

// 	useEffect(() => {
// 		RealTimeNotificationSetup();
// 	}, [])

// 	useEffect(() => {
//     if (roleChanged) {
//       RealTimeNotificationSetup()
//       dispatch(resetRoleChanged());
//     }
//   }, [roleChanged, dispatch]);
//   const isVisitorRoute = window.location.pathname === "/admin/vistors/show-visitors-queue";
// 	return (
// 		<div className={`panel ${closePanel}`}>
// 			{!isVisitorRoute && (
// 				<>
// 					<AppHeader handleBurger={handleBurger} />
// 					<AppMenu />
// 				</>
// 			)}
// 			<div className={`${isVisitorRoute ? "" : "main-content"}`} >
// 				<div className='page-content'>
// 					<div className='container-fluid' >
// 							<Switch>
// 								{menu}
// 								<Route path='/' component={Dashboard} />
// 							</Switch>
// 					</div>
// 				</div>
// 				{!isVisitorRoute && (
// 					<AppFooter />
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default AdminSide;


// import React from 'react';
// import { Routes, Route, Link } from 'react-router-dom';

// const Dashboard = () => <h2>Dashboard</h2>;

// const AdminSide = () => {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Admin Side</h1>
//       <nav>
//         <Link to="/admin/dashboard">Dashboard</Link>
//       </nav>
//       <Routes>
//         <Route path="dashboard" element={<Dashboard />} />
//       </Routes>
//     </div>
//   );
// };

// export default AdminSide;
