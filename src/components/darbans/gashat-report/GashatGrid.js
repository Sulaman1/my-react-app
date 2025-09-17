import React, { useEffect, useState } from "react";
import {
  getIds,
  transformData,
  transformDataForTableGrid,
  transformEmployeeData,
  validateDate,
} from "../../../common/Helpers";
import { baseImageUrl, postData } from "../../../services/request";
import { Grid, _ } from "gridjs-react";
import ProfilePic from "../../../assets/images/users/1.jpg";
import InputWidget from "../../../droppables/InputWidget";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import DescriptionModal from "../../../common/DescriptionModal";
import { Modal, Button } from 'react-bootstrap';

function GashatGrid({ data, refetch, allReport, renderIg }) {
  const [lookup, setLookup] = useState();
  const [formPayload, setFormPayload] = useState({});
  const [searchData, setSearchData] = useState([]);
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [convictDateRange, setConvictDateRange] = useState([null, null]);
  const [convictStartDate, convictEndDate] = convictDateRange;
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const fetchLookUps = async () => {
    try {
      const lookup = {};
      const allEmployeesObj = transformEmployeeData(newLookups?.allEmployees);
      lookup["employees"] = allEmployeesObj;

      const userSessionData = sessionStorage.getItem("user");
      const parsedUser = JSON.parse(userSessionData);
      
      if (parsedUser && parsedUser.employee && Array.isArray(parsedUser.employee.prisons)) {
        const prisonId = parsedUser.employee.prisons.map((e) => e);

        lookup["prison"] = transformData(prisonId);
      } else {
        console.warn("No valid prison data found in session storage.");
        lookup["prison"] = [];
      }
      setLookup(lookup);
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  };

  useEffect(() => {
    fetchLookUps();
  }, []);

  const handleSearch = async () => {
    
    postData(
      `/services/app/EmployeeAppServices/GetAllGhashtReports`,
      formPayload
    )
      .then((result) => {
        if (result && result.result?.isSuccessful) {
          setSearchData(result?.result?.data);
        } else {
          swal(
            result.error?.message || "An error occurred",
            result.error?.details || "",
            "warning"
          ).then(() => {});
        }
      })
      .catch((err) => {
        console.error(err);
        swal("Something went wrong!", err, "warning").then(() => {});
      });
  };

  const generateGridCols = (pos) => {
    const entries = {};
    if (!allReport) {
      entries["Report Title"] = "";
      entries["Report Description"] = "";
      entries["Report Date"] = "";
      entries["Report Attachment"] = "";
    } else {
      entries["Report Title"] = "";
      entries["Report Description"] = "";
      entries["Report Date"] = "";
      entries["Report Attachment"] = "";
      entries["Employee Name"] = "";
      entries["User Name"] = "";
    }
    return Object.keys(entries);
  };

  const handleShowModal = (description, title) => {
    setModalContent(description);
    setModalTitle(title);
    setShowModal(description?.length > 30 ?  true : false);
  };

  
  const handleShowAttachmentModal = (attachment) => {
    setSelectedAttachment(attachment);
    setShowAttachmentModal(true);
  };

  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
    setSelectedAttachment(null);
  };

  const handleDownloadAttachment = () => {
    if (selectedAttachment) {
      const link = document.createElement('a');
      link.href = baseImageUrl + selectedAttachment;
      link.target = '_blank'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderGridData = (data) =>
    data?.map((entry) => {
      const shortDescription =
        entry?.reportDescription?.length > 50
          ? `${entry.reportDescription.substring(0, 50)}...`
          : entry.reportDescription;

      return {
        reportTitle: entry.reportTitle,
        reportDescription: _(
          <div
            onClick={() =>
              handleShowModal(entry.reportDescription, entry.reportTitle)
            }
            style={{ cursor: "pointer" }}
          >
            {shortDescription}
          </div>
        ),
        reportDate: validateDate(entry.reportDate),
        reportAttachments: _(
          <div className="profile-td profile-td-hover">
            <img
              src={
                entry?.reportAttachments
                  ? baseImageUrl + entry?.reportAttachments
                  : ProfilePic
              }
              className="avatar-xs rounded-circle"
              alt=""
              onClick={() => handleShowAttachmentModal(entry?.reportAttachments)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        ),
        employeeName: entry?.employees?.[0]?.user?.userName,
        userName: entry?.employees?.[0]?.personalInfo?.fullName,
      };
    });

  return (
    <>
      <DescriptionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        description={modalContent}
        title={modalTitle}
      />
      {allReport && (
        <>
          <h2>Search</h2>
          <form className="d-flex gap-5">
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                inputType={"select"}
                isMulti={true}
                label={"Employees"}
                id={"Employees-id"}
                require={false}
                icon={"icon-number"}
                options={lookup?.employees || []}
                setValue={(value) => {
                  const employeeIds = getIds(value);
                  const payload = {
                    ...formPayload,
                    employeeIds:
                      employeeIds.length > 0 ? employeeIds : undefined,
                  };
                  setFormPayload(payload);
                }}
              />
            </div>
          {renderIg &&
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                inputType={"select"}
                isMulti={true}
                label={"Prison"}
                id={"prison-id"}
                require={false}
                icon={"icon-number"}
                options={lookup?.prison || []}
                setValue={(value) => {
                  const prisonIds = getIds(value);
                  const payload = {
                    ...formPayload,
                    prisonIds: prisonIds.length > 0 ? prisonIds : undefined, // Remove prisonIds if empty
                  };
                  setFormPayload(payload);
                }}
              />
            </div>
            }
            <div className="col-lg-3">
              <div className="inputs force-active">
                <label>Gashat Start-End Date</label>
                <DatePicker
                  icon={"icon-calendar"}
                  dateFormat="dd/MM/yyyy"
                  selectsRange={true}
                  startDate={convictStartDate}
                  endDate={convictEndDate}
                  onChange={(date) => {
                    setConvictDateRange(date);
                    const payload = {
                      ...formPayload,
                    };
                    if (date[0] && date[1]) {
                      payload["reportDateFrom"] = `${date[0].getFullYear()}-${
                        date[0].getMonth() + 1
                      }-${date[0].getDate()}`;
                      payload["reportDateTo"] = `${date[1].getFullYear()}-${
                        date[1].getMonth() + 1
                      }-${date[1].getDate()}`;
                    } else {
                      delete payload["reportDateFrom"];
                      delete payload["reportDateTo"];
                    }
                    setFormPayload(payload);
                  }}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                  isClearable={true}
                  id={"gasht-report-start-end-date"}
                />
              </div>
            </div>
          </form>
          <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
            <button
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              onClick={handleSearch}
            >
              <i className="icon-search ml-2"></i> Search
            </button>
          </div>
        </>
      )}
      <div className="card custom-card animation-fade-grids custom-card-scroll mb-5">
        <div className="row">
          <Grid
            data={transformDataForTableGrid(
              renderGridData(allReport ? searchData : data)
            )}
            columns={generateGridCols()}
            search
            sort
            pagination={{ enabled: true, limit: 20 }}
          />
        </div>
      </div>
      <Modal show={showAttachmentModal} onHide={handleCloseAttachmentModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Report Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedAttachment ? baseImageUrl + selectedAttachment : ProfilePic}
            alt="Report Attachment"
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAttachmentModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadAttachment}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GashatGrid;
