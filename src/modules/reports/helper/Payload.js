
const rawData = sessionStorage.getItem("user"); 
const prisonId = JSON.parse(rawData)?.employee?.prisons.map((e)=> e.prisonId);
export const PayloadFtn =  {
    prisonerBasicInfo: {
        admissionDate: {
            start: "",
            end: "",
        },
        dateOfBirth: {
            start: "",
            end: "",
        },
        year:{
            start: "",
            end: "",
        },
        prisonId: prisonId,
    },
    prisonerAdvancedInfo:{
        convictionDate: {
            start: "",
            end: "",
        },
        darbanEntryDate: {
            start: "",
            end: "",
        },
    },
    person: {
        professionalInfo: {},
        personalInfo:{},
        address:{
        },
        biometricInfo: {
            fingerprintsCount: "",
            picturesCount: "",
        },
        contactInfo: {},
    },
    dependents: {
        dateOfBirth: {
            start: "",
            end: "",
        },
    },
    offenses:{
        dateRange: {
            start: "",
            end: "",
        },
    },
    prisonerBellongings: {
    },
    prisonerAdmission: {
       
       
        releaseDate: {
            start: "",
            end: "",
        },
    },
    prisonerNumber: {
        darbanEntryDate: {
            start: "",
            end: "",
        },
       
    },
    personalInfo: {
       
    },

    medicalInfo: {
    },
    professionalInfo: {
    },
    biometricInfo: {},
    contactInfo: {},
    address: {
    },
    prisonerAccommodation: {
        allocationDate: {
            start: "",
            end: "",
        },
    },
    prisonerCase: {
        hearing: {    
            hearingDate: {
                start: "",
                end: "",
            },
        },
        appeal:{
            appealDate: {
                start: "",
                end: "",
            },
            decisionDate: {
                start: "",
                end: "",
            },
        },
        productionOrderDate: {
            start: "",
            end: "",
        },
        firDate: {
            start: "",
            end: "",
        },
        decisionDate: {
            start: "",
            end: "",
        },
        sentenceDate: {
            start: "",
            end: "",
        },
        releaseDate: {
            start: "",
            end: "",
        },
        probableReleaseDate: {
            start: "",
            end: "",
        },
        firYear:[],

    },
    prisonerRelease: {
        releaseDate: {
            start: "",
            end: "",
        },
    },
    prisonerRemissions: {
        remissionDate: {
            start: "",
            end: "",
        },
    },
    checkInOuts: {
        checkOutRequestDateTime: {
            start: "",
            end: "",
        },
    },
    prisonerTransfers: {
        transferDate: {
            start: "",
            end: "",
        },
    },
    prisonerVisitors: {
        visitDate: {
            start: "",
            end: "",
        },
        address:{
            countryId: "",
            provinceId: "",
            districtId: "",
            cityId: "",
        },
    },

   
    hospitalAdmissions: {
        checkup:{
            medicines: [],
        },
        admissionDate: {
            start: "",
            end: "",
        },
        dischargeDate: {
            start: "",
            end: "",
        },
        checkUpDate: {
            start: "",
            end: "",
        },
    },
};