import React from "react";
import calender from "../../../assets/images/1.svg";
import warrent from "../../../assets/images/1.svg";
import prisoners from "../../../assets/images/1.svg";

const PrintHearingInfo = ({ statsData }) => {

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
  
  };

  const paperStyle = {
    margin: "auto",
    width: "595.2756px",
    height: "841.8898px",
  };

  const mainHeadingStyle = {
    color: "#000000",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "normal",
  };
  const mainHeadingdetail = {
    color: "#000000",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
  };

  const marginStyle = {
    margin: "26px 0px 0px 0px",
  };

  const rowStyle = {
    display: "flex",
    clear: "both",
  };

  const column1Style = {
    width: "144px",
    height: "47px",
    color: "#2E3192",
    margin: "0px 35px 0px 35px",
    textAlign: "center",
    borderRadius: "16px",
    fontSize: "12px",
  };

  const column2Style = {
    ...column1Style,
    height: "5px",
    margin: "0px 35px 8px 35px",
  };

  const column3Style = {
    ...column1Style,
    height: "32px",
    backgroundColor: "#000000",
    color: "white",
    margin: "5px 35px 0px 35px",
  };
  const column6Style = {
    width: "144px",
    height: "32px",
    backgroundColor: "#ffffff",
    color: "#2E3192",
    margin: "8px 0px 0px 36px",
    textAlign: "left",
    border: "2px solid #2E3192",
    lineHeight: "32px",
    textIndent: "10px",
  };

  const column7Style = {
    ...column6Style,
    width: "369px",
    margin: "8px 19px 0px 11px",
  };

  const column8Style = {
    width: "144px",
    height: "32px",
    color: "#2E3192",
    margin: "10px 0px 0px 36px",
    textAlign: "left",
    lineHeight: "32px",
    fontWeight: "bold",
    textIndent: "20px",
  };

  const column9Style = {
    ...column6Style,
    width: "369px",
    margin: "10px 19px 0px 11px",
    borderRadius: "16px",
    height: "auto!important",
    maxHeight: "160px",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": "5",
    "-webkit-box-orient": "vertical",
    whiteSpace: "normal",
    textOverflow: "ellipsis",
  };


  const signatureStyle = {
    width: "150px",
    borderTop: "2px solid #000000",
    position: "relative",
    top: "350px",
    marginLeft: "400px",
    textAlign: "center",
    paddingTop: "5px",
  };

  const tableTextStyle = {
    fontSize: "12px",
  };

  const tableHeaderStyle = {
    backgroundColor: "#000000",
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    padding: "8px",
    fontSize: "14px",
    border: "2px solid #000000", 
  };

  const tableCellStyle = {
    borderTop: "2px solid #000000",
    borderBottom: "2px solid #000000",
    padding: "8px",
    textAlign: "center",
    color: "#2E3192",
    fontSize: "13px",
    fontWeight: "semibold",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    borderLeft: "2px solid #000000", 
    borderRight: "2px solid #000000", 
  };

  const matchedOfficers = statsData?.details?.checkPoliceOfficers.map((officer) => {
    const matchedGuard = statsData?.gaurdsInfo.find(
      (guard) => guard.id === officer.policeOfficerId
    );
    return matchedGuard ? (
      <tr key={matchedGuard.id}>
        <td style={tableCellStyle}>{matchedGuard.beltNumber || "-----"}</td>
        <td style={tableCellStyle}>{matchedGuard.name || "-----"}</td>
        <td style={tableCellStyle}>{matchedGuard.mobileNumber || "-----"}</td>
        <td style={tableCellStyle}>{matchedGuard.designation || "-----"}</td>
        <td style={tableCellStyle}>{"     "}</td>
      </tr>
    ) : null;
  });

  return (
    <div style={containerStyle}>
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
      <div style={paperStyle}>
        <h1 style={mainHeadingStyle}>Prisons Department Of</h1>
        <h1 style={mainHeadingdetail}>{process.env.REACT_APP_PRISON_NAME}</h1>
        <div style={marginStyle}>
          <div style={rowStyle}>
            <div style={column1Style}>
              <img src={prisoners} alt="Prisoners Icon" style={{paddingTop: "8px"}} height="30px" />
            </div>
            <div style={column1Style}>
              <img src={warrent} alt="warrent Icon" />
            </div>
            <div style={column1Style}>
              <img src={calender} alt="calender Icon" />
            </div>
          </div>
          <div style={rowStyle}>
            <div style={column2Style}>Total Prisoners</div>
            <div style={column2Style}>Total Warrents</div>
            <div style={column2Style}>Check-out-Date</div>
          </div>
          <div style={rowStyle}>
            <div style={column3Style}>
              <h2 style={tableTextStyle}>{statsData?.totalPrionsers || 4}</h2>
            </div>
            <div style={column3Style}>
              <h2 style={tableTextStyle}>{statsData?.totalWarrants || 5}</h2>
            </div>
            <div style={column3Style}>
              <h2 style={tableTextStyle}>{statsData?.checkoutDate || "2024-08-03"}</h2>
            </div>
          </div>
          <div style={rowStyle} className="mt-2">
            <div style={column8Style}>Vehicle number</div>
            <div style={column9Style}>{statsData?.vehicleNumber || "-----"}</div>
          </div>
          <div style={rowStyle}>
            <div style={column8Style}>Other Details</div>
            <div style={column9Style}>{statsData?.otherDetails || "-----"}</div>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Belt Number</th>
                <th style={tableHeaderStyle}>Guard Name</th>
                <th style={tableHeaderStyle}>Mobile Number</th>
                <th style={tableHeaderStyle}>Designation</th>
                <th style={tableHeaderStyle}>Signature</th>
              </tr>
            </thead>
            <tbody>
              {matchedOfficers}
            </tbody>
          </table>
          <div style={signatureStyle}>
            Signature
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintHearingInfo;
