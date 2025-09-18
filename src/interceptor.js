const originalFetch = window.fetch;

window.fetch = async (input, init = {}) => {
  // Keep original URL
  let url = input;
  console.log("THE INPUT:", input);
  console.log("THE URL:", url);
  console.log("INIT : ", init);
  url = "http://pmis-bl:4502/api/TokenAuth/Authenticate";
  console.log("THE second URL: ", url);
  let modifiedInit = { ...init };
  
  console.log("MODIFIED INIT : ", modifiedInit);

  // Only modify PrisonerSearch requests
  //if (sessionStorage.getItem('activeRoleId') && typeof input === 'string' && input.includes('PrisonerSearch')) {
    //const activeRoleId = parseInt(sessionStorage.getItem('activeRoleId'), 10);
    try {
      const currentBody = init?.body ? JSON.parse(init.body) : {};
      const newBody = { ...currentBody, roleId: 1 };

      modifiedInit = {
        ...init,
        body: JSON.stringify(newBody),
        headers: {
          ...init.headers,
          'Content-Type': 'application/json',
          // Optionally add auth token
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      };
    } catch (e) {
      console.error('Error modifying request body:', e);
    }
  //}

  try {
     console.log("IN FETCH URL 1:", url);
    console.log("MODIFIED INIT 1: ", modifiedInit);

    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhbGlpLmtoYW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhbGlpLmtoYW5AdGVzdC5jb20iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkpGVDVRRVJOQ0VKM05FQ01RV1BUTDZMU0FTVUVCRzMyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIkFkbWluIiwiSW5zcGVjdG9yIEdlbmVyYWwgUHJpc29ucyJdLCJodHRwOi8vd3d3LmFzcG5ldGJvaWxlcnBsYXRlLmNvbS9pZGVudGl0eS9jbGFpbXMvdGVuYW50SWQiOiIxIiwic3ViIjoiMTI5IiwianRpIjoiMDFmYmE3OTgtMWE4Yi00OGQ3LTk5ZjEtODhlNjE4NGM2MTdjIiwiaWF0IjoxNzU4MTIwNjcyLCJuYmYiOjE3NTgxMjA2NzIsImV4cCI6MTc1ODEyNjA3MiwiaXNzIjoiUE1JU1MiLCJhdWQiOiJQTUlTUyJ9.AR8I1yHP1WxviTaGVGvCetNCZVXlvagJwzLqbrpMwIs";

    //MAKE THIS URL CORRECT to satisfy this const roles = result.result.employee.user.roles; in Login
    url="https://pmis-bl:4502/api/services/app/EmployeeAppServices/GetAllEmployee";
    const response = await originalFetch(url,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // <-- single Bearer token only
    },
  });

    console.log("IN FETCH URL 2:", url);
    console.log("MODIFIED INIT 2: ", modifiedInit);
    if (response.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login';
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};



// const originalFetch = window.fetch;

// window.fetch = async (input, init) => {
//     // Request interceptor logic
    
//     // Get activeRoleId from sessionStorage
//     const activeRoleId = parseInt(sessionStorage.getItem('activeRoleId'), 10);
    
//     let url = input;
//     url = "https://pmis-bl:4502/api/";
//     let modifiedInit = { ...init };

//     // Only modify requests that include 'PrisonerSearch'
//     if (activeRoleId && typeof input === 'string' && input.includes('PrisonerSearch')) {
//         try {
//             const currentBody = init?.body ? JSON.parse(init.body) : {};
//             const newBody = {
//                 ...currentBody,
//                 roleId: activeRoleId
//             };
            
//             modifiedInit = {
//                 ...init,
//                 body: JSON.stringify(newBody),
//                 headers: {
//                     ...init?.headers,
//                     'Content-Type': 'application/json',
//                 },
//             };
//         } catch (e) {
//             console.error('Error modifying request body:', e);
//         }
//     }

//     try {
//         const response = await originalFetch(url, modifiedInit);

//         if (response.status === 401) {
//             console.error('Unauthorized access - redirecting to login');
//             sessionStorage.clear();
//             localStorage.clear();
//             window.location.href = '/login';
//         }

//         return response;
//     } catch (error) {
//         console.error('Fetch error:', error);
//         throw error;
//     }
// };