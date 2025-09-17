import React from "react";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerCaseForm from "./components/PrisonerCaseForm";
import HearingForm from "./components/HearingForm";
import PrisonerAppealParams from "./components/PrisonerAppealParams";

const PrisonerCaseReport = () => {
  // Define tab configuration for case report
  const tabConfig = [
    { id: "basic", label: "Basic" , icon: "fas fa-user"},
    { id: "prisonerType", label: "Prisoner Type" , icon: "fas fa-user-cog"},
    { id: "case", label: "Case Details" , icon: "fas fa-file-alt"},
    { id: "hearing", label: "Hearings" , icon: "fas fa-user-clock"},
    { id: "appeal", label: "Appeals" , icon: "fas fa-user-clock"},
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
      case "prisonerType":
        return (
          <div className="tab-content-section">
            <PrisonerTypeForm
              type="case"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "case":
        return (
          <div className="tab-content-section">
            <PrisonerCaseForm
              type="case"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "hearing":
        return (
          <div className="tab-content-section">
            <HearingForm
              type="case"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "appeal":
        return (
          <div className="tab-content-section">
            <PrisonerAppealParams
              type="case"
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
      reportName="Prisoner Case"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={tabConfig}
      renderTabContent={renderTabContent}
      excelFileName="prisoner_case_report"
    />
  );
};

export default PrisonerCaseReport;
