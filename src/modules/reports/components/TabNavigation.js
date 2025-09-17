import React, { useEffect, useRef } from 'react';

const TabNavigation = ({ activeTab, setActiveTab, customTabs }) => {
  const navigationRef = useRef(null);

  const defaultTabs = [
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
      icon: 'fas fa-heartbeat'
    },
    {
      id: 'case',
      label: 'Prisoner Case',
      icon: 'fas fa-gavel'
    },
    {
      id: 'release',
      label: 'Prisoner Release',
      icon: 'fas fa-door-open'
    },
    {
      id: 'remission',
      label: 'Prisoner Remission',
      icon: 'fas fa-calendar-check'
    },
    {
      id: 'transfer',
      label: 'Prisoner Transfer',
      icon: 'fas fa-exchange-alt'
    },
    {
      id: 'checkinout',
      label: 'Check-In / Out ',
      icon: 'fas fa-clipboard-check'
    },
    {
      id: 'visitor',
      label: 'Prisoner Visitor',
      icon: 'fas fa-user-friends'
    },
    {
      id: 'accomodation',
      label: 'Prisoner Accomodation',
      icon: 'fas fa-bed'
    }
  ];

  
  // Use customTabs if provided, otherwise use defaultTabs
  const tabs = customTabs || defaultTabs;

  // Update indicator position when tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (navigationRef.current) {
      navigationRef.current.style.setProperty('--tab-index', activeIndex);
    }
  }, [activeTab, tabs]);

  return (
    <div className="master-tab-navigation" ref={navigationRef}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          className={`master-tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(tab.id);
            navigationRef.current.style.setProperty('--tab-index', index);
          }}
          type="button"
        >
          <i className={`${tab.icon} me-2`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 