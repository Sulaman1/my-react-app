import { useRef, useEffect, useState } from "react";
import { Grid, _ } from "gridjs-react";
import swal from "sweetalert";
import { transformDataForTableGrid } from "../../../../common/Helpers";
import Print from "../../../../components/admin/search/Print";
import { baseImageUrl, getData, postData } from "../../../../services/request";


const generateGridCols = () => {
  const cols = {
    "Profile pic (تصویر)": "",
    "Employee No (سٹاف نمبر)": "",
    "Full Name (نام)": "",
  };
  cols["Username (صارف کا نام)"] = "";
  cols["Role (کردار)"] = "";

  cols["Designation (عہدہ) "] = "";
  cols["Department (شعبہ)"] = "";
  cols["BPS (بی پی ایس)"] = "";
  cols["Action (عملدرامد)"] = "";
  return Object.keys(cols);
};

const mockUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU";

const ViewInventoryItems = ({
  btnTitle,
  setActiveTab,
  getURL,
  hr,
  apiEndpoint,
  successMsg,
  leaves,
  approval,
}) => {
  const [entries, setEntries] = useState([]);
  const gridRef = useRef(null);
  const [newUserData, setNewUserData] = useState([]);

  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    const rawData = sessionStorage.getItem("user");
    const userId = JSON.parse(rawData).userId;

    try {
      

      const hasQuery = getURL === "GetAllEmployee";

      const url = `/services/app/EmployeeAppServices/${getURL}${hasQuery ? `?userId=${userId}` : ""
        }`;

      const method = hasQuery ? getData : postData;

      const res = await method(url, "", true);

      console.log("ENTRIES >>>", res);
      if (res.success && res.result?.isSuccessful) {
        

        const data = res.result.data;

        if (data.length > 0) {
          setEntries(data);
          setNewUserData(data);
        } else {
          setEntries([]);
        }
      } else {
        await swal(
          res.error?.message || "An error occured",
          res.error?.details || "",
          "warning"
        );
        
      }
    } catch (err) {
      console.log("Error", err);
      await swal("Something went wrong!", "", "warning");
      
    }
  };

  const handleClick = async (empEntry) => {
    console.log("EMPLOYEE", empEntry);
      sessionStorage.setItem("empMedicalEntry", JSON.stringify(empEntry));
      setActiveTab(1);
  };

  const gridDataMap = (e) => {

    const mapObj = {
      imgURL: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = mockUrl;
              }}
              className="avatar-xs rounded-circle "
              src={`${e.imgUrl ? baseImageUrl + e.imgUrl : mockUrl}`}
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = mockUrl;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.imgUrl ? baseImageUrl + e.imgUrl : mockUrl}`}
            width="50"
          />
        </div>
      ),
      employeeNumber: e.employeeNumber,
      fullName: e.fullName,
    };

      mapObj["username"] = e.userName;
      mapObj["role"] = e.role;

    mapObj["designation"] = e.designation;
    mapObj["department"] = e.department;
    mapObj["bps"] = e.bps;
    mapObj["Actions"] = _(
      <div className="action-btns">
        <button
          id={"view-details-btn"}
          type="button"
          onClick={handleClick.bind(this, e)}
          className="btn btn-success p-2 tooltip"
        >
              {btnTitle}
        </button>
      </div>
    );
    return mapObj;
  };

  const newData = newUserData.map((x) => {
    return {
      "Employee No": x.employeeNumber,
      "Full Name": x.fullName,
      Designation: x.designation,
      Department: x.department,
      BPS: x.bps,
    };
  });

  let file = leaves
    ? "Leaves"
    : hr
      ? "Attendance"
      : approval
        ? "Approval"
        : "List";

  return (
    <>


      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <Print data={newData} filename={file} />
        <div className="row">
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry))
            )}
            columns={generateGridCols()}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ViewInventoryItems;
