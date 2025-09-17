/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, _ } from "gridjs-react";
import React, { useEffect, useRef, useState } from "react";
import { getData, postData } from "../../../../services/request";
import PrisonerInfoCard from "../release-prisoner/PrisonerInfoCard";
import { ICONS } from "../../../../services/icons";
import {
  transformData,
  transformDataForTableGrid,
  validateDate,
  getFormattedDate,
} from "../../../../common/Helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputWidget from "../../../../droppables/InputWidget";
import moment from "moment-mini";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import ProfileCard from "../circleoffice/profile/ProfileCard";
import CaseModal from "../CaseModal";
import { validateConvictFields, validateConvictFormFields } from "../../../../common/FormValidator";
//import { generateYears } from "../../../../common/Common";
import {  useSelector } from "react-redux";
import { Checkboxes, DRPDR, SentenceRow, SentenceRowIfNotPaid, SystemCalculations, UndertrialPeriod, HearingInfo } from "../common/DR_PDR_Fields";


const ViewConvicted = ({ setActiveTab }) => {
  //const [years, setYears] = useState(generateYears());
  const [loading, setloading] = useState(false);

  const [prisoner, setPrisoner] = useState({});
  const [gridCases, setGridCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDateCd, setSelectedDateCd] = useState(null);
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const prisonerObj = JSON.parse(sessionStorage.getItem("convictedPrisoner"));

  const [courts, setCourts] = useState([]);
  const [remandingCourts, setRemandingCourts] = useState([]);

  const [formPayload, setFormPayload] = useState({
    prisonerId: prisonerObj?.id,
    data: [],
    year: new Date().getFullYear()
  });
  console.log("FORM PAYLOAD", formPayload);
  const [infoPayload, setInfoPayload] = useState({
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
    },
    hearingInfo: {}
  });
  const [fetchedData, setData] = useState({});
  const [isConvict, setIsConvicted] = useState(false);
  const [anyUTP, setAnyUTP] = useState(false);
  const [lastPrsNo, setLastPrsNo] = useState();
  const IsUTP = prisonerObj?.prisonerCategory === "UTP";
  const convict = prisonerObj?.prisonerCategory === "Convict";
  const [caseInfo, setCaseInfo] = useState({});
  const [caseModalIsVisible, setCaseModalIsVisible] = useState(false);
  const [getPDR, setPDR] = useState('');

  const hideModal = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    if (!validateConvictFormFields(infoPayload, true)) {
      return false;
    }

    if (infoPayload?.wef) {
      infoPayload['utpPeriod']['year'] = infoPayload?.utpPeriod?.year || 0;
      infoPayload['utpPeriod']['month'] = infoPayload?.utpPeriod?.month || 0;
      infoPayload['utpPeriod']['day'] = infoPayload?.utpPeriod?.day || 0;
    }

    if (infoPayload?.condemned) {
      infoPayload['dateOfRelease'] = null;
      infoPayload['probableDateOfRelase'] = null;
      infoPayload['sentence']['year'] = 0;
      infoPayload['sentence']['month'] = 0;
      infoPayload['sentence']['day'] = 0;
      infoPayload['ifFineNotPaid']['year'] = 0;
      infoPayload['ifFineNotPaid']['month'] = 0;
      infoPayload['ifFineNotPaid']['day'] = 0;
      infoPayload['utpPeriod']['year'] = 0;
      infoPayload['utpPeriod']['month'] = 0;
      infoPayload['utpPeriod']['day'] = 0;
      infoPayload['wef'] = false;
      infoPayload['consecutive'] = false
    }
    if (Object.keys(infoPayload).length > 1) {
      const caseItem = JSON.parse(sessionStorage.getItem("case"));
      const obj = {
        caseId: +caseItem.id,
        sentence: caseItem.sentence,
        sentenceDate: caseItem.sentenceDate,
        decisionDate: caseItem.decisionDate,
        decisionAuthorityId: caseItem.decisionAuthority,
        ...infoPayload,
      };
      const pd = {
        ...formPayload,
        data: [...formPayload.data, obj],
      };
      setFormPayload(pd);
      setInfoPayload({});
    }
    setShowModal(false);
    sessionStorage.removeItem("case");
  };

  const gridRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("convictedPrisoner")) {
      loadData();
    }
  }, []);

  useEffect(() => {
    fetchApiData();
  }, []);

  useEffect(() => {
    loadPrisonerData();
  }, []);

  const sendData = async (event) => {
    if (!convict) {
      if (!validateConvictFields(formPayload)) {
        return false;
      }
    }
    event.preventDefault();
    if (!formPayload.convictionDate) {
      formPayload.convictionDate = moment().format("YYYY-MM-DD");
    }

    if (anyUTP) {
      formPayload["prisonerNumber"] = 0;
    }

    if(formPayload.hearings?.courtId){
      formPayload.data[0].hearingInfo = formPayload.hearings;
      delete formPayload.hearings;
    }
    // if (!formPayload.prisonerNumber || !formPayload.prisonerId) return false;
    postData(`/services/app/PrisonerRelease/ConvictPrisoner`, formPayload)
      .then((result) => {
        if (result && result?.result?.isSuccessful) {
          
          swal("Successfully convicted", "", "success");
        } else {
          
          console.log("HERE");
          swal(result?.error?.message, "", "warning");
        }
        sessionStorage.removeItem("convictedPrisoner");
        setActiveTab(0);
      })
      .catch((error) => {
        
        console.log(error);
      });
  };

  const openModal = (c) => {
    sessionStorage.setItem("case", JSON.stringify(c));
    setShowModal(true);
  };

  const loadData = () => {
    

    const prisonerId = JSON.parse(
      sessionStorage.getItem("convictedPrisoner")
    ).id;
    getData(
      `/services/app/PrisonerRelease/GetPrisonerCases?PrisonerId=${prisonerId}`,
      "",
      true
    )
      .then((res) => {
        const data = res.result.data;
        console.log("CONVICTED PRISONER", data);
        if (data) {
          const isAnyUTP = data?.cases.filter(
            (e) => e.status == "Under trail case"
          );
          if (isAnyUTP.length > 0 && data?.cases.length > 1) {
            setAnyUTP(true);
          }
          setIsConvicted(data.prisonerData.prisonerCategory !== "UTP");
          setPrisoner(data.prisonerData);
          setGridCases(data.cases || []);
        }
      })
      .catch((error) => {
        
        swal("Something went wrong", "", "warning");
      });
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

  const fetchApiData = async () => {
    try {
      const data = {};

      const courtsObj = transformData(newLookups?.courtType);
      data["releaseCourts"] = courtsObj;

      const courtObj = transformData(newLookups?.court);
      data["courts"] = courtObj;
      data["remandingCourts"] = courtObj;

      const policeStationsObj = transformData(newLookups?.policeStation);
      data["policeStations"] = policeStationsObj;

      const sectionObj = transformData(newLookups?.sections);
      data["sections"] = sectionObj;

      setData(data);
    } catch (err) {
      alert("An error occured");
    }
  };

  const loadPrisonerData = (value) => {
    const objStringify = sessionStorage.getItem("LoggedInEmployeeInfo");
    const objParsed = JSON.parse(objStringify);
    const currentYear = value || new Date().getFullYear();
    const catId = 2;
    const prisonId = objParsed?.prisons?.[0]["prisonId"];
    getData(
      "/services/app/AddPrisonerAppServices/GetLastPrisonerNumber?Category=" +
      catId +
      "&PrisonId=" +
      prisonId +
      "&year=" +
      currentYear
      ,
      "",
      false,
      false
    )
      .then((res) => {
        if (res.success) {
          console.log("prs num", res.result.prsNumber);
          setLastPrsNo(res.result.prsNumber);
        }
      })
      .catch((err) => {
        console.log(err, "Error while fetching last Prsion number");
      });
  };

  const handleLastPrisonNumber = (value) => {
    loadPrisonerData(value);
  };

  const handleDetailsBtn = async (item) => {
    try {
      const res = await getData(
        "/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=" +
        item.id
      );

      if (res.success && res.result?.isSuccessful) {
        const fetchedCase = {
          ...res.result.data,
          hearings: { ...res.result.data.hearings[0] },
          Allhearings: res.result.data.hearings,
        };
        console.log("Case", fetchedCase);
        setCaseModalIsVisible(true);

        setCaseInfo({ ...fetchedCase });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCaseModalClose = () => {
    setCaseModalIsVisible(false);
  };

  const gridDataMap = (e, existingCase) => {
    const hearingLength = e?.hearings.length;
    const mapObj = {
      firNo: e.firNo,
      firDate: validateDate(e.firDate) || "",
      firYear: e.firYear,
      policeStation: e.policeStation,
      sections: e.underSections,
    };

    if (!IsUTP) {
      mapObj["decisionAuthority"] = e.decisionAuthority;
      mapObj["decisionDate"] = validateDate(e.decisionDate) || "";
      mapObj["sentenceDate"] = validateDate(e.sentenceDate) || "";
    }

    if (IsUTP) {
      mapObj["hearingDate"] = validateDate(e.hearings[hearingLength - 1]?.nextHearingDate) || "";
    }

    mapObj["Action"] = _(
      <div className="action-btns">
        {e.appealInProgress == true && (
          <button
            id={"view-more-btn"}
            type="button"
            className="tooltip btn btn-danger waves-effect waves-light mx-1 "
          >
            <i className="custom-icon-warning" dangerouslySetInnerHTML={{ __html: ICONS.info }}></i>
            <span>Appeal In process</span>
          </button>
        )}
        {e.status === "Under trail case" && (
          <button
            id={"convict-btn"}
            onClick={() => (existingCase ? undoCaseHandler(e) : openModal(e))}
            className={`btn btn-${existingCase ? "danger" : "success"
              } waves-effect waves-light mx-1`}
          >
            {existingCase ? "Undo" : "Convict"}
          </button>
        )}

        <button
          id={"view-more-btn"}
          type="button"
          onClick={() => handleDetailsBtn(e)}
          className="tooltip btn btn-prim waves-effect waves-light mx-1"
        >
          <i className="icon-show-password"></i>
          <span>View More</span>
        </button>
      </div>
    );

    return mapObj;
  };

  const generateGridCols = () => {
    const gridCols = {
      "Fir No (ایف آئی آر نمبر)": "",
      "Fir Date  (ایف آئی آر کی تاریخ)": "",
      "Fir Year (ایف آئی آر کا سال)": "",
      "Police Station (تھانہ)": "",
      "Under Sections (دفعات)": "",
    };

    if (!IsUTP) {
      gridCols["Decision Authority"] = "";
      gridCols["Decision Date (فیصلے کی تاریخ)"] = "";
      gridCols["Sentence Date (سزا کی تاریخ)"] = "";
    }

    if (IsUTP) {
      gridCols["Next Hearing Date (اگلی پیشی کی تاریخ)"] = "";
    }

    gridCols["Action (عملدرامد)"] = "";
    return Object.keys(gridCols);
  };


  const calculateDR_PDR = async () => {
    if (!infoPayload?.sentenceDate) {
      swal('Please select Sentence Date', '', 'warning');
      return;
    }
    const sentenceDT = infoPayload?.sentenceDate
    const consecutive = infoPayload?.consecutive || false;
    const wef = infoPayload?.wef || false;
    const payload = {
      "prisonerId": prisonerObj?.id,
      "sentenceDate": sentenceDT,
      "sentence": {
        "year": infoPayload?.sentence?.year || 0,
        "month": infoPayload?.sentence?.month || 0,
        "day": infoPayload?.sentence?.day || 0,
      },
      "utpPeriod": {
        "year": infoPayload?.wef ? infoPayload?.utpPeriod?.year : 0 || 0,
        "month": infoPayload?.wef ? infoPayload?.utpPeriod?.month : 0 || 0,
        "day": infoPayload?.wef ? infoPayload?.utpPeriod?.day : 0 || 0,
      },
      "wef": wef,
      "consecutive": consecutive
    }
    try {

      setPDR("")
      const getPDR = await postData(
        `/services/app/PrisonerDetailInformation/GetProbableDateOfRelease`, payload
      )
      setPDR(getPDR?.result.split('T')[0] || '');

      const existingPayload = {
        ...infoPayload,
      }
      const splitPDR = getPDR?.result.split('T')[0].split('/');
      existingPayload['probableDateOfRelase'] = `${splitPDR[1]}-${splitPDR[0]}-${splitPDR[2]}`;
      setInfoPayload(existingPayload);
    } catch (error) {
      console.error(error, 'getting error while fetching API {GetProbableDateOfRelease} and fileName is {Case.js}');
    }
  }

  const getUTPPeriod = async (value) => {
    if (!infoPayload?.sentenceDate) {
      swal('Please select Sentence Date', '', 'warning');
      return;
    }

    const payload = {
      ...infoPayload,
    };
    if (value) {
      const getDR = await getData(`/services/app/PrisonerDetailInformation/GetUtpPeriod?sentenceDate=${infoPayload?.sentenceDate}&prisonerId=${prisonerObj?.id}`)
      payload['wef'] = value;
      setInfoPayload({ ...payload, utpPeriod: getDR?.result })
    } else {
      setInfoPayload({ ...payload, utpPeriod: { year: 0, month: 0, day: 0 } })
    }
  }

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
            ...infoPayload
          };
           
          pd['hearingInfo']['hearingDocuments'] = res.result.imagePath;
          setInfoPayload(pd);
          setloading(false);
        }
      })
      .catch(err => {
        console.log(err, 'getting error while uploading');
        setloading(false);
      });
  };




  return (
    <>
      <CaseModal
        utp={IsUTP}
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
                const existingCase = formPayload.data.find(
                  (item) => item.caseId === e.id
                );
                return gridDataMap(e, existingCase);
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
      <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
        {!isConvict ? (
          <form className="mt-4 grid col-7 just-center">
            <div className=" rel">
              <span className="d-flex sub-title just-right">
                <span style={{ color: "red" }}>
                  <b> Last Convict : </b> {lastPrsNo}
                </span>
              </span>
              <InputWidget
                type={"input"}
                inputType={"number"}
                label={"New Convict Number "}
                id={"new-convict-number"}
                require={false}
                icon={"icon-number"}
                defaultValue={formPayload.prisonerNumber}
                setValue={(value) => {
                  console.log("convictNumber", value);
                  const payload = {
                    ...formPayload,
                    data: [...formPayload.data],
                  };
                  payload["prsNumber"] = +value;
                  setFormPayload(payload);
                }}
              />
            </div>
            <div className="">
              <InputWidget
                type={"multiSelect"}
                isMulti={false}
                inputType={"select"}
                id={"years"}
                label={"Year (سال)"}
                require={false}
                icon={"icon-event"}
                options={years}
                defaultValue={{ value: formPayload.year || new Date().getFullYear(), label: (formPayload.year || new Date().getFullYear()).toString() }}
                value={{ value: formPayload.year || new Date().getFullYear(), label: (formPayload.year || new Date().getFullYear()).toString() }}
                setValue={(value) => {
                  console.log("years", value);
                  const payload = {
                    ...formPayload,
                    data: [...formPayload.data],  // Preserve the data array
                    year: value.value
                  };
                  handleLastPrisonNumber(value.value);
                  setFormPayload(payload);
                }}
              />
            </div>
            <div className="">
              <div className="inputs force-active">
                <label>
                  Conviction Date <span>(سزا کی تاریخ)</span>
                </label>
                <DatePicker
                  selected={getFormattedDate(formPayload.convictionDate)}
                  onChange={(date) => {
                    setSelectedDateCd(date);
                    const payload = {
                      ...formPayload,
                    };
                    payload["convictionDate"] = date
                      ? `${date.getFullYear()}-${date.getMonth() + 1
                      }-${date.getDate()}`
                      : "";
                    setFormPayload(payload);
                  }}
                  dateFormat="dd/MM/yyyy"
                  //minDate={new Date()}
                  maxDate={new Date()}
                  icon={"icon-operator"}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                  id={"conviction-date"}
                  placeholderText={""}
                />
              </div>
            </div>
            <div className="flex just-center">
              {formPayload?.data?.length ? (
                <button
                  id={"save-btn"}
                  className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
                  onClick={sendData}
                  type="button"
                >
                  Save
                </button>
              ) : (
                ""
              )}
            </div>
          </form>
        ) : formPayload?.data?.length && anyUTP ? (
          <div className="flex just-center">
            <button
              id={"save-btn-two"}
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              onClick={sendData}
              type="button"
            >
              Save
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <Modal
        show={showModal}
        onHide={hideModal}
        size="xl"
        class="modal-custom-xl"
      >
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            Convict information
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form>
            <ProfileCard
              data={prisoner}
              caseInfo={JSON.parse(sessionStorage.getItem("case")) || null}
            />
            <div className="col-12 px-0 mt-5">
              <div className="row">
                <div className="col-lg-6">
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    label={"Court Fine (عدالت کا جرمانہ)"}
                    id={"court-fine"}
                    require={true}
                    icon={"icon-rupees"}
                    defaultValue={infoPayload.courtFine}
                    setValue={(value) => {
                      console.log("courtFine", value);
                      const payload = {
                        ...infoPayload,
                      };
                      payload["courtFine"] = +value;
                      setInfoPayload(payload);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <div className='inputs force-active'>
                    <label>Sentence Date</label>
                    <DatePicker
                      selected={getFormattedDate(infoPayload.sentenceDate)}
                      onChange={(date) => {

                        const payload = {
                          ...infoPayload,
                        };

                        payload['sentenceDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                        setInfoPayload(payload);
                      }}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      icon={'icon-operator'}
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      id={'sentence-date'}
                    />
                  </div>
                </div>
                <Checkboxes formPayload={infoPayload} setFormPayload={setInfoPayload} getUTPPeriod={getUTPPeriod} />
                <div className="col-lg-6">
                  {!infoPayload?.condemned && (
                    <SystemCalculations getPDR={getPDR} calculateDR_PDR={calculateDR_PDR} />
                  )}

                </div>
                {!infoPayload?.condemned &&
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
                      <SentenceRow formPayload={infoPayload} setFormPayload={setInfoPayload} />
                      <SentenceRowIfNotPaid formPayload={infoPayload} setFormPayload={setInfoPayload} />
                    </>
                  )}

                {!infoPayload?.condemned && infoPayload?.wef && (
                  <>
                    <UndertrialPeriod formPayload={infoPayload} setFormPayload={setInfoPayload} />
                    <div className='col-lg-6'></div>
                  </>
                )}
                {!infoPayload?.condemned && (<DRPDR formPayload={infoPayload} setFormPayload={setInfoPayload} />)}
                <div className="col-lg-6">
                  <InputWidget
                    type={"multiSelect"}
                    inputType={"name"}
                    label={"Decision Authority"}
                    id={"decision-authority"}
                    require={true}
                    icon={"icon-court"}
                    options={fetchedData.courts || []}
                    multiple={false}
                    setValue={(value) => {
                      console.log("decisionAuthority", value);
                      const pd = {
                        ...infoPayload,
                      };
                      pd["decisionAuthorityId"] = value.value;
                      setInfoPayload(pd);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Records of rigorous imprisonment'}
                    id={'labor'}
                    require={false}
                    icon={'icon-file'}
                    setValue={(value) => {
                      const payload = {
                        ...infoPayload,
                      };
                      payload['laborInfo'] = value;
                      setInfoPayload(payload);
                    }}
                  />
                </div>
                <HearingInfo formPayload={formPayload} setFormPayload={setFormPayload} courts={fetchedData.courts} remandingCourts={fetchedData.courts} isUTP={false} loading={false} handleFrontUpload={handleFrontUpload} hideFields={true} />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"save-btn-last"}
            className="btn btn-prim waves-effect waves-light"
            onClick={closeModal}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewConvicted;
