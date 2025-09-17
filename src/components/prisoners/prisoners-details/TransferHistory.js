import { Grid, _ } from 'gridjs-react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import ImageCell from '../../../common/components/ImageCell';
import DescriptionModal from '../../../common/DescriptionModal';
import CheckInOutModal from './CheckInOutModal';
import { html } from 'gridjs';

const gridCols = [
    {
        'Authority': '', 
        'Prison From': '',
        'Prison To': '',
        'Reason': '',
        'Remarks': '',
        'Transfer Date': '',
        'Transfer Status': '',
        'Reject Reason': '',
        'Authority Letter': '',
        'Court Order': '',
        'Actions': '',
    }
];

const TransferHistory = (props) => {
    const gridRef = useRef();
    const [entries, setEntries] = useState([]);
    const [showDescModal, setShowDescModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [showCheckInOutModal, setShowCheckInOutModal] = useState(false);
    const [selectedCheckInOut, setSelectedCheckInOut] = useState(null);

    useEffect(() => {
        loadData();
        
        // Register global handler function
        window.handleTransferRemarkClick = (index) => {
            if (!props.cases?.prisonerTransfers?.length) return;
            
            if (index >= 0 && index < props.cases.prisonerTransfers.length) {
                const transfer = props.cases.prisonerTransfers[index];
                handleShowDescModal(transfer.remarks, "Remarks");
            }
        };

        // Register CheckInOut handler
        window.handleCheckInOutClick = (index) => {
            if (!props.cases?.prisonerTransfers?.length) return;
            
            if (index >= 0 && index < props.cases.prisonerTransfers.length) {
                const transfer = props.cases.prisonerTransfers[index];
                setSelectedCheckInOut(transfer.checkInOut);
                setShowCheckInOutModal(true);
            }
        };
        
        // Cleanup
        return () => {
            delete window.handleTransferRemarkClick;
            delete window.handleCheckInOutClick;
        };
    }, [props.cases]);

    const handleShowDescModal = (description, title) => {
        if (!description) return;
        
        // Format the description for better readability
        const formattedDescription = (
            <span style={{ padding: "0.5rem" }}>
                {description}
            </span>
        );
        
        setModalContent(formattedDescription);
        setModalTitle(title);
        setShowDescModal(true);
    };

    const loadData = () => {
        try {
            const gridData = props.cases.prisonerTransfers;
            if (gridData?.length > 0) {
                const filterdData = gridData.map((e, index) => {
                    // Create truncated remarks with View All link
                    const remarks = e.remarks || "N/A";
                    const truncatedRemarks = remarks.length > 30 
                        ? html(`<div>
                            ${remarks.substring(0, 30)}... 
                            <span class="text-primary" style="cursor:pointer;text-decoration:underline" 
                                onclick="window.handleTransferRemarkClick(${index})">
                                (View All)
                            </span>
                            </div>`)
                        : remarks;
                       
                    // Create Action button for CheckInOut details
                    const actionButton = html(`
                        <button class="btn btn-sm btn-primary" 
                            onclick="window.handleCheckInOutClick(${index})">
                            Check In/Out Details
                        </button>
                    `);
                        
                    return {
                        Authority: e.authority,
                        prisonfrom: e.oldPrison,
                        prisonto: e.newPrison,
                        reason: e.reason,
                        remarks: truncatedRemarks,
                        'Transfer Date': validateDate(e.transferDate),
                        'Transfer Status': e.transferStatus,
                        'Reject Reason': e.rejectReason,
                        authorityLetter: _(
                            <div>
                                <ImageCell value={e.authorityLetter} />
                            </div>
                        ),
                        courtOrder: _(
                            <div>
                                <ImageCell value={e.courtOrder} />
                            </div>
                        ),
                        actions: actionButton
                    };
                });
                setEntries(transformDataForTableGrid(filterdData));
            }
            else {
                setEntries([]);
            }
        }
        catch (error) {
            console.error(error);
            setEntries([]);
        }
    }

    return (
        <>
            <div className="custom-card">
                <h3 className="third-heading">
                    <span style={{ fontWeight: "bold" }}></span>
                </h3>
                {entries?.length < 1 ? (
                    <h4>
                        <b>No Records Found</b>
                    </h4>
                ) : (
                    <div className="row">
                        <Grid
                            ref={gridRef}
                            data={entries}
                            columns={Object.keys(gridCols[0])}
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
            
            <DescriptionModal 
                show={showDescModal} 
                handleClose={() => setShowDescModal(false)} 
                description={modalContent} 
                title={modalTitle}
            />

            <CheckInOutModal
                show={showCheckInOutModal}
                handleClose={() => setShowCheckInOutModal(false)}
                checkInOutData={selectedCheckInOut}
            />
        </>
    );
};

export default TransferHistory;


