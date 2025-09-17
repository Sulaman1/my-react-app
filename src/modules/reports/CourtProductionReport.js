import React from "react";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import ProfessionalInfoForm from "./components/ProfessionalInfoForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";
import PrisonerCaseForm from "./components/PrisonerCaseForm";
import HearingForm from "./components/HearingForm";
import PrisonerAppealParams from "./components/PrisonerAppealParams";
import PrisonerDependentsInfoParams from "./components/PrisonerDependentsInfoParams";

const CourtProductionReport = () => {
  // Court-specific tab configuration
  const tabConfig = [
    {
      id: 'basic',
      label: 'Prisoner Basic Info',
      icon: 'fas fa-user'
    },
    {
      id: 'advanced',
      label: 'Prisoner Advanced Info',
      icon: 'fas fa-user-cog'
    },
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'fas fa-id-card'
    },
    {
      id: 'case',
      label: 'Case Info',
      icon: 'fas fa-gavel'
    }
  ];

  // Define initial payload to include prison ID from session
  const getInitialPayload = () => {
    try {
      const rawData = sessionStorage.getItem("user");
      const userData = JSON.parse(rawData);
      const prisonId = userData?.employee?.prisons.map((e) => e.prisonId);
      
      return {
        prisonerBasicInfo: {
          prisonId: prisonId
        }
      };
    } catch (error) {
      console.error("Error getting prison ID:", error);
      return {};
    }
  };

  // This function will render the content for each tab
  const renderTabContent = (activeTab, formPayload, handleFormPayloadChange, setFormPayload) => {
    switch(activeTab) {
      case 'basic':
        return (
          <div className="tab-content-section">
            <PrisonerBasicInfoParams
              setFormPayload={setFormPayload}
              formPayload={formPayload}
            />
          </div>
        );
      
      case 'advanced':
        return (
          <div className="tab-content-section">
            <PrisonerTypeForm
              type="court"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm 
              type="court" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ProfessionalInfoForm 
              type="court" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerDependentsInfoParams
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              type="court"
            />
          </div>
        );

      case 'personal':
        return (
          <div className="tab-content-section">
            <PersonalInfoForm 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ContactInfoForm 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <AddressForm 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
          </div>
        );

      case 'case':
        return (
          <div className="tab-content-section">
            <PrisonerCaseForm 
              type="court" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <HearingForm 
              type="court" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerAppealParams 
              type="court" 
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
      reportName="Court Production"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={tabConfig}
      renderTabContent={renderTabContent}
      defaultFormPayload={getInitialPayload()}
      excelFileName="court_production_report"
    />
  );
};

export default CourtProductionReport;
