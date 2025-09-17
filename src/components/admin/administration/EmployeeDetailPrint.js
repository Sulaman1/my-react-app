import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ changed

import $ from "jquery";
import moment from "moment-mini";
import { ICONS } from "../../../services/icons";
import ProfilePic from "../../../../src/assets/images/users/1.jpg";
import { baseImageUrl } from "../../../services/request";
import Logo from "../../../../src/assets/images/1.jpeg";

const EmployeeDetailPrint = () => {
  const navigate = useNavigate(); // ✅ changed
  const stateParamVal = useLocation().state?.stateParam;
  const [employeeDetails, setEmployeeDetails] = useState();

  const [domicileData, setDomicileData] = useState();
  const [departmentData, setDepartmentData] = useState();
  const [designationData, setdesignation] = useState();
  const [employmentType, setEmploymentType] = useState();
  const [nationalityData, setNationalityData] = useState();
  const [genderData, setGenderData] = useState();
  const [maritalStatus, setMaritalStatus] = useState();
  const [casteData, setCasteData] = useState();
  const [religionData, setReligionData] = useState();
  const [logo, setLogo] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const myElementRef = useRef(null);

  useEffect(() => {
    if (stateParamVal?.details) {
      setEmployeeDetails(stateParamVal.details);
      setDomicileData(stateParamVal?.domicileData);
      setDepartmentData(stateParamVal?.departmentData);
      setdesignation(stateParamVal?.designationData);
      setEmploymentType(stateParamVal?.employmentType);
      setNationalityData(stateParamVal?.nationalityData);
      setGenderData(stateParamVal?.genderData);
      setMaritalStatus(stateParamVal?.maritalStatus);
      setCasteData(stateParamVal?.casteData);
      setReligionData(stateParamVal?.religionData);
    } else {
      return false;
    }

    const timeout = setTimeout(() => {
      handlePrint();
    }, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, []);

  const LogoMain = () => {
    import(`${process.env.REACT_APP_LOGO_PRINT}`).then((module) => {
      setLogo(module.default);
    });

    return <img src={logo} alt="logo" className="logo" />;
  };

  const handlePrint = () => {
    var restorepage = $("body").html();
    var printcontent = $("#my-element").clone();
    $("body").empty().html(printcontent);
    window.print();
    $("body").html(restorepage);
    navigate("/admin/administration/manage-employee"); // ✅ changed
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-label print-btn"
        onClick={handlePrint}
      >
        <i
          className="custom-icon-white"
          dangerouslySetInnerHTML={{ __html: ICONS.print }}
        ></i>
      </button>
      <div id="my-element" ref={myElementRef}>
        {/* … your full JSX unchanged … */}
      </div>
    </>
  );
};

export default EmployeeDetailPrint;
