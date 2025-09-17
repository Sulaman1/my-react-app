import React, { useState, useEffect, useRef } from "react";
import BaseReportComponent from "../../components/common/BaseReportComponent";

// Import form components
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import ProfessionalInfoForm from "./components/ProfessionalInfoForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";
import PrisonerMedicalForm from "./components/PrisonerMedicalForm";
import PrisonerHospitalForm from "./components/PrisonerHospitalForm";
import PrisonerDependentsInfoParams from "./components/PrisonerDependentsInfoParams";

const PrisonerHospitalReport = () => {
  // Medical-specific tab configuration
  const medicalTabs = [
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
      id: 'medical',
      label: 'Medical Info',
      icon: 'fas fa-hospital'
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
              type="medical"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm 
              type="medical" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ProfessionalInfoForm 
              type="medical" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerDependentsInfoParams
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              type="medical"
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

      case 'medical':
        return (
          <div className="tab-content-section">
            <PrisonerMedicalForm 
              type="medical" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerHospitalForm 
              type="medical" 
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
      reportName="Prisoner Hospital"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={medicalTabs}
      renderTabContent={renderTabContent}
      defaultFormPayload={getInitialPayload()}
      excelFileName="prisoner_hospital_report"
    />
  );
};

export default PrisonerHospitalReport;
