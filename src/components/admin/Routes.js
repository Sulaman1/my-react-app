// Routes.js
import Dashboard from '../admin/dashboard/Dashboard';
//import Users from '../admin/users/Users';

const RoutesConfig = [
  { path: '/dashboard', component: Dashboard },
  //{ path: '/users', component: Users },
];

export default RoutesConfig;


// import AddAccount from "./administration/AddAccount";
// import BiomatricThanks from "../prisoners/Components/common/BiomatricThanks";
// import ManageEmployee from "./administration/ManageEmployee";
// import EmployeeDetails from "./administration/EmployeeDetails";
// import UsersOnline from "./administration/UsersOnline";
// import PrisonersSearch from "./search/PrisonersSearch";
// import ManageRoles from "./system-settings/ManageRoles";
// import Prisoners from "../prisoners/Prisoners";
// import ManageDarban from "../darbans/ManageDarban";
// import ManageGuests from "../guests/ManageGuests";
// //Account
// import AccountSetting from "../profile-settings/AccountSetting";
// import HelpSection from "../profile-settings/HelpSection";
// import LookupRoutes from "./system-settings/LookupsRoute";
// import PrisonerDetails from "../prisoners/PrisonerDetails";
// import ViewDetails from "../prisoners/prisoners-details/ViewDetails";
// import ManageCheckoutCheckin from "../prisoners/Components/CheckoutCheckin";
// import EmployeeListNew from "./administration/EmployeeListNew";
// import ManageReleasePrisoner from "../prisoners/Components/ReleasePrisoner";
// import ManageConvictPrisoner from "../prisoners/Components/ConvictPrisoner";
// import PrisonerTransfer from "../prisoners/Components/PrisonerTransfer";
// import Remission from "../prisoners/Components/Remission";
// import ManageVisitors from "./administration/visitor/ManageVisitors";
// //import Allocation from "./administration/barrack-allocation/Allocation";
// import AddVisitors from "./administration/visitor/AddVisitors";
// import Admission from "../../modules/hospital/Admission";
// import OutsideAdmission from "../../modules/hospital/OutsideAdmission";
// import OPDAdmission from "../../modules/hospital/OPDAdmission";
// import IPDAdmission from "../../modules/hospital/IPDAdmission";
// import MedicalInfo from "../../modules/medical/MedicalInfo";
// import BlockVisitor from "./administration/visitor/BlockVisitor";
// import AddHearing from "../../modules/courtProduction/AddHearing";
// import CourtProductionList from "../../modules/courtProduction/CourtProductionList";
// import MedicalStores from "../../modules/medical/MedicalStores";
// import PrescribeList from "../../modules/medical/PrescribeList";
// import EmployeePriscriptions from "../../modules/medical/EmployeePriscriptions";
// import NotificationsList from "../../modules/notifications/NotificationsList";
// import MedicineTransfer from "../../modules/medical/MedicineTransfer";
// import MedicalDetails from "../../modules/hospital/MedicalDetails";
// import Attendance from "../../modules/hr/Attendance/Attendance";
// import Leaves from "../../modules/hr/Leave/Leaves";
// import MasterReport from "../../modules/reports/MasterReport";
// import LeaveApproval from "../../modules/hr/LeaveApproval/LeaveApproval";
// import PrintDetails from "../prisoners/prisoners-details/PrintDetails";
// import PrintMarasla from "../../modules/courtProduction/components/PrintMarasla";
// import DarbanReport from "../../modules/reports/DarbanReport";
// import CheckinCheckoutReport from "../../modules/reports/CheckinCheckoutReport";
// import UnderTrialReport from "../../modules/reports/UnderTrialReport";
// import ConvictReport from "../../modules/reports/ConvictReport";
// import TreatmentWiseMedicalReport from "../../modules/reports/TreatmentWiseMedicalReport";
// import PrisonerWiseMedicalReport from "../../modules/reports/PrisonerWiseMedicalReport";
// import ManageInventory from "../../modules/inventory/ManageInventory";
// import ManageInventoryItems from "../../modules/inventory/ManageInventoryItems";
// import ManageInventoryTransfer from "../../modules/inventory/ManageInventoryTransfer";
// import VisitorsPrisonerWiseReport from "../../modules/reports/VisitorsPrisonerWiseReport";
// import VisitorsWiseReport from "../../modules/reports/VisitorsWiseReport";
// import InventoryReceivingReport from "../../modules/reports/InventoryReceivingReport";
// import InventoryIssuanceReport from "../../modules/reports/InventoryIssuanceReport";
// import CourtProductionReport from "../../modules/reports/CourtProductionReport";
// import UnderTrialDashboard from "./dashboard/UnderTrialDashboard";
// import ConvictDashboard from "./dashboard/ConvictDashboard";
// import CourtProductionDashboard from "./dashboard/CourtProductionDashboard";
// import CircleOfficeDashboard from "./dashboard/CircleOfficeDashboard";
// import VisitorsDashboard from "./dashboard/VisitorsDashboard";
// import HospitalDashboard from "./dashboard/HospitalDashboard";
// import MedicalStoreDashboard from "./dashboard/MedicalStoreDashboard";
// import InventoryDashboard from "./dashboard/InventoryDashboard";
// import HRDashboard from "./dashboard/HRDashboard";
// import UserActivity from "../../modules/reports/UserActivity";
// import GuestReport from "../../modules/reports/GuestReport";
// import UserActivityPrint from "../../modules/reports/UserActivityPrint";
// import EmployeeDetailPrint from "./administration/EmployeeDetailPrint";
// import ManageAppealManagement from "../../modules/appealManagement/ManageAppealManagement";
// import ManageHearingCheckinOut from "../prisoners/Components/ManageHearingCheckinOut";
// import HistoryTicket from "../prisoners/prisoners-details/HistoryTicket";
// import ManageApproveEmployee from "./administration/ManageApproveEmployee";
// import ManageUpcomingRelease from "../../modules/upcomingReleases/ManageUpcomingRelease";
// import Historian from "./administration/history/Historian";

// import TableDemo from "../prisoners/Components/TableDemo";
// import MedicalStoreReport from "../../modules/reports/MedicalStoreReport";
// import ManageOffences from "./administration/ManageOffences";
// import ManageInPrisonEducation from "../../modules/inPrisonEducation/ManageInPrisonEducation";
// import ManageGoodsAccess from "../../modules/GoodsAccess/ManageGoodsAccess";
// import PrintPrescriptions from "../../modules/hospital/components/PrintPrescriptions";
// import ManageGashat from "../darbans/gashat-report/ManageGashat";
// //import ManageUpcomingRetirements from "../../modules/upcomingRetirements/ManageUpcomingRetirements";
// import ManageBloodDonorList from "../../modules/bloodDonorList/ManageBloodDonorList";
// import RetrialApproval from "../../modules/retrialManagement/RetrialApproval";
// import ReleasePrisonReport from "../../modules/reports/releaseReport/ReleasePrisonReport";
// import ReleaseApproval from "../prisoners/Components/release-prisoner/ReleaseApproval";
// import TransferReport from "../../modules/reports/TransferReport";
// import PrisonerCaseReport from "../../modules/reports/PrisonerCaseReport";
// import PrisonerHospitalReport from "../../modules/reports/PrisonerHospitalReport";
// import PrisonerRemissionReport from "../../modules/reports/PrisonerRemissionReport";
// import IGDIGDashboard from "./dashboard/IGDIGDashboard";
// import ManageEscapedPrisoners from "../darbans/ManageEscapedPrisoners";
// import ManageVisitApprovals from "../prisoners/Components/release-prisoner/ManageVisitApprovals";
// import DailyDarbanReport from "../../modules/reports/DailyDarbanReport";
// import VisitorsQueue from "./administration/visitor/components/VisitorsQueue";
// const Routes = [
//   //administration
//   {
//     path: "/admin/administration/manage-roles",
//     exact: true,
//     name: "manage-roles",
//     component: ManageRoles,
//   },
//   {
//     path: "/admin/administration/manage-employee",
//     exact: true,
//     name: "manage-employee",
//     component: ManageEmployee,
//   },
//   {
//     path: "/admin/administration/approve-employee",
//     exact: true,
//     name: "approve-employee",
//     component: ManageApproveEmployee,
//   },
//   {
//     path: "/admin/administration/employee-details/:id",
//     exact: true,
//     name: "employee-details",
//     component: EmployeeDetails,
//   },
//   {
//     path: "/admin/administration/employee-details-print",
//     exact: true,
//     name: "employee-details-print",
//     component: EmployeeDetailPrint,
//   },
//   {
//     path: "/admin/administration/employee-new-view",
//     exact: true,
//     name: "manage-list",
//     component: EmployeeListNew,
//   },
// //   {
// //     path: "/admin/administration/barrack-allocation/allocation",
// //     exact: true,
// //     name: "Allocation",
// //     component: Allocation,
// //   },
//   {
//     path: "/admin/administration/users-online",
//     exact: true,
//     name: "users-online",
//     component: UsersOnline,
//   },
//   {
//     path: "/admin/administration/users-online",
//     exact: true,
//     name: "users-online",
//     component: UsersOnline,
//   },
//   {
//     path: "/admin/prisoner-search",
//     exact: true,
//     name: "prisoner-search",
//     component: PrisonersSearch,
//   },
//   {
//     path: "/admin/history-search",
//     exact: true,
//     name: "history-search",
//     component: Historian,
//   },
//   {
//     path: "/admin/administration/add-account",
//     exact: true,
//     name: "add-account",
//     component: AddAccount,
//   },
//   {
//     path: "/admin/prisoner/manage-prisoners",
//     exact: true,
//     name: "manage-prisoners",
//     component: Prisoners,
//   },
//   {
//     path: "/admin/prisoner/prisoner-details/:id",
//     exact: true,
//     name: "prisoner-details",
//     component: ViewDetails,
//   },

//   {
//     path: "/admin/prisoner/manage-darbans",
//     exact: true,
//     name: "add-account",
//     component: ManageDarban,
//   },
//   {
//     path: "/admin/prisoner/manage-eascaped-prisoners",
//     exact: true,
//     name: "add-account",
//     component: ManageEscapedPrisoners,
//   },
//   {
//     path: "/admin/prisoner/manage-guests",
//     exact: true,
//     name: "add-account",
//     component: ManageGuests,
//   },
//   {
//     path: "/admin/administration/system-settings/:type",
//     exact: true,
//     name: "system-settings",
//     component: LookupRoutes,
//   },
//   {
//     path: "/admin/profile-setting/account-setting",
//     exact: true,
//     name: "lookups",
//     component: AccountSetting,
//   },
//   {
//     path: "/admin/profile-setting/help-section",
//     exact: true,
//     name: "lookups",
//     component: HelpSection,
//   },
//   {
//     path: "/admin/prisoner/add-prisoner-detail",
//     exact: true,
//     name: "lookups",
//     component: PrisonerDetails,
//   },
//   {
//     path: "/admin/circleoffice/checkout-checkin",
//     exact: true,
//     name: "checkin-checkout",
//     component: ManageCheckoutCheckin,
//   },
//   {
//     path: "/admin/circleoffice/hearing-checkout-checkin",
//     exact: true,
//     name: "hearing-checkin-checkout",
//     component: ManageHearingCheckinOut,
//   },
//   {
//     path: "/admin/prisoner/release-prisoner",
//     exact: true,
//     name: "release-prisoner",
//     component: ManageReleasePrisoner,
//   },
//   {
//     path: "/admin/employees/gashat-report",
//     exact: true,
//     name: "gashat-report",
//     component: ManageGashat,
//   },
//   {
//     path: "/admin/prisoner/upcoming-release",
//     exact: true,
//     name: "upcoming-release",
//     component: ManageUpcomingRelease,
//   },
// //   {
// //     path: "/admin/prisoner/upcoming-retirements",
// //     exact: true,
// //     name: "upcoming-retirements",
// //     component: ManageUpcomingRetirements,
// //   },
//   {
//     path: "/admin/prisoner/blood-donor-list",
//     exact: true,
//     name: "blood-donor-list",
//     component: ManageBloodDonorList,
//   },
//   {
//     path: "/admin/prisoner/convict-prisoner",
//     exact: true,
//     name: "convict-prisoner",
//     component: ManageConvictPrisoner,
//   },
//   {
//     path: "/admin/prisoner/appeal-management",
//     exact: true,
//     name: "appeal-management",
//     component: ManageAppealManagement,
//   },
  
//   {
//     path: "/admin/prisoner/transfer-prisoner",
//     exact: true,
//     name: "transfer-prisoner",
//     component: PrisonerTransfer,
//   },
//   {
//     path: "/admin/vistors/manage-visitors",
//     exact: true,
//     name: "manage-visitors",
//     component: ManageVisitors,
//   },
//   {
//     path: "/admin/vistors/show-visitors-queue",
//     exact: true,
//     name: "visitors-queue",
//     component: VisitorsQueue,
//   },
//   {
//     path: "/admin/vistors/add-visitors",
//     exact: true,
//     name: "add-visitors",
//     component: AddVisitors,
//   },
//   {
//     path: "/admin/visitors/block-visitor",
//     exact: true,
//     name: "medical-info",
//     component: BlockVisitor,
//   },
//   {
//     path: "/admin/prisoner/remission-prisoner",
//     exact: true,
//     name: "remission-prisoner",
//     component: Remission,
//   },
//   {
//     path: "/admin/hospital/admission",
//     exact: true,
//     name: "hospital-admission",
//     component: Admission,
//   },
//   {
//     path: "/admin/hospital/outside-admission",
//     exact: true,
//     name: "hospital-outside-admission",
//     component: OutsideAdmission,
//   },
//   {
//     path: "/admin/hospital/opd-admission",
//     exact: true,
//     name: "hospital-opd-admission",
//     component: OPDAdmission,
//   },
//   {
//     path: "/admin/hospital/ipd-admission",
//     exact: true,
//     name: "hospital-ipd-admission",
//     component: IPDAdmission,
//   },
//   {
//     path: "/admin/medical",
//     exact: true,
//     name: "medical-info",
//     component: MedicalInfo,
//   },
//   {
//     path: "/admin/court-production/add-hearing",
//     exact: true,
//     name: "add-hearing",
//     component: AddHearing,
//   },
//   {
//     path: "/admin/court-production/list",
//     exact: true,
//     name: "add-hearing",
//     component: CourtProductionList,
//   },
//   {
//     path: "/admin/medical-store/store-list",
//     exact: true,
//     name: "store-list",
//     component: MedicalStores,
//   },
//   {
//     path: "/admin/medical-store/prescribe-list",
//     exact: true,
//     name: "store-list",
//     component: PrescribeList,
//   },
//   {
//     path: "/admin/medical-store/employee-priscriptions",
//     exact: true,
//     name: "store-list",
//     component: EmployeePriscriptions,
//   },
//   {
//     path: "/admin/notifications/notifications-list",
//     exact: true,
//     name: "manage-list",
//     component: NotificationsList,
//   },
//   {
//     path: "/admin/medical-store/transfer-medicine",
//     exact: true,
//     name: "store-list",
//     component: MedicineTransfer,
//   },
//   {
//     path: "/admin/hospital/medical-details",
//     exact: true,
//     name: "medical-details",
//     component: MedicalDetails,
//   },
//   {
//     path: "/admin/hr/attendance",
//     exact: true,
//     name: "attendance",
//     component: Attendance,
//   },
//   {
//     path: "/admin/hr/leaves",
//     exact: true,
//     name: "leaves",
//     component: Leaves,
//   },
//   {
//     path: "/admin/hr/leave-approval",
//     exact: true,
//     name: "leave-approval",
//     component: LeaveApproval,
//   },
//   {
//     path: "/admin/sp/retrial-approval",
//     exact: true,
//     name: "retrial-approval",
//     component: RetrialApproval,
//   },
//   {
//     path: "/admin/sp/release-approval",
//     exact: true,
//     name: "release-approval",
//     component: ReleaseApproval,
//   },
//   {
//     path: "/admin/sp/visit-approval",
//     exact: true,
//     name: "visit-approval",
//     component: ManageVisitApprovals,
//   },
//   {
//     path: "/admin/reports/master-report",
//     exact: true,
//     name: "master-report",
//     component: MasterReport,
//   },
//   {
//     path: "/admin/reports/darban-report",
//     exact: true,
//     name: "darban-report",
//     component: DarbanReport,
//   },
//   {
//     path: "/admin/reports/guest-report",
//     exact: true,
//     name: "guest-report",
//     component: GuestReport,
//   },
//   {
//     path: "/admin/reports/user-activity",
//     exact: true,
//     name: "user-activity",
//     component: UserActivity,
//   },
//   {
//     path: "/admin/reports/user-activity-print",
//     exact: true,
//     name: "user-activity-print",
//     component: UserActivityPrint,
//   },
//   {
//     path: "/admin/reports/checkincheckout-report",
//     exact: true,
//     name: "checkincheckout-report",
//     component: CheckinCheckoutReport,
//   },
//   {
//     path: "/admin/reports/undertrial-report",
//     exact: true,
//     name: "undertrial-report",
//     component: UnderTrialReport,
//   },
//   {
//     path: "/admin/reports/convict-report",
//     exact: true,
//     name: "convict-report",
//     component: ConvictReport,
//   },
//   {
//     path: "/admin/reports/treatment-medical-report",
//     exact: true,
//     name: "medical-report",
//     component: TreatmentWiseMedicalReport,
//   },
//   {
//     path: "/admin/reports/prisoner-medical-report",
//     exact: true,
//     name: "medical-report",
//     component: PrisonerWiseMedicalReport,
//   },
//   {
//     path: "/admin/reports/prisoner-wise-visitor-report",
//     exact: true,
//     name: "visitor-report",
//     component: VisitorsPrisonerWiseReport,
//   },
//   {
//     path: "/admin/reports/visitor-wise-report",
//     exact: true,
//     name: "visitor-wise-report",
//     component: VisitorsWiseReport,
//   },
//   {
//     path: "/admin/reports/receiving-report",
//     exact: true,
//     name: "inventory-receving-report",
//     component: InventoryReceivingReport,
//   },
//   {
//     path: "/admin/reports/issuance-report",
//     exact: true,
//     name: "inventory-issuance-report",
//     component: InventoryIssuanceReport,
//   },
//   {
//     path: "/admin/reports/court-production-report",
//     exact: true,
//     name: "visitor-wise-report",
//     component: CourtProductionReport,
//   },
//   {
//     path: "/admin/reports/medical-store-report",
//     exact: true,
//     name: "medical-store-report",
//     component: MedicalStoreReport,
//   },
//   {
//     path: "/admin/print-details",
//     exact: true,
//     name: "print-details",
//     component: PrintDetails,
//   },
//   {
//     path: "/admin/history-ticket",
//     exact: true,
//     name: "history-ticket",
//     component: HistoryTicket,
//   },
//   {
//     path: "/admin/print-marasla",
//     exact: true,
//     name: "print-marasla",
//     component: PrintMarasla,
//   },
//   {
//     path: "/admin/print-prescription",
//     exact: true,
//     name: "print-prescription",
//     component: PrintPrescriptions,
//   },
//   {
//     path: "/admin/inventory/manage-inventory",
//     exact: true,
//     name: "manage-inventory",
//     component: ManageInventory,
//   },
//   {
//     path: "/admin/inventory/manage-inventory-items",
//     exact: true,
//     name: "manage-inventory-items",
//     component: ManageInventoryItems,
//   },
//   {
//     path: "/admin/inventory/manage-inventory-transfer",
//     exact: true,
//     name: "manage-inventory-transfer",
//     component: ManageInventoryTransfer,
//   },
//   {
//     path: "/admin/under-trial-dashboard",
//     exact: true,
//     name: "under-trial-dashboard",
//     component: UnderTrialDashboard,
//   },
//   {
//     path: "/admin/convict-dashboard",
//     exact: true,
//     name: "convict-dashboard",
//     component: ConvictDashboard,
//   },
//   {
//     path: "/admin/court-dashboard",
//     exact: true,
//     name: "court-dashboard",
//     component: CourtProductionDashboard,
//   },
//   {
//     path: "/admin/circle-office-dashboard",
//     exact: true,
//     name: "circle-office-dashboard",
//     component: CircleOfficeDashboard,
//   },
//   {
//     path: "/admin/visitor-dashboard",
//     exact: true,
//     name: "visitor-dashboard",
//     component: VisitorsDashboard,
//   },
//   {
//     path: "/admin/hospital-dashboard",
//     exact: true,
//     name: "hospital-dashboard",
//     component: HospitalDashboard,
//   },
//   {
//     path: "/admin/medical-store-dashboard",
//     exact: true,
//     name: "medical-store-dashboard",
//     component: MedicalStoreDashboard,
//   },
//   {
//     path: "/admin/inventory-dashboard",
//     exact: true,
//     name: "inventory-dashboard",
//     component: InventoryDashboard,
//   },
//   {
//     path: "/admin/hr-dashboard",
//     exact: true,
//     name: "hr-dashboard",
//     component: HRDashboard,
//   },
//   {
//     path: "/admin/biomatric-thanks",
//     exact: true,
//     name: "biomatric-thanks",
//     component: BiomatricThanks,
//   },
//   {
//     path: "/admin/prisoner/table-demo",
//     exact: true,
//     name: "table-demo",
//     component: TableDemo,
//   },
//   {
//     path: "/admin/prisoner/manage-offences",
//     exact: true,
//     name: "manage-offences",
//     component: ManageOffences,
//   },
//   {
//     path: "/admin/education-management",
//     exact: true,
//     name: "in-prison-education-management",
//     component: ManageInPrisonEducation,
//   },
//   {
//     path: "/admin/goods-access",
//     exact: true,
//     name: "goods-access",
//     component: ManageGoodsAccess,
//   },
//   {
//     path: "/admin/prisoner/release-prisoner-report",
//     exact: true,
//     name: "release-prison-report",
//     component: ReleasePrisonReport,
//   },
//   {
//     path: "/admin/reports/transfer-report",
//     exact: true,
//     name: "transfer-report",
//     component: TransferReport,
//   },
//   {
//     path: "/admin/reports/case-report",
//     exact: true,
//     name: "case-report",
//     component: PrisonerCaseReport,
//   },
//   {
//     path: "/admin/reports/hospital-admission-report",
//     exact: true,
//     name: "hospital-admission-report",
//     component: PrisonerHospitalReport,
//   },
//   {
//     path: "/admin/reports/remission-report",
//     exact: true,
//     name: "remission-report",
//     component: PrisonerRemissionReport,
//   },
//   {
//     path: "/admin/detailed-dashboard",
//     exact: true,
//     name: "detailed-dashboard",
//     component: IGDIGDashboard,
//   },
//   {
//     path: "/admin/reports/daily-darban-report",
//     exact: true,
//     name: "daily-darban-report",
//     component: DailyDarbanReport,
//   },
// ];

// export default Routes;
