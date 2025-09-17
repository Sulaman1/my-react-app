import React from 'react';
import { getItemFromList } from '../../../../../common/Helpers';

const PrintQueue = ({ printQueueObj, Logo, lookups }) => {

	const styles = {
		body: {
			fontFamily: "'Courier New', monospace",
			fontSize: '14px',
			width: '300px',
			margin: 'auto',
			textAlign: 'center',
		},
		receipt: {
			border: '1px solid #000',
			padding: '10px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		receiptH2: {
			margin: '0',
			fontSize: '16px',
		},
		items: {
			textAlign: 'left',
			width: '100%',
			// marginTop: '-13px',
		},
		itemsDiv: {
			display: 'flex',
			justifyContent: 'space-between',
		},
		topLine: {
			borderTop: '1px dashed #000',
			paddingTop: '5px',
			textAlign: 'center',
		},
		topLine2: {
			borderTop: '1px dashed #000',
			marginTop: '10px',
			paddingTop: '0px',
			textAlign: 'center',
		},
		queueNumber: {
			width: '100px',
			height: '100px',
			border: '2px solid black',
			borderRadius: '50%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '24px',
			fontWeight: 'bold',
			margin: '10px auto',

		},
		footer: {
			marginTop: '8px',
			fontSize: '12px',
		},
		mb_0: {
			marginBottom: '0px'
		}
	};

	const visits = printQueueObj?.visitorsInfo?.map((visitor) => {
		return (
			<div style={styles.items}>
				<div style={styles.itemsDiv}>Visitor's Name: <span>{visitor?.person?.personalInfo?.fullName}</span></div>
				<div style={styles.itemsDiv}>{visitor?.person?.personalInfo?.relationshipType || getItemFromList(lookups?.relationshipTypes, visitor?.person?.personalInfo?.relationshipTypeId )}: <span>{visitor?.person?.personalInfo?.relationshipName}</span></div>
				<div style={styles.itemsDiv}>CNIC: <span>{visitor?.person?.personalInfo?.cnic}</span></div>
			</div>
		)
	})

	return (
		<div style={styles.body} id="my-element">
			<style>
				{`
                @media print {
                    body {
                -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}
			</style>
			<div style={styles.receipt}>
				{Logo()}
				<h2 style={styles.receiptH2}>{printQueueObj?.prisonerInfo?.prisonName}</h2>
				<p style={styles.mb_0}>Date: {printQueueObj?.currentDate}</p>
				<div style={styles.queueNumber}>{printQueueObj?.queueNo}</div>
				<div style={styles.topLine}>
					<h2 style={styles.receiptH2}>Visitor Queue Ticket</h2>
				</div>
				{visits}
				<div style={styles.topLine2}>
					<h2 style={styles.receiptH2}>Meeting With</h2>
				</div>
				<div style={styles.items}>
					<div style={styles.itemsDiv}>Prisoner's Name: <span>{printQueueObj?.prisonerInfo?.fullName}</span></div>
					<div style={styles.itemsDiv}>{printQueueObj?.prisonerInfo?.relationshipType}: <span>{printQueueObj?.prisonerInfo?.relationshipName}</span></div>
				</div>
				<div style={styles.footer}>
					<p style={{ textAlign: 'center' }}>PMIS is implemented by UNODC and Funded by {process.env.REACT_APP_FUNDED_BY_SHORT}.</p>
				</div>
			</div>
		</div>
	);
};

export default PrintQueue;

