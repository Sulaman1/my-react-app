import React from "react";

const TimezoneAlert = (props) => {
    const zone = new Date().toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'long' }).substring(4)
  return (
    <>
       <div class="alert alert-danger material-shadow" role="alert" style={{"zIndex":"1", "marginBottom": "0"}}>
       Your current system timezone is set to <strong> {zone} Zone</strong>. Please change your system settings to <b>Pakistan Standard Time</b>.
    </div>
    </>
  );
};

export default TimezoneAlert;
