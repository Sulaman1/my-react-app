import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, validateDate } from "../../../../common/Helpers";
import { getData } from "../../../../services/request";
import DescriptionModal from "../../../../common/DescriptionModal";

const ViewRemissionsByPrisoner = ({ show, handleClose, prisonerId, isDeduct }) => {
  const [remissions, setRemissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (show && prisonerId) {
      loadRemissions();
    }
  }, [show, prisonerId]);

  const loadRemissions = async () => {
    setLoading(true);
    try {
      const response = await getData(`/services/app/PrisonerRemission/GetRemissionsByPrisoner?prisonerId=${prisonerId}&isDeduction=${isDeduct}`);
      if (response && response.result.isSuccessful) {
        setRemissions(response.result.data);
      }
    } catch (error) {
      console.error('Error fetching remissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowRemarksModal = (remarks) => {
    setModalContent(remarks);
    setModalTitle("Remarks");
    setShowDescModal(true);
  };

  const renderRemarks = (remarks) => {
    if (!remarks || remarks === 'N/A') {
      return _(<span>N/A</span>);
    }
    
    const shortRemarks = remarks.length > 30 ? `${remarks.substring(0, 30)}...` : remarks;
    
    return _(
      <div
        className="cursor-pointer"
        onClick={() => {
          if (remarks.length > 30) {
            handleShowRemarksModal(remarks);
          }
        }}
        style={{ color: remarks.length > 30 ? '#007bff' : 'inherit' }}
      >
        {shortRemarks}
      </div>
    );
  };

  const gridMapData = (entries) => {
    const filteredData = entries.map((e) => ({
      remissionName: e.remissionName,
      authorityName: e.authorityName,
      remissionDate: validateDate(e.remissionDate),
      remissionDaysEarned: e.remissionDaysEarned,
      remarks: renderRemarks(e.remarks),
      isIndividualRemission: e.isIndividualRemission ? 'Yes' : 'No',
      nextDueDate: validateDate(e.nextDueDate)
    }));

    return transformDataForTableGrid(filteredData);
  };

  const colHeaders = {
    'Remission Name': "",
    'Authority Name': "",
    'Remission Date': "",
    'Days Earned': "",
    'Remarks': "",
    'Individual Remission': "",
    'Next Due Date': ""
  };

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />
      
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Prisoner Remissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="card custom-card animation-fade-grids">
              <Grid
                data={gridMapData(remissions)}
                columns={Object.keys(colHeaders)}
                search={true}
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewRemissionsByPrisoner; 