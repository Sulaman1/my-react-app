import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Grid, _ } from 'gridjs-react';
import { html } from 'gridjs';

const CheckInOutModal = ({ show, handleClose, checkInOutData }) => {
    const [showOfficerDetails, setShowOfficerDetails] = useState(false);
    const [selectedOfficers, setSelectedOfficers] = useState({ type: '', officers: [] });
    const [checkOutEntries, setCheckOutEntries] = useState([]);
    const [checkInEntries, setCheckInEntries] = useState([]);
    const [officerEntries, setOfficerEntries] = useState([]);
    
    const checkOutColumns = ['Check Out Date', 'Check Out Time', 'Darban Check Out Time', 'Check Out Vehicle', 'Police Officers'];
    const checkInColumns = ['Check In Date', 'Check In Time', 'Darban Check In Time', 'Check In Vehicle', 'Police Officers', 'Status'];
    const officerColumns = ['Name', 'Designation', 'Belt Number', 'Mobile Number'];

    useEffect(() => {
        loadData();
        
        // Register global handler function
        window.handleViewOfficersClick = (type) => {
            const officers = type === 'out' ? 
                checkInOutData?.policeOfficerCheckOut || [] : 
                checkInOutData?.policeOfficerCheckIn || [];
                
            handleShowOfficers(type === 'out' ? 'Check Out' : 'Check In', officers);
        };
        
        // Cleanup
        return () => {
            delete window.handleViewOfficersClick;
        };
    }, [checkInOutData]);

    const loadData = () => {
        if (!checkInOutData) return;
        
        try {
            // Format check out data
            const checkOutData = [[
                checkInOutData.checkOutDate || 'N/A',
                checkInOutData.checkOutDateTime || 'N/A',
                checkInOutData.checkOutDarbanDateTime || 'N/A', 
                checkInOutData.checkOutVehicleNumber || 'N/A',
                checkInOutData.policeOfficerCheckOut?.length > 0 ? 
                    html(`<button class="btn btn-sm btn-info" onclick="window.handleViewOfficersClick('out')">
                        View Officers (${checkInOutData.policeOfficerCheckOut.length})
                    </button>`) : 
                    'No officers recorded'
            ]];
            setCheckOutEntries(checkOutData);
            
            // Format check in data
            const checkInData = [[
                checkInOutData.checkInDate || 'N/A',
                checkInOutData.checkInDateTime || 'N/A',
                checkInOutData.checkInDarbanDateTime || 'N/A',
                checkInOutData.checkInVehicleNumber || 'N/A',
                checkInOutData.policeOfficerCheckIn?.length > 0 ? 
                    html(`<button class="btn btn-sm btn-info" onclick="window.handleViewOfficersClick('in')">
                        View Officers (${checkInOutData.policeOfficerCheckIn.length})
                    </button>`) : 
                    'No officers recorded',
                checkInOutData.status || 'N/A'
            ]];
            setCheckInEntries(checkInData);
        }
        catch (error) {
            console.error("Error loading check in/out data:", error);
            setCheckOutEntries([]);
            setCheckInEntries([]);
        }
    };

    const handleShowOfficers = (type, officers) => {
        console.log(`${type} Officers:`, officers);
        setSelectedOfficers({
            type: type,
            officers: officers || []
        });
        
        // Format officer data
        const officerData = (officers || []).map(officer => [
            officer.name || 'N/A',
            officer.designation || 'N/A',
            officer.beltNumber || 'N/A',
            officer.mobileNumber || 'N/A'
        ]);
        setOfficerEntries(officerData);
        setShowOfficerDetails(true);
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Check In/Out Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <h5>Check Out Information</h5>
                    {checkOutEntries.length > 0 ? (
                        <Grid
                            data={checkOutEntries}
                            columns={checkOutColumns}
                            pagination={false}
                            search={false}
                            className={{
                                container: 'custom-gridjs-container',
                                table: 'custom-gridjs-table'
                            }}
                        />
                    ) : (
                        <div className="alert alert-warning">No check out data available</div>
                    )}
                </div>

                <div className="mb-4">
                    <h5>Check In Information</h5>
                    {checkInEntries.length > 0 ? (
                        <Grid
                            data={checkInEntries}
                            columns={checkInColumns}
                            pagination={false}
                            search={false}
                            className={{
                                container: 'custom-gridjs-container',
                                table: 'custom-gridjs-table'
                            }}
                        />
                    ) : (
                        <div className="alert alert-warning">No check in data available</div>
                    )}
                </div>

                {showOfficerDetails && (
                    <div className="mt-4">
                        <h5>{selectedOfficers.type} Police Officers</h5>
                        <Grid
                            data={officerEntries}
                            columns={officerColumns}
                            pagination={false}
                            search={false}
                            className={{
                                container: 'custom-gridjs-container',
                                table: 'custom-gridjs-table'
                            }}
                        />
                        <div className="text-center mt-3">
                            <Button variant="secondary" size="sm" onClick={() => setShowOfficerDetails(false)}>
                                Hide Officer Details
                            </Button>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CheckInOutModal; 