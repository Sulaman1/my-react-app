import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { generateYears } from "../../../common/Common";
import { useSelector } from "react-redux";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";
import { booleanOptions } from "../../../common/ReportHelpers";

const PrisonerCaseForm = ({ type, formPayload, setFormPayload, headingType }) => {
  // Initialize all date ranges with values from formPayload
  const [productionDateRange, setProductionDateRange] = useState(() => [
    formPayload?.prisonerCase?.productionOrderDate?.start ? new Date(formPayload.prisonerCase.productionOrderDate.start) : null,
    formPayload?.prisonerCase?.productionOrderDate?.end ? new Date(formPayload.prisonerCase.productionOrderDate.end) : null
  ]);
  const [courtOrderDateRange, setCourtOrderDateRange] = useState(() => [
    formPayload?.prisonerCase?.courtOrderDate?.start ? new Date(formPayload.prisonerCase.courtOrderDate.start) : null,
    formPayload?.prisonerCase?.courtOrderDate?.end ? new Date(formPayload.prisonerCase.courtOrderDate.end) : null
  ]);
  const [firDateRange, setFirDateRange] = useState(() => [
    formPayload?.prisonerCase?.firDate?.start ? new Date(formPayload.prisonerCase.firDate.start) : null,
    formPayload?.prisonerCase?.firDate?.end ? new Date(formPayload.prisonerCase.firDate.end) : null
  ]);
  const [decisionDateRange, setDecisionDateRange] = useState(() => [
    formPayload?.prisonerCase?.decisionDate?.start ? new Date(formPayload.prisonerCase.decisionDate.start) : null,
    formPayload?.prisonerCase?.decisionDate?.end ? new Date(formPayload.prisonerCase.decisionDate.end) : null
  ]);
  const [sentenceDateRange, setSentenceDateRange] = useState(() => [
    formPayload?.prisonerCase?.sentenceDate?.start ? new Date(formPayload.prisonerCase.sentenceDate.start) : null,
    formPayload?.prisonerCase?.sentenceDate?.end ? new Date(formPayload.prisonerCase.sentenceDate.end) : null
  ]);
  const [caseReleaseDateRange, setCaseReleaseDateRange] = useState(() => [
    formPayload?.prisonerCase?.releaseDate?.start ? new Date(formPayload.prisonerCase.releaseDate.start) : null,
    formPayload?.prisonerCase?.releaseDate?.end ? new Date(formPayload.prisonerCase.releaseDate.end) : null
  ]);
  const [prelease, setProbableReleaseDateRange] = useState(() => [
    formPayload?.prisonerCase?.probableReleaseDate?.start ? new Date(formPayload.prisonerCase.probableReleaseDate.start) : null,
    formPayload?.prisonerCase?.probableReleaseDate?.end ? new Date(formPayload.prisonerCase.probableReleaseDate.end) : null
  ]);
  const [releaseDateRange, setReleaseDateRange] = useState(() => [
    formPayload?.prisonerAdmission?.releaseDate?.start ? new Date(formPayload.prisonerAdmission.releaseDate.start) : null,
    formPayload?.prisonerAdmission?.releaseDate?.end ? new Date(formPayload.prisonerAdmission.releaseDate.end) : null
  ]);

  // Destructure date ranges
  const [startProductionDate, endProductionDate] = productionDateRange;
  const [startCourtOrderDate, endCourtOrderDate] = courtOrderDateRange;
  const [startFirDate, endFirDate] = firDateRange;
  const [startDecisionDate, endDecisionDate] = decisionDateRange;
  const [startSentenceDate, endSentenceDate] = sentenceDateRange;
  const [caseStartReleaseDate, caseEndReleaseDate] = caseReleaseDateRange;
  const [startPreleaseDate, endPreleaseDate] = prelease;

  // Other state initializations
  //const [years] = useState(generateYears());
  const [lookup, setLookup] = useState();
  const [open, setOpen] = useState(true);
  
  // Selectors
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const userMeta = useSelector((state) => state.user);
  
  // Constants
  const isDig = userMeta?.role === "DIG Prisons";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isReleaseReport = type === "release";

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};

      const policeStationObj = transformData(newLookups?.policeStation);
      lookup["policeStation"] = policeStationObj;

      const sectionObj = transformData(newLookups?.sections);
      lookup["section"] = sectionObj;

      const courtObj = transformData(newLookups?.court);
      lookup["court"] = courtObj;

      const releaseTypeObj = transformData(newLookups?.ReleaseType);
      lookup["releaseType"] = releaseTypeObj;

      const caseStatus = transformData(newLookups?.caseStatus);
      lookup["caseStatus"] = caseStatus;

      
      const prisonObj = transformData(newLookups?.prison);
      lookup["prisons"] = prisonObj;


      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  return (
    <div className="row">
      <h3
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="master-report-headings"
      >
        <span className="d-flex justify-content-between w-100">
          {isReleaseReport ? "Release Report Filters" : "Prisoner Cases"}{" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          {isReleaseReport && (
            <>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Release Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={releaseDateRange[0]}
                    endDate={releaseDateRange[1]}
                    onChange={(date) => {
                      setReleaseDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload.prisonerAdmission.releaseDate = {
                        start: date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "",
                        end: date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : ""
                      };
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"admission-release-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Prisoner Name"}
                  require={false}
                  icon={"icon-operator"}
                  id={"prisoner-name"}
                  defaultValue={formPayload?.personalInfo?.fullName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["fullName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"Father Name"}
                  require={false}
                  icon={"icon-operator"}
                  id={"father-name"}
                  defaultValue={formPayload?.personalInfo?.relationshipName}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["relationshipName"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputWidget
                  type={"input"}
                  label={"CNIC"}
                  require={false}
                  icon={"icon-operator"}
                  id={"cnic"}
                  defaultValue={formPayload?.personalInfo?.cnic}
                  setValue={(value) => {
                    const payload = { ...formPayload };
                    payload["personalInfo"]["cnic"] = value;
                    setFormPayload(payload);
                  }}
                />
              </div>
              {(isIG || isDig)  &&
				<>
					<div className="col-lg-3">
						<InputWidget
							type={"multiSelect"}
							label={"Prison"}
							isMulti={true}
							id={"prison"}
							icon={"icon-office"}
							options={lookup?.prisons || []}
							setValue={(value) => {
								const payload = {
									...formPayload,
								};
								payload["prisonerNumber"]["prisonId"] = getIds(value);
								setFormPayload(payload);
							}}
						/>
					</div>
					
				</>
			}
            </>
          )}

          <div className="col-lg-3">
            <InputWidget
              type={"input"}
              label={"Number of cases"}
              require={false}
              icon={"icon-operator"}
              id={"number-of-cases"}
              defaultValue={formPayload?.prisonerCase?.numberOfCases}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerCase"]["numberOfCases"] = value;
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Case Status"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"case-status"}
              options={lookup?.caseStatus || []}
              defaultValue={mapIdsToLabels(
                formPayload?.prisonerCase?.caseStatus,
                lookup?.caseStatus || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerCase"]["caseStatus"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Police station"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"police-station"}
              options={lookup?.policeStation || []}
              defaultValue={mapIdsToLabels(
                formPayload?.prisonerCase?.policeStationId,
                lookup?.policeStation || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload.prisonerCase.policeStationId = value ? value.map(v => v.value) : [];
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <InputWidget
              type={"input"}
              label={"Fir Number"}
              require={false}
              icon={"icon-operator"}
              id={"fir-no"}
              defaultValue={formPayload?.prisonerCase?.firNo}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerCase"]["firNo"] = value;
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Except Sections"}
                isMulti={true}
                require={false}
                icon={"icon-operator"}
                id={"except-sec-id"}
                options={lookup?.section || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.prisonerCase?.sectionsExcept,
                  lookup?.section || []
                )}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload.prisonerCase.sectionsExcept = value ? value.map(v => v.value) : [];
                  setFormPayload(payload);
                }}
              />
            </div>
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Sections"}
              isMulti={true}
              require={false}
              icon={"icon-operator"}
              id={"sec-id"}
              options={lookup?.section || []}
              defaultValue={mapIdsToLabels(
                formPayload?.prisonerCase?.sections,
                lookup?.section || []
              )}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                payload.prisonerCase.sections = value ? value.map(v => v.value) : [];
                setFormPayload(payload);
              }}
            />
          </div>
         
          <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Only Provided Under Sections"}
                id={"only-provided-under-sections"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions|| []}
                defaultValue={
                  formPayload?.prisonerCase?.onlyProvidedUndersections !== undefined
                    ? { value: formPayload.prisonerCase.onlyProvidedUndersections, label: formPayload.prisonerCase.onlyProvidedUndersections ? "Yes" : "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  
                  payload["prisonerCase"]["onlyProvidedUndersections"] = value?.value;
                  
                  setFormPayload(payload);
                }}
              />
            </div>
         
          
            {isReleaseReport && (<>
               <div className="col-lg-3">
               <InputWidget
                 type={"switch"}
                 inputType={"checkbox"}
                 label={"Current Population"}
                 require={false}
                 icon={"icon-operator"}
                 id={"current-population"}
                 setValue={(value) => {
                   const payload = {
                     ...formPayload,
                   };
                   payload["prisonerNumber"]["addedInPrison"] = value;
                   setFormPayload(payload);
                 }}
               />
             </div>
             </> )}

          {!isReleaseReport && (
            <>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Production Order Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startProductionDate}
                    endDate={endProductionDate}
                    onChange={(date) => {
                      setProductionDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["productionOrderDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerCase"]["productionOrderDate"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"production-order-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="col-lg-12">
                  <div className="inputs force-active">
                    <label>Fir Start Start-End Date</label>
                    <DatePicker
                      icon={"icon-calendar"}
                      dateFormat="dd/MM/yyyy"
                      selectsRange={true}
                      startDate={startFirDate}
                      endDate={endFirDate}
                      onChange={(date) => {
                        setFirDateRange(date);
                        const payload = {
                          ...formPayload,
                        };
                        payload["prisonerCase"]["firDate"]["start"] =
                          date && date[0] != null
                            ? `${date[0].getFullYear()}-${
                                date[0].getMonth() + 1
                              }-${date[0].getDate()}`
                            : "";
                        payload["prisonerCase"]["firDate"]["end"] =
                          date && date[1] != null
                            ? `${date[1].getFullYear()}-${
                                date[1].getMonth() + 1
                              }-${date[1].getDate()}`
                            : "";
                        setFormPayload(payload);
                      }}
                      isClearable={true}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      id={"fir-start-end-date"}
                    />
                  </div>
                </div>
              </div>
                <div className="col-lg-3">
                  <InputWidget
                    type={"multiSelect"}
                    label={"Decision Authority"}
                    require={false}
                    isMulti={true}
                    icon={"icon-operator"}
                    id={"Decision-authority"}
                    defaultValue={mapIdsToLabels(
                      formPayload?.prisonerCase?.decisionAuthorityId,
                      lookup?.court || []
                    )}
                    options={lookup?.court || []}
                    setValue={(value) => {
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["decisionAuthorityId"] =
                        getIds(value);
                      setFormPayload(payload);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Decision Start Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startDecisionDate}
                    endDate={endDecisionDate}
                    onChange={(date) => {
                      setDecisionDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["decisionDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerCase"]["decisionDate"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"decision-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"WEF"}
              isMulti={false}
              id={"wef"}
              icon={"icon-prison"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerCase?.wef !== undefined
                  ? { value: formPayload.prisonerCase.wef, label: formPayload.prisonerCase.wef ? "Yes" : "No" }
                  : null
              }
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerCase"]["wef"] = value?.value;
                setFormPayload(payload);
              }}
            />
          </div>
          {/* Sentence Fields */}
          <div className="col-lg-6 ">
            <label>Sentence Range</label>
            <div className="d-flex  gap-2">
              <div className="col-lg-6">
                <label>Start</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    placeholder="Years"
                    require={false}
                    icon={"icon-calender"}
                    id={"sentence-start-year"}
                    defaultValue={formPayload?.prisonerCase?.sentence?.start?.year}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.start.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    placeholder="Months"
                    require={false}
                    icon={"icon-calender"}
                    id={"sentence-start-month"}
                    maxLength={2}
                    defaultValue={formPayload?.prisonerCase?.sentence?.start?.month}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.start.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"sentence-start-day"}
                    maxLength={2}
                    defaultValue={formPayload?.prisonerCase?.sentence?.start?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.start.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <label>End</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                    icon={"icon-calender"}
                    inputType={"number"}
                    placeholder="Years"
                    require={false}
                    id={"sentence-end-year"}
                    defaultValue={formPayload?.prisonerCase?.sentence?.end?.year}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.end.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Months"
                    require={false}
                    id={"sentence-end-month"}
                    defaultValue={formPayload?.prisonerCase?.sentence?.end?.month}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.end.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"sentence-end-day"}
                    defaultValue={formPayload?.prisonerCase?.sentence?.end?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.sentence) payload.prisonerCase.sentence = { start: {}, end: {} };
                      payload.prisonerCase.sentence.end.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
            </div>
          <div className="col-lg-12">
            <label>If Fine Not Paid Range</label>
            <div className="d-flex  gap-3">
              <div className="col-lg-6">
                <label>Start</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                 

                    inputType={"number"}
                    placeholder="Years"
                    require={false}
                    icon={"icon-calender"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.start?.year}
                    id={"fine-start-year"}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.start.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Months"
                    require={false}
                    id={"fine-start-month"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.start?.month}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.start.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"fine-start-day"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.start?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.start.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <label>End</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Years"
                    require={false}
                    id={"fine-end-year"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.end?.year}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.end.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Months"
                    require={false}
                    id={"fine-end-month"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.end?.month}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.end.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"fine-end-day"}
                    defaultValue={formPayload?.prisonerCase?.ifFineNotPaid?.end?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.ifFineNotPaid) payload.prisonerCase.ifFineNotPaid = { start: {}, end: {} };
                      payload.prisonerCase.ifFineNotPaid.end.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
        
            </div>
          </div>
          
          </div>
          <div className="col-lg-6">
            <label>UTP Period Range</label>
            <div className="d-flex  gap-3">
              <div className="col-lg-6">
                <label>Start</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                 
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.start?.year}
                    inputType={"number"}
                    placeholder="Years"
                    require={false}
                    icon={"icon-calender"}

                    id={"fine-start-year"}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.start.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Months"
                    require={false}
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.start?.month}
                    id={"fine-start-month"}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.start.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"fine-start-day"}
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.start?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.start.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <label>End</label>
                <div className="d-flex gap-2">
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Years"
                    require={false}
                    id={"fine-end-year"}
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.end?.year}
                    setValue={(value) => {
                      if (value.toString().length > 4) {
                        value = value.toString().slice(0, 4);
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.end.year = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Months"
                    require={false}
                    id={"fine-end-month"}
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.end?.month}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 12) {
                        value = "12";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.end.month = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                  <InputWidget
                    type={"input"}
                    inputType={"number"}
                    icon={"icon-calender"}
                    placeholder="Days"
                    require={false}
                    id={"fine-end-day"}
                    defaultValue={formPayload?.prisonerCase?.utpPeriod?.end?.day}
                    setValue={(value) => {
                      if (value.toString().length > 2) {
                        value = value.toString().slice(0, 2);
                      }
                      if (parseInt(value) > 31) {
                        value = "31";
                      }
                      const payload = {
                        ...formPayload
                      };
                      if (!payload.prisonerCase.utpPeriod) payload.prisonerCase.utpPeriod = { start: {}, end: {} };
                      payload.prisonerCase.utpPeriod.end.day = parseInt(value) || 0;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
            </div>
                 
          </div>
         
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Consecutive"}
              isMulti={false}
              id={"consecutive"}
              icon={"icon-prison"}
              defaultValue={
                formPayload?.prisonerCase?.consecutive !== undefined
                  ? { value: formPayload.prisonerCase.consecutive, label: formPayload.prisonerCase.consecutive ? "Yes" : "No" }
                  : null
              }
              isClearable={true}
              options={booleanOptions}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["consecutive"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Added Labor Info"}
              isMulti={false}
              id={"addedLaborInfo"}
              icon={"icon-prison"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerCase?.addedLaborInfo !== undefined
                  ? { value: formPayload.prisonerCase.addedLaborInfo, label: formPayload.prisonerCase.addedLaborInfo ? "Yes" : "No" }
                  : null
              }
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["addedLaborInfo"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>

        
                      
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Condemned"}
              isMulti={false}
              id={"condemned"}
              icon={"icon-prison"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerCase?.condemned !== undefined
                  ? { value: formPayload.prisonerCase.condemned, label: formPayload.prisonerCase.condemned ? "Yes" : "No" }
                  : null
              }
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["condemned"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Added Vakaltnama"}
              isMulti={false}
              id={"addedVakaltnama"}
              icon={"icon-prison"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerCase?.addedVakaltnama !== undefined
                  ? { value: formPayload.prisonerCase.addedVakaltnama, label: formPayload.prisonerCase.addedVakaltnama ? "Yes" : "No" }
                  : null
              }
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["addedVakaltnama"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Probable Release Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startPreleaseDate}
                    endDate={endPreleaseDate}
                    onChange={(date) => {
                      setProbableReleaseDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["probableReleaseDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerCase"]["probableReleaseDate"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"probable-release-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Sentence Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={startSentenceDate}
                    endDate={endSentenceDate}
                    onChange={(date) => {
                      setSentenceDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["sentenceDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerCase"]["sentenceDate"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"decision-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-3 my-2">
                <InputWidget
                  type={"multiSelect"}
                  label={"Fir Year"}
                  require={false}
                  isMulti={true}
                  icon={"icon-operator"}
                  id={"fir-year"}
                  isClearable={true}
                  defaultValue={mapIdsToLabels(
                    formPayload?.prisonerCase?.firYear,
                    years || []
                  )}
                  options={years}
                  setValue={(value) => {
                    const payload = {
                      ...formPayload,
                    };
                    payload["prisonerCase"]["firYear"] = getIds(value);
                    setFormPayload(payload);
                  }}
                />
              </div>

              <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Appeal"}
              isMulti={false}
              id={"hasAnyAppeal"}
              icon={"icon-prison"}
              defaultValue={
                formPayload?.prisonerCase?.hasAnyAppeal !== undefined
                  ? { value: formPayload.prisonerCase.hasAnyAppeal, label: formPayload.prisonerCase.hasAnyAppeal ? "Yes" : "No" }
                  : null
              }
              isClearable={true}
              options={booleanOptions}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["hasAnyAppeal"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>
              <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Retrial"}
              isMulti={false}
              id={"isRetrialCase"}
              icon={"icon-prison"}
              defaultValue={
                formPayload?.prisonerCase?.isRetrialCase !== undefined
                  ? { value: formPayload.prisonerCase.isRetrialCase, label: formPayload.prisonerCase.isRetrialCase ? "Yes" : "No" }
                  : null
              }
              isClearable={true}
              options={booleanOptions}
              setValue={(value) => {
                const payload = {
                  ...formPayload,
                };
                
                payload["prisonerCase"]["isRetrialCase"] = value?.value;
                
                setFormPayload(payload);
              }}
            />
          </div>
              <div className="col-lg-3">
                <div className="inputs force-active">
                  <label>Release Start-End Date</label>
                  <DatePicker
                    icon={"icon-calendar"}
                    dateFormat="dd/MM/yyyy"
                    selectsRange={true}
                    startDate={caseStartReleaseDate}
                    endDate={caseEndReleaseDate}
                    onChange={(date) => {
                      setCaseReleaseDateRange(date);
                      const payload = {
                        ...formPayload,
                      };
                      payload["prisonerCase"]["releaseDate"]["start"] =
                        date && date[0] != null
                          ? `${date[0].getFullYear()}-${
                              date[0].getMonth() + 1
                            }-${date[0].getDate()}`
                          : "";
                      payload["prisonerCase"]["releaseDate"]["end"] =
                        date && date[1] != null
                          ? `${date[1].getFullYear()}-${
                              date[1].getMonth() + 1
                            }-${date[1].getDate()}`
                          : "";
                      setFormPayload(payload);
                    }}
                    isClearable={true}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    showMonthDropdown
                    id={"release-start-end-date"}
                  />
                </div>
              </div>
              <div className="col-lg-6 "  >
                <div className="d-flex gap-2">
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Substansive Sentence From`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFormPayload((prev) => ({
                              ...prev,
                              prisonerCase: {
                                ...prev.prisonerCase,
                                substansiveSentence: {
                                  ...prev.prisonerCase.substansiveSentence,
                                  start: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Substansive Sentence To`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFormPayload((prev) => ({
                              ...prev,
                              prisonerCase: {
                                ...prev.prisonerCase,
                                substansiveSentence: {
                                  ...prev.prisonerCase.substansiveSentence,
                                  end: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                </div>
              </div>
            
           
           
          
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};
export default PrisonerCaseForm;
