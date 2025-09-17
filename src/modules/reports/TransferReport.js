import React from "react";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerTransferForm from "./components/PrisonerTransferForm";

const TransferReport = () => {
  // Define tab configuration for transfer report
  const tabConfig = [
    { id: "basic", label: "Basic" , icon: "fas fa-user"},
    { id: "prisonerType", label: "Prisoner Type" , icon: "fas fa-user-cog"},
    { id: "transfer", label: "Transfer" , icon: "fas fa-truck"},
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
              type="transfer"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
          </div>
        );
      case "transfer":
        return (
          <div className="tab-content-section">
            <PrisonerTransferForm
              type="transfer"
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
      reportName="Transfer"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={tabConfig}
      renderTabContent={renderTabContent}
      excelFileName="transfer_report"
    />
  );
};

export default TransferReport; 