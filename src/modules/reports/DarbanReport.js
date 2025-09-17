import React, { useState, useEffect, useRef } from 'react';
import { baseImageUrl, postData } from "../../services/request";
import { cleanReportsPayload } from "../../common/Helpers";
import { PayloadFtn } from "./helper/Payload";
import TabNavigation from './components/TabNavigation';
import swal from 'sweetalert';
import generateReport from "../../assets/images/1.svg";
import ProfilePic from "../../assets/images/users/1.jpg";
import MasterModal from "./masterReport/components/MasterModal";
import { apiExcelRequest } from '../../common/XmlToXsls';
import { handleCleanup, handleResetReport } from "../../common/ResetReport";
import { RiRefreshLine } from "react-icons/ri";
import Print from '../../components/admin/search/Print';
import ReportStats from './components/ReportStats';
import DescriptionModal from "../../common/DescriptionModal";
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import ProfessionalInfoForm from "./components/ProfessionalInfoForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";

const DarbanReport = () => {
  // Darban-specific tab configuration
  const darbanTabs = [
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
              type="darban"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm 
              type="darban" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ProfessionalInfoForm 
              type="darban" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
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

      default:
        return null;
    }
  };

  return (
    <BaseReportComponent
      reportName="Darban"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={darbanTabs}
      renderTabContent={renderTabContent}
      defaultFormPayload={getInitialPayload()}
      excelFileName="darban_report"
    />
  );
};

export default DarbanReport;

