import React from "react";
import { Modal } from "react-bootstrap";
import { Grid } from "gridjs-react";

const PoliceOfficerDetailsModal = (props) => {
  
  const policeOfficers = {
    name: "Name",
    "Belt Number": "Belt Number",
    "Mobile Number": "Mobile Number",
    "Designation": "Designation",
    "Vehicle Number": ""
  };

  return (
    <>
      <Modal
        show={props?.show}
        onHide={props?.onHide}
        size="custom-xl "
        class="modal-custom-xl"
        // centered
      >
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 className="modal-title" id="exampleModalgridLabel">
            {"Police Officer Details"}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="table-main">
            <div className="">
              <h4 className="third-heading db-heading mb-2">
                Officer Information
              </h4>
              <div id="pagination-list">
                <Grid
                  data={
                    Array.isArray(props?.policeOfficerData)
                      ? props?.policeOfficerData?.map((e) => ({
                          name: e?.name || "",
                          beltNumber: e?.beltNumber || "",
                          mobileNumber: e?.mobileNumber || "",
                          designation: e?.designation || "",
                          vehicleNumber: props?.vehicleNumber || e?.policeCarNumber || "",
                        }))
                      : []
                  }
                  columns={Object.keys(policeOfficers)}
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
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"confirm-btn"}
            className="btn btn-primary"
            onClick={props?.onHide}
          >
            {"Close"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PoliceOfficerDetailsModal;
