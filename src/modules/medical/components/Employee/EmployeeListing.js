import { useRef, useEffect, useState } from "react";
import { Grid, _ } from "gridjs-react";
import swal from "sweetalert";
import { formatDate, transformDataForTableGrid, validateDate, formatTime } from "../../../../common/Helpers";
import { baseImageUrl, getData, postData } from "../../../../services/request";
import Print from "../../../../components/admin/search/Print";
import LeaveModal from "../../../medical/components/MedicalModal";
import LeavesGrid from "../../../hr/Leave/LeavesGrid";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import ShowNoOfRecords from "../../../../common/ShowNoOfRecords";

const generateGridCols = (hide, isDarban, leaves, isAdmin, isHr) => {
  const show = useSelector((state) => state.language.urdu);
  const cols = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: "",
    [`Employee No${show ? ' (سٹاف نمبر)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
  };

  if (!hide) {
    cols[`Username${show ? ' (صارف کا نام)' : ''}`] = "";
    cols[`Role${show ? ' (کردار)' : ''}`] = "";
  }

  cols[`Designation${show ? ' (عہدہ)' : ''}`] = "";
  cols[`Department${show ? ' (شعبہ)' : ''}`] = "";
  cols[`BPS${show ? ' (بی پی ایس)' : ''}`] = "";
  cols['Entry Date']="";
  cols[`Entry Time` ] = "";
  if (!hide || isDarban || leaves || isAdmin | isHr) {
    cols[`Action${show ? ' (عملدرامد)' : ''}`] = "";
  }
  return Object.keys(cols);
};

const mockUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU";

const EmployeeListing = ({
  btnTitle,
  setActiveTab,
  getURL,
  hr,
  apiEndpoint,
  successMsg,
  leaves,
  hideCol,
  approval,
  leaveInProgress,
  btnIcon,
  HideButtonInList,
  hide
}) => {
  const [entries, setEntries] = useState([]);
  const gridRef = useRef(null);
  const userMeta = useSelector((state) => state.user);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [newUserData, setNewUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unapprovedLeaves, setUnapprovedLeaves] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const isDarban = userMeta?.role === 'Darban';
  const isAdmin = userMeta?.role === 'Super Admin';
  const isSp = userMeta?.role === 'Prison Superintendent';
  const isHr = userMeta?.role === 'HR Branch';
  // const [pageLimit, setPageLimit] = useState(10);
  const show = useSelector((state) => state.language.urdu);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    const rawData = sessionStorage.getItem("user");
    const userId = JSON.parse(rawData).userId;

    try {
      
      let url;
      let method;
      const hasQuery = getURL === "GetAllEmployee";
      if (leaveInProgress) {
        method = getData;
        url = `/services/app/EmployeeAppServices/${getURL}`
      } else {
        method = hasQuery ? getData : postData;
        url = `/services/app/EmployeeAppServices/${getURL}${hasQuery ? `?userId=${userId}` : ""
          }`;
      }
      const res = await method(url, "", true);
      console.log("ENTRIES >>>", res);
      if (res.success && res.result?.isSuccessful) {
        const data = res.result.data;
        setTotalNoOfRecords(data.length)
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
    if (hr) {
      const url = `/services/app/EmployeeAppServices/${apiEndpoint}?EmployeeId=${empEntry.id}`;
      try {
        const res = await postData(url, {});
        if (res.success && res.result?.isSuccessful) {
          swal(successMsg, "", "success");
          loadGridData();
        } else {
          swal(
            res.error?.message || "An error occured",
            res.error?.details || "",
            "warning"
          );
        }
      } catch (err) {
        swal("Something went wrong!", "", "warning");
      }
    } else {
      sessionStorage.setItem("empMedicalEntry", JSON.stringify(empEntry));
        setActiveTab(isSp ? 2 : 1);
    }
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

    if (!hideCol) {
      mapObj["username"] = e.userName;
      mapObj["role"] = e.role;
    }

    mapObj["designation"] = e.designation;
    mapObj["department"] = e.department;
    mapObj["bps"] = e.bps;
    mapObj["Entry Date"] = formatDate(e.attendance?.[0]?.['entryTime'])
    mapObj["Entry Time"] = formatTime(e.attendance?.[0]?.['entryTime'])
    mapObj["Actions"] = _(
      <div className="action-btns">
        {!approval && e.leaves.length > 0 && !hideCol || leaves && (isSp || isAdmin) && !HideButtonInList && (
          <button
            id={"check-leaves-btn"}
            type="button"
            className="btn p-2 btn-info align-center tooltip"
            onClick={() => checkLeavesHandler(e)}
          >
            <i className="icon-confirmation"></i> <span>{`Check Leaves${show ? ' (چھٹیاں چیک کریں)' : ''}`}</span>
          </button>
        )}
        {(leaves && !approval && !leaveInProgress && !hide) && (
          <button
            id={"apply-leave-btn"}
            type="button"
            className="btn p-2 btn-info align-center tooltip"
            onClick={handleOpenModal.bind(this, e)}
          >
            <i className="icon-add"></i> <span>{`Apply Leave${show ? ' (چھٹی کی درخواست دیں)' : ''}`}</span>
          </button>
        )}
        <button
          id={"view-details-btn"}
          type="button"
          onClick={handleClick.bind(this, e)}
          className="btn btn-success p-2 tooltip"
        >
          {leaves ? (
            <>
              <i className="icon-show-password"></i>
              <span>{`View Details${show ? ' (تفصیلات دیکھیں)' : ''}`}</span>
            </>
          ) : (<>
            {btnTitle}
          </>
          )}
        </button>
      </div>
    );
    return mapObj;
  };

  const handleOpenModal = (emp) => {
    setModalIsVisible(true);
    setSelectedEmployee(emp);
  };

  const checkLeavesHandler = async (emp) => {
    try {
      
      setEmployeeId(emp.id);
      const res = await getData(
        `/services/app/EmployeeAppServices/GetEmployeeLeaves?EmployeeId=${emp.id}`,
        "",
        true
      );

      if (res.success && res.result) {
        
        setUnapprovedLeaves(
          res.result.unapprovedLeaves
        );
        setIsOpen(true);
      } else {
        swal(
          res?.error?.message || "An error occured",
          res?.error?.details || "",
          "error"
        );
      }
    } catch (err) {
      console.log(err);
      await swal("Something went wrong", "", "error");
      
    }
  };

  const leavesSubmitHandler = async (data) => {
    const payload = {
      employeeId: selectedEmployee.id,
      ...data,
    };

    console.log(payload);
  
    try {
      const res = await postData(
        "/services/app/EmployeeAppServices/SetEmployeeLeaves",
        payload
      );
      if (res.success && res.result?.isSuccessful) {
        swal("Successfully applied for leaves.", "", "success");
        setDefaultValues({
          start: null,
          end: null,
          leaveType: null,
        });
        setModalIsVisible(false);
      } else {
        swal(
          res.error?.message || "An error occured",
          res.error?.details || "",
          "warning"
        );
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    }
  };

  const closeModal = () => {
    setModalIsVisible(false);
    setDefaultValues({
      start: null,
      end: null,
      leaveType: null,
    });
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
      <Modal show={isOpen} onHide={() => setIsOpen(false)} size="xl">
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            {`Leaves${show ? ' (چھٹیاں)' : ''}`}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <LeavesGrid
            unapprovedLeaves={unapprovedLeaves}
            refetch={() => checkLeavesHandler({ id: employeeId })}
            loadGridData={() => loadGridData()}
            setIsOpen={()=> setIsOpen()}
            leavesModal={true}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"close"}
            onClick={() => setIsOpen(false)}
            className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
          >
            {`Close${show ? ' (بند کریں)' : ''}`}
          </button>
        </Modal.Footer>
      </Modal>

      <LeaveModal
        visible={modalIsVisible}
        onClose={closeModal}
        title={`Apply for Leaves${show ? ' (چھٹی درخواست فارم)' : ''}`}
        leaves
        onSubmit={leavesSubmitHandler}
        defaultValues={defaultValues}
      />

      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <Print data={newData} filename={file} />
        <div className="row">
        <div className="col">
            <div className="float-end">
              <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} type={"Employees"} />
            </div>
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry))
            )}
            columns={generateGridCols(hideCol, isDarban, leaves, isAdmin, isHr)}
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
    </>
  );
};

export default EmployeeListing;