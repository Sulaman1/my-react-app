export const dashApi = {

    outOfBarrackDetails: "/services/app/DashboardData/GetOutOfBarrackDetails",
    prisonerStats: "/services/app/DashboardData/GetPrisonerStats", 
    hospitalStats: "/services/app/DashboardData/GetAllHospitalStats",
    hearingStats: "/services/app/DashboardData/GetAllHearingStats", 
    speacialStats: "/services/app/DashboardData/GetAllSpeacialStats", 
    actWiseStats: "/services/app/DashboardData/GetAllActWiseStats", 
    hospitalStat: "/services/app/DashboardData/GetAllHospitalStat",
    visitorStats: "/services/app/DashboardData/GetAllVisitorStats", 
    countryWise: "/services/app/DashboardData/GetAllCountryWise", 
    prisonerTypes: "/services/app/DashboardData/GetAllPrisonerTypes", 
    medicineStore: "/services/app/DashboardData/GetAllMedicineStore",
    barrackCappacity: "/services/app/DashboardData/GetAllBarrackStats", 
    employeeStats: "/services/app/DashboardData/GetAllEmployeeStats",  
    employeesGenderStats: "/services/app/DashboardData/GetAllEmployeesGenderStats", 
    empAttendanceAndLeave: "/services/app/DashboardData/GetAllEmployeesAttendanceAndLeaveStats", 
    employeesDepartmentStats: "/services/app/DashboardData/GetAllEmployeesDepartmentStats", 
    prisonerAgeCategoryWiseStats: "/services/app/DashboardData/GetPrisonerAgeCategoryWiseStats", 
    medicineDashboardStats: "/services/app/DashboardData/GetAllMedicineDashboardStats",  
    guestStats: "/services/app/DashboardData/GetAllGuestsStats",  
    mostIssuedItemsStats: "/services/app/DashboardData/GetMostIssuedItemsStats",  
    prevalentDisease: "/services/app/DashboardData/GetPrevalentDisease",  
    employeeInventoryStats: "/services/app/DashboardData/GetEmployeeInventoryStats",  
    allIgPrisonWiseStats: "/services/app/DashboardData/GetAllIgPrisonWiseStats",  
    inventoryStats: "/services/app/DashboardData/GetInventoryStats",  
    prisonerDetailedStats: (category, admissionStatus) => 
      `/services/app/DashboardData/GetPrisonerStatsData?prisonerCategory=${category}&admissionStatus=${admissionStatus}`,
    hospitalDetailedStats: (type, duration) =>
      `/services/app/DashboardData/GetAllHospitalStatsData?hospitalAdmissionType=${type}&duration=${duration}`,
    hearingDetailedStats: (duration) =>
      `/services/app/DashboardData/GetAllHearingStatsData?duration=${duration}`,
    barrackDetailedStats: (allocated) =>
      `/services/app/DashboardData/GetAllBarrackStatsData?allocated=${allocated}`,
    employeeDetailedStats: (duration) =>
      `/services/app/DashboardData/GetAllEmployeeStatsData?duration=${duration}`,
    guestDetailedStats: (duration) =>
      `/services/app/DashboardData/GetAllGuestsStatsData?duration=${duration}`,
}

// Enums for the API parameters
export const DurationType = {
  TODAY: 1,
  WEEK: 2,
  MONTH: 3
};

export const PrisonerCategory = {
  UTP: 1,
  CONVICT: 2
};

export const HospitalAdmissionType = {
  OPD: 1,
  IPD: 2,
  OUTSIDE_HOSPITAL: 3
};

export const BarrackAllocation = {
  ALLOCATED: 1,
  UNALLOCATED: 2,
  TOTAL: 3
};