/* eslint-disable no-tabs */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { transfromStringArray } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl, getData, postData } from '../../../services/request';
import AddNewGuard from './addNewGuard';

const GuardInfo = props => {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [guardFormPayload, setGuardFormPayload] = useState([]);
  const [showNewGaurdInfoBtn, setShowNewGaurdInfoBtn] = useState(false);
  const [gaurdsInfo, setGaurdsInfo] = useState([
    { "label": "Azam khan | 345-c", "value": "1" },
    { "label": "Shakeel Yasrab | 123-az", "value": "1" },
    { "label": "Faheem Aalam | 767-q", "value": "1" }
  ])
  const [policeFormPayload, setPoliceFormPayload] = useState({
    checkPoliceOfficers: []
  })

  const loadData = () => {

    getData(`/services/app/Darban/GetAllPoliceOfficers`)
      .then(res => {
        if (res.success) {
          if (res?.result?.policeOfficers.length) {
            const infoObj = res.result.policeOfficers.map((e) => { return ({
              value: e.id,
              label: e.name,
              designation: e.designation,
              beltNumber: e.beltNumber,
              mobileNumber: e.mobileNumber
          }) });
            setGaurdsInfo(infoObj)
          } else {
            setGaurdsInfo(true)
          }
        }
      })
      .catch(e => {
        console.log(e, 'Error while fetching gaurdInfo and fileName is {BasicInfo}');
      });
  }

  useEffect(() => {
    loadData()
    if(!props.forDarban){
      setPoliceFormPayload(props?.formPayload?.[0].checkPoliceOfficers)

    }
  }, [])
  

  const GuardSubmitHandler = () => {
    const payload = {
      "name": guardFormPayload?.policeOfficerName,
      "beltNumber": guardFormPayload?.beltNo,
      "designation": guardFormPayload?.designation,
      "mobileNumber": guardFormPayload?.cellNo,
    }
    if (guardFormPayload?.policeOfficerName) {

      const url = `/services/app/Darban/CreateUpdatePoliceOfficer`;
      postData(url, payload)
        .then(res => {
          if (res.success) {
            setShowSelectModal(false)
            loadData()
          } else {
            swal("", res.error.message, "warning")
          }
        })
    } else {
      swal("Fields are Required!", "Please fill all the fields", "warning")
    }
  }
  const getOptionLabel = option => (
    <div>
        <b>Name:</b> {option?.label} <b> | </b> 
        <b>Designation:</b> {option?.designation}<br/>
        <b>Belt Number:</b> {option?.beltNumber} <b> | </b> 
        <b>Cell No:</b> {option?.mobileNumber}
    </div>
  );

  const loadOptions = (inputVal, callback) => {
    if (inputVal.length > 2) {
      getData(`/services/app/Darban/GetAllPoliceOfficers`)
        .then(res => {
          if (res.success) {
            const responseData = res.result?.policeOfficers || []
            const filtered = filterPolice(inputVal, responseData)
            if (filtered.length) {
              const infoObj = filtered.map((e) => {
                return {
                    value: e.id,
                    label: e.name,
                    designation: e.designation,
                    beltNumber: e.beltNumber,
                    mobileNumber: e.mobileNumber
                };
            });
              setShowNewGaurdInfoBtn(false)
              callback(infoObj)
            } else {
              setShowNewGaurdInfoBtn(true)
              callback([])
            }
          }
        })
        .catch(e => {
          console.log(e, 'Error while fetching prisoner/user history detail and fileName is {HistoryDetailModal}');
        });
    }
  };
  const filterPolice = (inputValue, responseData) => {
    return responseData.filter((i) =>
        (i.name && i.name.toLowerCase().includes(inputValue.toLowerCase())) ||
        (i.designation && i.designation.toLowerCase().includes(inputValue.toLowerCase())) || // Check for null
        (i.beltNumber && i.beltNumber.toString().includes(inputValue)) || // Check for null
        (i.mobileNumber && i.mobileNumber.toString().includes(inputValue)) // Check for null
    );
};


  return (
    <>
      <div className='col-lg-6'>
       
        <InputWidget
          type={'asyncSelect'}
          ismulti={true}
          inputType={'select'}
          label={'Guard Info (Type at least 4 characters)'}
          id={'gaurd-info'}
          options={gaurdsInfo || []}
          getOptionLabel={getOptionLabel}
          require={false}
          loadOptions={loadOptions}
          icon={'icon-gender'}
          defaultValue={
            transfromStringArray(
              gaurdsInfo,
              props.forDarban ? props?.formPayload?.prisonerAdmission?.policeOfficers  : policeFormPayload?.checkPoliceOfficers,
              'object-arrays', "", 'Gaurd'
            ) || []
          }
          setValue={(value) => {
            const filteredVal = value.map((e) => {
              return { policeOfficerId: e.value, name:e.label };
            });
            const payload = {
              ...props.formPayload,
            };
            if (props.forDarban) {
              payload['prisonerAdmission']['policeOfficers'] = filteredVal;
              props.setFormPayload(payload);
            } else {
              const payload = {
                ...policeFormPayload
              };
              payload['checkPoliceOfficers'] = filteredVal;
              setPoliceFormPayload(payload);
              props.formPayload.forEach((ele) => {
                ele.checkPoliceOfficers = filteredVal;
              })
              props.setFormPayload(props.formPayload);
            }
          }}
        />

      
      </div>
      <div className="col-lg-6">
        <InputWidget
          type={"input"}
          label={"Vehicle Number (گاڑی کا نمبر)"}
          id={"vehicle-number"}
          require={true}
          icon={"icon-operator"}
          defaultValue={props?.formPayload?.prisonerAdmission?.policeCarNumber}
          setValue={(value) => {
            console.log("policeCarNumber", value);
            const payload = {
              ...props.formPayload,
            };
            if (props.forDarban) {
              payload['prisonerAdmission']["policeCarNumber"] = value;
              props.setFormPayload(payload);
            } else {
              props.formPayload.forEach((ele) => {
                ele.checkVehicleNumber = value;
              });
              props.setFormPayload(props.formPayload);
            }
          }}
        />
      </div>
      {!props.forDarban && (
        <div className="col-lg-12">
          <InputWidget
            type={"input"}
            label={"Other Details (دیگر تفصیلات)"}
            id={"other-details"}
            require={true}
            icon={"icon-operator"}
            defaultValue={props.formPayload?.otherDetails}
            setValue={(value) => {
              console.log("otherDetails", value);
              props.formPayload.forEach((ele) => {
                ele.otherDetails = value;
              });
              props.setFormPayload(props.formPayload);
            }}
          />
        </div>
      )}
      <div className='col-lg-6'>
      {showNewGaurdInfoBtn && (
          <button
            id="add-gaurd-btn"
            type='button'
            className={`btn rounded-pill  ${props?.forDarban ? "add-gaurd-btn" : "" }  w-lg btn-prim waves-effect waves-light`}
            onClick={() => setShowSelectModal(true)}
          >
            Add New Guard
          </button>
        )}
      </div>
      <AddNewGuard
        onClose={() => setShowSelectModal(false)}
        visible={showSelectModal}
        setFormPayload={setGuardFormPayload}
        formPayload={guardFormPayload}
        onSubmit={GuardSubmitHandler}
      />
    </>
  );
}
export default GuardInfo;
