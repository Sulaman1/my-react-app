import React, { useState } from "react";
import InputWidget from "../../../droppables/InputWidget";
import { Modal } from "react-bootstrap";

function RemarksModal({isOpen, setIsOpen, callDeclineLeave }) {
  const [localRemarks, setLocalRemarks] = useState("");
  const handle = () => {  
    setIsOpen(false);
    callDeclineLeave(localRemarks)
  }

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="lg">
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            Remarks
          </h5>
        </Modal.Header>
        <Modal.Body>
        <div className="row p-2">
        <form className='col-lg-12  justify-content-center'>
        <div className='col-lg-12'>
                <InputWidget
                  id={'user'}
                  type={'textarea'}
                  inputType={'text'}
                  label={'Remarks '}
                  require={false}
                  setValue={value => {
                    setLocalRemarks(value);
                  }}
                  icon={'icon-chat'}
                />
              </div>
            </form>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <button
            id={"close"}
            onClick={() => handle()}
            className="btn btn-light lg-btn submit-prim btn-success waves-effect waves-light mx-1"
          >
            Add
          </button>
          <button
            id={"close"}
            onClick={() => setIsOpen(false)}
            className="btn lg-btn submit-prim btn-danger waves-effect waves-light mx-1"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
  );
}

export default RemarksModal;
