import swal from 'sweetalert';

//Transfer
export const validateTransferFormFields = (formData) => {
  const errors = [];
  let validate = true;
  const {authority,authorityLetter,prisonToId,prisonerId,reason,remarks,transferDate} = formData;
  if(!prisonToId) {
    errors.push(' Prison To Is Required')
    validate = false;
  }
  if(!transferDate) {
    errors.push(' Transfer Date Is Required')
    validate = false;
  }
  if(!authority) {
    errors.push(' Authority Is Required');
    validate = false;
  }
  if(!reason) {
    errors.push(' Reason Is Required')
    validate = false;
  }
  if(!authorityLetter) {
    errors.push(' Authority Letter is Required');
    validate = false;
  }

  if(errors.length) {
    swal(
      'Required Fields',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

// 2. Medicine form validation
export const validateMedicineFormFields = (data, isEmployee) => {
  const errors = [];
  let validate = true;
  const { medicineId, quantityRequired, prisonId, medicineTypeId } = data;

  if (!medicineTypeId) {
    errors.push(" Medicine Type Is Required");
    validate = false;
  }
  if (!medicineId) {
    errors.push(" Medicine Is Required");
    validate = false;
  }
  if (!quantityRequired) {
    errors.push(" Quantity Is Required");
    validate = false;
  }
  if (isEmployee && !prisonId) {
    errors.push(" Prison Is Required");
    validate = false;
  }
  if (errors.length) {
    swal("Required Fields", errors.toString(), "warning");
  }
  return validate;
};
// 2. Medical form validation
export const validateMedicalFormFields = (data) => {
  const errors = [];
  let validate = true;
  const {  medicalIssue, medicalTreatment } = data;

  if (!medicalIssue) {
    errors.push(" Medical Issue Is Required");
    validate = false;
  }
  if (!medicalTreatment) {
    errors.push(" Medical Treatment Is Required");
    validate = false;
  }
  if (errors.length) {
    swal("Required Fields", errors.toString(), "warning");
  }
  return validate;
};

// 3.convict modal validation
export const validateConvictFormFields = (dataNew, isSkip) => {
  const errors = [];
  let validate = true;
  const { courtFine, decisionAuthorityId } = dataNew;

  if (!isSkip && !courtFine) {
    errors.push(' court Fine Is Required')
    validate = false;
  }
  if (!decisionAuthorityId) {
    errors.push(' Decision Authority Is Required')
    validate = false;
  }

  if (errors.length) {
    swal(
      'Required Fields',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

// 4.convict validation
export const validateConvictFields = (convict) => {
  const errors = [];
  let validate = true;
  const { prsNumber, year, convictionDate } = convict;

  if (!prsNumber) {
    errors.push(' Convict Number Is Required')
    validate = false;
  }
  if (!year) {
    errors.push(' Year Is Required')
    validate = false;
  }
  if (!convictionDate) {
    errors.push(' conviction Date Is Required')
    validate = false;
  }

  if (errors.length) {
    swal(
      'Required Fields',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

// 5.darban validation
export const validateDarbanFields = (darban) => {
  const errors = [];
  let validate = true;
  const { category} = darban?.prisonerNumber;
  const { prisonerAdmission } = darban;

  if (!category) {
    errors.push(' Prisoner Category Is Required')
    validate = false;
  }
  if(!prisonerAdmission?.policeOfficers?.length){
    errors.push(' Police Officer Is Required')
    validate = false;
  }

  if (errors.length) {
    swal(
      'Your Request is not valid',
      errors.toString(),
      'warning',
    );
  }
  return validate
};
// 6.professional information validation
export const validateEducationFields = (education) => {
  const errors = [];
  let validate = true;
  const { occupationId, formalEducationId, religiousEducationId, technicalEducationId } = education;

  if (!occupationId) {
    errors.push('Occupation Is Required ')
    validate = false;
  }
  if (!formalEducationId) {
    errors.push(' Formal Education Is Required ')
    validate = false;
  }
  if (!religiousEducationId) {
    errors.push(' Religious Education Is Required ')
    validate = false;
  }
  if (!technicalEducationId) {
    errors.push(' Technical Education Is Required ')
    validate = false;
  }

  if (errors.length) {
    swal(
      'These Fields Are Missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

// 7.hospital validation
export const validateHospitalFields = (hospital) => {
  const errors = [];
  let validate = true;
  const { diseaseId, hospitalAdmissionType } = hospital;

  if (!diseaseId) {
    errors.push(' disease is Missing')
    validate = false;
  }
  if (!hospitalAdmissionType) {
    errors.push(' hospital Admission Type is Required')
    validate = false;
  }

  if (errors.length) {
    swal(
      'These Fields Are Missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};
//Case Hearing Information modal 
export const validateHearingModalFields = (hearing) => {
  const errors = [];
  let validate = true;
  const { courtId, remandingCourtId, judgeId, nextHearingDate, lastHearingDate } = hearing;

  if (!courtId) {
    errors.push('Trial Court is Required')
    validate = false;
  }
  if (!remandingCourtId) {
    errors.push('Remanding Court is Required')
    validate = false;
  }
  if (!lastHearingDate) {
    errors.push('Last hearing date is Required')
    validate = false;
  }
  if (!nextHearingDate) {
    errors.push('Next hearing date is Required')
    validate = false;
  }
  if (errors.length) {
    swal(
      'These Fields Are Missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

export const validateMedicalStoreFields = (medical) => {
  const errors = [];
  let validate = true;
  const { prisonId, medicineTypeId, medicineId, quantityType, quantity} = medical;

  if (!medicineTypeId) {
    errors.push('Medicine Type is Required')
    validate = false;
  }
  if (!medicineId) {
    errors.push(' Medicine is Required ')
    validate = false;
  }
  if (!prisonId) {
    errors.push(' prison is Required ')
    validate = false;
  }
  if (!quantityType) {
    errors.push(' Quantity Type is Required ')
    validate = false;
  }
  if (!quantity) {
    errors.push(' Quantity is Required ')
    validate = false;
  }
 

  if (errors.length) {
    swal(
      'These Fields Are Missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};

export const validateInventoryFields = (inventory) => {
  const errors = [];
  let validate = true;
  const { prisonId, inventoryType, inventoryId, quantity} = inventory;

  if (!inventoryType) {
    errors.push('Inventory Type is Required')
    validate = false;
  }
  if (!inventoryId) {
    errors.push(' Inventory is Required ')
    validate = false;
  }
  if (!prisonId) {
    errors.push(' prison is Required ')
    validate = false;
  }
  if (!quantity) {
    errors.push(' Quantity is Required ')
    validate = false;
  }
 
  if (errors.length) {
    swal(
      'These Fields Are Missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};
export const validateGuestFields = (guests) => {
  const errors = [];
  let validate = true;
  const { fullName, designation, organization, visitDate} = guests;

  if (!fullName) {
    errors.push('full Name Type')
    validate = false;
  }
  if (!designation) {
    errors.push(' Designation')
    validate = false;
  }
  if (!organization) {
    errors.push(' Organization')
    validate = false;
  }
  if (!visitDate) {
    errors.push(' visit Date')
    validate = false;
  }
 
 
  if (errors.length) {
    swal(
      'The following fields are missing',
      errors.toString(),
      'warning',
    );
  }
  return validate
};