import { useState, useEffect } from "react";
import { Grid, _ } from "gridjs-react";

import swal from "sweetalert";
import {  getData, postData } from "../../../services/request";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import EmployeeInfoCard from "../../medical/components/Employee/EmployeeInfoCard";
import {
  formatDate,
} from "../../../common/Helpers";
import LeavesGrid from "./LeavesGrid";
import GashatGrid from "../../../components/darbans/gashat-report/GashatGrid";
import GashatModal from "../../../components/darbans/gashat-report/GashatModal";

const EmployeeDetails = (props) => {
  const [employee, setEmployee] = useState();
  const [events, setEvents] = useState([]);
  const [approvedLeaves, setapprovedLeaves] = useState([]);
  const [gashatData, setGashatData] = useState([]);
  const [openGashatModal, setOpenGashatModal] = useState(false);

  useEffect(() => {
    props.isGashatEnable ? loadGashatData() : loadData();
  }, []);

  const loadData = async () => {
    const employee = JSON.parse(sessionStorage.getItem("empMedicalEntry"));
    try {
      

      const res = await getData(
        `/services/app/EmployeeAppServices/GetEmployeeLeaves?EmployeeId=${employee.id}`,
        "",
        true
      );

      if (res.success && res.result) {
        
        console.log(res.result);

        const fetchedEvents = [];

        if (!props.approval) {
          for (const d of res.result.attendance) {
            const event = {
              title: "Attendance",
              date: formatDate(d.entryTime),
              backgroundColor: "#09c4a3",
              eventTextColor: "blue",
            };
            fetchedEvents.push(event);
          }
        }

        console.log(res.result.leaves);

        let leaves = res.result.leaves;

        for (const l of leaves) {
          const event = {
            title: l.leaveType,
            date: formatDate(l.leaveDate),
            // backgroundColor: l.approved ? "#197ba9" : "#ba2727",
            backgroundColor: l.status == "Approved" ? "#008000" : l.status == "Denied" ? "#FF0000" : l.status == "Cancelled After Approval" ? "#FFA500" : "#d6d60c",
            borderColor: l.status == "Approved" ? "#008000" : l.status == "Denied" ? "#FF0000" : l.status == "Cancelled After Approval" ? "#FFA500" : "#d6d60c",

          };
          fetchedEvents.push(event);
        }

        const employeeObj = {};

        for (const x in res.result) {
          if (x !== "attendance" && x !== "leaves") {
            employeeObj[x] = res.result[x];
          }
        }

        console.log(employeeObj);
        console.log(fetchedEvents);

        setEmployee(employeeObj);
        setEvents(fetchedEvents);
        setapprovedLeaves(
          res.result.leaves
        );
      } else {
        swal(res?.error?.message, res?.error?.details, "warning");
      }
    } catch (err) {
      console.log(err);
      await swal("Something went wrong", "", "warning");
      
    }
  };

  const loadGashatData = async () => {
    try {
      const employee = JSON.parse(sessionStorage.getItem("empMedicalEntry"));
      setEmployee(employee);
      
      const payload = {
        "employeeIds": [
          employee.id
        ]
        // ,
        // "prisonIds": [
        //   1
        // ]
      }
      const res = await postData(
        `/services/app/EmployeeAppServices/GetAllGhashtReports`,
        payload,
        true
      );

      if (res.success && res.result) {
        setGashatData(res.result.data);
        
      } else {
        
        swal(res?.error?.message, res?.error?.details, "warning");
      }
    } catch (error) {
      console.log(error);
      await swal("Something went wrong", "", "warning");
      
    }
  }

  const handleAddGashat = () => {

    setOpenGashatModal(true);

  }

  const onCloseGashatModal = () => {
    setOpenGashatModal(false);
  }



  return (
    <>
      <GashatModal openModal={openGashatModal} onClose={onCloseGashatModal} title={"Add Gasht Report"} employeeData={employee} refetch={loadGashatData}/>
      <EmployeeInfoCard title="Employee Basic Information" emp={employee} />
      {props.isGashatEnable ? (
        <>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleAddGashat();
            }}
          >
            Add Gasht Report
          </button>
          <GashatGrid data={gashatData} refetch={loadGashatData}  />
        </>
      ) : (
        <>
          <LeavesGrid approvedLeaves={approvedLeaves} refetch={loadData} isSp={true} hide={props?.hide} />
          <FullCalendar plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events} />
        </>
      )}
    </>
  );
};

export default EmployeeDetails;
