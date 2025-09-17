import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { validateDate, formatDateAndTime } from "../../../common/Helpers";
import { baseImageUrl } from "../../../services/request";

// Import images (adjust paths as needed)
import logoImage from "../../../assets/images/1.jpg";
import dpImage from "../../../assets/images/1.jpg";
import bpImage from "../../../assets/images/1.svg";
import pulseImage from "../../../assets/images/1.svg";
import temperatureImage from "../../../assets/images/1.svg";
import GCSImage from "../../../assets/images/1.svg";
import FbsRbsImage from "../../../assets/images/1.svg";
import $ from "jquery";
import { useSelector } from "react-redux";
import {  useNavigate  } from 'react-router-dom';


const PrintPrescriptions = () => {
  const stateParamVal = useLocation().state?.stateParam;
  const [logo, setLogo] = useState("");
  const newLookups = useSelector((state) => state?.dropdownLookups) 
  const medicineEntries = newLookups?.medicine;

  useEffect(() => {
    import(`../../${process.env.REACT_APP_LOGO}`).then((module) => {
      setLogo(module.default);
    });
  }, []);

  const paperStyle = {
    margin: "auto",
    backgroundColor: "white",
    width: "595.2756px",
    height: "841.8898px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const logoStyle = {
    width: "86px",
  };

  const margin15Style = {
    margin: "15px 0 0 0",
  };

  const customColumnStyle = {
    textAlign: "left",
    paddingTop: "2px",
    paddingLeft: "7px"	
  };

  const textHeadingStyle = {
    fontWeight: "bold",
    fontSize: "12px",
    marginTop: "17px",
  };

  const textParagraphStyle = {
    fontWeight: "normal",
    fontSize: "10px",
  };

  const textFormatStyle = {
    paddingTop: "12px",
  };

  const dateFormatStyle = {
    paddingTop: "23px",
    textAlign: "left",
  };

  const margin0Style = {
    margin: "0 10px 0 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  };

 
  const marginLeftStyle = {
    margin: "0px 0 5px 5px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    width: "100%",
  };

  const vitalStyle = {
    paddingLeft: "10px",
    paddingRight: "0",
    textAlign: "center",
  };

  const vitalHeadingStyle = {
    fontWeight: "bold",
    fontSize: "12px",
    textAlign: "center",
  };

  const remarksStyle = {
    border: "1px solid #8b8b8b",
    textAlign: "start",
    paddingBottom: "45px",
    paddingLeft: "10px",
  };

  const remarksHeadingStyle = {
    fontSize: "9px",
    fontWeight: 500
  };

  const iconStyle = {
    width: "28px",
    height: "28px",
  };

  const renderVitalInfo = (icon, title, value) => (
    <div style={margin0Style}>
      <div style={{ padding: "12px 0px", width: "25%" }}>
        <img src={icon} alt={title} style={iconStyle} />
      </div>
      <div style={{ ...vitalStyle, width: "65%" }}>
        <div style={vitalHeadingStyle} >{title}</div>
        <div style={{ border: "1px solid black" , textAlign: "center" }}>{value}</div>
      </div>
    </div>
  );

  const getMedicineTypeLabel = (medicineId) => {
    const medicine = medicineEntries.find(entry => entry.id === medicineId);
    return medicine ? medicine.medicineType : "N/A";
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: "12px",
  };

  const cellStyle = {
    padding: '8px',
    borderBottom: '1px solid black',
    verticalAlign: 'middle',
  };

  const headerCellStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid black',
  };

  const firstCellStyle = {
    ...cellStyle,
    borderLeft: '1px solid black',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderRight: '1px solid black',
  };

  const renderMedicineInfo = (medicine) => (
    <tr>
      <td style={firstCellStyle}>{medicine?.medicine || 'N/A'}</td>
      <td style={cellStyle}>{getMedicineTypeLabel(medicine?.medicineId)}</td>
      <td style={cellStyle}>{medicine?.quantityRequired || 'N/A'}</td>
      <td style={lastCellStyle}>{medicine?.prescriptionTimming || 'N/A'}</td>
    </tr>
  );

  const getLastCheckup = () => {
    const checkups = stateParamVal?.e?.checkups;
    return checkups && checkups.length > 0 ? checkups[checkups.length - 1] : null;
  };

  const lastCheckup = getLastCheckup();

  const formatCustomDateTime = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return {
      date: `${month}-${day}-${year}`,
      time: `${hours}:${minutes}`
    };
  };


  
	useEffect(() => {

		const timeout = setTimeout(() => {
			handlePrint();
		}, 200);
		return () => clearTimeout(timeout);

	}, []);

  //const history = useHistory();
  const navigate = useNavigate();

	const handlePrint = () => {
		var restorepage = $('body').html();
		var printcontent = $('#my-element').clone();
		$('body').empty().html(printcontent);
		window.print();
		$('body').html(restorepage);
    if(stateParamVal?.e?.hospitalAdmissionType === "OPD"){
      navigate('/admin/hospital/opd-admission'); 
    }else{
      navigate('/admin/hospital/ipd-admission'); 
    }

	}
	const myElementRef = useRef(null);


  const currentDateTime = formatCustomDateTime(new Date());

  return (
    <div style={paperStyle} ref={myElementRef} id="my-element">
			 <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
      <div style={margin0Style}>
        <div style={{ ...margin15Style, width: "16.66%" }}>
          <img src={logo || "public/images/1.jpg"} alt="logo" style={logoStyle} />
        </div>
        <div style={{ ...margin15Style, ...textFormatStyle, width: "50%" }}>
          <div>
            <h5>
              Prison Department of <br />
              <b>{process.env.REACT_APP_PRISON_NAME}</b>
            </h5>
          </div>
        </div>
        <div style={{ ...margin15Style, width: "33.33%" }}>
          <div style={dateFormatStyle}>
            <div>
              <h4 style={{ margin: 0, fontSize: "17px", justifySelf: "self-end", display: "flex", paddingRight: "10px", fontWeight: "bold" }}>Prescription Report</h4>
            </div>
            <div style={{ ...margin0Style, paddingTop: "5px" }}>
              <div style={{ padding: "0 10px 0 0px", textAlign: "right", borderRight: "1px solid black", width: "100%", fontSize: "large", height: "20px" }}>
                {currentDateTime.date}
              </div>
              <div style={{ padding: "0 0px 0 10px", width: "30%", fontSize: "large" }}>
                {currentDateTime.time}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ ...margin0Style, marginTop: "0px" }}>
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          <b>Patient Information</b>
        </p>
      </div>
      <div style={margin0Style} className="ms-2">
        <div style={{ width: "25%" }}>
          <img src={stateParamVal?.e?.prisonerPhoto
                    ? baseImageUrl + stateParamVal?.e?.prisonerPhoto
                    : dpImage} alt="Patient" style={{ maxWidth: "95%", borderRadius: "10px" }} />
        </div>
        <div style={{ ...customColumnStyle,  width: "25%" }}>
          <div style={textHeadingStyle} className="mt-0">Prisoner Number</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.prisonerNumber || "N/A"}</div>
          <div style={textHeadingStyle}>Prisoner Name</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.prisonerName || "N/A"}</div>
          <div style={textHeadingStyle}>Prisoner CNIC</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.prisonerCNIC || "N/A"}</div>
        </div>
        <div style={{ ...customColumnStyle,  width: "25%" }}>
          <div style={textHeadingStyle} className="mt-0"  >Treatment No</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.treatmentNumber || "N/A"}</div>
          <div style={textHeadingStyle}>Admission Type</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.hospitalAdmissionType || "N/A"}</div>
          <div style={textHeadingStyle}>Prison Name</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.prisonName || "N/A"}</div>
        </div>
        <div style={{ ...customColumnStyle, width: "25%" }}>
          <div style={textHeadingStyle} className="mt-0"  >Disease</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.disease || "N/A"}</div>
          <div style={textHeadingStyle}>Health Status</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.checkups?.[0]?.healthImproved ? "Improved" : "Not Improved"}</div>
          <div style={textHeadingStyle}>Dr. Name</div>
          <div style={textParagraphStyle}>{stateParamVal?.e?.checkups?.[0]?.medicalOfficerName || "N/A"}</div>
        </div>
      </div>
      <div style={{ ...margin0Style, padding: "10px 0 10px 0" }}>
        <div style={{ width: "25%" }}></div>
        <div style={{ width: "72%" }}>
          <p style={{ textAlign: "center", marginBottom: 0 }}>
            <b>Medicine Information</b>
          </p>
        </div>
      </div>
      <div style={margin0Style}>
        <div style={{ width: "25%" }}>
          {renderVitalInfo("/images/1.svg", "BP", lastCheckup?.bloodPressure || "N/A")}
          {renderVitalInfo("/images/1.svg", "Pulse Rate", lastCheckup?.pulse || "N/A")}
          {renderVitalInfo("/images/1.svg", "Temp", lastCheckup?.temperature || "N/A")}
          {renderVitalInfo("/images/1.svg", "Fbs/Rbs", lastCheckup?.fbsRbs || "N/A")}
          {renderVitalInfo("/images/1.svg", "GCS", lastCheckup?.gcs || "N/A")}
          <div style={marginLeftStyle}>
        <div style={{ width: "86%" }}>
          <div style={remarksHeadingStyle}>Presently Complaining</div>
          <div style={remarksStyle}>
            {stateParamVal?.e?.checkups?.[0]?.presentlyComplaining || "N/A"}
          </div>
        </div>
        <div style={{ width: "86%" }}>
          <div style={remarksHeadingStyle} className="mt-2">investigations</div>
          <div style={remarksStyle}>
            {stateParamVal?.e?.checkups?.[0]?.presentlyComplaining || "N/A"}
          </div>
        </div>
        <div style={{ width: "86%" }}>
          <div style={remarksHeadingStyle} className="mt-2">Treatment</div>
          <div style={remarksStyle}>
            {stateParamVal?.e?.checkups?.[0]?.treatment || "N/A"}
          </div>
        </div>
      </div>
        </div>
        <div style={{ width: "72%" }}>
          <table style={tableStyle}>
            <thead style={{backgroundColor: "white"}}>
              <tr>
                <th style={{...headerCellStyle, ...firstCellStyle}}>Name</th>
                <th style={headerCellStyle}>Type</th>
                <th style={headerCellStyle}>Qty Req</th>
                <th style={{...headerCellStyle, ...lastCellStyle}}>Med Timing</th>
              </tr>
            </thead>
            <tbody style={{fontSize: "13px"}}>
              {stateParamVal?.e?.checkups?.[0]?.priscriptions?.map((medicine, index) => (
                renderMedicineInfo(medicine)
              ))}
            </tbody>
          </table>
        </div>
      </div>
     
    </div>
  );
};

export default PrintPrescriptions;
