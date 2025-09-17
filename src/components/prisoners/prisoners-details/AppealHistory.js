import { Grid, _ } from "gridjs-react";
import React, { useRef } from "react";

const AppealHistory = ({ loadedAppealEntries }) => {
  console.log(loadedAppealEntries, "loadedAppealEntries");
  const gridRef = useRef(null);

  const EducationHeaders = [
    {
      "Court (عدالت)": "",
      "Remarks (ریمارکس)": "",
      "Fir No (فیر نمبر)": "",
      "Appeal Date (اپیل کی تاریخ)": "",
      "Appeal No (اپیل نمبر)": "",
      "Preference (ترجیح)": "",
      "Appeal Type (اپیل قسم)": "",
      "Appeal Status (اپیل وضعیت)": "",
      "Decision Date (تصدیق کی تاریخ)": "",
      "Appeal Document (اپیل داکیومنٹ)": "",
    },
  ];

  return (
    <>
    {loadedAppealEntries?.length > 0 ?(
    <div className="custom-card">
      <Grid
        ref={gridRef}
        data={loadedAppealEntries}
        columns={Object.keys(EducationHeaders[0])}
        search={true}
        sort={true}
        pagination={{
          enabled: true,
          limit: 10,
        }}
        />
        </div>
    ):(<>
        <div className=" custom-card">
        <h4 className="third-heading">
        {" "}
        <b>No Records Found</b>
      </h4>
          </div>
      
      </>
    )}
    </>
  );
};

export default AppealHistory;
