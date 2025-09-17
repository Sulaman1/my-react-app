import { useState, useEffect } from "react";
import InputWidget from "../../../droppables/InputWidget";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";

const ContactInfoForm = ({ type, formPayload, setFormPayload }) => {
  const [open, setOpen] = useState(true);


  useEffect(() => {

  }, []);

  return (
    <div className="row">
      <h3
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          className="master-report-headings"
        >
          {" "}
          <span className="d-flex justify-content-between w-100">
          Contact Info {" "}
            {open ? <IoMdArrowDropdownCircle size={27} /> :  <IoMdArrowDroprightCircle size={27} />}{" "}
          </span>{" "}
        </h3>
        <Collapse in={open}>

        <div id="example-collapse-text" className="row">
      <div className="col-lg-3">
        <InputWidget
          type={"input"}
          label={"Phone Number"}
          require={false}
          onlyNumbers
          icon={"icon-operator"}
          id={"phno"}
          defaultValue={formPayload?.person?.contactInfo?.phoneNumber}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["person"]["contactInfo"]["phoneNumber"] = value;
            setFormPayload(payload);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputWidget
          type={"input"}
          label={"Mobile Number"}
          require={false}
          onlyNumbers
          icon={"icon-operator"}
          id={"mobile-number"}
          defaultValue={formPayload?.person?.contactInfo?.mobileNumber}
          setValue={(value) => {
            const payload = {
              ...formPayload,
            };
            payload["person"]["contactInfo"]["mobileNumber"] = value;
            setFormPayload(payload);
          }}
        />
      </div>
      </div>
      </Collapse>
      

    </div>
  )
};
export default ContactInfoForm;






;






