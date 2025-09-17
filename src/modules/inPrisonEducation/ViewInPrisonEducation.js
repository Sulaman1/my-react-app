/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, _ } from 'gridjs-react';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { useSelector } from 'react-redux';
import CaseModal from '../../components/prisoners/Components/CaseModal';
import PrisonerInfoCard from '../../components/prisoners/Components/release-prisoner/PrisonerInfoCard';
import InputWidget from '../../droppables/InputWidget';
import { transformDataForTableGrid, transformData, validateDate, getFormattedDate } from '../../common/Helpers';
import { getData, postData } from '../../services/request';

const EducationHeaders = [
  {
    'Education (تعلیم)': '',
    'Education Details (تعلیم کی تفصیلات)': '',
    'start Date (شروع کرنے کی تاریخ)': '',
    'End Date (ختم ہونے کی تاریخ)': '',
    // 'Action (عملدرامد)': '',
  },
];

const ViewinPrisonEducationPrisoner = (props) => {
  const [prisoner, setPrisoner] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loadedEducationEntries, setEducationEntries] = useState([]);
  const [formPayload, setFormPayload] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const prisonerObj = JSON.parse(sessionStorage.getItem('inPrisonEducationPrisoner'));
  const isUTP = prisonerObj?.prisonerCategory === 'UTP';
  const [caseInfo, setCaseInfo] = useState({});
  const [caseModalIsvisible, setCaseModalIsVisible] = useState(false);
  const [fetchedData, setData] = useState({});
  const gridRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('inPrisonEducationPrisoner')) {
      loadData();
    }
  }, []);

  useEffect(() => {
    fetchApiData();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const fetchApiData = async () => {
    try {
      const data = {};

      const remissionsObj = transformData(newLookups?.remissionType);
      data['remissions'] = remissionsObj;

      const courtObj = transformData(newLookups?.court);
      data['courts'] = courtObj;
      data['remandingCourts'] = courtObj;

      const policeStationsObj = transformData(newLookups?.policeStation);
      data['policeStations'] = policeStationsObj;

      const judgeObj = transformData(newLookups?.judge);
      data['judges'] = judgeObj;

      const sectionObj = transformData(newLookups?.sections);
      data['sections'] = sectionObj;

      const educationObj = transformData(newLookups?.EducationLKPT);
      data['EducationLKPT'] = educationObj;

      const prisonObj = transformData(newLookups?.prison);
      data['prison'] = prisonObj;

      setData(data);
    } catch (err) {
      alert('An error occured');
    }

  };

  const prisonerData = JSON.parse(
    sessionStorage.getItem('inPrisonEducationPrisoner')
  )

  const prisonerId = JSON.parse(
    sessionStorage.getItem('inPrisonEducationPrisoner')
  ).id;

  const loadData = () => {
    
    const prisonerId = JSON.parse(
      sessionStorage.getItem('inPrisonEducationPrisoner')
    ).id;
    getData(
      `/services/app/AddPrisonerAppServices/GetOnePrisonerProfile?PrisonerId=${prisonerId}`,
      '',
      true
    )
      .then((res) => {
        const data = res.result?.prisonerProfile?.prisonerEducations;
        const profileData = res.result.prisonerProfile;
        console.log(profileData);
        const prisonerInfo = {
          ...profileData.personalInfo,
          admissionDate: profileData.prisonerAdmission?.admissionDate,
          prisonerNumber: profileData.prisonerNumber?.prsNumber,
          category: profileData.prisonerNumber?.category,
          prisonName: profileData.prisonerNumber?.prison,
          frontPic: profileData.biometricInfo?.frontPic,
          leftPic: profileData.biometricInfo?.leftPic,
          rightPic: profileData.biometricInfo?.rightPic,
        };
        setPrisoner(prisonerInfo);
        
        if (data?.length > 0) {
            
          const filteredData = data.map((e) => {
            return {
                education: e.education,
              educationDetails: e.educationDetails,
              startDate: validateDate(e.startDate),
              endDate: validateDate(e.endDate),
                // Action : _(
                //     <div className="action-btns">
                //     {/* <button
                //       id={"view-more-btn"}
                //       type="button"
                //     //   onClick={() => handleDetailsBtn(e)}
                //       className="tooltip btn btn-prim waves-effect waves-light mx-1"
                //     >
                //       <i className="icon-add"></i>
                //       <span>Add</span>
                //     </button> */}
                //     <button
                //       id={"view-more-btn"}
                //       type="button"
                //     //   onClick={() => handleDetailsBtn(e)}
                //       className="tooltip btn btn-prim waves-effect waves-light mx-1"
                //     >
                //       <i className="icon-show-password"></i>
                //       <span>View Deatils</span>
                //     </button>
                //   </div>
                // )
            };
          });
          setEducationEntries(transformDataForTableGrid(filteredData));
        } else {
          setEducationEntries([]);
        }
      })
      .catch((err) => {
        swal('Something went wrong!', '', 'warning');
      });
  };

  const handleClose = () => {
    setCaseModalIsVisible(false);
  };

  const getPrisonId = (prisonName) => {
    const prison = fetchedData?.prison.find(p => p.label === prisonName);
    return prison ? prison.value : null;
  };

  
  const handleAddRemission = () => {
    
    const prisonName = prisonerData.prisonName; 
    const prisonId = getPrisonId(prisonName);
    const payload = {
      ...formPayload,
    };
    const pd = {
        data:{
            prisonId: prisonId,
            prisonerBasicInfoId: prisonerId,
            ...payload,
        }
    };
    postData(`/services/app/PrisonerDetailInformation/CreateUpdatePrisonerEducation`, pd)
      .then((result) => {
        if (result && result.success) {
          swal('Successfully created.', '', 'success');
          setShowModal(false);
          loadData();
          resetFormPayload()
          
          
        } else {
        
          swal(result.error.message === "Please input correct dates" ? "End date cannot be before the Admission date" : result.error.message, '', 'warning');
        }
        
      })
      .catch((error) => {
        
        swal(`${error?.message}`, ``, 'error')
        console.log(error);
      });
  };

  const resetFormPayload = () => {
    const payload = {
      ...formPayload
    };
    payload.educationDetails ='';
    payload.endDate = '';
    payload.startDate = '';
    setFormPayload(payload); 
  }

  return (
    <>
      <CaseModal
        utp={isUTP}
        visible={caseModalIsvisible}
        onClose={handleClose}
        caseDetails={caseInfo}
      />
      {!props.isDetails && (
        <PrisonerInfoCard prisoner={prisoner} />
      )}
           {!props.isHighAuth && (
            <button
              id={'add-btn'}
              className="btn btn-success  waves-effect waves-light mx-1 px-3 py-2 float-end"
              onClick={openModal}
            >
              Add New
            </button>
          )}
            <Grid
              ref={gridRef}
              data={loadedEducationEntries}
              columns={Object.keys(EducationHeaders[0])}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
      {/* {showGrid && (
        <div className="row">
          <div className="card custom-card mt-2">
            <div className='btns just-right'>
            <button
              id={'add-btn'}
              className="btn btn-success  waves-effect waves-light mx-1 px-3 py-2 float-end"
              onClick={openModal}
            >
              Add
            </button>
            </div>
            <Grid
              ref={gridRef}
              data={loadedEducationEntries}
              columns={Object.keys(EducationHeaders[0])}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
          </div>
        </div>
      )} */}


      <Modal show={showModal} onHide={() => setShowModal(false)} size="custom-xl">
        <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
          <h3 class="modal-title" id="exampleModalgridLabel">
            Add Education
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 px-0 mt-1">
            <div className="row">
              <form>
                <div className="col-lg-12">
                  <InputWidget
                    type={'multiSelect'}
                    inputType={'name'}
                    label={'Education Type'}
                    id={'remission-type'}
                    require={false}
                    options={fetchedData['EducationLKPT'] || []}
                    icon={'icon-operator'}
                    multiple={false}
                    setValue={(value) => {
                      const pd = {
                        ...formPayload,
                      };
                      pd['educationId'] = value.value;
                      setFormPayload(pd);
                    }}
                  />
                </div>
              
                <div className="col-lg-12">
                  <div className='inputs force-active'>
                    <label>Start Date</label>
                    <DatePicker
                      selected={getFormattedDate(
                        formPayload.startDate
                      )}
                      onChange={date => {
                        setSelectedDate(date);
                        const pd = {
                          ...formPayload,
                        };
                        pd['startDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                        setFormPayload(pd);
                      }}
                      dateFormat='dd/MM/yyyy'
                      //minDate={new Date()}
                      maxDate={new Date()}
                      icon={'icon-operator'}
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      placeholderText={''}
                      id={'remission-date'}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className='inputs force-active'>
                    <label>End Date</label>
                    <DatePicker
                      selected={getFormattedDate(
                        formPayload.endDate
                      )}
                      onChange={date => {
                        setSelectedDate(date);
                        const pd = {
                          ...formPayload,
                        };
                        pd['endDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                        setFormPayload(pd);
                      }}
                      dateFormat='dd/MM/yyyy'
                      //minDate={new Date()}
                      maxDate={new Date()}
                      icon={'icon-operator'}
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      placeholderText={''}
                      id={'remission-date'}
                    />
                  </div>
                  <div className="col-lg-12">
                  <InputWidget
                    type={'textarea'}
                    inputType={'name'}
                    label={'Education Details'}
                    id={'education-details'}
                    require={false}
                    icon={'icon-chat'}
                    defaultValue={formPayload?.educationDetails}
                    setValue={(value) => {
                      const payload = {
                        ...formPayload,
                      };
                      payload['educationDetails'] = value;
                      setFormPayload(payload);
                    }}
                  />
                </div>
                </div>
               
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button id={'cancel-btn'} className="btn btn-light" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button id={'create-btn'} className="btn btn-primary" onClick={handleAddRemission}>
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewinPrisonEducationPrisoner;
