import { useState } from "react";
import { Modal } from "react-bootstrap";
import swal from "sweetalert";
import InputWidget from "../../../droppables/InputWidget";

const CancleModalVisitor = ({ show, hide, setVisitorsPayload, index }) => {
  const [reasonField, setReasonField] = useState("");

  const handleSaveButton = () => {
    if (!reasonField) {
      swal("Missing Required Field", "Please enter a cancel reason", "error");
      return;
    }
    setVisitorsPayload((prevPayload) => {
      const updatedPayload = { ...prevPayload };
      updatedPayload.visitors[index] = {
        ...updatedPayload.visitors[index],
        cancelled: true,
        cancelReason: reasonField,
      };
      return updatedPayload;
    });
    setReasonField("");
    hide();
  };

  return (
    <>
      <Modal show={show} onHide={hide} size="lg" centered>
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            Decline Reason
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form className="hover-card">
            <div className="row">
              <div className="col-lg-12">
                <InputWidget
                  type={"input"}
                  inputType={"name"}
                  label={"Reason"}
                  id={"reason"}
                  require={true}
                  icon={"icon-operator"}
                  setValue={(value) => {
                    setReasonField(value);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"cancel-btn"}
            className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={hide}
          >
            Close
          </button>
          <button
            id={"save-btn"}
            className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={handleSaveButton}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancleModalVisitor;
