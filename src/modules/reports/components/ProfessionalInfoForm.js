import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { getData } from "../../../services/request";
import InputWidget from "../../../droppables/InputWidget";
import { useSelector } from "react-redux";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";
import { mapIdsToLabels } from "../../../common/ReportHelpers";

const ProfessionalInfoForm = ({ type, formPayload, setFormPayload }) => {
  const [open, setOpen] = useState(true);
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);

  useEffect(() => {
    fetchLookUps();
  }, []);

  const fetchLookUps = async () => {
    try {
      let lookup = {};
      const eduObj = newLookups?.EducationTypeLkpt;
      const fls = eduObj?.filter((dt) => dt.name === "Technical Education")[0];

      const techanical = await getData(
        "/services/app/EducationLkpt/GetAllEducation?educationTypeId=" +
        fls?.id,
        "",
        true, false
      );
      const techanicalObj = transformData(techanical?.result?.data);
      lookup["techanical"] = techanicalObj;

      const pls = eduObj?.filter((dt) => dt.name === "Formal Education")[0];

      const formal = await getData(
        "/services/app/EducationLkpt/GetAllEducation?educationTypeId=" +
        pls?.id,
        "",
        true, false
      );
      const formalObj = transformData(formal?.result?.data);
      lookup["formal"] = formalObj;

      const mls = eduObj?.filter((dt) => dt.name === "Religious Education")[0];

      const religious = await getData(
        "/services/app/EducationLkpt/GetAllEducation?educationTypeId=" +
        mls?.id,
        "",
        true, false
      );
      const religiousObj = transformData(religious?.result?.data);
      lookup["religious"] = religiousObj;

      const occupationObj = transformData(newLookups?.Occupation);
      lookup["occupation"] = occupationObj;

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
          Professional Info {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Occupation"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"occupation"}
              options={lookup?.occupation || []}
              defaultValue={mapIdsToLabels(
                formPayload?.person?.professionalInfo?.occupationId,
                lookup?.occupation || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["person"]["professionalInfo"]["occupationId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Formal Education"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"formal-education"}
              options={lookup?.formal || []}
              defaultValue={mapIdsToLabels(
                formPayload?.person?.professionalInfo?.formalEducationId,
                lookup?.formal || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["person"]["professionalInfo"]["formalEducationId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Religious Education"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"religious-education"}
              options={lookup?.religious || []}
              defaultValue={mapIdsToLabels(
                formPayload?.person?.professionalInfo?.religiousEducationId,
                lookup?.religious || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["person"]["professionalInfo"]["religiousEducationId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Technical Education"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"technical-education"}
              options={lookup?.techanical || []}
              defaultValue={mapIdsToLabels(
                formPayload?.person?.professionalInfo?.technicalEducationId,
                lookup?.techanical || []
              )}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["person"]["professionalInfo"]["technicalEducationId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default ProfessionalInfoForm;






