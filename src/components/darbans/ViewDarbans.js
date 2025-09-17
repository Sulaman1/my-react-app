import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import { formatDateAndTime, transformDataForTableGrid, validateDate } from "../../common/Helpers";
import { baseImageUrl, deleteData, postData } from "../../services/request";
import ProfilePic from "../../../src/assets/images/users/1.jpg";
import swal from "sweetalert";
import AllSearch from "../admin/search/AllSearch";
import Print from "../../components/admin/search/Print";
import PoliceOfficerDetailsModal from "../prisoners/Components/circleoffice/checkinout/PoliceOfficerDetailsModal";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";
import { useSelector } from 'react-redux';

const ViewDarban = (props) => {
  const gridRef = useRef();
  const [darbanData, setDarbanData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [policeOfficerData, setPoliceOfficerData] = useState([]);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const show = useSelector((state) => state.language.urdu);

  const getColumns = () => [
    `Full Name${show ? ' (نام)' : ''}`,
    'Relationship Type',
    'Relationship Name',
    `Darban Date${show ? ' (دربان کی تاریخ)' : ''}`,
    `Time${show ? ' (وقت)' : ''}`,
    `CNIC${show ? ' (شناختی کارڈ)' : ''}`,
    `Category${show ? ' (قیدی کی درجہ بندی)' : ''}`,
    `No of warrants${show ? ' (وارنٹ)' : ''}`,
    `Gender${show ? ' (جنس)' : ''}`,
    `Police Car Number`,
    `Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`,
    `Actions${show ? ' (عملدرامد)' : ''}`,
  ];

  const handleSelectedOfficer = (officer) => {
    if (officer?.policeOfficers?.length) {
      officer.policeOfficers.forEach(policeOfficer => {
        policeOfficer['policeCarNumber'] = officer.policeCarNumber;
      });
    }
    if (officer?.admissionPoliceOfficers?.length) {
      officer.admissionPoliceOfficers.forEach(admissionPoliceOfficer => {
        admissionPoliceOfficer['policeCarNumber'] = officer.policeCarNumber;
      });
    }
    setPoliceOfficerData(officer?.admissionPoliceOfficers || officer?.policeOfficers)
    setShowOfficerModal(true)
  }
  
  const loadData = () => {
    
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
      maxResults: pageLimit,
      userId: parsedId,
      name: "",
      category: 0,
      prisonId: 0,
      year: 0,
      prsNumber: 0,
      relationshipName: "",
      relationshipTypeId: "",
      genderId: 0,
      policeStationId: 0,
      firYear: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };
    postData("/services/app/PrisonerSearch/SearchDarbanEntries", obj)
      .then((result) => {
        if (result && result.success) {
          const data = result.result.data;
          if (data.length > 0) {
            setTotalNoOfRecords(result.result?.totalPrisoners)
            const filterdData = data.map((e) => {
              return {
                fullName: e.fullName,
                relationshipType: e?.relationshipType,
                relationshipName: e.relationshipName,
                darbanDate: validateDate(e.darbanAdmissionDate),
                time: validateDate(e.darbanAdmissionDate)
                  ? new Date(e.darbanAdmissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "",
                cnic: e.cnic,
                category: e.category || '',
                noOfWarrantsUponAdmission: e.noOfWarrantsUponAdmission || 0,
                gender: e.gender,
                admissionPoliceCarNumber: e.policeCarNumber,
                lastModifiedBy: e.lastModifiedByUser,
                Actions: _(
                  <div className="action-btns">
                    <button
                      id={"edit-btn"}
                      type="button"
                      onClick={() => {
                        handleEditBtn(e);
                      }}
                      disabled={e?.darbanAdmissionDate && Date.parse(e?.darbanAdmissionDate) + 24 * 60 * 60 * 1000 < Date.now() ? true : false}
                      className="tooltip  btn btn-info waves-effect waves-light"
                    >
                      <i className="icon-edit"></i>
                      <span>{`Edit${show ? ' (ترمیم)' : ''}`}</span>
                    </button>
                    <button
                    id={"approve-btn"}
                    type="button"
                    onClick={() => handleSelectedOfficer(e)}
                    className="btn btn-info waves-effect waves-light mx-1 tooltip"
                  >
                    <i className="icon-show-password"></i>
                    <span>{`Officer Details${show ? ' (افسر کی تفصیلات)' : ''}`}</span>
                  </button>
                  </div>
                ),
              };
            });
            setDarbanData(transformDataForTableGrid(filterdData));
            setNewData(data);
            const gridjsInstance = gridRef.current.getInstance();
            gridjsInstance.on("rowClick", (...args) => {
              // console.log("row: ", args);
            });
          } else {
            setDarbanData([]);
          }
        } else {
          console.error("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditBtn = (item) => {
    sessionStorage.setItem("selectedDarban", JSON.stringify(item));
    props.setActiveTab(1);
  };

  const handleDelBtn = (item, event) => {
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
          let url = "";
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



  const handleSubmit = (payload) => {
    
    const { userId } = JSON.parse(sessionStorage.getItem("user"));
    const reqPayload = {
      relationshipName: payload.relationshipName,
      relationshipTypeId: payload.relationshipTypeId,
      firNo: payload.firNo,
      firYear: payload.firYear,
      genderId: payload.genderId,
      name: payload.name,
      policeStationId: payload.policeStationId,
      prsNumber: payload.prsNumber,
      userId,
      year: payload.year,
      maxResults: payload?.maxResults || pageLimit
    };
    postData(`/services/app/PrisonerSearch/SearchDarbanEntries`, reqPayload)
      .then((result) => {
        if (result && result.result.isSuccessful) {
          const data = result.result.data;
          setTotalNoOfRecords(result.result?.totalPrisoners)
          const filterdData = data.map((e) => {
            return {
              // profile: _(
              //   <>
              //     <img
              //       onError={(ev) => {
              //         ev.target.src = ProfilePic;
              //       }}
              //       className="avatar-xs rounded-circle "
              //       src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
              //         }`}
              //       width="50"
              //     />
              //   </>
              // ),
              fullName: e.fullName,
              relationshipType: e?.relationshipType,
              relationshipName: e.relationshipName,
              darbanDate: validateDate(e.darbanAdmissionDate),
              time: validateDate(e.darbanAdmissionDate)
                ? new Date(e.darbanAdmissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "",
              cnic: e.cnic,
              category: e.category || '',
              noOfWarrantsUponAdmission: e.noOfWarrantsUponAdmission || 0,
              gender: e.gender,
              admissionPoliceCarNumber: e.policeCarNumber,
              lastModifiedBy: e.lastModifiedByUser,
              Actions: _(
                <div className="action-btns">
                  <button
                    id={"edit-btn-two"}
                    type="button"
                    onClick={() => {
                      handleEditBtn(e);
                    }}
                    className="tooltip  btn btn-info waves-effect waves-light"
                  >
                    <i className="icon-edit"></i>
                    <span>Edit</span>
                  </button>
                  <button
                    id={"approve-btn"}
                    type="button"
                    onClick={() => handleSelectedOfficer(e)}
                    className="btn btn-info waves-effect waves-light mx-1 tooltip"
                  >
                    <i className="icon-show-password"></i>
                    <span>{"Officer Details"}</span>
                  </button>
                </div>
              ),
            };
          });
          setDarbanData(transformDataForTableGrid(filterdData));
          
        } else {
          
          swal(result.error.message, result.error.details, "warning");
        }
      })
      .catch((err) => {
        
        swal("Something went wrong!", "", "warning");
      });
  };

  const gridData = newData.map((x) => {
    return {
      fullName: x.fullName,
      relationshipType: x?.relationshipType,
      relationshipName: x.relationshipName,
      DarbanDate: validateDate(x.darbanAdmissionDate),
      cnic: x.cnic,
      category: x.prisonerNumber,
      noOfWarrantsUponAdmission: x.noOfWarrantsUponAdmission || 0,
      gender: x.gender,
      admissionPoliceCarNumber: x.policeCarNumber,
    };
  });
  return (
    <>
      <PoliceOfficerDetailsModal
        show={showOfficerModal}
        onHide={() => setShowOfficerModal(false)}
        policeOfficerData={policeOfficerData}
        subTitle={`darban${show ? ' (دربان)' : ''}`}
      />
      <AllSearch handleSubmit={handleSubmit} />
      <div className="row gridjs">
        <Print data={gridData} filename={`Darban List${show ? ' (دربان کی فہرست)' : ''}`} />
        <div className="col-xl-12 p-0">
          <div className="card custom-card animation-fade-grids custom-card-scroll">
            <div className="row ">
              <div className="col">
									<div className="float-end">
                <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
                </div>
                <Grid
                  ref={gridRef}
                  data={darbanData}
                  columns={getColumns()}
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

export default ViewDarban;