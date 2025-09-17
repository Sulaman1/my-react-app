/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { _ } from 'gridjs-react';
import { useSelector } from 'react-redux';
import {
  transformData,
  scrollToTop,
  validateDate,
} from '../../../common/Helpers';
import { getData, deleteData, postData } from '../../../services/request';
import swal from 'sweetalert';
import DetailsGrid from './DetailsGrid';
import moment from 'moment-mini';
import 'react-datepicker/dist/react-datepicker.css';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import CaseModal from './CaseModal';
//import { generateYears } from '../../../common/Common';
import PrisonerInfoCard from './release-prisoner/PrisonerInfoCard';
import { Checkboxes, ConvictionInfo, CourtFineAndLabour, CourtProductionDate, DRPDR, FirInfo, HearingInfo, PrisonerCategory, SentenceRow, SentenceRowIfNotPaid, SystemCalculations, UndertrialPeriod, Vakalatnama } from './common/DR_PDR_Fields';
// import { Ring } from "react-awesome-spinners";

const Case = (props) => {

  const [formPayload, setFormPayload] = useState({
    hearings: {},
    sentence: {
      year: 0,
      month: 0,
      day: 0,
    },
    ifFineNotPaid: {
      year: 0,
      month: 0,
      day: 0,
    },
    utpPeriod: {
      "year": 0,
      "month": 0,
      "day": 0
    }
  });
  const userMeta = useSelector((state) => state.user);
  //const [years, setYears] = useState(generateYears());
  const [sections, setSections] = useState([]);
  const [courts, setCourts] = useState([]);
  const [remandingCourts, setRemandingCourts] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  // const history = useHistory();
  const navigate = useNavigate();

  const [caseInfo, setCaseInfo] = useState({});
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [vakalatnamaLoading, setVakalatnamaLoading] = useState(false);
  const [isUTP, setIsUTP] = useState(userMeta?.role === 'Prison UTP Branch');
  const [isConvict, setIsConvict] = useState(userMeta?.role === 'Prison Convict Branch');
  const [isSuperAdmin, setIsSuperAdmin] = useState(userMeta?.role === 'Super Admin');
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const [hideHearingOnEdit, setHideHearingOnEdit] = useState(true);
  const [getPDR, setPDR] = useState('');
  const [prionserId, setPrionserId] = useState(0);
  const [isWitness, setIsWitness] = useState(false);

  const generateGridCols = () => {
    const gridCols = {
      'Fir No': '',
      'Fir Date': '',
      'Fir Year': '',
      'Case Status': '',
      'Police Station': '',
      'Under Sections': '',
      "Release Document ": "",
      'Warrant': '',
      'Vakalatnama': '',
    };

    if (!isUTP) {
      gridCols['Decision Authority'] = '';
      gridCols['Sentence Date'] = '';
    } else {
      gridCols['Next Hearing Date'] = '';
    }

    gridCols['Action'] = '';

    return gridCols;
  };

  useEffect(() => {
    loadData();
    loadlookups();
  }, []);

  useEffect(() => {
    props?.lookUps?.caseStatuses?.forEach((status) => {
      if (status.label.includes('Witness')) {
        status.label = 'Witness Case / Remand / Zamima';
      }
    });
  },[props?.lookUps?.caseStatuses])

  



  const loadlookups = () => {
    try {

      const courtObj = transformData(newLookups?.court);
      setCourts(courtObj);
      setRemandingCourts(courtObj);

      const policestationObj = transformData(newLookups?.policeStation);
      setPoliceStations(policestationObj);

      const sectionObj = transformData(newLookups?.sections);
      setSections(sectionObj);

    } catch (error) {
      console.error(error);
      alert("something went wrong in lookups api and fileName is {Case.js}");
    }
  };

  const handleFrontUpload = (value) => {
    if (!value) return;
    const data = {
      image: value.split(',')[1],
      prisoner: false,
      imageName: 'doc'
    };
    setloading(true);
    postData('/services/app/BasicInfo/uploadBase64', data)
      .then(res => {
        if (res.success == true) {
          const pd = {
            ...formPayload
          };


          pd['hearings']['hearingDocuments'] = res.result.imagePath;
          
          setFormPayload(pd);
          setloading(false);
        }
      })
      .catch(err => {
        console.log(err, 'getting error while uploading');
        setloading(false);
      });
  };
  const handleVakalatnamaUpload = (value) => {
    if (!value) return;
    const data = {
      image: value.split(',')[1],
      prisoner: false,
      imageName: 'doc'
    };
    setVakalatnamaLoading(true);
    postData('/services/app/BasicInfo/uploadBase64', data)
      .then(res => {
        if (res.success == true) {
          const pd = {
            ...formPayload
          };


          pd['vakalatnama'] = res.result.imagePath;

          setFormPayload(pd);
          setVakalatnamaLoading(false);
        }
      })
      .catch(err => {
        console.log(err, 'getting error while uploading');
        setVakalatnamaLoading(false);
      });
  };

  const loadData = () => {
    const prisoner = JSON.parse(sessionStorage.getItem('selectedPrisoner'));
    setPrionserId(prisoner.id);
    if (prisoner) {
      getData(
        `/services/app/PrisonerDetailInformation/GetAllPrisonerCases?prisonerId=${prisoner.id}`
      )
        .then((res) => {
          const data = res.result.data;
          if (data.length > 0) {
            setUserData(data);
          } else {
            setUserData([]);
          }
        })
        .catch((err) => {
          console.log(err, "getting error while fetching API {GetAllPrisonerCases} and fileName is {Case.js}");
        });
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleViewBtn = async (item) => {
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
        setShowModal(true);
        const infoPayload = {
          ...fetchedCase,
          policeStationId: policeStations.find(
            (p) => p.value === fetchedCase.policeStationId
          )?.label,
          hearings: {
            ...fetchedCase.hearings,
            courtId: courts.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            remandingCourtId: remandingCourts.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            judge: fetchedCase.hearings?.judge
            ,
          },
          decisionAuthorityId: courts.find(
            (court) => court.value === fetchedCase.decisionAuthorityId
          )?.label,
          sections: fetchedCase.sections?.map((sec) => {
            const label = sections.find((s) => s.value === sec.actId)?.label;
            return label;
          }),
        };
        setCaseInfo({ ...infoPayload });
      }
    } catch (err) {
      console.log(err, "getting error while fetching API {GetAllPrisonerCases} and fileName is {Case.js}");
    }
  };

  const handleEditBtn = (item) => {
    setHideHearingOnEdit(false);
    scrollToTop();
    getData(
      '/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=' + item.id
    )
      .then((res) => {
        if (res.result.isSuccessful) {
          const fetchedCase = {
            ...res.result.data,
            PrisonerCategory : res.result.data.status === 'Under trail case' ? 1 : 2,
            caseId: res.result.data.id,
            hearings: { ...res.result.data.hearings[0] },
          };
          setIsUTP(fetchedCase.PrisonerCategory == 1)
          setIsWitness(fetchedCase.caseStatus == 1)

          setFormPayload({ ...fetchedCase });
        }
      })
      .catch((err) => {
        console.log(err, "getting error while fetching API {GetOnePrisonerCase} and fileName is {Case.js}");
      });
  };

  const handleDelBtn = (item, event) => {
    swal({
      title: 'Are you sure?',
      text: 'You want to delete',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (willDelete) => {
      if (willDelete) {
        swal('Deleted!', '', 'success').then((result) => {
          deleteData(
            '/services/app/PrisonerDetailInformation/DeletePrisonerCase?id=' +
            item.id
          )
            .then((res) => {
              if (res.success == true) {
                loadData();
              }
            })
            .catch((err) => {
              console.log(err, "getting error while deleting API {DeletePrisonerCase} and fileName is {Case.js}");
            });
        });
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let isValid = true;
    const prisoner = JSON.parse(sessionStorage.getItem('selectedPrisoner'));
    const invalidErrors = [];
    if (!formPayload['policeStationId']) {
      isValid = false;
      invalidErrors.push('Police station missing');
    }

    if (!formPayload['firNo']) {
      invalidErrors.push('Fir No is missing');
      isValid = false;
    }
    if (!formPayload['firYear']) {
      formPayload['firYear'] = years[0].value;
    }
    
    if (!isUTP && !isWitness && !formPayload['decisionAuthorityId']) {
      invalidErrors.push('decision authority missing');
      isValid = false;
    }
    if (!isWitness && (!formPayload['sections'] || formPayload['sections'].length === 0)) {
      invalidErrors.push('Undersections is missing');
      isValid = false;
    }
    if (hideHearingOnEdit) {

      if (
        !formPayload['hearings'] ||
        !formPayload['hearings']['remandingCourtId']
      ) {
        isValid = false;
        invalidErrors.push('Remanding court missing');
      }
      if (!formPayload['hearings'] || !formPayload['hearings']['courtId']) {
        isValid = false;
        invalidErrors.push('Court missing');
      }

      if (!isUTP && !isWitness && validateDate(formPayload.sentenceDate)) {
        formPayload['hearings']['hearingDate'] = formPayload.sentenceDate;
      } else {
        if(formPayload?.hearings){
          formPayload['hearings']['hearingDate'] = moment(new Date()).format(
            'YYYY-MM-DD'
          );
        }
        
      }

      if (!validateDate(formPayload?.hearings?.lastHearingDate)) {
        if(formPayload?.hearings){
          formPayload['hearings']['lastHearingDate'] = moment(new Date()).format(
            'YYYY-MM-DD'
          );
        }
        
      }
    }


    if (!validateDate(formPayload.firDate)) {
      formPayload['firDate'] = moment(new Date()).format('YYYY-MM-DD');
    }
    if ((isUTP || isWitness) && !validateDate(formPayload.productionOrderDate)) {
      formPayload['productionOrderDate'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
    }
    // if (!isUTP && !validateDate(formPayload.decisionDate)) {
    //   formPayload['decisionDate'] = moment(new Date()).format('YYYY-MM-DD');
    // }

    if (!isUTP && !isWitness && !validateDate(formPayload.sentenceDate)) {
      formPayload['sentenceDate'] = moment(new Date()).format('YYYY-MM-DD');
    }
    if ((isUTP || isWitness) && !validateDate(formPayload.probableDateOfRelase)) {
      formPayload['probableDateOfRelase'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
    }
    if (formPayload?.wef) {
      if(formPayload?.utpPeriod == null || (!formPayload?.utpPeriod.day && !formPayload?.utpPeriod.month && !formPayload?.utpPeriod.year)){
        isValid = false;
        invalidErrors.push('UTP Period is missing');
      }else{
        formPayload['utpPeriod']['year'] = formPayload?.utpPeriod?.year || 0;
        formPayload['utpPeriod']['month'] = formPayload?.utpPeriod?.month || 0;
        formPayload['utpPeriod']['day'] = formPayload?.utpPeriod?.day || 0;
      }
      
    }

    if (formPayload?.condemned) {
      formPayload['dateOfRelease'] = null;
      formPayload['probableDateOfRelase'] = null;
      formPayload['sentence']['year'] = 0;
      formPayload['sentence']['month'] = 0;
      formPayload['sentence']['day'] = 0;
      formPayload['ifFineNotPaid']['year'] = 0;
      formPayload['ifFineNotPaid']['month'] = 0;
      formPayload['ifFineNotPaid']['day'] = 0;
      formPayload['utpPeriod']['year'] = 0;
      formPayload['utpPeriod']['month'] = 0;
      formPayload['utpPeriod']['day'] = 0;
      formPayload['wef'] = false;
      formPayload['consecutive'] = false
    }else{
      
      if(!isUTP && !isWitness && (formPayload?.sentence == null || (!formPayload?.sentence.day && !formPayload?.sentence.month && !formPayload?.sentence.year))) 
        {
        isValid = false;
        invalidErrors.push('Sentence is missing');
      }
    }



    formPayload['prisonerBasicInfoId'] = prisoner.id;
    // formPayload['caseStatus'] = isUTP ? "UTP" : "Convict";

    if (!isValid) {
      swal({
        button: true,
        icon: 'error',
        title: 'Missing Required fields',
        text: invalidErrors.toString(),
      });
    } else {
      formPayload['hearings'] = [{ ...formPayload['hearings'] }];

      const actualPd = {};

      // for (const x in formPayload) {
      //   if (x !== 'categoryId') {
      //     actualPd[x] = formPayload[x];
      //   }
      // }
      if (!formPayload?.PrisonerCategory) {
        formPayload['PrisonerCategory'] = isUTP ? 1 : 2;
      }
      if (!hideHearingOnEdit) {
        formPayload.hearings = null
        // payload.data.hearings = null
      }
      postData(
        '/services/app/PrisonerDetailInformation/CreatePrisonerCase',
        formPayload
      )
        .then((res) => {
          if (res.success == false) {
            swal(
              !res.error.details ? '' : res.error.message,
              res.error.details ? res.error.details : res.error.message,
              'warning'
            );
          } else {

            swal('Successfully Saved!', '', 'success');
            loadData();
            setHideHearingOnEdit(true);
            resetForm();
          }
        })
        .catch((err) => {
          swal('Something went wrong!', '', 'warning');
          console.log(err, "getting error while Creating or Updating API {CreateUpdatePrisonerCase} and fileName is {Case.js}");
        });
    }
  };

  const resetForm = () => {
    const obj = {
      caseStatus: '',
      category: '',
      // decisionDate: '',
      firDate: '',
      firNo: '',
      firYear: '',
      remarks:'',
      hearings: [],
      sentence: {
        year: 0,
        month: 0,
        day: 0,
      },
      ifFineNotPaid: {
        year: 0,
        month: 0,
        day: 0,
      },
      utpPeriod: {
        year: 0,
        month: 0,
        day: 0
      },
      wef: false,
      consecutive: false,
      policeStationId: '',
      prisonerBasicInfoId: '',
      productionOrderDate: '',
      remarks: '',
      sections: [],
      sentenceDate: '',
    };
    if (isConvict) {
      obj.probableDateOfRelase = '';
    }
    setFormPayload(obj);
  };

  const handleFinish = () => {
    swal('Successfully Admitted!', '', 'success').then(() => {
      if (
        sessionStorage.getItem('entryType') &&
        sessionStorage.getItem('entryType') === 'fromSearch'
      ) {
        sessionStorage.removeItem('entryType');
        navigate('/admin/prisoner-search');
      } else {
        navigate('/admin/prisoner/manage-prisoners');
      }
    });
  };


  const calculateDR_PDR = async () => {
    if (!formPayload?.sentenceDate) {
      swal('Please select Sentence Date', '', 'warning');
      return;
    }
    const sentenceDT = formPayload?.sentenceDate
    const wef = formPayload?.wef || false;
    const payload = {
      "prisonerId": prionserId,
      "sentenceDate": sentenceDT,
      "sentence": {
        "year": formPayload?.sentence?.year || 0,
        "month": formPayload?.sentence?.month || 0,
        "day": formPayload?.sentence?.day || 0,
      },
      "utpPeriod": {
        "year": formPayload?.wef ? formPayload?.utpPeriod?.year : 0 || 0,
        "month": formPayload?.wef ? formPayload?.utpPeriod?.month : 0 || 0,
        "day": formPayload?.wef ? formPayload?.utpPeriod?.day : 0 || 0,
      },
      "wef": wef
    }
    try {

      setPDR("")
      const getPDR = await postData(
        `/services/app/PrisonerDetailInformation/GetProbableDateOfRelease`, payload
      )
      setPDR(getPDR?.result.split('T')[0] || '');
      const existingPayload = {
        ...formPayload
      }
      const splitPDR = getPDR?.result.split('T')[0].split('/');
      existingPayload['probableDateOfRelase'] = `${splitPDR[1]}-${splitPDR[0]}-${splitPDR[2]}`;
      setFormPayload(existingPayload);
    } catch (error) {
      console.error(error, 'getting error while fetching API {GetProbableDateOfRelease} and fileName is {Case.js}');
    }
  }


  const getUTPPeriod = async (value) => {
    if (!formPayload?.sentenceDate) {
      swal('Please select Sentence Date', '', 'warning');
      return;
    }

    const payload = {
      ...formPayload,
    };
    if (value) {
      const getDR = await getData(`/services/app/PrisonerDetailInformation/GetUtpPeriod?sentenceDate=${formPayload?.sentenceDate}&prisonerId=${prionserId}`)
      payload['wef'] = value;
      setFormPayload({ ...payload, utpPeriod: getDR?.result })
    } else {
      setFormPayload({ ...payload, utpPeriod: { year: 0, month: 0, day: 0 } })
    }
  }


  return (
    <>
      <PrisonerInfoCard prisoner={props?.prisoner} />
      <div className="row p-2">
        <div className="row">
          <h4 className="third-heading">{props.title}</h4>
        </div>
        <form onSubmit={handleSubmit} >
          <div className="row">
            <h3 className="heading mb-4">Case & FIR Information</h3>
            <span className="text-danger fw-bold mb-4">Note: The first case of the prisoner can only be convict or Under Trial Case and please enter the data carefully specially dates, because dates cannot be edited once the case is saved.</span>
            <hr />
          </div>
          <div className="row">
            {(<PrisonerCategory props={props} formPayload={formPayload} setFormPayload={setFormPayload} setIsUTP={setIsUTP} setIsWitness={setIsWitness} hideHearingOnEdit={hideHearingOnEdit} />)}
            <FirInfo formPayload={formPayload} setFormPayload={setFormPayload} sections={sections} policeStations={policeStations} />
            {(isUTP || isWitness) && (<CourtProductionDate formPayload={formPayload} setFormPayload={setFormPayload} />)}
            {(!isUTP && !isWitness) && (
              <>
                <ConvictionInfo formPayload={formPayload} setFormPayload={setFormPayload} courts={courts} />
                <Checkboxes formPayload={formPayload} setFormPayload={setFormPayload} getUTPPeriod={getUTPPeriod} />
                <div className="col-lg-6">
                  {!formPayload?.condemned && (
                    <SystemCalculations calculateDR_PDR={calculateDR_PDR} getPDR={getPDR} />
                  )}
                </div>
                <div className="col-lg-6"></div>
                {!formPayload?.condemned &&
                  (
                    <>
                      <div className='row mt-4'>
                        <div className='col-lg-6'>
                          <h3 className="heading mb-4">Sentence</h3>
                        </div>
                        <div className='col-lg-6'>
                          <h3 className="heading mb-4"> If Fine Not Paid Sentence</h3>
                        </div>
                      </div>
                      <SentenceRow formPayload={formPayload} setFormPayload={setFormPayload} />
                      <SentenceRowIfNotPaid formPayload={formPayload} setFormPayload={setFormPayload} />
                    </>
                  )}
              </>
            )}
            {!formPayload?.condemned && formPayload?.wef && (
              <>
                <UndertrialPeriod formPayload={formPayload} setFormPayload={setFormPayload} />
                <div className='col-lg-6'></div>
              </>
            )}
            <CourtFineAndLabour formPayload={formPayload} setFormPayload={setFormPayload} isUTP={isUTP} isWitness={isWitness} />
            {!formPayload?.condemned && !isUTP && !isWitness && (<DRPDR formPayload={formPayload} setFormPayload={setFormPayload} />)}
            {hideHearingOnEdit && (<HearingInfo formPayload={formPayload} setFormPayload={setFormPayload} courts={courts} remandingCourts={remandingCourts} isUTP={isUTP} loading={loading} handleFrontUpload={handleFrontUpload} isWitness={isWitness}   />)}
            <Vakalatnama formPayload={formPayload}  handleVakalatnamaUpload={handleVakalatnamaUpload} vakalatnamaLoading={vakalatnamaLoading} />
          </div>
          <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
            <button
              id={'save-btn'}
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              disabled={loading}
            >
              save <i className="icon-folder ml-2"></i>
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
        <button
          id={'finish-btn'}
          onClick={handleFinish}
          className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
          disabled={loading}
        >
          Finish
        </button>
      </div>
      <CaseModal
        utp={isUTP}
        visible={showModal}
        onClose={handleClose}
        caseDetails={caseInfo}
      />
      <DetailsGrid
        utp={isUTP}
        status={"Profile"}
        columnData={generateGridCols()}
        data={userData}
        handleEditBtn={handleEditBtn}
        handleDelBtn={handleDelBtn}
        handleDetailsBtn={handleViewBtn}
        caseWarrant={true}
        vakalatnama={true}
        casesOnly={true}
      />
    </>
  );
};

export default Case;
