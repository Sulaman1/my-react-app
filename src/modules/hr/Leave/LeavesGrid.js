import React, { useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { transformDataForTableGrid, validateDate } from "../../../common/Helpers";
import { postData } from "../../../services/request";
import { Grid, _ } from "gridjs-react";
import RemarksModal from "./RemarksModal";

function LeavesGrid({ unapprovedLeaves, refetch, loadGridData, setIsOpen, isSp, approvedLeaves, leavesModal, hide }) {
  const generateGridCols = (pos) => {
    const entries = {};

    if (!leavesModal) {
      (entries["Leave Date (چھٹی کی تاریخ)"] = ""),
        (entries["Leave Type (چھٹی کی نویت)"] = ""),
        (entries["Day parts (دن کے حصے)"] = ""),
        (entries["Status"] = ""),
        (entries["Remarks"] = ""),
        (entries["Leave Approval Date"] = ""),
        (entries["Leave Denied Date"] = ""),
        (entries["Denied Remarks"] = ""),
        (entries["Cancelled Remarks"] = ""),
        (entries["Cancelled Date"] = "");
        if(!hide){
          (entries["Actions (عملدرامد)"] = "");
        }
    } 
    else{
      (entries["Leave Date (چھٹی کی تاریخ)"] = ""),
      (entries["Leave Type (چھٹی کی نویت)"] = ""),
      (entries["Day parts (دن کے حصے)"] = ""),
      (entries["Status"] = ""),
      (entries["Remarks"] = "");
      if(!hide){
        (entries["Actions (عملدرامد)"] = "");
      }
    }

    return Object.keys(entries);
  };
  const userMeta = useSelector((state) => state.user);
  const  isHr = userMeta?.role === "HR Branch";
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);
  const [leaveId, setLeaveId] = useState("");

  const handleLeaveAction = async (entry, operation, localRemarks = "") => {
    const isApproval = operation === "approval";
    const url = isApproval 
      ? "UpdateLeaveStatus" 
      : operation === "discard" 
      ? "UpdateLeaveStatus" 
      : "UpdateLeaveStatus";
    const message = isApproval ? "Leave Approved." : operation === "discard" ? "Leave Declined."  :"Approved Leave cancelled";

    const payload = {
      id: leaveId || entry?.leaveId,
      status: operation === "approval" ? 1 : operation === "discard" ? 2 : 3
    };
    if (leaveId) payload.remarks = localRemarks;

    try {
      const response = await postData(`/services/app/EmployeeAppServices/${url}`, payload);
      if (response.success && response.result?.isSuccessful) {
        await swal(message, "", "success");
        setLeaveId("");

        if (!isSp) {
          if (unapprovedLeaves.length - 1 === 0) {
            loadGridData();
            setIsOpen(false);
          } else {
            refetch();
          }
        } else {
          refetch();
        }
      } else {
        swal(response.error?.message || "An error occurred", response.error?.details || "", "error");
      }
    } catch (error) {
      console.error(error);
      swal("Something went wrong!", "", "error");
    }
  };

  const handleDeleteLeave = async (entry) => {
    try {
      const response = await postData(`/services/app/EmployeeAppServices/DeleteEmployeeLeave?id=${entry}`);
      if (response.success && response.result?.isSuccessful) {
        await swal(message, "", "success");
        setLeaveId("");

       
          refetch();
      } else {
        swal(response.error?.message || "An error occurred", response.error?.details || "", "error");
      }
    } catch (error) {
      console.error(error);
      swal("Something went wrong!", "", "error");
    }
  } 

  const handleDecline = (entry) => {
    setLeaveId(entry.leaveId);
    setIsRemarksOpen(true);
  };

  const callDeclineLeave = (localRemarks) => {
    const operation = isSp ? "decline" : "discard";
    handleLeaveAction(null, operation, localRemarks);
  };

  const renderGridData = (leaveData) => leaveData.map((entry) => {
    const leaveDate = new Date(entry.leaveDate);
    const isFutureDate = leaveDate > new Date();
  
    if (leavesModal) {
      return {
        leaveDate: validateDate(entry.leaveDate) ? leaveDate.toDateString() : "",
        leaveType: entry.leaveType,
        dayspart: entry?.day,
        status: entry?.status,
        remarks: entry?.remarks,
        Action: _(
          <div className="action-btns">
            {!isHr && 
              <>
              {isSp ? (
                isFutureDate && entry?.status === "Approved" ? (
                  <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDecline(entry, "discard")}>
                    Cancel
                  </button>
                ) : (
                  ''
                )
              ) : (
                <>
                  <button type="button" className="btn p-2 btn-success align-center tooltip" onClick={() => handleLeaveAction(entry, "approval")} disabled={entry?.status === "Denied"}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDecline(entry)} disabled={entry?.status === "Denied"}>
                    Reject
                  </button>
                </>
              )}
              </>
            }
            {isHr && entry?.status === "Pending" && isFutureDate && 
              <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDeleteLeave(entry?.leaveId)}>
                Cancel
              </button>
            }
          </div>
        ),
      };
    } else {
      return {
        leaveDate: validateDate(entry.leaveDate) ? leaveDate.toDateString() : "",
        leaveType: entry.leaveType,
        dayspart: entry?.day,
        status: _(
          <div>
          <span style={entry?.status === "Denied" || entry?.status === "Cancelled After Approval" ? { color: "red" } : {}}>{entry?.status}</span>
        </div>
        
        ),
        remarks: entry?.remarks,
        approvalDate: validateDate(entry.approvalDate) ||  "",
        deniedDate: validateDate(entry.deniedDate) ||  "",
        deniedRemarks: entry?.deniedRemarks,
        cancelledRemarks: entry?.cancelledRemarks,
        cancelledDate: validateDate(entry.cancelledDate) ||  "",
        Action: _(
          <div className="action-btns">
            {!isHr && 
              <>
              {isSp ? (
                isFutureDate && entry?.status === "Approved" ? (
                  <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDecline(entry, "discard")}>
                    Cancel
                  </button>
                ) : (
                  ''
                )
              ) : (
                <>
                  <button type="button" className="btn p-2 btn-success align-center tooltip" onClick={() => handleLeaveAction(entry, "approval")} disabled={entry?.status === "Denied"}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDecline(entry)} disabled={entry?.status === "Denied"}>
                    Reject
                  </button>
                </>
              )}
              </>
            }
            {isHr && entry?.status === "Pending" && isFutureDate && 
              <button type="button" className="btn btn-danger p-2 tooltip" onClick={() => handleDeleteLeave(entry?.leaveId)}>
                Cancel
              </button>
            }
          </div>
        ),
      };
    }
  });
  


  return (
    <>
      <RemarksModal isOpen={isRemarksOpen} setIsOpen={setIsRemarksOpen} callDeclineLeave={callDeclineLeave} />
      <div className="card custom-card animation-fade-grids custom-card-scroll mb-5">
        <div className="row">
          <Grid
            data={transformDataForTableGrid(isSp ? renderGridData(approvedLeaves) : renderGridData(unapprovedLeaves))}
            columns={generateGridCols()}
            search
            sort
            pagination={{ enabled: true, limit: 20 }}
          />
        </div>
      </div>
    </>
  );
}

export default LeavesGrid;
