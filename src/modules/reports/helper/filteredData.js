import { getItemFromList, validateDate } from "../../../common/Helpers";

export const filteredMasterData = (rowData, key, rawData, lookUps) => {
	const id = rowData.Id;
	let childData = [];
	const filtered = rawData.filter((obj) => obj.id === id)
	childData = key == 'Total Cases' ? filtered[0]['prisonerCase'] : key == 'Dependents' ? filtered[0]['dependents'] :
		key == 'Visitors' ? filtered[0]['prisonerVisitors'] : key == 'Total Transfers' ? filtered[0]['prisonerTransfers'] :
			key == 'No. of OPDs' ? filtered[0]['hospitalAdmissionsOPD'] : key == 'No. of IPDs' ? filtered[0]['hospitalAdmissionsIPD'] :
				key == 'No. of outside Hospital visits' ? filtered[0]['hospitalAdmissionsOH']
					: key == 'Visits Details' ? filtered[0]['visitsDetails'] : []
	if (childData.length > 0) {
		const mappedData = childData.map(ele => {
			if (key == 'Total Cases') {
				return {
					Id: ele.id, 'Decision Authority': ele.decisionAuthority || "", 'Decision Date': validateDate(ele.decisionDate) ? new Date(ele.decisionDate).toDateString() : "" || '', 'Zone': ele.zone || ele?.status == "Under trail case" ? "UTP Case" : ele?.zone,
					'Sentence': ele.sentence || ele?.status == "Under trail case" ? "UTP Case" : ele.sentence, 'Sentence Date': validateDate(ele.sentenceDate) ? new Date(ele.sentenceDate).toDateString() : "" || '', 'Status': ele.status, 'Court Production Date': validateDate(ele.productionOrderDate) ? new Date(ele.productionOrderDate).toDateString() : "" || '',
					'Court Fine': ele.courtFine || '', 'Under Sections': ele.underSections || '', 'Hearings': `#${ele.hearings?.length}` || 0,
					'Remissions': `#${ele.prisonerRemissions?.length}` || 0
				}
			}
			else if (key == 'Dependents') {
				return {
					'Name': ele.name || '', 'Gender': ele.gender || '', 'Relationship': ele.relationship || '', 'Age': ele.ageCategory || '', 'Other Details': ele.otherDetails || ''
				}
			}
			else if (key == 'Visitors') {

				// return {
				// 	'Name': ele.fullName || '', 'Relation': ele.relationship || '', 'Purpose': ele.purpose || '', 'Description': ele.description || '',
				// 	'Luggage Details': ele.luggageDetail, 'Address': ele.address || '', 'Visit Date': validateDate(ele.visitDate) ? new Date(ele.visitDate).toDateString() : "" || ''
				// }
				 return filterVisitorInfo(ele)
			
			}
			else if (key == 'No. of OPDs') {
				return  {
					'admission Date': validateDate(ele.admissionDate) ? new Date(ele.admissionDate).toDateString() : "" || '', 'Diagnosis': ele.diagnosis || '', 'Disease': ele.disease || '', 'Hospital': ele.hospital || '',
					'investigations': ele.investigations, 'known Case Of': ele.knownCaseOf || '', 'discharge Date': validateDate(ele.dischargeDate) ? new Date(ele.dischargeDate).toDateString() : "" || '',
					'presently Complaining': ele.presentlyComplaining || '', 'Special Diet': ele.specialDiet, 'Treatment': ele.treatment
				}
			}
			else if (key == 'No. of IPDs') {
				return {
					'admission Date': validateDate(ele.admissionDate) ? new Date(ele.admissionDate).toDateString() : "" || '', 'Diagnosis': ele.diagnosis || '', 'Disease': ele.disease || '', 'Hospital': ele.hospital || '',
					'investigations': ele.investigations, 'known Case Of': ele.knownCaseOf || '', 'discharge Date': validateDate(ele.dischargeDate) ? new Date(ele.dischargeDate).toDateString() : "" || '',
					'presently Complaining': ele.presentlyComplaining || '', 'Special Diet': ele.specialDiet, 'Treatment': ele.treatment
				}
			}
			else if (key == 'No. of outside Hospital visits') {
				return {
					'admission Date': validateDate(ele.admissionDate) ? new Date(ele.admissionDate).toDateString() : "" || '', 'Diagnosis': ele.diagnosis || '', 'Disease': ele.disease || '', 'Hospital': ele.hospital || '',
					'investigations': ele.investigations, 'known Case Of': ele.knownCaseOf || '', 'discharge Date': validateDate(ele.dischargeDate) ? new Date(ele.dischargeDate).toDateString() : "" || '',
					'presently Complaining': ele.presentlyComplaining || '', 'Special Diet': ele.specialDiet, 'Treatment': ele.treatment
				}
			}
			else if (key == 'Visits Details') {
				return {
					'Full Name': ele.fullName || '', 'Prisoner Number': ele.prisonerNumber || '', 'Father Name': ele.relationshipName, 'Category': ele.prisonerCategory || '',
					'Lugage Details': ele.lugageDetail || '', 'CNIC': ele.cnic || '', 'Relationship': ele.relationship || '', "Lugage Detail": ele.lugageDetail || '', 'Admission Date': validateDate(ele.admissionDate) ? new Date(ele.admissionDate).toDateString() : "" || '',
					'Visit Date': validateDate(ele.visitDate) ? new Date(ele.visitDate).toDateString() : "" || '',
				}
			}
			else {
				return {
					'Prison From': ele.prisonFrom || '', 'Prison To': ele.prisonTo || '', 'Authority': ele.authority || '', 'status': ele.status || '',
					'Cancel Reason': ele.cancelReason, 'Reject Reason': ele.rejectReason || '', 'Remarks': ele.remarks || '', 'Transfer Date': validateDate(ele.transferDate) ? new Date(ele.transferDate).toDateString() : "" || ''
				}
			}
		});
		return { mappedData, childData, key }
	} else {
		return {}
	}

	function filterVisitorInfo(data) {
	
		let visitInfo = data.visitorsInformation.map(visitor => {
		  return {
			 'Name': visitor?.person.personalInfo.fullName,
			 'Purpose': visitor?.purpose,
			 'Luggage Details': visitor?.luggageDetail,
			 'Relation': getItemFromList(lookUps?.relationships, visitor?.relationshipId) || "",
			 'Description': visitor?.description,
			 'Adress': `${visitor?.person?.permanentAddress?.streetAddress || ""} ${visitor?.person?.permanentAddress?.city  || ""}`,
			 'Visit Date': validateDate(data.visitDate) ? new Date(data.visitDate).toDateString() : "" || '',
		  };
		})
		return visitInfo;
	  
	}
}


