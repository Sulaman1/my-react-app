/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, _ } from 'gridjs-react';
import React, { useEffect, useRef, useState } from 'react';
import { baseImageUrl, getData, postData } from '../../../../services/request';
import PrisonerInfoCard from './PrisonerInfoCard';
import {
  transformData,
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import InputWidget from '../../../../droppables/InputWidget';
import moment from 'moment-mini';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import ProfileCard from '../circleoffice/profile/ProfileCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CaseModal from '../CaseModal';
import { useSelector } from 'react-redux';
import letter from '../../../../assets/images/users/1.png';
import ProfilePic from '../../../../assets/images/users/1.png';


const ViewReleasePrisonerDetails = ({ setActiveTab }) => {
  const prisonerObj = JSON.parse(sessionStorage.getItem('releasedPrisoner'));
  const [prisoner, setPrisoner] = useState({});
  const [gridCases, setGridCases] = useState([]);
  const [fetchedData, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formPayload, setFormPayload] = useState({
    prisonerId: prisonerObj?.id,
    data: [],
  });

  const isUTP = prisonerObj?.prisonerCategory === 'UTP';

  const [caseInfo, setCaseInfo] = useState({});
  const [caseModalIsVisible, setCaseModalIsVisible] = useState(false);
  const newLookups = useSelector((state) => state?.dropdownLookups)


  const gridRef = useRef(null);

  const handleFrontUpload = (value) => {
    if(!value) return;
    const data = {
      image: value.split(',')[1],
      prisoner: false,
      imageName: 'doc'
    };
    
    postData('/services/app/BasicInfo/uploadBase64', data)
      .then(res => {
        if (res.success == true) {
          const pd = {
            ...formPayload,
          };
          pd['attestedDocument'] = res.result.imagePath;
          setFormPayload(pd);
        }
      })
      .catch(err => {
        console.log(err, 'getting error while uploading');
        

      });
  };

  useEffect(() => {
    if (sessionStorage.getItem('releasedPrisoner')) {
      loadData();
    }
  }, []);

  useEffect(() => {
    fetchReleaseData();
  }, []);

  const sendData = async (e) => {
    try {
      const selectedCase = JSON.parse(sessionStorage.getItem('case'));
      const remainingCases = gridCases.filter((item) => item.status != 'Released in case').length; // for chekcing the remaining cases
      const text = remainingCases === 1 ? 'The release request has been successfully sent to the Superintendent for approval.' : 'Prisoner has been Released from this case';

      if(!formPayload?.releaseDate){
        return
      }

      if(!formPayload.releaseCourtId){
        swal('Release Court is Required', '','warning')
        return;
      }

      if(!formPayload.releaseTypeId){
        swal('Release Type is Required' , '','warning')
        return;
      }

      const payload = {
        caseId: selectedCase.id,
        releaseDate: formPayload?.releaseDate,
        prisonerId: formPayload?.prisonerId,
        releaseTypeId: formPayload?.releaseTypeId,
        releaseCourtId: formPayload?.releaseCourtId,
        attestedDocument: formPayload?.attestedDocument,
        requireGuardian: formPayload?.requireGuardian ? true : false
      };

      if((selectedCase?.status === "Convicted case") && validateDate(payload?.releaseDate) != validateDate(selectedCase.probableDateOfRelase)){
        e.preventDefault();
        await swal({
          title: "Are you sure you want to release this prisoner? The release date does not match the selected date.",
          type: "warning",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(async (willProceed) => {
          if (willProceed) {
            payload['releaseBeforeDate'] = true;
            await releasePrisoner(payload, text);
          } else {
            return false;
          }
        });   
      }else{
        await releasePrisoner(payload, text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const releasePrisoner = async (formPayload, text) => {
    try {
      const result = await postData(`/services/app/PrisonerRelease/ReleasePrisonerInCase`, formPayload);
      if (result && result.result?.isSuccessful) {
        const isConfirmed = await swal(text, '', 'success');
        if (isConfirmed) {
          setActiveTab(0);
          setShowModal(false);
        }
      } else if (result && result.error) {
        swal(result.error.message, '', 'warning');
      }
      sessionStorage.removeItem('releasedPrisoner'); 
    } catch (error) {
      console.error(error);
    }
  }

  const openModal = (c) => {
    sessionStorage.setItem('case', JSON.stringify(c));
    setShowModal(true);
  };

  const loadData = () => {
    
    const prisonerId = JSON.parse(
      sessionStorage.getItem('releasedPrisoner')
    ).id;
    getData(
      `/services/app/PrisonerRelease/GetPrisonerCases?PrisonerId=${prisonerId}`,
      '',
      true
    )
      .then((res) => {
        const data = res.result?.data;
        if (data) {
          setPrisoner(data.prisonerData);
          const filteredCases = data?.cases?.filter((e)=> {return e.status != "Witness In case"})
          setGridCases(filteredCases || []);
        }
        
      })
      .catch((error) => {
        swal('Something went wrong', '', 'warning');
      });
  };

  const fetchReleaseData = async () => {
    try {
      const data = {};

      const typeObj = transformData(newLookups?.ReleaseType);
      data['releaseType'] = typeObj;

      const courtsObj = transformData(newLookups?.courtType);
      data['releaseCourts'] = courtsObj;

      const courtObj = transformData(newLookups?.court);
      data['courts'] = courtObj;
      data['remandingCourts'] = courtObj;

      const policeStationsObj = transformData(newLookups?.policeStation);
      data['policeStations'] = policeStationsObj;

      const judgeObj = transformData(newLookups?.judge);
      data['judges'] = judgeObj;

      const sectionObj = transformData(newLookups?.sections);
      data['sections'] = sectionObj;

      setData(data);
    } catch (err) {
      alert('An error occured');
    }
  };

  const undoCaseHandler = (c) => {
    const updatedCases = formPayload.data.filter(
      (item) => item.caseId !== c.id
    );

    setFormPayload({
      ...formPayload,
      data: updatedCases,
    });
  };

  const handleDetailsBtn = async (item) => {
    try {
      
      const res = await getData(
        '/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=' +
        item.id
      );

      if (res.success && res.result?.isSuccessful) {
        
        const fetchedCase = {
          ...res.result.data,
          hearings: { ...res.result.data.hearings[0] },
          Allhearings: [...res.result.data.hearings],
        };
        setCaseModalIsVisible(true);

        const infoPayload = {
          ...fetchedCase,
          policeStationId: fetchedData['policeStations']?.find(
            (p) => p.value === fetchedCase.policeStationId
          )?.label,
          hearings: {
            ...fetchedCase.hearings,
            courtId: fetchedData['courts']?.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            remandingCourtId: fetchedData['remandingCourts']?.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            judgeId: fetchedData['judges']?.find(
              (court) => court.value === fetchedCase.hearings?.judgeId
            )?.label,
          },
          decisionAuthorityId: fetchedData['courts']?.find(
            (court) => court.value === fetchedCase.decisionAuthorityId
          )?.label,
          sections: fetchedCase.sections?.map((sec) => {
            const label = fetchedData['sections']?.find(
              (s) => s.value === sec.actId
            )?.label;
            return label;
          }),
        };

        setCaseInfo({ ...infoPayload });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const generateGridCols = () => {
    const gridCols = {
      'Fir Number (ایف آئی آر نمبر)': '',
      'Fir Date  (ایف آئی آر کی تاریخ)': '',
      'Fir Year (ایف آئی آر کا سال)': '',
      'Police Station (تھانہ)': '',
      'Under Sections (دفعات)': '',
      'Case Info (کیس کی معلومات)': '',
    };

    if (!isUTP) {
      gridCols['Decision Authority'] = '';
      gridCols['Decision Date (فیصلے کی تاریخ)'] = '';
      gridCols['Sentence Date (سزا کی تاریخ)'] = '';
    }

    if (isUTP) {
      gridCols['Next Hearing Date (اگلی پیشی کی تاریخ)'] = '';
    }
    gridCols['Release Date (تاریخ رہائی)'] = '';
    gridCols['Release Type (رہائی کی قسم)'] = '';
    gridCols['Release Court (رہائی کی عدالت)'] = '';
    gridCols['Attested Document (تصدیق شدہ دستاویز)'] = '';
    gridCols['Action (عملدرامد)'] = '';
    return Object.keys(gridCols);
  };

  const gridDataMap = (e, infoData) => {

    const mapObj = {
      firNo: e.firNo,
      firDate: validateDate(e.firDate)
        ? new Date(e.firDate).toDateString()
        : '',
      firYear: e.firYear,
      policeStation: e.policeStation,
      underSections: e.underSections,
      status: e.status
    };

    if (!isUTP) {
      mapObj['decisionAuthority'] = e.decisionAuthority;
      mapObj['decisionDate (فیصلے کی تاریخ)'] = validateDate(e.decisionDate);
      mapObj['sentenceDate (سزا کی تاریخ)'] = validateDate(e.sentenceDate);
    }

    if (isUTP) {
      mapObj['hearingDate (پیشی کی تاریخ)'] = validateDate(e.hearings[0]?.lastHearingDate);
    }

    (mapObj['releaseDate (تاریخ رہائی)'] = _(
      infoData ? (<p>{validateDate(infoData.releaseDate)}</p>) :
        validateDate(e.releaseDate)
    )),
      (mapObj['releaseType (رہائی کی قسم)'] = _(
        infoData ? (
          <p>
            {
              fetchedData['releaseType']?.find(
                (x) => x.value === infoData.releaseTypeId
              )?.label
            }
          </p>
        ) :
          <>
            {e.releaseType}
          </>
      )

      );

    (mapObj['releaseCourt'] = _(
      infoData ? (
        <p>
          {
            fetchedData['releaseCourts']?.find(
              (x) => x.value === infoData.releaseCourtId
            )?.label
          }
        </p>
      ) :
        <>
          {e.releaseCourt}
        </>
    )
    ),
      (mapObj['AttestedDocument'] = _(
        <div
          className="profile-td profile-td-hover form-check-label"
        >
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle"
            src={infoData?.attestedDocument ? baseImageUrl + infoData?.attestedDocument : ProfilePic}
            width="50"
            alt="AttestedDocument"
          />
        </div>
      )
      ),
      (mapObj['Action'] = _(
        <div className="action-btns">
          {e.appealInProgress == true && (
            <button
              id={"view-more-btn"}
              type="button"
              className="tooltip btn btn-danger waves-effect waves-light mx-1 "
            >
              <i className="icon-glamping"></i>
              <span>Appeal In process</span>
            </button>
          )}
          {e.status !== 'Released in case' && (
            <button
              id={'action-btn'}
              onClick={() => (infoData ? undoCaseHandler(e) : openModal(e))}
              className={`btn btn-${infoData ? 'danger' : 'success'
                } waves-effect waves-light tooltip`}
            >
              <i className="icon-login"></i>
              <span>{infoData ? 'Undo' : 'Release'}</span>
            </button>
          )}

          <button
            id={'view-more-btn'}
            type="button"
            onClick={() => handleDetailsBtn(e)}
            className="tooltip btn btn-prim waves-effect waves-light mx-1"
          >
            <i className="icon-show-password"></i>
            <span>View More</span>
          </button>
        </div>
      ));

    return mapObj;
  };

  const handleCaseModalClose = () => {
    setCaseModalIsVisible(false);
  };

  return (
    <>
      <CaseModal
        utp={isUTP}
        visible={caseModalIsVisible}
        onClose={handleCaseModalClose}
        caseDetails={caseInfo}
      />
      <PrisonerInfoCard prisoner={prisoner} />

      <div className="card custom-card animation-fade-grids custom-card-scroll mt-5">
        <div className="row">
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              gridCases.map((e) => {
                const infoData = formPayload.data.find(
                  (item) => item.caseId === e.id
                );
                return gridDataMap(e, infoData);
              })
            )}
            columns={generateGridCols()}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={()=>{setShowModal(false)}} size="custom-xl" className="">
        <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
          <h3 class="modal-title" id="exampleModalgridLabel">
            Release Information
          </h3>
        </Modal.Header>
        <Modal.Body>
          <form className="mt-0">
            <ProfileCard
              data={prisoner}
              caseInfo={JSON.parse(sessionStorage.getItem('case')) || null}
            />
            <div className="col-12 px-0 mt-5">
              <div className="row">
                <div className="col-lg-12">
                  <div className='inputs force-active'>
                    <label>Release Date (تاریخ رہائی)</label>
                    <DatePicker
                      icon={'icon-calendar'}
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        const pd = {
                          ...formPayload,
                        };
                        pd['releaseDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                        setFormPayload(pd);
                      }}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      id={'release-date'}
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                    // placeholderText={'Release Date (تاریخ رہائی)'}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <InputWidget
                    type={'multiSelect'}
                    inputType={'name'}
                    label={'Release Type (رہائی کی قسم)'}
                    id={'release-type'}
                    require={false}
                    options={fetchedData.releaseType || []}
                    icon={'icon-release'}
                    multiple={false}
                    setValue={(value) => {
                      const pd = {
                        ...formPayload,
                      };
                      pd['releaseTypeId'] = value.value;
                      setFormPayload(pd);
                    }}
                  />
                </div>
                <div className="col-lg-12">
                  <InputWidget
                    type={'multiSelect'}
                    inputType={'name'}
                    label={'Release Court (رہائی کی عدالت)'}
                    id={'release-court'}
                    require={false}
                    icon={'icon-court'}
                    options={fetchedData.courts || []}
                    multiple={false}
                    setValue={(value) => {
                      const pd = {
                        ...formPayload,
                      };
                      pd['releaseCourtId'] = value.value;
                      setFormPayload(pd);
                    }}
                  />
                </div>
                <div className='col-lg-12'>
                <InputWidget
                    type={'switch'}
                    inputType={'checkbox'}
                    label={'Is Guardian Required?'} 
                    id={'has-guardian'}
                    require={false}
                    icon={'icon-prisoner'}
                    defaultValue={formPayload?.requireGuardian
                    }
                    setValue={checked => {
                      const pd = {
                        ...formPayload
                      };
                      pd['requireGuardian'] = checked;
                      setFormPayload(pd);
                    }}
                  />
                </div>
                <h3 className='sub-heading text-center just-center mb-3'>
                  Release Order
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
                    formPayload?.AttestedDocument
                      ? baseImageUrl +
                      formPayload?.AttestedDocument
                      : letter
                  }
                  setValue={value => {
                    handleFrontUpload(value);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            id={'confirm-btn'}
            className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={sendData}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewReleasePrisonerDetails;
