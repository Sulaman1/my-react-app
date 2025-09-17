import { Grid, _ } from "gridjs-react";
import React, { useEffect, useRef, useState } from "react";
import {
  transformDataForTableGrid,
  validateDate,
} from "../../../common/Helpers";
import DescriptionModal from "../../../common/DescriptionModal";

const InPrisonEducation = ({ education }) => {
  const [loadedEducationEntries, setEducationEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const gridRef = useRef(null);

  const EducationHeaders = [
    {
      "Education (تعلیم)": "",
      "Education Details (تعلیم کی تفصیلات)": "",
      "start Date (شروع کرنے کی تاریخ)": "",
      "End Date (ختم ہونے کی تاریخ)": "",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (education?.prisonerEducations?.length > 0) {
      const filteredData = education?.prisonerEducations?.map((e, index) => {
        const details = e?.educationDetails || "N/A";
        const truncatedDetails = details.length > 15 
          ? `<div>
              ${details.substring(0, 15)}... 
              <span class="text-primary" style="cursor:pointer;text-decoration:underline" 
                onclick="window.handleEducationClick(${index})">
                (View All)
              </span>
            </div>`
          : details;

        return {
          education: e?.education,
          educationDetails: truncatedDetails,
          startDate: validateDate(e?.startDate),
          endDate: validateDate(e?.endDate),
        };
      });
      setEducationEntries(transformDataForTableGrid(filteredData));
    } else {
      setEducationEntries([]);
    }
  };

  // Add this useEffect to set up the global click handler
  useEffect(() => {
    window.handleEducationClick = (index) => {
      const content = education?.prisonerEducations[index]?.educationDetails;
      handleShowModal(content, "Education Details");
    };

    // Cleanup
    return () => {
      delete window.handleEducationClick;
    };
  }, [education]);

  const handleShowModal = (content, title) => {
    setModalContent(content);
    setModalTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderLongText = (text, title, characterLimit = 15) => {
    if (!text || text === "N/A") return "N/A";
    
    const trimmedText = text.trim();
    
    if (trimmedText.length <= characterLimit) {
        return trimmedText;
    }

    const handleShowFullText = () => {
        const formattedDescription = (
            <span style={{ whiteSpace: 'pre-wrap' }}>
                {trimmedText}
            </span>
        );
        handleShowModal(formattedDescription, title);
    };

    return (
        <>
            {`${trimmedText.substring(0, characterLimit)}... `}
            <span 
                className="text-primary"
                onClick={handleShowFullText}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
                (View All)
            </span>
        </>
    );
};

  return (
    <>
     <DescriptionModal 
            show={showModal}
            handleClose={handleCloseModal}
            description={modalContent}
            title={modalTitle}
          />
      {loadedEducationEntries?.length > 0 ? (
        <Grid
          ref={gridRef}
          data={loadedEducationEntries}
          columns={[
            ...Object.keys(EducationHeaders[0]).map(key => ({
              name: key,
              formatter: (cell) => _(<div dangerouslySetInnerHTML={{ __html: cell }} />)
            }))
          ]}
          search={true}
          sort={true}
          pagination={{
            enabled: true,
            limit: 10,
          }}
        />
      ) : (
        <div className="custom-card">
          <h4 className="third-heading">
            {" "}
            <b>No Records Found</b>
          </h4>
        </div>
      )}
    </>
  );
};

export default InPrisonEducation;
