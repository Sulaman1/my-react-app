import React from "react";

const ShowNoOfRecords = ({ setPageLimit, totalNoOfRecords, type }) => {

  return (
    <>
      <label style={{"position":"absolute"}}>Total { type || `Prisoners`}: {totalNoOfRecords}</label>
      <select
        className="form-select select-dropdown-entires"
        aria-label="Default select example"
        style={{ width: "180px" }}
        onChange={(e) => {
          setPageLimit(e.target.value);
        }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>

    
    </>
  );
};

export default ShowNoOfRecords;
