import React, { useState, useEffect, useRef } from "react";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerMedicalForm from "./components/PrisonerMedicalForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ProfessionalInfoForm from "./components/ProfessionalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import PrisonerCaseForm from "./components/PrisonerCaseForm";
import HearingForm from "./components/HearingForm";
import CheckinCheckoutForm from "./components/CheckinCheckoutForm";
import PrisonerTransferForm from "./components/PrisonerTransferForm";
import PrisonerVisitorForm from "./components/PrisonerVisitorForm";
import PrisonerHospitalForm from "./components/PrisonerHospitalForm";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerDependentsInfoParams from "./components/PrisonerDependentsInfoParams";
import PrisonerAppealParams from "./components/PrisonerAppealParams";
import PrisonerReleaseParams from "./components/PrisonerReleaseParams";
import PrisonerRemissionParams from "./components/PrisonerRemissionParams";
import PrisonerVisitorAddressParams from "./components/PrisonerVisitorAddressParams";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerOfensesForm from "./components/PrisonerOfensesForm";
import PrisonerEducationForm from "./components/PrisonerEducationForm";
const MasterReport = () => {
  // Define tab configuration
  const tabConfig = [
    { id: "basic", label: "Basic" , icon: "fas fa-user"},
    { id: "advanced", label: "Advanced" , icon: "fas fa-user-cog"},
    { id: "personal", label: "Personal" , icon: "fas fa-id-card"},
    { id: "medical", label: "Medical" , icon: "fas fa-user-md"},
    { id: "case", label: "Case" , icon: "fas fa-book-open"},
    { id: "release", label: "Release" , icon: "fas fa-user-clock"},
    { id: "remission", label: "Remission" , icon: "fas fa-user-clock"},
    { id: "accomodation", label: "Accomodation" , icon: "fas fa-bed"},
    { id: "transfer", label: "Transfer" , icon: "fas fa-truck"},
    { id: "checkinout", label: "Check In/Out" , icon: "fas fa-check-circle"},
    { id: "visitor", label: "Visitor" , icon: "fas fa-user-friends"},
  ];

  // This function will render the content for each tab
  const renderTabContent = (activeTab, formPayload, handleFormPayloadChange, setFormPayload) => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="tab-content-section">
            <PrisonerBasicInfoParams
              setFormPayload={setFormPayload}
              formPayload={formPayload}
            />
          </div>
        );
      case "advanced":
        return (
          <div className="tab-content-section">
            <PrisonerTypeForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <ProfessionalInfoForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerDependentsInfoParams
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              type="master"
            />
          </div>
        );
      case "personal":
        return (
          <div className="tab-content-section">
            <PersonalInfoForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <ContactInfoForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <AddressForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "medical":
        return (
          <div className="tab-content-section">
            <PrisonerMedicalForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <PrisonerHospitalForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "case":
        return (
          <div className="tab-content-section">
            <PrisonerCaseForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <HearingForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <PrisonerAppealParams
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "release":
        return (
          <div className="tab-content-section">
            <PrisonerReleaseParams
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
              headingType="master"
            />
          </div>
        );
      case "remission":
        return (
          <div className="tab-content-section">
            <PrisonerRemissionParams
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "transfer":
        return (
          <div className="tab-content-section">
            <PrisonerTransferForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "accomodation":
        return (
          <div className="tab-content-section">
            <PrisonerAccodomationForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerOfensesForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerEducationForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "checkinout":
        return (
          <div className="tab-content-section">
            <CheckinCheckoutForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      case "visitor":
        return (
          <div className="tab-content-section">
            <PrisonerVisitorForm
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
            <PrisonerVisitorAddressParams
              type="master"
              formPayload={formPayload}
              setFormPayload={setFormPayload}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BaseReportComponent
      reportName="Master"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={tabConfig}
      renderTabContent={renderTabContent}
      excelFileName="master_report"
    />
  );
};

export default MasterReport;
