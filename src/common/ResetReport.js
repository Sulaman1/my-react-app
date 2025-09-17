import swal from "sweetalert";
import { PayloadFtn } from "../modules/reports/helper/Payload";

export const createCleanPayload = (preservedFields = {}) => {
  const cleanPayload = {
    prisonerBasicInfo: {
      admissionDate: {},
      dateOfBirth: {},
      year: {},
      prisonId: [],
    },
    prisonerAdvancedInfo: {
      convictionDate: {},
      bannedOrganizationsId: [],
      prisonerTypeId: [],
      prisonerSubTypeId: [],
    },
    prisonerAccommodation: {
      allocationDate: {},
      noOfAllocations: null,
      barrackId: [],
    },
    person: {
      personalInfo: {},
      contactInfo: {},
      address: {},
      professionalInfo: {},
      biometricInfo: {}
    },
    dependents: {
      dateOfBirth: {},
      genderId: [],
      relationshipId: []
    },
    prisonerCase: {
      hearing: {},
      appeal: {},
      productionOrderDate: {},
      firDate: {},
      decisionDate: {},
    },
    prisonerRelease: {
      releaseDate: {},
      releaseTypeId: [],
      releaseCourtId: []
    },
    prisonerRemissions: {
      remissionDate: {},
      remissionTypeId: [],
      remissionDaysEarned: null
    },
    prisonerVisitors: {
      visitDate: {},
      address: {},
      numberOfVisits: null,
      fullName: '',
      cnic: '',
    },
    checkInOuts: {
      checkOutRequestDateTime: {},
      checkReason: [],
      numberOfCheckouts: null
    },
    prisonerTransfers: {
      transferDate: {},
      numberOfTransfers: null,
      oldPrisonId: [],
      newPrisonId: []
    },
    hospitalAdmissions: {
      admissionDate: {},
      dischargeDate: {},
      checkUpDate: {},
      diseaseId: [],
      doctorId: [],
      hospitalId: [],
      hospitalAdmissionType: [],
      treatmentNumber: {},
      checkup: {
        medicines: []
      }
    },
    medicalInfo: {
      bloodGroupId: [],
      diseasesIds: [],
      vaccination: [],
      height: '',
      markOfIdentification: ''
    }
  };

  // Deep merge preserved fields into clean payload
  Object.keys(preservedFields).forEach(key => {
    if (typeof preservedFields[key] === 'object' && preservedFields[key] !== null) {
      cleanPayload[key] = {
        ...cleanPayload[key],
        ...preservedFields[key]
      };
    } else {
      cleanPayload[key] = preservedFields[key];
    }
  });

  return cleanPayload;
};

export const handleResetReport = ({
  setFormPayload,
  setShouldRemount,
  setRefreshKey,
  setActiveTab,
  preservedFields = {}
}) => {
  swal({
    title: "Reset Report",
    text: "Are you sure you want to reset all fields?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willReset) => {
    if (willReset) {
      // Create clean payload
      const cleanPayload = JSON.parse(JSON.stringify(PayloadFtn));
      
      // Apply preserved fields
      Object.keys(preservedFields).forEach(key => {
        if (cleanPayload[key]) {
          cleanPayload[key] = {
            ...cleanPayload[key],
            ...preservedFields[key]
          };
        }
      });

      setFormPayload(cleanPayload);
      
      // Force remount
      setShouldRemount(false);
      setRefreshKey(prev => prev + 1);
      
      setTimeout(() => {
        setShouldRemount(true);
        setActiveTab('basic');
      }, 50);
      
      swal("Report has been reset!", {
        icon: "success",
      });
    }
  });
};

export const handleCleanup = (setFormPayload, PayloadFtn) => {
  // Create a deep clone of PayloadFtn to avoid reference issues
  const cleanPayload = JSON.parse(JSON.stringify(PayloadFtn));
  
  // Get prison ID from session
  const rawData = sessionStorage.getItem("user");
  const prisonId = JSON.parse(rawData)?.employee?.prisons.map(
    (e) => e.prisonId
  );

  // Set clean payload with only prisonId preserved
  setFormPayload({
    ...cleanPayload,
    prisonerBasicInfo: {
      ...cleanPayload.prisonerBasicInfo,
      prisonId: prisonId,
    },
  });
}; 