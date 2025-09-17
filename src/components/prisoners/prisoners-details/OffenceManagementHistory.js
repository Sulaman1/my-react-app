import { Grid, _ } from "gridjs-react";
import React, { useEffect, useRef, useState } from "react";
import {
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";

const OffenceManagementHistory = ({ offence }) => {
  const gridRef = useRef(null);
  const [loadedEducationEntries, setEducationEntries] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const EducationHeaders = [
    {
      "Offence (تعلیم)": "",
      "offence Type (جرم کی قسم)": "",
      "Discription (تفصیل)": "",
      "remarks (ریمارکس)": "",
      "Offence Date (جرم کی تاریخ)": "",
    },
  ];

  const loadData = () => {
    if (offence?.prisonerAdmission?.prisonerOffenses?.length > 0) {
      const filteredData = offence?.prisonerAdmission?.prisonerOffenses?.map(
        (e) => {
          return {
            offense: e?.offense?.name,
            offenseType: e?.offense?.offenseType,
            description: e?.offense?.description,
            remarks: e?.remarks,
            offenseDate: validateDate(e?.offenseDate),
          };
        }
      );
      setEducationEntries(transformDataForTableGrid(filteredData));
    } else {
      setEducationEntries([]);
    }
  };

  return (
    <>
      <Grid
        ref={gridRef}
        data={loadedEducationEntries}
        columns={Object.keys(EducationHeaders[0])}
        search={true}
        sort={true}
        pagination={{
          enabled: true,
          limit: 10,
        }}
      />
    </>
  );
};

export default OffenceManagementHistory;
