/* eslint-disable brace-style */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable max-len */
import {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import {getFingerData, postData, postFingerData} from '../services/request';
import CnicProfile from '../components/prisoners/Components/CnicProfile';
import swal from 'sweetalert';

const FingerScanner = ({
  visible,
  title,
  onClose,
  fingerIndex,
  scanType,
  callBack,
  globalSearch = false,
  isCheckout = false,
  handleCheckoutPrisoner
}) => {
  const [formPayload, setFormPayload] = useState({});
  const [FingerPrint, setFingerPrint] = useState('');
  const [finger, setFinger] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [prisonerData, setPrisonerData] = useState({});
  const [disableSave, setDisableSave] = useState(true);
  const [scaningReady, setScaningReady] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  console.log('fingerIndexfingerIndex', fingerIndex);


  useEffect(() => {
    setDeviceMode();  
  }, [fingerIndex]);

  useEffect(() => {
    setDeviceReady(false)
    setDisableSave(true)
    setScaningReady(false)
    setTimeout(()=>{
      makeSearchFingerReady({'UserId': 0, 'Action': 2})
    },3000)
  },[visible])

  const resetFingerModal = () => {
    setDisableSave(true);
    setScaningReady(false);
  };

  const setDeviceMode = async () => {
    // Action 1: Enrollment, 2: Attendance, 3: Reset Device
    let payload = {};
    if (scanType === 'admission' && !globalSearch) {
      payload['UserId'] = 0;
      payload['Action'] = 1;
    } else {
      payload['UserId'] = 0;
      payload['Action'] = 2;
    }
    await postFingerData('/WriteUserInfo', payload);

    switch (fingerIndex) {
      case 'right thumb':
        setFinger(3)
        break;
      case 'left thumb':
        setFinger(2)
        break;
      case 'left index':
        setFinger(0)
        break;
      case 'right index':
        setFinger(1)
        break;
      default:
        break;
    }
  };

  const resetDevice = async () => {
    const payload = {
      UserId: 0,
      Action: 3
    };
    await postFingerData('/WriteUserInfo', payload);
  };

  const apiCallForPrisonerValidation = (data) => {
    return new Promise((resolve, reject) => {
      try {
        postData('/services/app/BasicInfo/CheckFingerprintPrisoner', data)
          .then((res) => {
            if (res.success == true) {
              resolve(res);
            }
          })
          .catch((err) => {
            console.log('getting error while uploading');
            reject(false);
          });
      } catch (error) {
        alert('something went wrong');
      }
    });
  };

  const apiCallForPrisonerCheckout = (data) => {
    return new Promise((resolve, reject) => {
      try {
        postData('/services/app/BasicInfo/CheckFingerprintPrisonerForCheckOutDarban', data)
          .then((res) => {
            if (res.success == true) {
              resolve(res);
            }
          })
          .catch((err) => {
            console.log('getting error while uploading');
            reject(false);
          });
      } catch (error) {
        alert('something went wrong');
      }
    });
  };

  const makeSearchFingerReady = async (data) => {
    const payload = data;
    await postFingerData('/WriteUserInfo', payload);
    setScaningReady(true);
    setDeviceReady(true)
  };

  const searchAndValidateFinger = async () => {
    const res = await getFingerData('/ReadFingerPrint');
    if (res?.DataResult) {
      let validatePrisonerByFingerPrint = null;
      const fingPrintData = res;
      if (!isCheckout) {
        try {
          validatePrisonerByFingerPrint = await apiCallForPrisonerValidation({'fingerprintTemp': fingPrintData.DataResult, 'finger': finger});
        } catch (error) {
          swal('Something went wrong! Prisoner Finding Api', '', 'warning');
        }
        const foundData = validatePrisonerByFingerPrint?.result?.data;
        if (foundData) {
          setPrisonerData(foundData);
          setIsOpen(true);
          // onClose()
        } else {
          makeSearchFingerReady({'UserId': 0, 'Action': 1});
          swal('No Prisoner Found against the fingerprint.', '', 'warning');
        }
        setDisableSave(false);
      } else {
        searchPrisonerForCheckout(fingPrintData);
      }
    } else {
      swal('Something went wrong! validateAndSearchFinger', '', 'warning');
    }
  };

  const searchPrisonerForCheckout = async (fingPrintData) => {
    try {
      const validatePrisonerByFingerPrint = await apiCallForPrisonerCheckout({'fingerprintTemp': fingPrintData.DataResult, 'finger': finger});
      const foundData = validatePrisonerByFingerPrint?.result?.data;
      if (foundData) {
        setPrisonerData(foundData);
        setIsOpen(true);
        onClose();
      } else {
        swal('No such prisoner in the list', '', 'warning');
        onClose();
      }
    } catch (error) {
      swal('something went wrong in prisoner checkout', '', 'warning');
    }
  };
  const submitHandler = async () => {
    // const prisoner = JSON.parse(sessionStorage.getItem('prisonerMedicalEntry'));
    // Need to recode a bit later

    try {
      const res = await getFingerData('/ReadFingerPrint');
      // const res = FingerPrints;
      if (res?.DataResult) {
        setFingerPrint(res);
        callBack(res, fingerIndex);
        setFormPayload(res);
        // setActiveTab(0);
        // onClose();
      } else {
        swal('Something went wrong!', '', 'warning');
      }
    } catch (err) {
      swal(err.message, err.details ?? '', 'warning');
    }
  };

  return (
    <>
      <Modal show={visible} onHide={onClose} size="lg">
        <Modal.Header closeButton style={{padding: '1.25rem 1.25rem'}}>
          <h5 className="modal-title" id="exampleModalgridLabel">
            {title}
          </h5>
        </Modal.Header>
        <Modal.Body>
        <p> Place your {fingerIndex} on the fingerprint device to scan the finger</p>
          <br />
          {FingerPrint &&
            <img src={`data:image/png;base64,${FingerPrint.ImageBytes}`} />
          }
          {(scaningReady && disableSave && deviceReady) && (
           <p style={{color:"red"}}>Note: Make sure the device surface and the thumb is clean. The biometric search will not bring any results until the <strong>"Fingerprint is successfully scanned and the file is generated"</strong> notification appears in the right bottom corner of your screen.
            <br/><br/> <span>
            نوٹ: اس بات کو یقینی بنایں کہ سکین کیا جانے والی اُنگلی اور مشین کی سکیننگ والی جگہ بالکل صاف ہو۔ اور جب تک سکیننگ ٹھیک ہونے کا میسج سکرین کے نیچے والے دایں کارنر میں نیں آ جاتا تب تک سرچ والے بٹن پر کلک نہ کریں۔
            </span>
          </p>
        )}
        {!disableSave && (
          <p  style={{color:"red"}}>
            No Prisoner has been found against the fingerprint. 
            Please scan the finger again on the machine and complete the 4 counts. Upon the completion of the 4th count, the system will show a success message <strong>"An enrollment FMD was successful"</strong> after the message appears, click on Save FingerPrint button. 
            <br/><br/> <span>
              
اس فنگر پرنٹ پر کوی قیدی یا حوالاتی نہیں ریجسٹرڈ، اب آپ مزید چار بار اسی اُنگلی کو سکین کریں، اور اُس کے بعد سیوو فنگر پرنٹ والے بٹن پر کلک کریں۔
            </span>
          </p>
        )}
          


        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {resetFingerModal(); onClose();}}
            className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
          >
            Cancel
          </button>
          {!disableSave && (
            <button
              disabled={disableSave}
              onClick={submitHandler}
              className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
            >
              Save
            </button>
          )}

          {!deviceReady && (
            <button
              disabled={true}
              className="btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1"
            >
              Setting Device into Ready mode
            </button>
          )}

          {(scaningReady && disableSave && deviceReady) && (
            <button
              onClick={searchAndValidateFinger}
              className="btn btn-primary lg-btn submit-prim waves-effect waves-light mx-1"
            >
              Perform Biometric Search
            </button>
          )}

        </Modal.Footer>
      </Modal>
      <CnicProfile
        globalSearch={globalSearch}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={prisonerData}
        isCheckout={isCheckout}
        checkoutPrisoner={handleCheckoutPrisoner}
        resetFingerModal={resetFingerModal}
      />
    </>
  );
};

export default FingerScanner;
