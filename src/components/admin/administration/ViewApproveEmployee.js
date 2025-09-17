import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ changed
import { Grid, _ } from "gridjs-react";

import {
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import { baseImageUrl, getData, postData } from "../../../services/request";
import swal from "sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../../store/loader";
import Print from "../search/Print";

const mockUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU";

const ViewApproveEmployee = (props) => {
  const gridRef = useRef();
  const navigate = useNavigate(); // ✅ new hook
  const [userData, setUserData] = useState([]);
  const [newUserData, setNewUserData] = useState([]);
  const dispatch = useDispatch();
  const userMeta = useSelector((state) => state.user);
  const userId = JSON.parse(sessionStorage.getItem("user")).userId;

  const EmpData = [
    {
      "Profile Pic (تصویر)": "",
      "Employee Number (سٹاف نمبر)": "atariq",
      "Full Name (نام)": "Abdullah",
      "Username (صارف کا نام)": "Abdullah Tariq",
      "Role (کردار)": "Abdullah Tariq",
      "Prison (جیل)": "",
      "Designation (عہدہ)": true,
      "Department (شعبہ)": "Tariq",
      "BPS (بی پی ایس)": "Abdullah Tariq",
      "Actions (عملدرامد)": "",
    },
  ];

  const PrisonerData = [
    {
      "Profile Pic (تصویر)": "",
      "Prisoner Number": "Convict-2020",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relation Name": "",
      "Darban Date (دربان کی تاریخ)": "",
      "CNIC (شناختی کارڈ نمبر)": "",
      "Actions (عملدرامد)": "",
    },
  ];

  const SAPrisonerData = [
    {
      "Profile Pic (تصویر)": "",
      "Prisoner Number": "Convict-2020",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relation Name": "",
      "Darban Date (دربان کی تاریخ)": "",
      "CNIC (شناختی کارڈ نمبر)": "",
      "Prison Name (جیل)": "",
      "Actions (عملدرامد)": "",
    },
  ];

  const loadData = () => {
    getData(
      `${
        props?.tab == 1
          ? props?.activeUrl
          : props?.tab == 2
          ? props?.inactiveNewUrl
          : props?.inactiveOldUrl
      }?userId=${userId}`,
      "",
      true
    )
      .then((result) => {
        if (result && result.result?.isSuccessful) {
          const data = result.result.data;
          if (data.length > 0) {
            const uniquePrisonNames = [...new Set(data.map((e) => e.prison))];
            const filterdData = data.map((e) => {
              const prisonName =
                uniquePrisonNames.length > 0 ? e.prison : "Multiple Prisons";

              return {
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
                userName: e.userName,
                role: e.role,
                prisonName: _(
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      title={
                        e?.prison?.split(",")?.length > 1
                          ? uniquePrisonNames?.join(", ")
                          : ""
                      }
                    >
                      {e?.prison?.split(",")?.length > 1
                        ? "Multiple prisons"
                        : prisonName}
                    </span>
                  </div>
                ),
                designation: e.designation,
                department: e.department,
                bps: e.bps,
                Action: _(
                  <div className="action-btns">
                    {props?.tab == 2 ? (
                      <button
                        id={"view-more-btn"}
                        className="tooltip btn btn-danger waves-effect waves-light mx-1"
                        type="button"
                        onClick={() => {
                          handleDeactive(e);
                        }}
                      >
                        <i className="icon-add"></i>
                        <span> De-Activate </span>
                      </button>
                    ) : (
                      <button
                        id={"view-more-btn"}
                        className="tooltip btn btn-success waves-effect waves-light mx-1"
                        type="button"
                        onClick={() => {
                          handleActivate(e);
                        }}
                      >
                        <i className="icon-add"></i>
                        <span>Activate </span>
                      </button>
                    )}
                  </div>
                ),
              };
            });
            setUserData(transformDataForTableGrid(filterdData));
            setNewUserData(data);
            const gridjsInstance = gridRef.current.getInstance();
            gridjsInstance.on("rowClick", (...args) => {});
          } else {
            setUserData([]);
          }
        } else {
          setUserData([]);
          console.error("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeactive = (e) => {
    swal({
      title: "Are you sure?",
      text: "This action will deactivate the user. Are you sure you want to proceed?",
      icon: "warning",
      buttons: ["Cancel", "Deactivate"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        postData(
          `/services/app/EmployeeAppServices/DeactivateUser?userId=${e?.userId}`
        )
          .then((result) => {
            if (result && result.success) {
              swal(
                "Deactivated",
                "The user has been successfully deactivated.",
                "success"
              );
              loadData();
            } else {
              swal("Error", "Failed to deactivate the user.", "error");
            }
          })
          .catch(() => {
            swal(
              "Error",
              "An error occurred while deactivating the user.",
              "error"
            );
          });
      }
    });
  };

  const handleActivate = (e) => {
    swal({
      title: "Are you sure?",
      text: "This action will activate the user. Are you sure you want to proceed?",
      icon: "warning",
      buttons: ["Cancel", "Activate"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        postData(
          `/services/app/EmployeeAppServices/ActivateUser?userId=${e?.userId}`
        )
          .then((result) => {
            if (result && result.success) {
              swal(
                "Activated",
                "The user has been successfully activated.",
                "success"
              );
              loadData();
            } else {
              swal("Error", "Failed to activate the user.", "error");
            }
          })
          .catch(() => {
            swal(
              "Error",
              "An error occurred while activating the user.",
              "error"
            );
          });
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const newData = newUserData.map((x) => {
    if (props.isPrisoner) {
      return {
        category: x.prisonerNumber,
        fullName: x.fullName,
        relationshipType: x?.relationshipType,
        relationshipName: x.relationshipName,
        DarbanDate: validateDate(x.darbanAdmissionDate),
        cnic: x.cnic,
      };
    } else {
      return {
        "Employee No": x.employeeNumber,
        "full Name": x.fullName,
        "User Name": x.userName,
        Role: x.role,
        Designation: x.designation,
        Department: x.department,
        BPS: x.bps,
      };
    }
  });
  let file = props.isPrisoner ? "Prisoner List" : "Employee List";

  return (
    <>
      <div className="row gridjs">
        <Print data={newData} filename={file} />
        <div className="col-xl-12 p-0">
          <div className="card custom-card animation-fade-grids custom-card-scroll">
            <div className="row ">
              <div className="col">
                <Grid
                  ref={gridRef}
                  data={userData}
                  columns={
                    props.isPrisoner
                      ? Object.keys(
                          userMeta?.role === "Super Admin"
                            ? SAPrisonerData[0]
                            : PrisonerData[0]
                        )
                      : Object.keys(EmpData[0])
                  }
                  search={true}
                  sort={true}
                  pagination={{
                    enabled: true,
                    limit: 10,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApproveEmployee;
