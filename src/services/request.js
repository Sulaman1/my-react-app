import store from '../store/store'; // Adjust the import path as needed
import { setLoaderOn, setLoaderOff } from '../store/loader'; // Adjust the import path as needed

// export const BASEUIURL = "https://qr.sightsnsounds.pk";
// TODO: make configuratable ports
const BASEURL = "process.env.REACT_APP_BASE_URL";
const FINGERBASEURL = "process.env.REACT_APP_FINGERBASEURL";
// const BASEURL = "http://localhost:44311/api";
// export var faceBaseUrl = "https://idverify.ng/dapi/api";
// export var facialUrl = "https://mysterious-sands-13000.herokuapp.com/";
export var baseImageUrl = "process.env.REACT_APP_IMAGE_URL";

export const socketBaseUrl = "process.env.REACT_APP_SOCKET";

// get all inventory
export const getData = (URL, data, authflag, useLoader = true) => {
  console.log("use loader in get data =", useLoader);
  return new Promise((resolve, reject) => {
    const authKey = sessionStorage.getItem('accessToken')
      ? 'Bearer ' + sessionStorage.getItem('accessToken')
      : '';
    if (useLoader) {
      store.dispatch(setLoaderOn());
    }

    fetch(BASEURL + URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authKey,
      },
    }) 
      .then((response) => { 
        console.log("response.status =", response.status);
        if (response.status === 401) {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/';
        }
        return response.json()
      })
      .then((data) => {
        resolve(data);
        if (useLoader) {
          setTimeout(() => {
            store.dispatch(setLoaderOff());
          }, 1000);
        }
      })
      .catch((error) => {
        console.error('error in get api', error);
        if (useLoader) {
          setTimeout(() => {
            store.dispatch(setLoaderOff());
          }, 1000); 
        }
        reject(error);
      });
  });
};

// put request
export const putData = (URL, data, authflag) => {
  return new Promise((resolve, reject) => {
    const authKey = sessionStorage.getItem('accessToken')
      ? 'Bearer ' + sessionStorage.getItem('accessToken')
      : '';
    fetch(BASEURL + URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authKey,
      },
    }) // getInventory
      .then((response) => {response.json()})
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('error in post api', error);
        reject(error);
      });
  });
};

// add items in inventory
export const postData = (URL, data, useLoader = true) => {
  console.log("use loader in post data =", useLoader);
  return new Promise((resolve, reject) => {
    const authKey = sessionStorage.getItem('accessToken')
      ? 'Bearer ' + sessionStorage.getItem('accessToken')
      : '';

    if (useLoader) {
      store.dispatch(setLoaderOn());
    }

    fetch(BASEURL + URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: authKey,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/';
        }
        return response.json()
      })
      .then((result) => {
        resolve(result);
        if (useLoader) {
          setTimeout(() => {
            store.dispatch(setLoaderOff());
          }, 1000); 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (useLoader) {
          setTimeout(() => {
            store.dispatch(setLoaderOff());
          }, 1000); 
        }
        reject(error);
      });
  });
};

export var uploadFileService = (file, url, extraParams = null) => {
  return new Promise((resolve, reject) => {
    try {
      const req = new XMLHttpRequest();
      const authKey = sessionStorage.getItem('accessToken')
        ? 'Bearer ' + sessionStorage.getItem('accessToken')
        : '';

      const formData = new FormData();
      //formData.append("uploadfile", data.uploadfile, data.fileName);

      formData.append('File', file);
      if (extraParams) {
        formData.append('FileName', extraParams.name);
        formData.append('PrisonerId', extraParams.prisonerId);
        formData.append('TransferFile', true);
      }
      //formData.append("uploadfile", data.uploadfile, data.fileName);
      req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          let response = JSON.parse(this.responseText);
          resolve(response);
        } else if (this.status === 500) {
          resolve(false);
        }
      };
      req.open('POST', `${BASEURL}${url}`);
      req.setRequestHeader('Authorization', authKey);
      req.send(formData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export var postFingerData = (url, data) => {
  return new Promise((resolve, reject) => {
      fetch(FINGERBASEURL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
};

export const getFingerData = (URL) => {
  return new Promise((resolve, reject) => {
    fetch(FINGERBASEURL + URL, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
      },
    }) // getInventory
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('error in post api', error);
        reject(error);
      });
  });
};

// add items in inventory
export const deleteData = (URL, data) => {
  return new Promise((resolve, reject) => {
    const authKey = sessionStorage.getItem('accessToken')
      ? 'Bearer ' + sessionStorage.getItem('accessToken')
      : '';
    fetch(BASEURL + URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: authKey,
      },
      body: {},
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
};


// get all inventory
export const getDataTest = (URL, data, authflag) => {
  return new Promise((resolve, reject) => {
    const authKey = sessionStorage.getItem('accessToken')
      ? 'Bearer ' + sessionStorage.getItem('accessToken')
      : '';
    fetch(FINGERBASEURL, {
      method: 'GET',
      headers: {
        Authorization: authKey,
      },
    }) // getInventory
      .then((response) => response)
      .then((data) => {
        console.log('api from get request for node server')
        resolve(data);
        setTimeout(() => {
          store.dispatch(setLoaderOff());
        }, 1000); 
      })
      .catch((error) => {
        console.error('error in get node api', error);
        reject(error);
        setTimeout(() => {
          store.dispatch(setLoaderOff());
        }, 1000); 
      });
  });
};