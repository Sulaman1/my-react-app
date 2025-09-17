import React, { useEffect, useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Grid, _ } from "gridjs-react";
import Print from "../../../components/admin/search/Print";
import AllSearch from "../search/AllSearch";

import {
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import {
  baseImageUrl,
  deleteData,
  getData,
  postData,
} from "../../../services/request";
import swal from "sweetalert";
import InputWidget from "../../../droppables/InputWidget";
import { useSelector, useDispatch } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../../store/loader";
import { CSVLink } from "react-csv";
import ChangePassword from "../../profile-settings/ChangePassword";
import Modal from "react-bootstrap/Modal";
import ShowNoOfRecords from "../../../common/ShowNoOfRecords";

const mockUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU";
const ViewEmployee = (props) => {
  //const history = useHistory();
  const navigate = useNavigate();
  const gridRef = useRef();
  const [isOpen, setIsOpen] = React.useState(false);
  const [userData, setUserData] = useState([]);
  const [isEmployee] = useState([true]);
  const [modalTitle, setModalTitle] = useState("Change Password");
  const [newUserData, setNewUserData] = useState([]);
  const dispatch = useDispatch();
  const userMeta = useSelector((state) => state.user);
  const isSp = userMeta?.role === "Prison Superintendent";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isDig = userMeta?.role === "DIG Prisons";
  const isHr = userMeta?.role === "HR Branch";
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  /*
  Steps
  1. declare payload const if not declare
  2. copy paste filter numbers
  3. copy paste html from metaLookup
  4. make grid dynamic with payload.WHATEVER
  */
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
      "PMIS User (پی ایم آئی ایس صارف)": "NO",
      "Employment Status": "",
      // "Seniority": "",
      "Actions (عملدرامد)": "",
    },
  ];

  const PrisonerData = [
    {
      "Profile Pic (تصویر)": "",
      "Prisoner Number": "Convict-2020",
      // "Year (سال)": "",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relation Name": "",
      "Darban Date (دربان کی تاریخ)": "",
      "CNIC (شناختی کارڈ نمبر)": "",
      "Has Opposition (مخالفت ہے؟)": "",
      "condemend": "",
      "Escaped": "",
      "High Profile": "",
      "Multiple Case": "",
      "Warrants (وارنٹ)": "",
      // 'category': '',
      "Transferred (منتقل کیا گیا)": "",
      "Actions (عملدرامد)": "",
    },
  ];

  const SAPrisonerData = [
    {
      "Profile Pic (تصویر)": "",
      "Prisoner Number": "Convict-2020",
      // "Year (سال)": "",
      "Full Name (نام)": "",
      "Relationship Type": "",
      "Relation Name": "",
      "Darban Date (دربان کی تاریخ)": "",
      "CNIC (شناختی کارڈ نمبر)": "",
      "Has Opposition (مخالفت ہے؟)": "",
      "condemend": "",
      "Escaped": "",
      "High Profile": "",
      "Multiple Case": "",
      "Warrants (وارنٹ)": "",
      "Transferred (منتقل کیا گیا)": "",

      "Prison Name (جیل)": "",
      "Actions (عملدرامد)": "",
    },
  ];
  const rawData = sessionStorage.getItem("user");
  const parsedId = JSON.parse(rawData).userId;
  const handleAllDeatails = (e) => {
    navigate(`/admin/prisoner/prisoner-details/${e.id}`,{
      state: {
        ignoreRedirect: true,
      },
    });
  };
  const showModal = () => {
    setIsOpen(true);
  };
  const hideModal = () => {
    setIsOpen(false);
  };
  const loadData = () => {
    if (props.isPrisoner) {
      
      const rawData = sessionStorage.getItem("user");
      const parsedId = JSON.parse(rawData).userId;
      const obj = {
        userId: parsedId,
        name: "",
        category: 0,
        prisonId: 0,
        year: 0,
        prsNumber: 0,
        relationshipName: "",
        genderId: 0,
        policeStationId: 0,
        firYear: 0,
        prisonerStatusId: 0,
        searchTypeId: 0,
        maxResults: pageLimit
      };
      postData("/services/app/PrisonerSearch/SearchDarbanEntries", obj)
        .then((result) => {
          if (result && result.result.isSuccessful) {
            const data = result.result.data;
            setTotalNoOfRecords(result.result?.totalPrisoners)
            if (data.length > 0) {
              const filterdData = data.map((e) => {
                if (userMeta?.role === "Super Admin") {
                  return {
                    profile: _(
                      <div className="profile-td profile-td-hover">
                        <div className="pic-view">
                          <img
                            onError={(ev) => {
                              ev.target.src = mockUrl;
                            }}
                            className="avatar-xs rounded-circle "
                            src={`${
                              e.frontPic ? baseImageUrl + e.frontPic : mockUrl
                            }`}
                          />
                        </div>
                        <img
                          onError={(ev) => {
                            ev.target.src = mockUrl;
                          }}
                          className="avatar-xs rounded-circle "
                          src={`${
                            e.frontPic ? baseImageUrl + e.frontPic : mockUrl
                          }`}
                          width="50"
                        />
                      </div>
                    ),
                    prisonerNumber: e.prisonerNumber,
                    // year: e.year,
                    fullName: e.fullName,
                    relationshipType: e?.relationshipType,
                    relationshipName: e.relationshipName,
                    darbanDate: validateDate(e.darbanAdmissionDate),
                    cnic: e.cnic,
                    hasOpposition: e.hasOpposition ? "Yes" : "No",
                    condemend: _(
                      <span style={{ color: e.condemend ? "red" : "inherit" }}>
                        {e.condemend ? "Yes" : "No"}
                      </span>
                    ),
                    isEscaped: e.isEscaped ? "Yes" : "No",
                    highProfile: e.highProfile ? "Yes" : "No",
                    hasManyCases: e.hasManyCases ? "Yes" : "No",
                    noOfWarrantsUponAdmission: e.noOfWarrantsUponAdmission,
                    isTransferred: e.isTransferred ? "yes" : "No",
                    prisonName: e.prisonName,
                    Actions: _(
                      <div className="action-btns">
                        <button
                          id={"Initiate-btn"}
                          type="button"
                          onClick={() => {
                            handleEditBtn(e);
                          }}
                          className="tooltip  btn  btn-warning waves-effect waves-light"
                        >
                          <i className="icon-next"></i>
                          <span>Initiate Admission</span>
                        </button>
                        {e.isTransferred &&
                        <button
                          id={"view-more-btn"}
                          className="tooltip btn btn-prim waves-effect waves-light mx-1"
                          type="button"
                          onClick={() => handleAllDeatails(e)}
                        >
                          <i className="icon-show-password"></i>
                          <span>View More</span>
                        </button>
                  }
                      </div>
                    ),
                  };
                } else {
                  return {
                    profile: _(
                      <div className="profile-td profile-td-hover">
                        <div className="pic-view">
                          <img
                            onError={(ev) => {
                              ev.target.src = mockUrl;
                            }}
                            className="avatar-xs rounded-circle "
                            src={`${
                              e.frontPic ? baseImageUrl + e.frontPic : mockUrl
                            }`}
                          />
                        </div>

                        <img
                          onError={(ev) => {
                            ev.target.src = mockUrl;
                          }}
                          className="avatar-xs rounded-circle "
                          src={`${
                            e.frontPic ? baseImageUrl + e.frontPic : mockUrl
                          }`}
                          width="50"
                        />
                      </div>
                    ),
                    prisonerNumber: e.prisonerNumber,

                    fullName: e.fullName,
                    relationshipType: e?.relationshipType,
                    relationshipName: e.relationshipName,
                    darbanDate: validateDate(e.darbanAdmissionDate),
                    cnic: e.cnic,
                    hasOpposition: e.hasOpposition ? "Yes" : "No",
                    condemend: _(
                      <span style={{ color: e.condemend ? "red" : "inherit" }}>
                        {e.condemend ? "Yes" : "No"}
                      </span>
                    ),
                    isEscaped: e.isEscaped ? "Yes" : "No",
                    highProfile: e.highProfile ? "Yes" : "No",
                    hasManyCases: e.hasManyCases ? "Yes" : "No",
                    noOfWarrantsUponAdmission: e.noOfWarrantsUponAdmission,
                    isTransferred: e.isTransferred ? "yes" : "No",
                    Actions: _(
                      <div className="action-btns">
                        <button
                          id={"initiate-btn-two"}
                          type="button"
                          onClick={() => {
                            handleEditBtn(e);
                          }}
                          className="tooltip  btn  btn-warning waves-effect waves-light"
                        >
                          <i className="icon-next"></i>
                          <span>Initiate Admission</span>
                        </button>
                        {e.isTransferred &&
                        <button
                          id={"view-more-btn-two"}
                          className="tooltip btn btn-success waves-effect waves-light mx-1"
                          type="button"
                          onClick={() => handleAllDeatails(e)}
                        >
                          <i className="icon-show-password"></i>
                          <span>view</span>
                        </button>}
                      </div>
                    ),
                  };
                }
              });

              setUserData(transformDataForTableGrid(filterdData));
              setNewUserData(data);
            }
          } else {
            console.error("something went wrong");
            setUserData([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const employeeApi = "/services/app/EmployeeAppServices/GetAllEmployee";
      getData(
        `${
          props?.tab == 1
            ? employeeApi
            : props?.tab == 3
            ? props?.inActiveUrl
            : employeeApi
        }`,
        "",
        true,
        
      )
        .then((result) => {
          if (result && result.success) {
            const data = result.result.data;
            if (data.length > 0) {
              setTotalNoOfRecords(data.length)
              const uniquePrisonNames = [...new Set(data.map(e => e.prison))];
              const filterdData = data.map((e) => {
                const id = e.userId == 0 ? e.id+'&' : e.userId; // for Non-PMIS users
              
                const prisonName = uniquePrisonNames.length > 0 ? e.prison : "Multiple Prisons";
                return {
                  imgURL: _(
                    <div className="profile-td profile-td-hover">
                      <div className="pic-view">
                        <img
                          onError={(ev) => {
                            ev.target.src = mockUrl;
                          }}
                          className="avatar-xs rounded-circle "
                          src={`${
                            e.imgUrl ? baseImageUrl + e.imgUrl : mockUrl
                          }`}
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
                    <div style={{whiteSpace: "nowrap", overflow:"hidden", textOverflow: "ellipsis"}}>
                    <span  title={e?.prison?.split(',')?.length > 1 ? uniquePrisonNames?.join(', ') : ""}>{e?.prison?.split(',')?.length > 1 ? "Multiple prisons" : prisonName}</span>
                    </div>
                  ),
                  designation: e.designation,
                  department: e.department,
                  bps: e.bps,
                  PMISUser: e.isPmisUser,
                  serviceStatus: e?.serviceStatus,
                  // seniority: e?.seniority,
                  Action: _(
                    <div className="action-btns">
                      {props?.tab == 3 ? (
                         <button
                         id={"edit-btn"}
                         type="button"
                         onClick={() => {
                           handleEditBtn(e);
                         }}
                         className="tooltip  btn btn-warning waves-effect waves-light tooltip"
                       >
                         <i className="icon-edit"></i>
                         <span>Edit</span>
                       </button>
                      ) : (
                        <>
                          {" "}
                          {!isSp && !isIG && !isDig && (
                            <>
                              <button
                                id={"edit-btn"}
                                type="button"
                                onClick={() => {
                                  handleEditBtn(e);
                                }}
                                className="tooltip  btn btn-warning waves-effect waves-light tooltip"
                              >
                                <i className="icon-edit"></i>
                                <span>Edit</span>
                              </button>
                            {!isHr &&
                              <button
                                type="button"
                                onClick={() => {
                                  showModal();
                                  handlePassBtn(e);
                                  setModalTitle("Reset Password");
                                }}
                                className="tooltip btn btn-danger waves-effect waves-light mx-1"
                              >
                                <i className="icon-password"></i>
                                <span>Reset Password</span>
                              </button>}
                            </>
                          )}
                          <button
                            id={"view-more-btn"}
                            className="tooltip btn btn-prim waves-effect waves-light mx-1"
                            type="button"
                            onClick={() => {
                              navigate(
                                `/admin/administration/employee-details/${id}`
                              );
                            }}
                          >
                            <i className="icon-show-password"></i>
                            <span>View More </span>
                          </button>
                        </>
                      )}
                    </div>
                  ),
                };
              });
              setUserData(transformDataForTableGrid(filterdData));
              setNewUserData(data);
              const gridjsInstance = gridRef.current.getInstance();
              gridjsInstance.on("rowClick", (...args) => {
              });
            } else {
              setUserData([]);
            }
          } else {
            console.error("something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handlePassBtn = (e) => {
    sessionStorage.setItem("selectedEmp", JSON.stringify(e));
  };
  const handleEditBtn = (e) => {
    if (props.isPrisoner) {
      sessionStorage.setItem("selectedPrisoner", JSON.stringify(e));
    } else {
      sessionStorage.setItem("selectedEmp", JSON.stringify(e));
    }
    props.setActiveTab(1);
  };
  const handleDelBtn = (item) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete: " + item.fullName,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (willDelete) => {
      if (willDelete) {
        swal("Deleted!", "", "success").then((result) => {
          const url = props.isPrisoner
            ? "/services/app/EmployeeAppServices/DeleteEmployee?input="
            : "/services/app/EmployeeAppServices/DeleteEmployee?input=";
          deleteData(url + item.id)
            .then((res) => {
              if (res.success == true) {
                loadData();
              }
            })
            .catch((err) => {
              console.log("error while deleting employee or prisoner", err);
            });
        });
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [pageLimit]);
  const [payload, setPayload] = useState({});
  const filterType = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
  ];

  // function to handle the search submission
  const handleSubmit = (payload) => {
    dispatch(setLoaderOn());
    const { userId } = JSON.parse(sessionStorage.getItem("user"));
    const reqPayload = {
      ...payload,
      userId,
      maxResults: pageLimit
    };

    const searchUrl = props.isPrisoner
      ? "/services/app/PrisonerSearch/SearchDarbanEntries"
      : "/services/app/EmployeeAppServices/SearchEmployees";

    postData(searchUrl, reqPayload)
      .then((result) => {
        if (result && result.success) {
          const data = result.result.data;
          setTotalNoOfRecords(props.isPrisoner ? result.result?.totalPrisoners : data?.length)
          const filteredData = props.isPrisoner
            ? filterPrisonerData(data)
            : filterEmployeeData(data);

          setUserData(transformDataForTableGrid(filteredData));
          setNewUserData(data);
          dispatch(setLoaderOff());
        } else {
          dispatch(setLoaderOff());
          swal(result.error.message, result.error.details, "warning");
        }
      })
      .catch((err) => {
        dispatch(setLoaderOff());
        swal("Something went wrong!", "", "warning");
      });
  };

  const filterPrisonerData = (data) => {
    return data.map((e) => {
      const baseData = {
        "Profile Pic (تصویر)": _(
          <div className="profile-td profile-td-hover">
            <div className="pic-view">
              <img
                onError={(ev) => {
                  ev.target.src = mockUrl;
                }}
                className="avatar-xs rounded-circle "
                src={`${e.frontPic ? baseImageUrl + e.frontPic : mockUrl}`}
              />
            </div>
            <img
              onError={(ev) => {
                ev.target.src = mockUrl;
              }}
              className="avatar-xs rounded-circle "
              src={`${e.frontPic ? baseImageUrl + e.frontPic : mockUrl}`}
              width="50"
            />
          </div>
        ),
        "Prisoner Number": e.prisonerNumber,
        "Full Name (نام)": e.fullName,
        "Relationship Type": e?.relationshipType,
        "Relation Name": e.relationshipName,
        "Darban Date (دربان کی تاریخ)": validateDate(e.darbanAdmissionDate),
        "CNIC (شناختی کارڈ نمبر)": e.cnic,
        "Has Opposition (مخالفت ہے؟)": e.hasOpposition ? "Yes" : "No",
        "condemend": _(
          <span style={{ color: e.condemend ? "red" : "inherit" }}>
            {e.condemend ? "Yes" : "No"}
          </span>
        ),
        "Escaped": e.isEscaped ? "Yes" : "No",
        "High Profile": e.highProfile ? "Yes" : "No",
        "Multiple Case": e.hasManyCases ? "Yes" : "No",
        "Warrants (وارنٹ)": e.noOfWarrantsUponAdmission,
        "Transferred (منتقل کیا گیا)": e.isTransferred ? "Yes" : "No",
        "Actions (عملدرامد)": _(
          <div className="action-btns">
            <button
              id={"Initiate-btn"}
              type="button"
              onClick={() => {
                handleEditBtn(e);
              }}
              className="tooltip  btn  btn-warning waves-effect waves-light"
            >
              <i className="icon-next"></i>
              <span>Initiate Admission</span>
            </button>
            {e.isTransferred && (
              <button
                id={"view-more-btn"}
                className="tooltip btn btn-prim waves-effect waves-light mx-1"
                type="button"
                onClick={() => handleAllDeatails(e)}
              >
                <i className="icon-show-password"></i>
                <span>View More</span>
              </button>
            )}
          </div>
        ),
      };

      // Add "Prison Name (جیل)" column only for Super Admin role
      if (userMeta?.role === "Super Admin") {
        baseData["Prison Name (جیل)"] = e.prisonName;
      }

      return baseData;
    });
  };

  const filterEmployeeData = (data) => {
    return data.map((e) => {
      const id = e.userId == 0 ? e.id + '&' : e.userId; // for Non-PMIS users
      return {
        "Profile Pic (تصویر)": _(
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
        "Employee Number (سٹاف نمبر)": e.employeeNumber,
        "Full Name (نام)": e.fullName,
        "Username (صارف کا نام)": e.userName,
        "Role (کردار)": e.role,
        "Prison (جیل)": _(
          <div style={{whiteSpace: "nowrap", overflow:"hidden", textOverflow: "ellipsis"}}>
            <span title={e?.prison?.split(',')?.length > 1 ? e.prison : ""}>{e?.prison?.split(',')?.length > 1 ? "Multiple prisons" : e.prison}</span>
          </div>
        ),
        "Designation (عہدہ)": e.designation,
        "Department (شعبہ)": e.department,
        "BPS (بی پی ایس)": e.bps,
        "PMIS User (پی ایم آئی ایس صارف)": e.IsPmisUser ,
        "Employment Status": e?.serviceStatus,
        "Actions (عملدرامد)": _(
          <div className="action-btns">
            {props?.tab == 3 ? (
              <button
                id={"edit-btn"}
                type="button"
                onClick={() => {
                  handleEditBtn(e);
                }}
                className="tooltip  btn btn-warning waves-effect waves-light tooltip"
              >
                <i className="icon-edit"></i>
                <span>Edit</span>
              </button>
            ) : (
              <>
                {!isSp && (
                  <>
                    <button
                      id={"edit-btn"}
                      type="button"
                      onClick={() => {
                        handleEditBtn(e);
                      }}
                      className="tooltip  btn btn-warning waves-effect waves-light tooltip"
                    >
                      <i className="icon-edit"></i>
                      <span>Edit</span>
                    </button>
                    {!isHr && (
                      <button
                        type="button"
                        onClick={() => {
                          showModal();
                          handlePassBtn(e);
                          setModalTitle("Reset Password");
                        }}
                        className="tooltip btn btn-danger waves-effect waves-light mx-1"
                      >
                        <i className="icon-password"></i>
                        <span>Reset Password</span>
                      </button>
                    )}
                  </>
                )}
                <button
                  id={"view-more-btn"}
                  className="tooltip btn btn-prim waves-effect waves-light mx-1"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/admin/administration/employee-details/${id}`
                    );
                  }}
                >
                  <i className="icon-show-password"></i>
                  <span>View More </span>
                </button>
              </>
            )}
          </div>
        ),
      };
    });
  };

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

  const apiDownloadRequest = async() => {
    try {
      const apiRes = await postData('/services/app/Reports/EmployeeWiseReportExel',"")
      FileDownloadButton(apiRes?.result)
    } catch (error) {
      console.error(error)
    }

  }

  const FileDownloadButton = (pdf) => {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    console.log(linkSource);
    downloadLink.href = linkSource;
    downloadLink.target = "_blank";
    downloadLink.click();
}

  return (
    <>
      {isOpen && (
        <Modal show={isOpen} onHide={hideModal}>
          <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
            <h5 class="modal-title" id="exampleModalgridLabel">
              {modalTitle}
            </h5>
          </Modal.Header>
          <Modal.Body>
            <ChangePassword employee={isEmployee} hide={hideModal} />
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={hideModal}
              className="btn btn-danger"
              id={"save-password"}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      )}
     {props.isPrisoner && <AllSearch handleSubmit={handleSubmit} />}

      <div className="row gridjs">
        <div className='d-flex flex-column'>
        <div className='btns '>
          <button type="button" className="btn my-2 btn-primary" onClick={() => { apiDownloadRequest(props.payload) }}>
            <i className="icon-file label-icon align-middle  fs-16 me-2"></i> Export to Excel
          </button>
        </div>
        </div>
          <span className="text-danger fw-bold">Note: Please be patient once you click on the"Export to Excel button", this will start compiling the data and might take some time to give you the option to save the file.</span>
        <div className="col-xl-12 p-0">
          <div className="card custom-card animation-fade-grids custom-card-scroll">
            <div className="row ">
              <div className="col">
                <div className="float-end">
                <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} type={"Employees"} />
                </div>
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
                    limit: pageLimit,
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

export default ViewEmployee;