import { useState, useEffect } from 'react';
import InputWidget from '../../../droppables/InputWidget';
import {  useSelector } from 'react-redux';
import { baseImageUrl, getData, postData } from '../../../services/request';
import { transformData, transfromStringArray } from '../../../common/Helpers';
import PrisonerInfoCard from './release-prisoner/PrisonerInfoCard';
import { _ } from 'gridjs-react';
import AddVaccinationModal from './AddVaccinationModal';
import { validateMedicalFormFields } from '../../../common/FormValidator';
import letter from '../../../assets/images/users/1.png';
import { Spinner } from 'react-bootstrap';
const Medical = ({ setActiveTab, redirectTab, prisoner, details, setPrisonerData }) => {

  const [isDisabled, setIsDisabled] = useState(false);
  const [lookups, setLookups] = useState({});
  const userMeta = useSelector((state) => state.user);
  const [isHospital] = useState(userMeta?.role === 'Prison Hospital' || userMeta?.role === "Super Admin");
  const [vaccinationArray, setVaccinationArray] = useState([])
  const [formPayload, setFormPayload] = useState({
    data: {},
  });
  const [documentLoading, setDocumentLoading] = useState(false);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const loadData = async () => {
    

    try {
      const prisoner =JSON.parse(sessionStorage.getItem('prisonerAdmissionEntry')) ||  JSON.parse(sessionStorage.getItem('selectedPrisoner')) ;
      formPayload['prisonerBasicInfoId'] = prisoner.id;
      const res = await getData(
        `/services/app/PrisonerMedicalInfo/GetOnePrisonerMedicalInfo?PrisonerBasicInfoId=${prisoner.id}`,
        '',
        true,
      );
      if (res?.result?.isSuccessful) {
        const data = res?.result?.medicalData;
        setFormPayload(data);
        
        if (isHospital) {
          setPrisonerData(res?.result?.prisonerData);
        }
        if (data?.vaccinations?.length > 0) {
          setVaccinationArray(data?.vaccinations)
        }
      }
      if (!isHospital) {
        setIsDisabled(!isDisabled);
      }
    } catch (err) {
      
      console.log(err, 'getting error while fetching API {GetOnePrisonerMedicalInfo} & fileName is {Medical.js}');
    }
  };

  const handleSubmit = async (e) => {
  
    if (!validateMedicalFormFields(formPayload)) {
      return false;
    }
    const tempdata = vaccinationArray.map((item) => {
      return {
        vaccinationLkptId: item.vaccinationLkptId,
        vaccinationDate: item.vaccinationDate,
        vaccinationDate2: item.vaccinationDate2,
        vaccinationDate3: item.vaccinationDate3,
      }
    })
   
    const filteredDiseases = formPayload?.diseases?.filter(item => item)
    const prisoner = JSON.parse(sessionStorage.getItem('prisonerAdmissionEntry'));
    formPayload['prisonerBasicInfoId'] = prisoner.id;
    formPayload.diseases = filteredDiseases
    if(formPayload?.bloodGroupId == null){
        delete formPayload.bloodGroupId
      }
      const payload = { ...formPayload, vaccinations: tempdata }
    

    try {
      const res = await postData(
        "/services/app/PrisonerMedicalInfo/CreateOrEditMedicalInfo",
        payload,
      );
      
      if (res.success == false) {
        swal(
          !res.error.details ? '' : res.error.message,
          res.error.details ?
            res.error.details :
            res.error.message,
          'warning',
        );
      } else {
        swal('Successfully Saved!', '', 'success').then(() => {
            setActiveTab(redirectTab);
        });
      }
    } catch (err) {
      swal('Something went wrong!', err, 'warning');
      console.log(err, 'getting error while fetching API {CreateOrEditMedicalInfo} & fileName is {Medical.js}');
    } finally {
      dispatch(setLoaderOff());
    }
  };

  useEffect(() => {
    loadData();
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      const lookup = {};
     
      const bloodGroupObj = transformData(newLookups?.bloodGroup);
      lookup['bloodGroup'] = bloodGroupObj;
    
      const covidObj = transformData(newLookups?.vaccinations);
      lookup['CovidVacinationTypes'] = covidObj;
      // diseases
      if (!lookups?.diseases || lookups?.diseases?.length == 0) {

        const diseasesObj = transformData(newLookups?.disease);
        lookup['diseases'] = diseasesObj;
      }
   
      setLookups(lookup);
    } catch (err) {
      console.error(err);
      console.log(err, 'getting error while fetching Lookups {fetchLookUps} & fileName is {Medical.js}');
    }
  };

      const handleDocumentUpload = (value) => {
        if (!value) return;
        const data = {
          image: value.split(',')[1],
          prisoner: false,
          imageName: 'doc'
        };
          setDocumentLoading(true);
        postData('/services/app/BasicInfo/uploadBase64', data)
          .then(res => {
            if (res.success == true) {
              const pd = {
                ...formPayload
              };


              pd['documents'] = res.result.imagePath;

              setFormPayload(pd);
              setDocumentLoading(false);
            }
          })
          .catch(err => {
            console.log(err, 'getting error while uploading');
            setDocumentLoading(false);
          });
      };


  return (
    <>
      <div className='row p-2'>
        {details && (
          <PrisonerInfoCard prisoner={prisoner} />
        )}
        <form>
          <div className='row'>
            {!isHospital && formPayload === null ? (
              <h2 className='third-heading' style={{ color: 'red' }}>To Be Filled By The Doctor</h2>
            )
              :
              !isHospital && formPayload !== null && (
                <h2 className='third-heading' style={{ color: 'green' }}>Filled By The Doctor</h2>
              )
            }
            {isHospital ? (
              <h4 className='third-heading'>Add/Update Medical Information</h4>
            ) :
              <h4 className='third-heading'>Medical Information</h4>
            }
          </div>
          <fieldset disabled={isDisabled}>
            <div className='row'>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  label={'Medical Issue (طبی مسئلہ)'}
                  readOnly={isDisabled}
                  require={false}
                  icon={'icon-medical'}
                  id={'medical-issue'}
                  defaultValue={formPayload?.medicalIssue}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['medicalIssue'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  label={'Medical Treatment (طبی علاج)'}
                  require={false}
                  readOnly={isDisabled}
                  icon={'icon-medical'}
                  id={'medical-treatment'}
                  defaultValue={formPayload?.medicalTreatment}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['medicalTreatment'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'multiSelect'}
                  label={'Blood Group (خون کا گروپ)'}
                  require={false}
                  icon={'icon-choice'}
                  id={'blood-group'}
                  isDisabled={isDisabled}
                  options={lookups?.bloodGroup || []}
                  defaultValue={
                    transfromStringArray(
                      lookups?.bloodGroup,
                      formPayload?.bloodGroupId
                    ) || []
                  }
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['bloodGroupId'] = value.value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  label={'First mark of Identification  (شناخت کا نشان)'}
                  require={false}
                  icon={'icon-operator'}
                  readOnly={isDisabled}
                  id={'mark-of-identification'}
                  defaultValue={formPayload?.markOfIdentification}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['markOfIdentification'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  label={'Second Mark of Identification (شناخت کا نشان)'}
                  require={false}
                  icon={'icon-operator'}
                  readOnly={isDisabled}
                  id={'mark-of-identification'}
                  defaultValue={formPayload?.markOfIdentification2}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['markOfIdentification2'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  inputType={'name'}
                  label={'Height (ft)'}
                  require={false}
                  icon={'icon-number'}
                  id={'height'}
                  readOnly={isDisabled}
                  defaultValue={formPayload?.height}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['height'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  inputType={'number'}
                  label={'Weight (kg)'}
                  id={'weight'}
                  require={false}
                  readOnly={isDisabled}
                  icon={'icon-number'}
                  defaultValue={formPayload?.weight}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['weight'] = value;
                    setFormPayload(payload);
                  }}
                />
            
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'multiSelect'}
                  label={'Disease (بیماریاں)'}
                  isMulti
                  isDisabled={isDisabled}
                  id={'disease'}
                  icon={'fa-solid fa-disease'}
                  options={lookups.diseases || []}
                  defaultValue={
                    formPayload?.diseases?.map((p) => {
                      return lookups?.diseases?.find((disese) => disese.value === p)
                    }) || []
                  }
                  setValue={(value) => {
                
                    const diseases = value.map((e) => {
                      return  e.value ;
                    });

                    const payload = {
                      ...formPayload,
                    };
                    payload['diseases'] = diseases;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6 '>
                <InputWidget
                  type={'input'}
                  label={'Injury/Unexplained Injury (غیر واضح چوٹ)'}
                  readOnly={isDisabled}
                  require={false}
                  id={'disease'}
                  icon={'icon-operator'}
                  defaultValue={formPayload?.injury}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['injury'] = value;
                    setFormPayload(payload);
                  }}
                />
                <InputWidget
                  type={'switch'}
                  inputType={'checkbox'}
                  label={'PWID (انجیکٹ ڈرگس)'}
                  id={'drugs'}
                  require={false}
                  defaultValue={
                    formPayload?.pwid
                  }
                  setValue={checked => {
                    const payload = {
                      ...formPayload
                    };
                    payload['pwid'] = checked;
                    setFormPayload(payload);
                  }}
                />
                <InputWidget
                  type={'switch'}
                  inputType={'checkbox'}
                  label={'Disabled (معذور)'}
                  id={'disabled'}
                  require={false}
                  icon={'icon-prisoner'}
                  defaultValue={formPayload?.disabled
                  }
                  setValue={checked => {
                    const payload = {
                      ...formPayload
                    };
                    payload['disabled'] = checked;
                    setFormPayload(payload);
                  }}
                />
               
                 <InputWidget
                  type={'switch'}
                  inputType={'checkbox'}
                  label={'Drug Addict (منشیات کے عادی)'}
                  id={'addicted'}
                  require={false}
                  icon={'icon-prisoner'}
                  defaultValue={formPayload?.addict
                  }
                  setValue={checked => {
                    const payload = {
                      ...formPayload
                    };
                    payload['addict'] = checked;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'switch'}
                  inputType={'checkbox'}
                  label={'Juvenile (نابالغ)'}
                  id={'Juvenile'}
                  require={false}
                  defaultValue={
                    formPayload?.juvinile
                  }
                  setValue={checked => {
                    const payload = {
                      ...formPayload
                    };
                    payload['juvinile'] = checked;
                    setFormPayload(payload);
                  }}
                />
                <InputWidget
                  type={'switch'}
                  inputType={'checkbox'}
                  label={'Fit for Labour (مزدوری کے لئے موزوں)'}
                  id={'fit-for-labour'}
                  require={false}
                  icon={'icon-prisoner'}
                  defaultValue={formPayload?.fitForLabour
                  }
                  setValue={checked => {
                    const payload = {
                      ...formPayload
                    };
                    payload['fitForLabour'] = checked;
                    setFormPayload(payload);
                  }}
                />
              </div>
            {formPayload?.addict &&
              <div className='col-lg-6 animation-fade-grids mt-2'>
                <InputWidget
                  type={'input'}
                  label={'Details of drug addiction (منشیات کی لت کی تفصیلات)'}
                  readOnly={isDisabled}
                  require={false}
                  icon={'icon-medical'}
                  id={'drug-details'}
                  defaultValue={formPayload?.drugAddictionDetails}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload['drugAddictionDetails'] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              }
            </div>
                    <div className='row mb-3'>
                <h3 className='sub-heading text-center just-center mb-3'>
                Blood Screening
                </h3>
                <InputWidget
                  id={'user'}
                  type={'editImage'}
                  inputType={'file'}
                  upload={'icon-upload'}
                  noCropping={true}
                  onlyUploadFile={true}
                  take={'icon-photographers'}
                  require={false}
                  Photo={
                    formPayload?.documents
                      ? baseImageUrl +
                      formPayload?.documents
                      : letter
                  }
                  setValue={value => {
                    handleDocumentUpload(value);
                  }}
                />
                </div>
                {(documentLoading) && (
				<div className="mt-4 mb-4 d-flex justify-content-center gap-2 align-items-center">
					<b>Please wait...</b> <br /><Spinner animation="border" variant="primary" />
				</div>
			)}
          </fieldset>
          <AddVaccinationModal
            isHospital={isHospital}
            setVaccinationArray={setVaccinationArray}
            vaccinationArray={vaccinationArray}
          />
          <div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
            {isHospital && (
              <button
                id={'save-medical-button'}
                type='button'
                onClick={handleSubmit}
                className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
              >
                Save <i className='icon-add ml-2'></i>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Medical;
