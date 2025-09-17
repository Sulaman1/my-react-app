import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedDate, getIds, transformData } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { generateYears } from "../../../common/Common";
import { PayloadFtn } from "../helper/Payload";

const ReportSearch = (props) => {
  //const [years, setYears] = useState(generateYears());

  const [prisonerData, setPrisonerData] = useState({});
  const [formPayload, setFormPayload] = useState({});
  const [checkoutDateRange, setCheckoutDateRange] = useState([null, null]);
  const [startCheckoutDate, endCheckoutDate] = checkoutDateRange;
  const [hospitaladmissionDateRange, setHospitalAdmissionDateRange] = useState([
    null,
    null,
  ]);
  const [startHospitalAdmissionDate, endHospitalAdmissionDate] =
    hospitaladmissionDateRange;
  const [dischargeDateRange, setDischargeDateRange] = useState([null, null]);
  const [startDischargeDate, endDischargeDate] = dischargeDateRange;
  const [checkup, setCheckupDateRange] = useState([null, null]);
  const [startCheckupDate, endCheckupDate] = checkup;
  const [darbanDateRange, setDarbanDateRange] = useState([null, null]);
  const [darbanStartDate, darbanEndDate] = darbanDateRange;
  const [admissionDateRange, setAdmissionDateRange] = useState([null, null]);
  const [admissionStartDate, admissionEndDate] = admissionDateRange;
  const [convictDateRange, setConvictDateRange] = useState([null, null]);
  const [convictStartDate, convictEndDate] = convictDateRange;
  const [releaseDateRange, setReleaseDateRange] = useState([null, null]);
  const [releaseStartDate, releaseEndDate] = releaseDateRange;
  const [visitDateRange, setVisitDateRange] = useState([null, null]);
  const [visitStartDate, visitEndDate] = visitDateRange;
  const [courtOrderDateRange, setCourtOrderDateRange] = useState([null, null]);
  const [startCourtOrderDate, endCourtOrderDate] = courtOrderDateRange;
	const newLookups = useSelector((state) => state?.dropdownLookups) 

  const [prisons, setPrisons] = useState([]);
  const [isRoleExist, setIsRoleExist] = useState("")

  useEffect(() => {
    fetchPrisonserData(); // loading lookups

    const rawData = sessionStorage.getItem("user");
    const employee = JSON.parse(rawData)?.employee;
    const prisonObj = employee?.prisons.map((e) => { return ({ "value": e.prisonId, "label": e.prisonName }) });
    setPrisons(prisonObj)
    setIsRoleExist(employee?.user?.roleNames[0])

    const prisonId = JSON.parse(rawData)?.employee?.prisons.map((e) => e.prisonId);
    PayloadFtn['prisonerNumber']['prisonId'] = prisonId
  }, []);

  const fetchPrisonserData = async () => {
    try {
      const prisonersData = {};

      const policeStationObj = transformData(newLookups?.policeStation);
      prisonersData["policeStations"] = policeStationObj;
    
      const prisonerCategoryObj = transformData(newLookups?.prisonerCategory);
      prisonersData["prisonerCategory"] = prisonerCategoryObj;
     
      const gendersObj = transformData(newLookups?.gender);
      prisonersData["gender"] = gendersObj;

      const prisonsObj = transformData(newLookups?.prison);
      prisonersData["prisons"] = prisonsObj;

      setPrisonerData(prisonersData);
    } catch (error) {
      console.error(error);
      alert("something went wrong in lookups api");
    }
  };

  return (
    <>


      <div className="row">
      </div>
      <h4 className="third-heading  sub-fill-heading">PRISONER Admission</h4>
      <form >
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              {(isRoleExist == "Inspector General Prisons" || isRoleExist == "DIG Prisons") &&
                <>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      label={"Prison"}
                      isMulti={true}
                      id={"prison"}
                      icon={"icon-office"}
                      options={prisons || []}
                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prisonerNumber"]["prisonId"] = getIds(value);
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                </>
              }
              {props.type && (props.type === "isdarban" || props.type === "checkinout") && (
                <div className="col-lg-4">
                  <InputWidget
                    type={"multiSelect"}
                    inputType={"name"}
                    label={"Prisoner Category (قیدی کی درجہ بندی)"}
                    options={prisonerData.prisonerCategory || []}
                    isMulti={true}
                    icon={"icon-prisoner"}

                    setValue={(value) => {
                      const payload = {
                        ...props.formPayload,
                      };
                      payload["prisonerNumber"]["category"] = getIds(value);
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
              )}
              <div className="col-lg-4">
                <InputWidget
                  type={"input"}
                  inputType={"name"}
                  label={"Prisoner Name (قیدی کا نا)"}
                  // require={'true'}
                  icon={"icon-prisoner"}
                  setValue={(value) => {
                    const payload = {
                      ...props.formPayload,
                    };
                    payload["personalInfo"]["fullName"] = value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
              {(!props.type === "isdarban"
                || props.type === "undertrial"
                || props.type === "convict") && (
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      onlyNumbers
                      label={"Prisoner Number (قیدی نمبر)"}
                      icon={"icon-number"}
                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prsNumber"] = +value;
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                )}
              {props.type === "isdarban" && (<>
                <div className='col-lg-4'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Nick Name (عرفی نام)'}
                    id={'nick_name'}
                    require={false}
                    onlyLetters={true}
                    icon={'icon-operator'}
                    defaultValue={
                      props?.formPayload?.personalInfo
                        ?.nickName
                    }
                    setValue={value => {
                      console.log('nickName', value);
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo']['nickName'] =
                        value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                <div className='col-lg-4'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Official ID No (For Foreigners Only)'}
                    id={'passport_number'}
                    require={false}
                    icon={'icon-number'}
                    defaultValue={
                      props?.formPayload?.personalInfo
                        ?.passportNumber
                    }
                    setValue={value => {
                      console.log('passportNumber', value);
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo'][
                        'passportNumber'
                      ] = value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
              </>
              )}
              <div className="col-lg-4">
                <InputWidget
                  type={"input"}
                  inputType={"name"}
                  label={"Prisoner's Fathers Name (قیدی کے والد کا نام)"}
                  icon={"icon-operator"}
                  setValue={(value) => {
                    const payload = {
                      ...props.formPayload,
                    };
                    payload["personalInfo"]["relationshipName"] = value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
              {!props.type === "isdarban" ? " " : (
                <>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isMulti={true}
                      inputType={"select"}
                      label={"Prisoner Year (قیدی سال)"}
                      require={false}
                      icon={"icon-event"}
                      options={years}

                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prisonerNumber"]["year"] = getIds(value);
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"name"}
                      label={"Police Station (تھانہ)"}
                      isMulti={true}
                      multiple={false}
                      icon={"icon-office"}
                      options={prisonerData.policeStations || []}

                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prisonerCase"]["policeStationId"] = getIds(value);
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                </>
              )}

              {(props.type !== "visitor" && props.type !== "visitorwise" && props.type !== "isdarban") && (
                <>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"number"}
                      label={"FIR No (ایف آئی آر نمبر)"}
                      icon={"icon-file"}
                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["firNo"] = value;
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isMulti={true}
                      inputType={"select"}
                      label={"Fir Year (ایف آئی آر کا سال)"}
                      require={false}
                      icon={"icon-event"}
                      options={years}

                      setValue={(value) => {
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prisonerCase"]["firYear"] = getIds(value);
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>
                  {props.type === "checkinout" || props.type === "hospital" ? " " : (<>
                    <div className="col-lg-4">
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Prisoner Status (قیدی کی حیثیت) "}
                        isMulti={true}
                        options={prisonerData.prisonerStatus || []}
                        icon={"icon-operator"}

                        setValue={(value) => {
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["checkInOuts"]["prisonerStatusId"] = getIds(value);
                          props.setFormPayload(payload);
                        }}
                      />
                    </div>

                  </>)}
                </>
              )}
              <div className="col-lg-4">
                <InputWidget
                  type={"multiSelect"}
                  inputType={"name"}
                  label={"Gender (جنس)"}
                  isMulti={true}
                  options={prisonerData.gender || []}
                  icon={"icon-gender"}

                  setValue={(value) => {
                    const payload = {
                      ...props.formPayload,
                    };
                    payload["personalInfo"]["genderId"] = getIds(value);
                    props.setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-4">
                <InputWidget
                  type={"cnic"}
                  inputType={"text"}
                  label={"CNIC (شناختی کارڈ نمبر)"}
                  require={false}
                  icon={"icon-carporate"}
                  onlyNumbers={true}
                  setValue={(value, event) => {
                    console.log("cnic", value);
                    //	checkCNIC(value);
                    const payload = {
                      ...props.formPayload,
                    };
                    payload["personalInfo"]["cnic"] = value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>

              {/* Reports Search Params */}
              {(props.type === 'master'
                || props.type === 'checkinout'
                || props.type === "undertrial"
                || props.type === "convict"
                || props.type === "visitorwise"
                || props.type === "visitor") && <>
                  <div className="col-lg-4">
                    <div className='inputs force-active'>
                      <label>Admission Start-End Date</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={admissionStartDate}
                        endDate={admissionEndDate}
                        onChange={(date) => {
                          setAdmissionDateRange(date);
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["prisonerAdmission"]["admissionDateStart"] =
                            date && date[0] != null
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                              : "";
                          payload["prisonerAdmission"]["admissionDateEnd"] =
                            date && date[1] != null
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                              : "";
                          props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                      />
                    </div>
                  </div>
                  {(props.type === "visitor" || props.type === "visitorwise") ? null :
                    (<div className="col-lg-4">
                      <div className='inputs force-active'>
                        <label>Release Start-End Date</label>
                        <DatePicker
                          icon={"icon-calendar"}
                          dateFormat="dd/MM/yyyy"
                          selectsRange={true}
                          startDate={releaseStartDate}
                          endDate={releaseEndDate}
                          onChange={(date) => {
                            setReleaseDateRange(date);
                            const payload = {
                              ...props.formPayload,
                            };
                            payload["prisonerAdmission"]["releaseDateStart"] =
                              date && date[0] != null
                                ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                                }-${date[0].getDate()}`
                                : "";
                            payload["prisonerAdmission"]["releaseDateEnd"] =
                              date && date[1] != null
                                ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                                }-${date[1].getDate()}`
                                : "";
                            props.setFormPayload(payload);
                          }}
                          isClearable={true}
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={120}
                          showMonthDropdown
                          id={"release-start-end-date"}
                        />
                      </div>
                    </div>)}

                  {(!props.type === "undertrial"
                    || props.type === "convict"
                    || props.type === 'master'
                  ) && (
                      <div className="col-lg-4">
                        <div className='inputs force-active'>
                          <label>Conviction Start-End Date</label>
                          <DatePicker
                            icon={"icon-calendar"}
                            dateFormat="dd/MM/yyyy"
                            selectsRange={true}
                            startDate={convictStartDate}
                            endDate={convictEndDate}
                            onChange={(date) => {
                              setConvictDateRange(date);
                              const payload = {
                                ...props.formPayload,
                              };
                              payload["prisonerAdmission"]["convictionDateStart"] =
                                date && date[0] != null
                                  ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                                  }-${date[0].getDate()}`
                                  : "";
                              payload["prisonerAdmission"]["convictionDateEnd"] =
                                date && date[1] != null
                                  ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                                  }-${date[1].getDate()}`
                                  : "";
                              props.setFormPayload(payload);
                            }}
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={120}
                            showMonthDropdown
                            isClearable={true}
                            id={"conviction-start-end-date"}
                          />
                        </div>
                      </div>
                    )}

                </>
              }
              {(props.type === "isdarban"
                || props.type === "master"
                || props.type === 'checkinout'
                || !props.type === "undertrial"
                || props.type === "convict"
                || props.type === "visitorwise"
                || props.type === "visitor") && (
                  <div className="col-lg-4">
                    <div className='inputs force-active'>
                      <label>Darban Start-End Date</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={darbanStartDate}
                        endDate={darbanEndDate}
                        onChange={(date) => {
                          setDarbanDateRange(date);
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["prisonerNumber"]["darbanEntryDateStart"] =
                            date && date[0] != null
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                              : "";
                          payload["prisonerNumber"]["darbanEntryDateEnd"] =
                            date && date[1] != null
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                              : "";
                          props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                        id={"darban-start-end-date"}
                      />
                    </div>
                  </div>
                )}
              {props.type === "checkinout" && (
                <div className="col-lg-4">
                  <div className='inputs force-active'>
                    <label>Checkout Start-End Date</label>
                    <DatePicker
                      icon={"icon-calendar"}
                      dateFormat="dd/MM/yyyy"
                      selectsRange={true}
                      startDate={startCheckoutDate}
                      endDate={endCheckoutDate}
                      onChange={(date) => {
                        setCheckoutDateRange(date);
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["checkInOuts"]["checkOutRequestDateTimeStart"] =
                          date && date[0] != null
                            ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                            : "";
                        payload["checkInOuts"]["checkOutRequestDateTimeEnd"] =
                          date && date[1] != null
                            ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                            : "";
                        props.setFormPayload(payload);
                      }}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      isClearable={true}
                      id={"checkout-start-end-date"}
                    />

                  </div>
                </div>

              )}

              {props.type === "hospital" &&
                <>
                  <div className="col-lg-4">
                    <div className='inputs force-active'>
                      <label>Admission Start-End Date</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={startHospitalAdmissionDate}
                        endDate={endHospitalAdmissionDate}
                        onChange={(date) => {
                          setHospitalAdmissionDateRange(date);
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["hospitalAdmissions"]["admissionDateStart"] =
                            date && date[0] != null
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                              : "";
                          payload["hospitalAdmissions"]["admissionDateEnd"] =
                            date && date[1] != null
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                              : "";
                          props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                        id={"admission-start-end-date"}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className='inputs force-active'>
                      <label>Discharge Start-End Date</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={startDischargeDate}
                        endDate={endDischargeDate}
                        onChange={(date) => {
                          setDischargeDateRange(date);
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["hospitalAdmissions"]["dischargeDateStart"] =
                            date && date[0] != null
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                              : "";
                          payload["hospitalAdmissions"]["dischargeDateEnd"] =
                            date && date[1] != null
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                              : "";
                          props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                        id={"checkup-start-end-date"}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className='inputs force-active'>
                      <label>checkup Start-End Date</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={startCheckupDate}
                        endDate={endCheckupDate}
                        onChange={(date) => {
                          setCheckupDateRange(date);
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["hospitalAdmissions"]["checkUpDateStart"] =
                            date && date[0] != null
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                              : "";
                          payload["hospitalAdmissions"]["checkUpDateEnd"] =
                            date && date[1] != null
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                              : "";
                          props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                        id={"checkup-start-end-date"}
                      />
                    </div>
                  </div>
                </>}
              {props.type === "court" && (
                <div className="col-lg-4">
                  <div className="inputs force-active">
                    <label>Court Production Start-End date</label>
                    <DatePicker
                      icon={"icon-calendar"}
                      dateFormat="dd/MM/yyyy"
                      selectsRange={true}
                      startDate={startCourtOrderDate}
                      endDate={endCourtOrderDate}
                      onChange={(date) => {
                        setCourtOrderDateRange(date);
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["prisonerCase"]["courtOrderDateStart"] =
                          date && date[0] != null
                            ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                            : "";
                        payload["prisonerCase"]["courtOrderDateEnd"] =
                          date && date[1] != null
                            ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                            : "";
                        props.setFormPayload(payload);
                      }}
                      isClearable={true}
                      id={"court-order-start-end-date"}
                    />
                  </div>
                </div>
              )}
              {props.type === 'visitor' && (
                <div className="col-lg-4">
                  <div className='inputs force-active'>
                    <label>visit Start-End Date</label>
                    <DatePicker
                      icon={"icon-calendar"}
                      dateFormat="dd/MM/yyyy"
                      selectsRange={true}
                      startDate={visitStartDate}
                      endDate={visitEndDate}
                      onChange={(date) => {
                        setVisitDateRange(date);
                        const payload = {
                          ...props.formPayload,
                        };
                        payload["visitDateStart"] =
                          date && date[0] != null
                            ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                            : "";
                        payload["visitDateEnd"] =
                          date && date[1] != null
                            ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                            : "";
                        props.setFormPayload(payload);
                      }}
                      isClearable={true}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      id={"visit-start-end-date"}
                    />
                  </div>
                </div>)}

            </div>

          </div>
        </div>
      </form>

    </>
  );
};

export default ReportSearch;
