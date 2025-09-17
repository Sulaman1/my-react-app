import { useState, useEffect } from "react";
import { getIds, transformData } from "../../../common/Helpers";
import { mapIdsToLabels, booleanOptions } from "../../../common/ReportHelpers";
import InputWidget from "../../../droppables/InputWidget";
import { useSelector } from "react-redux";
import "bootstrap/dist/js/bootstrap.js";
import { Collapse } from "react-bootstrap";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";

const PrisonerMedicalForm = ({ type, formPayload, setFormPayload }) => {
  const [open, setOpen] = useState(true);
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
      const bloodGroupObj = transformData(newLookups?.bloodGroup);
      lookup["bloodGroup"] = bloodGroupObj;

      const diseasesObj = transformData(newLookups?.disease);
      lookup["diseases"] = diseasesObj;

      const covidObj = transformData(newLookups?.vaccinations);
      lookup["CovidVacinationTypes"] = covidObj;

      setLookup(lookup);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="row">
        <h3 onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}
          className="master-report-headings">
          <span className="d-flex justify-content-between w-100">
            Medical Information{" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
          </span>
        </h3>

        <Collapse in={open}>
          <div id="example-collapse-text" className="row">
            <div className="col-lg-3">
              <InputWidget
                type={"input"}
                label={"First mark of Identification  (شناخت کا نشان)"}
                require={false}
                icon={"icon-operator"}
                id={"mark-of-identification"}
                defaultValue={formPayload?.medicalInfo?.markOfIdentification}
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["markOfIdentification"] = value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"input"}
                inputType={"name"}
                label={"Height (ft)"}
                require={false}
                icon={"icon-number"}
                id={"height"}
                defaultValue={formPayload?.medicalInfo?.height}
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["height"] = value;
                  setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-3">
              <InputWidget
                type={"input"}
                inputType={"number"}
                label={"Weight (kg)"}
                id={"weight"}
                require={false}
                defaultValue={formPayload?.medicalInfo?.weight}
                icon={"icon-number"}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload["medicalInfo"]["weight"] = value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"PWID (انجیکٹ ڈرگس)"}
                isMulti={false}
                id={"drugs"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions}
                defaultValue={
                  formPayload?.medicalInfo?.pwid !== undefined
                    ? formPayload.medicalInfo.pwid
                      ? { value: true, label: "Yes" }
                      : { value: false, label: "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["pwid"] = value?.value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Disabled (معذور)"}
                isMulti={false}
                id={"disabled"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions}
                defaultValue={
                  formPayload?.medicalInfo?.disabled !== undefined
                    ? formPayload.medicalInfo.disabled
                      ? { value: true, label: "Yes" }
                      : { value: false, label: "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["disabled"] = value?.value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Drug Addict (منشیات کے عادی)"}
                isMulti={false}
                id={"addicted"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions}
                defaultValue={
                  formPayload?.medicalInfo?.addict !== undefined
                    ? formPayload.medicalInfo.addict
                      ? { value: true, label: "Yes" }
                      : { value: false, label: "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["addict"] = value?.value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Juvenile (نابالغ)"}
                isMulti={false}
                id={"Juvenile"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions}
                defaultValue={
                  formPayload?.medicalInfo?.juvinile !== undefined
                    ? formPayload.medicalInfo.juvinile
                      ? { value: true, label: "Yes" }
                      : { value: false, label: "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["juvinile"] = value?.value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Fit for Labour (مزدوری کے لئے موزوں)"}
                isMulti={false}
                id={"fit-for-labour"}
                icon={"icon-prisoner"}
                isClearable={true}
                options={booleanOptions}
                defaultValue={
                  formPayload?.medicalInfo?.fitForLabour !== undefined
                    ? formPayload.medicalInfo.fitForLabour
                      ? { value: true, label: "Yes" }
                      : { value: false, label: "No" }
                    : null
                }
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["fitForLabour"] = value?.value;
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Covid Vaccination (کوویڈ ویکسینیشن)"}
                require={false}
                isMulti={true}
                icon={"icon-medical"}
                options={lookup?.CovidVacinationTypes || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.medicalInfo?.vaccination,
                  lookup?.CovidVacinationTypes || []
                )}
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["vaccination"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Blood Group"}
                isMulti
                icon={"icon-planer"}
                id={"blood-group"}
                options={lookup?.bloodGroup || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.medicalInfo?.bloodGroupId,
                  lookup?.bloodGroup || []
                )}
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["bloodGroupId"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>

            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Diseases"}
                isMulti
                id={"diseases"}
                icon={"icon-office"}
                options={lookup?.diseases || []}
                defaultValue={mapIdsToLabels(
                  formPayload?.medicalInfo?.diseasesIds,
                  lookup?.diseases || []
                )}
                setValue={(value) => {
                  const payload = { ...formPayload };
                  payload["medicalInfo"]["diseasesIds"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default PrisonerMedicalForm;
