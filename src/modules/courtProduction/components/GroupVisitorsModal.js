import React, { useEffect, useState } from "react";
import {
  formatDate,
  getItemFromList,
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import { Grid, _ } from "gridjs-react";
import ProfilePic from "../../../assets/images/users/1.jpg";
import { baseImageUrl, getData, postData } from "../../../services/request";
import { Modal } from "react-bootstrap";
import swal from "sweetalert";
import CancleModalVisitor from "./CancleModalVisitor";
import ImageCell from "../../../common/components/ImageCell";

const GroupVisitorsModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(false);
  const handleHideModal = () => {
    setShowModal(false);
  };

  const [visitorsPayload, setVisitorsPayload] = useState({
    prisonerId: props?.data?.prisonerInformation?.id,
    visitId: props?.visitId,
    visitors: [],
  });

  useEffect(() => {
    setVisitorsPayload({
      prisonerId: props?.data?.prisonerInformation?.id,
      visitId: props?.visitId,
      visitors:
        props?.data?.visitorsInformation?.map((visitor) => ({
          visitorInformationId: visitor.visitorInformationId,
          cancelled: false,
          cancelReason: "",
        })) || [],
    });
  }, [props?.data]);

  const handleDeclineMeeting = (e, index) => {
    setShowModal(true);

    setModalIndex(index);
  };

  const handleStartMeeting = async () => {
    try {
      const willProceed = await swal({
        title: "Are you sure?",
        text: `you want to ${
          visitorsPayload.visitors.every((visitor) => visitor.cancelled)
            ? "Decline"
            : "Start"
        } the meeting`,
        icon: "warning",
        buttons: true,
      });
      if (willProceed) {
        const res = await postData(
          `/services/app/Visitors/StartVisit`,
          visitorsPayload
        );
        if (res.success && res.result.isSuccessful) {
          swal(
            `Meeting ${
              visitorsPayload.visitors.every((visitor) => visitor.cancelled)
                ? "Declined"
                : "started"
            } `,
            "",
            "success"
          ).then(() => {
            props?.hide();
            props?.refresh();
          });
        } else {
          swal(res.error.message, res.error.details, "warning");
          props?.hide();
        }
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    } finally {
    }
  };

  const handleCompleteMeeting = async () => {
    try {
      const willProceed = await swal({
        title: "Are you sure?",
        text: "you want to complete the meeting",
        icon: "warning",
        buttons: true,
      });
      if (willProceed) {
        const res = await postData(
          `/services/app/Visitors/completeVisit?prisonerId=${visitorsPayload?.prisonerId}&visitId=${props?.visitId}`
        );
        if (res.success && res.result.isSuccessful) {
          swal("Meeting completed", "", "success").then(() => {
            props?.hide();
            props?.refresh();
          });
        } else {
          swal(res.error.message, res.error.details, "warning");
          props?.hide();
        }
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    } finally {
    }
  };

  const generateGridCols = () => {
    const entries = {
      "Profile Pic تصویر": "",
    };
    entries["Full Name (نام) "] = "";
    entries["Father Name (ولدیت)"] = "";
    entries["CNIC (شناختی تارڈ) "] = "";
    entries["Relationship "] = "";
    entries["Visit Date "] = "";
    entries["Purpose"] = "";
    entries["Luggage Details"] = "";
    entries["Description"] = "";
    entries["Cnic Front"] = "";
    entries["Cnic Back"] = "";

    if (
      !(
        props?.isVisitor ||
        props?.tabSequence === "2" ||
        props?.tabSequence === "3" ||
        props?.hideButton
      )
    ) {
      entries["Decline Meeting"] = "";
    }
    if (props?.tabSequence === "3") {
      entries["Declined"] = "";
      entries["Decline Reason"] = "";
    }

    return Object.keys(entries);
  };

  const gridDataMap = (e, index, data) => {
    const mapObj = {
      photo: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${
                e?.person?.biometricInfo?.frontPic
                  ? baseImageUrl + e?.person?.biometricInfo?.frontPic
                  : ProfilePic
              }`}
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${
              e?.person?.biometricInfo?.frontPic
                ? baseImageUrl + e?.person?.biometricInfo?.frontPic
                : ProfilePic
            }`}
            width="20"
          />
        </div>
      ),
      fullName: e?.person?.personalInfo?.fullName,
      relationshipName: e?.person?.personalInfo?.relationshipName,
      cnic: e?.person?.personalInfo?.cnic,
      relationship: getItemFromList(
        props?.lookups?.relationships,
        e?.relationshipId
      ),
      visitDate: validateDate(data?.visitDate),
      Purpose: e?.purpose,
      luggageDetail: e?.luggageDetail,
      description: e?.description,
      cnicFront: _(
        <div>
          <ImageCell value={e?.person?.personalInfo?.cnicFrontPic} noHover={true}/>
        </div>
      ),
      cnicBack: _(
        <div>
          <ImageCell value={e?.person?.personalInfo?.cnicBackPic} noHover={true}/>
        </div>
      ),
    };
    if (props?.tabSequence === "3") {
      mapObj["declined"] = e?.cancelReason ? "Yes" : "No";
      mapObj["decline reason"] = e?.cancelReason;
    }
    if (!(props?.isVisitor || props?.tabSequence !== "1")) {
      mapObj["Actions"] = _(
        <>
          <div className="action-btns">
            <button
              id={`cross-btn-${index}`}
              type="button"
              className="btn btn-danger waves-effect waves-light mx-1"
              onClick={() => handleDeclineMeeting(e, index)}
              disabled={visitorsPayload?.visitors?.some(
                (visitor) =>
                  visitor?.visitorInformationId === e?.visitorInformationId &&
                  visitor?.cancelled === true
              )}
            >
              <span className="text-center">Decline Meeting</span>
            </button>
          </div>
        </>
      );
    }

    return mapObj;
  };
  return (
    <>
      <CancleModalVisitor
        show={showModal}
        hide={handleHideModal}
        setVisitorsPayload={setVisitorsPayload}
        index={modalIndex}
      />

      <Modal show={props?.show} onHide={props?.hide} size="xl">
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title text-capitalize" id="exampleModalgridLabel">
            {props?.data?.prisonerInformation?.fullName}'s Visitors
          </h5>
        </Modal.Header>
        <Modal.Body>
          {props?.data?.visitorsInformation?.length > 0 && (
            <div className="card custom-card animation-fade-grids custom-card-scroll  mb-5 mt-5">
              <Grid
                data={transformDataForTableGrid(
                  // props?.tabSequence === "1" ?
                  props?.data?.visitorsInformation?.map((item, index) =>
                    gridDataMap(item, index, props?.data)
                  )
                  // : props?.tabSequence === "2" ? props?.data?.visitorsInformationAccepted?.map((item, index) =>
                  //   gridDataMap(item, index, props?.data) ):

                  // props?.tabSequence === "3" ? props?.data?.visitorsInformationCancelled?.map((item, index) =>
                  // gridDataMap(item, index, props?.data))  :" "
                )}
                columns={generateGridCols()}
                search={false}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"cancel-btn"}
            className="btn btn-prim my-4 lg-btn submit-prim  waves-effect waves-light mx-1"
            onClick={props?.hide}
          >
            Close
          </button>
          {!props?.hideButton && (
            <>
              {props?.tabSequence === "2" ||
                (!(props?.isVisitor || props?.tabSequence === "3") && (
                  <button
                    className="btn btn-success my-4 lg-btn submit-success  waves-effect waves-light mx-1"
                    onClick={handleStartMeeting}
                  >
                    {visitorsPayload.visitors.every(
                      (visitor) => visitor.cancelled
                    )
                      ? "Decline Meeting"
                      : "Start Meeting"}
                  </button>
                ))}
              {props?.tabSequence === "1" ||
                (!(props?.isVisitor || props?.tabSequence === "3") && (
                  <button
                    className="btn btn-success my-4 lg-btn submit-success  waves-effect waves-light mx-1"
                    onClick={handleCompleteMeeting}
                  >
                    Complete meeting
                  </button>
                ))}
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default GroupVisitorsModal;
