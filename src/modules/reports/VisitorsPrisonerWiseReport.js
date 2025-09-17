import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import BaseReportComponent from "../../components/common/BaseReportComponent";
import PrisonerBasicInfoParams from "./components/PrisonerBasicInfoParams";
import PrisonerTypeForm from "./components/PrisonerTypeForm";
import PrisonerAccodomationForm from "./components/PrisonerAccodomationForm";
import ProfessionalInfoForm from "./components/ProfessionalInfoForm";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContactInfoForm from "./components/ContactInfoForm";
import AddressForm from "./components/AddressForm";
import PrisonerVisitorForm from "./components/PrisonerVisitorForm";
import PrisonerVisitorAddressParams from "./components/PrisonerVisitorAddressParams";
import PrisonerDependentsInfoParams from "./components/PrisonerDependentsInfoParams";
import { transformData } from "../../common/Helpers";

const VisitorsPrisonerWiseReport = () => {
  const [lookups, setLookups] = useState({});
  const newLookups = useSelector((state) => state?.dropdownLookups);

  // Visitor-specific tab configuration
  const visitorTabs = [
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
      id: 'visitor',
      label: 'Visitor Info',
      icon: 'fas fa-users'
    }
  ];

  // Fetch lookups for relationships
  useEffect(() => {
    fetchLookUps();
  }, [newLookups]);

  const fetchLookUps = async () => {
    try {
      const lookup = {};
      const relationshipsObj = transformData(newLookups?.Relationships);
      lookup['relationships'] = relationshipsObj;
      setLookups(lookup);
    } catch (error) {
      console.error(error);
      // Let the BaseReportComponent handle error notifications
    }
  };

  // Define initial payload to include prison ID from session and visitors available flag
  const getInitialPayload = () => {
    try {
      const rawData = sessionStorage.getItem("user");
      const userData = JSON.parse(rawData);
      const prisonId = userData?.employee?.prisons.map((e) => e.prisonId);
      
      return {
        prisonerBasicInfo: {
          prisonId: prisonId
        },
        prisonerVisitors: {
          visitorsAvailable: true
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
              type="visitor"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
            />
            <PrisonerAccodomationForm 
              type="visitor" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <ProfessionalInfoForm 
              type="visitor" 
              formPayload={formPayload} 
              setFormPayload={handleFormPayloadChange} 
            />
            <PrisonerDependentsInfoParams
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              type="visitor"
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

      case 'visitor':
        return (
          <div className="tab-content-section">
            <PrisonerVisitorForm
              type="visitor"
              formPayload={formPayload}
              setFormPayload={handleFormPayloadChange}
              lookups={lookups}
            />
            <PrisonerVisitorAddressParams
              type="visitor"
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
      reportName="Visitors Prisoner Wise"
      apiEndpoint="/services/app/Reports/MasterReport"
      statsEndpoint="/services/app/Reports/GetMasterReportCounts"
      excelExportEndpoint="/services/app/Reports/MasterReportExelNew"
      tabConfig={visitorTabs}
      renderTabContent={renderTabContent}
      defaultFormPayload={getInitialPayload()}
      excelFileName="visitors_prisoner_wise_report"
    />
  );
};

export default VisitorsPrisonerWiseReport;
