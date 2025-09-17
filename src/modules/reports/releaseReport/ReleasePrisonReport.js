import React, { useState, useEffect, useRef } from "react";
import { baseImageUrl, postData } from "../../../services/request";
import { cleanReportsPayload } from "../../../common/Helpers";
import TabNavigation from '../components/TabNavigation';
import swal from 'sweetalert';
import generateReport from "../../../assets/images/1.svg";
import ProfilePic from "../../../assets/images/users/1.jpg";
import MasterModal from "../masterReport/components/MasterModal";
import { useNavigate } from "react-router-dom";
import MasterReportVisibilityManager from "../../../common/components/MasterReportVisibilityManager";
import { PayloadFtn } from "../helper/Payload";
import PrisonerBasicInfoParams from "../components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "../components/PrisonerTypeForm";
import PrisonerAccodomationForm from "../components/PrisonerAccodomationForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactInfoForm from "../components/ContactInfoForm";
import AddressForm from "../components/AddressForm";
import PrisonerCaseForm from "../components/PrisonerCaseForm";
import PrisonerReleaseParams from "../components/PrisonerReleaseParams";
import PrisonerAppealParams from "../components/PrisonerAppealParams";
import HearingForm from "../components/HearingForm";
import { apiExcelRequest } from '../../../common/XmlToXsls';
import ScrollButtons from "../../../common/ScrollButtons";
import { RiRefreshLine } from "react-icons/ri";
import { handleCleanup, handleResetReport } from "../../../common/ResetReport";
import Print from '../../../components/admin/search/Print';
import ReportStats from '../components/ReportStats';
import { Form } from "react-bootstrap";
import BaseReportComponent from "../../../components/common/BaseReportComponent";

const ReleasePrisonReport = () => {
  // Release-specific tab configuration
  const releaseTabs = [
    {
      id: 'basic',
      label: 'Prisoner Basic Info',
      icon: 'fas fa-user'
    },
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'fas fa-id-card'
    },
    {
      id: 'advanced',
      label: 'Advanced Info',
      icon: 'fas fa-file-alt'
    },
    {
      id: 'release',
      label: 'Release Info',
      icon: 'fas fa-file-alt'
    },
    {
      id: 'case',
      label: 'Case Info',
      icon: 'fas fa-gavel'
    },
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

      case 'advanced':
        return (
          <div className="tab-content-section">
            <PrisonerTypeForm
              type="master"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ProfessionalInfoForm 
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
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <HearingForm 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerAppealParams 
              type="master" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
          </div>
        );

      case 'release':
        return (
          <div className="tab-content-section">
            <PrisonerReleaseParams 
              type="master"
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
              headingType="release"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseReportComponent
      reportName="Release Prison"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={releaseTabs}
      renderTabContent={renderTabContent}
      defaultFormPayload={getInitialPayload()}
      excelFileName="release_prison_report"
    />
  );
};

export default ReleasePrisonReport;