import React, { useEffect, useRef, useState } from "react";
import { baseImageUrl, postData } from "../../services/request";
import { transformDataForTableGrid, validateDate } from "../../common/Helpers";
import ProfilePic from "../../assets/images/users/1.jpg";
import { Grid, _ } from "gridjs-react";
import { useSelector } from "react-redux";
import Print from "../../components/admin/search/Print";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";

const ViewUpComingRetirements = () => {
  const [entries, setEntries] = useState([]);
  const userMeta = useSelector((state) => state.user);
  const isAdmin = userMeta?.role === "Super Admin" || userMeta?.role === "Inspector General Prisons" || userMeta?.role === "DIG Prisons" || userMeta?.role === "Admin";
  const gridRef = useRef();
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const generateGridCols = () => {
    const gridCols = {
      "profile pic": "",
      "Username": "",
      "BPS": "",
      "Full Name": "",
      "Department": "Abdullah",
      "Designation": "",
      "Employee Number": "",
      "Role": "17301-5838517-9",
      "Retirement Date": "2022-04-14T00:00:00+05:00",
      "Retirement Days Left": "",
      "Service Status": "",
    };
    if (isAdmin) {
      gridCols["Prison Name"] = "";
    }
    return gridCols;
  };

  const loadData = (payload) => {
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const requestData = {
      maxResults: payload?.maxResults || pageLimit,
      skipCount: 0,
      userId: parsedId,
      name: payload?.name || '',
      category: payload?.category || 0,
      year: payload?.year || 0,
      prsNumber: payload?.prsNumber || 0,
      relationshipName: payload?.relationshipName || '',
      cnic: payload?.cnic || '',
      genderId: payload?.genderId || 0,
      policeStationId: payload?.policeStationId || 0,
      firYear: payload?.firYear || 0,
    };
    postData(
      "/services/app/EmployeeAppServices/UpcomingRetirements",
       requestData
    )
      .then((result) => {
        try {
          if (result && result.success) {
            const data = result.result.data;
            setTotalNoOfRecords(data.length)
            if (data && data.length > 0) {
              setEntries(data);
              const gridjsInstance = gridRef.current.getInstance();
              gridjsInstance.on("rowClick", (...args) => {
                console.log("row: ", args);
              });
            } else {
              setEntries([]);
            }
          } else {
            console.error("Something went wrong");
          }
        } catch (error) {
          console.error(
            "Error while processing API response SearchPrisonerUpcomingRelease:",
            error
          );
        }
      })
      .catch((error) => {
        
        console.log("API Error:", error);
      });
  };

  const gridMapData = (entries) => {
    const filterdData = entries.map((e) => {
      const obj = {};
      obj["profile"] = _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${e.imgUrl ? baseImageUrl + e.imgUrl : ProfilePic}`}
              width="50"
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.imgUrl ? baseImageUrl + e.imgUrl : ProfilePic}`}
            width="50"
          />
        </div>
      );
      obj["Username"] = e.userName;
      obj["bps"] = e.bps ;
      obj["fullName"] = e.fullName;
      obj["department"] = e.department;
      obj["designation"] = e.designation;
      obj["employeeNumber"] = e.employeeNumber;
      obj["role"] = e.role;
      obj["retirementDate"] = validateDate(e.retirementDate) || '' ;
      obj["retirementdaysleft"] = e.retirementDaysLeft;
      obj["serviceStatus"] = e.serviceStatus;
      obj["prisonName"] = e.prison;

     
      return obj;
    });
    const data = transformDataForTableGrid(filterdData);
    return data;
  };

  const prepareCSVData = () => {
    return entries.map(e => ({
      "Username": e.userName,
      "BPS": e.bps,
      "Full Name": e.fullName,
      "Department": e.department,
      "Designation": e.designation,
      "Employee Number": e.employeeNumber,
      "Role": e.role,
      "Retirement Date": validateDate(e.retirementDate) || '',
      "Retirement Days Left": e.retirementDaysLeft,
      "Service Status": e.serviceStatus,
      "Prison Name": isAdmin ? e.prison : ''
    }));
  };

  return (
    <>
      <h3 class="third-heading">
        <span style={{ fontWeight: "bold" }}>UpComing Retirements</span>
      </h3>
      <Print 
        data={prepareCSVData()}
        headers={Object.keys(generateGridCols()).filter(header => header !== "profile pic")}
        filename="UpcomingRetirements.csv"
      />
      <div className="row">
        <div className="col">
        <div className="float-end">
            <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} isEmployee={true} />
        </div>
        <Grid
          ref={gridRef}
          data={gridMapData(entries)}
          columns={Object.keys(generateGridCols())}
          search={true}
          sort={true}
          pagination={{
            enabled: true
          }}
        />
      </div>
      </div>
    </>
  );
};

export default ViewUpComingRetirements;
