const originalFetch = window.fetch;

window.fetch = async (input, init = {}) => {
  // Keep original URL
  let url = input;
  console.log("THE URL:", url);
  url = "/api/TokenAuth/Authenticate";
  let modifiedInit = { ...init };

  // Only modify PrisonerSearch requests
  if (sessionStorage.getItem('activeRoleId') && typeof input === 'string' && input.includes('PrisonerSearch')) {
    const activeRoleId = parseInt(sessionStorage.getItem('activeRoleId'), 10);
    try {
      const currentBody = init?.body ? JSON.parse(init.body) : {};
      const newBody = { ...currentBody, roleId: activeRoleId };

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
  }

  try {
    const response = await originalFetch(url, modifiedInit);

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