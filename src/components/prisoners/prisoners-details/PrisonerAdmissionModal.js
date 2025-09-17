import React, { useRef, useEffect, useState } from 'react';
import { Grid } from 'gridjs-react';
import { Modal, Button } from 'react-bootstrap';
import { transformDataForTableGrid } from '../../../common/Helpers';
import DescriptionModal from '../../../common/DescriptionModal';
import { html } from 'gridjs';

const PrisonerAdmissionModal = ({ 
  show, 
  handleClose, 
  title, 
  data, 
  columns, 
  prisoner 
}) => {
  const modalGridRef = useRef();
  const [showDescModal, setShowDescModal] = useState(false);
  const [descModalContent, setDescModalContent] = useState("");
  const [descModalTitle, setDescModalTitle] = useState("");
  
  // Store the raw data for reference in the window handler
  const currentModalDataRef = useRef([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (show && data && data.length > 0) {
      processModalData();
    }
    
    // Register global handler function for long text
    window.handleModalDetailClick = (type, index) => {
      const rawData = currentModalDataRef.current;
      if (!rawData || !rawData[index]) return;
      
      let content = "";
      let title = "";
      
      if (type === 'remarks') {
        // For Prisoner Offenses
        content = prisoner.prisonerAdmissions.flatMap(a => a.prisonerOffenses || [])
          .find(o => o.offense === rawData[index][0] && 
                     o.offenseDate === rawData[index][1])?.remarks || "N/A";
        title = "Remarks";
      } else if (type === 'description' && title === 'Prisoner Offenses') {
        // For Prisoner Offenses description
        content = prisoner.prisonerAdmissions.flatMap(a => a.prisonerOffenses || [])
          .find(o => o.offense === rawData[index][0] && 
                     o.offenseDate === rawData[index][1])?.description || "N/A";
        title = "Description";
      } else if (type === 'description' && title === 'Prisoner Belongings') {
        // For Prisoner Belongings
        content = prisoner.prisonerAdmissions.flatMap(a => a.prisonerBellongings || [])
          .find(b => b.itemName === rawData[index][0])?.itemDescription || "N/A";
        title = "Item Description";
      }
      
      handleShowDescModal(content, title);
    };
    
    // Cleanup
    return () => {
      delete window.handleModalDetailClick;
    };
  }, [show, data, prisoner, title]);

  const handleShowDescModal = (description, title) => {
    if (!description || description === "N/A") return;
    
    const formattedDescription = (
      <span style={{ padding: "0.5rem" }}>
        {description}
      </span>
    );
    
    setDescModalContent(formattedDescription);
    setDescModalTitle(title);
    setShowDescModal(true);
  };

  const processModalData = () => {
    // Transform the data based on the title type
    let transformedData = [];
    let rawData = [];
    
    if (title === 'Prisoner Numbers') {
      transformedData = data.map(item => ({
        prison: item.prison || 'N/A',
        category: item.category || 'N/A',
        year: item.year || 'N/A',
        prsNumber: item.prsNumber || 'N/A',
        darbanEntryDate: item.darbanEntryDate || 'N/A',
        noOfWarrantsUponAdmission: item.noOfWarrantsUponAdmission || 'N/A'
      }));
    } else if (title === 'Police Officers') {
      transformedData = data.map(item => ({
        name: item.name || 'N/A',
        beltNumber: item.beltNumber || 'N/A',
        mobileNumber: item.mobileNumber || 'N/A',
        designation: item.designation || 'N/A'
      }));
    } else if (title === 'Prisoner Offenses') {
      transformedData = data.map((item, index) => {
        // For storing raw data to reference later
        rawData.push([item.offense, item.offenseDate, item.remarks]);
        
        // Handle long remarks with View All link
        const remarks = item.remarks || 'N/A';
        const truncatedRemarks = remarks.length > 30 
          ? html(`<div>
              ${remarks.substring(0, 30)}... 
              <span class="text-primary" style="cursor:pointer;text-decoration:underline" 
                onclick="window.handleModalDetailClick('remarks', ${index})">
                (View All)
              </span>
            </div>`)
          : remarks;
          
        return {
          offense: item.offense || 'N/A',
          offenseDate: item.offenseDate || 'N/A',
          remarks: truncatedRemarks,
          offenseType: item.offenseType || 'N/A',
          description: item.description || 'N/A'
        };
      });
    } else if (title === 'Prisoner Belongings') {
      transformedData = data.map((item, index) => {
        // For storing raw data to reference later
        rawData.push([item.itemName, item.itemDescription]);
        
        // Handle long descriptions with View All link
        const description = item.itemDescription || 'N/A';
        const truncatedDescription = description.length > 30 
          ? html(`<div>
              ${description.substring(0, 30)}... 
              <span class="text-primary" style="cursor:pointer;text-decoration:underline" 
                onclick="window.handleModalDetailClick('description', ${index})">
                (View All)
              </span>
            </div>`)
          : description;
          
        return {
          itemName: item.itemName || 'N/A',
          itemDescription: truncatedDescription
        };
      });
    }
    
    // Store raw data for reference in the global handler
    currentModalDataRef.current = rawData;
    
    setProcessedData(transformDataForTableGrid(transformedData));
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {processedData.length > 0 ? (
            <Grid
              ref={modalGridRef}
              data={processedData}
              columns={columns}
              search
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
          ) : (
            <p>No data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Description Modal for long text */}
      <DescriptionModal 
        show={showDescModal} 
        handleClose={() => setShowDescModal(false)} 
        description={descModalContent} 
        title={descModalTitle}
      />
    </>
  );
};

export default PrisonerAdmissionModal; 