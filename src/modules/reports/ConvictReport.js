import React from "react";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";
import PrisonerCaseForm from "./components/PrisonerCaseForm";
import HearingForm from "./components/HearingForm";
import PrisonerRemissionParams from "./components/PrisonerRemissionParams";
import PrisonerReleaseParams from "./components/PrisonerReleaseParams";

const ConvictReport = () => {
  // Define tab configuration for convict report
  const tabConfig = [
    { id: "basic", label: "Basic" , icon: "fas fa-user"},
    { id: "advanced", label: "Advanced" , icon: "fas fa-user-cog"},
    { id: "personal", label: "Personal" , icon: "fas fa-id-card"},
    { id: "case", label: "Case" , icon: 'fas fa-file-alt'},
    { id: "release", label: "Release" , icon: "fas fa-user-clock"},
    { id: "remission", label: "Remission" , icon: "fas fa-user-clock"},
  ];

  // Special payload for convict report
  const defaultFormPayload = {
    prisonerBasicInfo: {
      prisonerTypeId: 2, // Convict type ID
    }
  };

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
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "personal":
        return (
          <div className="tab-content-section">
            <PersonalInfoForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <ContactInfoForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <AddressForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "case":
        return (
          <div className="tab-content-section">
            <PrisonerCaseForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <HearingForm
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "release":
        return (
          <div className="tab-content-section">
            <PrisonerReleaseParams
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              headingType="convict"
            />
          </div>
        );
      case "remission":
        return (
          <div className="tab-content-section">
            <PrisonerRemissionParams
              type="convict"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BaseReportComponent
      reportName="Convict Prisoner"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      defaultFormPayload={defaultFormPayload}
      tabConfig={tabConfig}
      renderTabContent={renderTabContent}
      excelFileName="convict_report"
    />
  );
};

export default ConvictReport;
