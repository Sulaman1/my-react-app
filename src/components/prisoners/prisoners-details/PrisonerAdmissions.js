import React, { useEffect, useRef, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import PrisonerAdmissionModal from './PrisonerAdmissionModal';

const PrisonerAdmissions = ({ prisoner }) => {
  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);

  useEffect(() => {
    loadData();
  }, [prisoner]);

  const handleShowModal = (title, data, columns) => {
    setModalTitle(title);
    setModalData(data);
    setModalColumns(columns);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData([]);
    setModalColumns([]);
  };

  // Define button styles for consistency
  const buttonStyle = "tooltip btn btn-sm btn-primary mx-1 py-2 px-2 waves-effect waves-light ";

  const loadData = () => {
    if (prisoner?.prisonerAdmissions?.length > 0) {
      const admissionData = prisoner?.prisonerAdmissions.map((admission, index) => {
        // Create action buttons for each child array
        const actionButtons = _(
          <div className="d-flex justify-content-center">
              <button 
                className={buttonStyle+ "btn-success" }
                onClick={() => handleShowModal(
                  'Prisoner Numbers', 
                  admission?.prisonerNumbers,
                  ['Prison', 'Category', 'Year', 'PRS Number', 'Darban Entry Date', 'No. of Warrants']
                )}
                disabled={admission?.prisonerNumbers?.length === 0}
              >
                <i className="icon-number"></i>
                <span> Prisoner Numbers</span>
              </button>
            
              <button 
                className={buttonStyle + "btn-info"}
                onClick={() => handleShowModal(
                  'Police Officers', 
                  admission?.policeOfficers,
                  ['Name', 'Belt Number', 'Mobile Number', 'Designation']
                )}
                disabled={admission?.policeOfficers?.length === 0}
              >
                <i className="icon-user"></i>
                <span> Police Officers</span>
              </button>
            
              <button 
                className={buttonStyle + "btn-warning"}
                onClick={() => handleShowModal(
                  'Prisoner Offenses', 
                  admission.prisonerOffenses,
                  ['Offense', 'Offense Date', 'Remarks','Offense Type',  'Description']
                )}
                disabled={admission?.prisonerOffenses?.length === 0}
              >
                <i className="icon-inquiry"></i>
                <span> Prisoner Offenses</span>
              </button>
            
              <button 
                className={buttonStyle + "btn-success"}
                onClick={() => handleShowModal(
                  'Prisoner Belongings', 
                  admission?.prisonerBellongings,
                  ['Item Name', 'Item Description']
                )}
                disabled={admission?.prisonerBellongings?.length === 0}
              >
                <i className="icon-visitor"></i>
                <span> Prisoner Belongings</span>
              </button>
          </div>
        );

        return {
          admissionDate: validateDate(admission?.admissionDate) || 'N/A',
          convictionDate: validateDate(admission?.convictionDate) || 'N/A',
          releaseDate: validateDate(admission?.releaseDate) || 'N/A',
          policeCarNumber: admission?.policeCarNumber || 'N/A',
          prisonName: admission?.prisonName || 'N/A',
          actions: actionButtons
        };
      });

      setEntries(transformDataForTableGrid(admissionData));
    } else {
      setEntries([]);
    }
  };

  const gridColumns = [
    'Admission Date', 
    'Conviction Date', 
    'Release Date', 
    'Police Car Number', 
    'Prison Name',
    'Actions'
  ];

  return (
    <>
      <div className="custom-card">
        {entries?.length < 1 ? (
          <h4>
            <b>No Records Found</b>
          </h4>
        ) : (
          <div className="row">
            <Grid
              ref={gridRef}
              data={entries}
              columns={gridColumns}
              search
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
          </div>
        )}
      </div>

      {/* Use the renamed PrisonerAdmissionModal component */}
      <PrisonerAdmissionModal 
        show={showModal}
        handleClose={handleCloseModal}
        title={modalTitle}
        data={modalData}
        columns={modalColumns}
        prisoner={prisoner}
      />
    </>
  );
};

export default PrisonerAdmissions; 