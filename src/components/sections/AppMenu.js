import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/1.jpeg";
import { NavLink, useLocation, useNavigate  } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import unodcLogo from "../../assets/images/footerlogo/1.png";

import { useSelector } from "react-redux";

const AppMenu = (props) => {
  const location = useLocation();
  //const history = useHistory();
  const navigate = useNavigate();

  const userMeta = useSelector((state) => {
    return state.user;
  });

  const isAdmin = userMeta?.role === "Super Admin";
  const isSp = userMeta?.role === "Prison Superintendent";
  const isDig = userMeta?.role === "DIG Prisons";
  const isIG = userMeta?.role === "Inspector General Prisons";
  const isDSP = userMeta?.role === "Prison DSP";
  // const [unodcLogo, setUnodcLogo] = useState('');
  const [usFlagLogo, setUsFlagLogo] = useState('');
  const [donorLogoMain, setDonorLogoMain] = useState('');

  useEffect(() => {
    var myrole = "Super Admin";
    if (myrole == "Super Admin") {
      accessValidator();
    }
  }, [userMeta]);

  const show = "urdu";//useSelector((state) => state.language.urdu);
  const [logo, setLogo] = useState('');

  const Logo = () => {
    
    // import(`../${process.env.REACT_APP_LOGO}`).then((module) => {
    //   setLogo(module.default);
    // });
  
    return (
      <img src={unodcLogo}  alt="" height="20" style={{ "borderRadius": "30px" }}/>
    );
  };

  const usFlag = () => {
    
    // import(`../${process.env.REACT_APP_US_FLAG}`).then((module) => {
    //   setUsFlagLogo(module.default);
    // });
  
    return (
      <img src={unodcLogo}  alt="us-flag" style={{width: '100%' , height: '100%'}} />
    );
  };

const donorLogo = () => {

    // import(`../${process.env.REACT_APP_INL_LOGO}`).then((module) => {
		// setDonorLogoMain(module.default);
	  // });
	
	  return (
		<img src={unodcLogo}  alt="donor-logo" style={{width: '90%' , height: '90%'}} />
	  );
}	

  // const companyLogo = () => {
  //   import(`../../${process.env.REACT_APP_UNODC_LOGO}`).then((module) => {
  //     setUnodcLogo(module.default);
  //   });
  // }
  const accessValidator = () => {
    //const currentPath = location.pathname;
    //if (userMeta.access.indexOf(currentPath) === -1) {
      navigate("/admin/dashboard");
    //}
  };

  const renderDashboard = () => {
    // eslint-disable-next-line max-len
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Dashboard"
    // );

    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <NavLink
          className="nav-link menu-link accordion__heading animation-fade"
          to="/admin/dashboard"
          activeClassName="inherit-class"
        >
          <i className="icon-dashboard"></i>
          <span>
            Dashboard {show && <label className="urdu-font">(ڈیش بورڈ)</label>}
          </span>
        </NavLink>
   
      );
    }
  };

  const renderIGDashboards = () => {
    // eslint-disable-next-line max-len
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "IGDashboards"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading className="accordion__heading">
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-dashboard"></i>{" "}
                <span data-key="t-apps">
                  Role Wise Dashboards{" "}
                  {show && (
                    <label className="urdu-font"> (رول وائز ڈیش بورڈز)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/detailed-dashboard"
              
              className="nav-link"
            >
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Detailed Dashboard
                {show && <label className="urdu-font"> (ڈیٹیلڈ دیش بورڈ)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/under-trial-dashboard"
              
              className="nav-link"
            >
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Under Trial
                {show && <label className="urdu-font"> (زیر سماعت)</label>}
              </span>
            </NavLink>

            <NavLink to="/admin/convict-dashboard"  className="nav-link">
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Convict
                {show && <label className="urdu-font"> (سزا یافتہ)</label>}
              </span>
            </NavLink>
            <NavLink to="/admin/court-dashboard"  className="nav-link">
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Court Production
                {show && <label className="urdu-font"> (عدالت)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/circle-office-dashboard"
              
              className="nav-link"
            >
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                Circle Office
                {show && <label className="urdu-font"> (حلقہ دفتر)</label>}
              </span>
            </NavLink>
            <NavLink to="/admin/visitor-dashboard"  className="nav-link">
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Visitor's
                {show && <label className="urdu-font"> (زائرین)</label>}
              </span>
            </NavLink>
            <NavLink to="/admin/hospital-dashboard" className="nav-link">
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Hospital
                {show && <label className="urdu-font"> (ہسپتال)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/medical-store-dashboard"
              
              className="nav-link"
            >
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Medical Store
                {show && <label className="urdu-font"> (میڈیکل سٹور)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/inventory-dashboard"
             
              className="nav-link"
              activeClassName="inherit-class"
            >
              {" "}
              <i className="icon-dashboard"></i>
              <span>
                {" "}
                Inventory
                {show && <label className="urdu-font"> (انوینٹری)</label>}
              </span>
            </NavLink>

            <NavLink to="/admin/hr-dashboard" className="nav-link" activeClassName="inherit-class" >
              {" "}
              <i className="icon-dashboard"></i>
              <span> HR</span>
              {show && <label className="urdu-font"> (ایچ آر)</label>}
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    }
  };

  const renderIGReports = () => {
    // eslint-disable-next-line max-len
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "IG Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  activeClassName="inherit-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Reports{" "}
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/master-report"
               
                className="nav-link"
              >
                {(isIG || isDig) && (
                  <span>
                    {" "}
                    Master Report
                    {show && <label className="urdu-font">(ماسٹر رپورٹ)</label>}
                  </span>
                )}
                {(isSp || isDSP) && (
                  <span>
                    {" "}
                    Report
                    {show && <label className="urdu-font">(رپورٹ)</label>}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/admin/reports/darban-report"
               
                className="nav-link"
              >
                <span> Darban Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/checkincheckout-report"
               
                className="nav-link"
              >
                <span> CheckIn/CheckOut Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/undertrial-report"
               
                className="nav-link"
              >
                <span>Under Trial Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/convict-report"
               
                className="nav-link"
              >
                <span> Convict Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/remission-report"
               
                className="nav-link"
              >
                <span> Remission Report</span>
              </NavLink>
              <NavLink
             to="/admin/prisoner/release-prisoner-report"
            
             className="nav-link"
           >
               <span> Release Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/transfer-report"
               
                className="nav-link"
              >
                <span> Transfer Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/case-report"
               
                className="nav-link"
              >
                <span> Case Report</span>
              </NavLink>
             
              <NavLink
                to="/admin/reports/user-activity"
               
                className="nav-link"
              >
                <span> User Activity Report</span>
              </NavLink>
              <li class="menu-title">
                <i class="ri-more-fill"></i> <span> Medical Reports</span>
              </li>

              <NavLink
                to="/admin/reports/prisoner-medical-report"
               
                className="nav-link"
              >
                Medical info Report
              </NavLink>
              <NavLink
                to="/admin/reports/hospital-admission-report"
               
                className="nav-link"
              >
                Hospital Admission Report
              </NavLink>

              <li class="menu-title">
                <i class="ri-more-fill"></i> <span> Visitors Reports</span>
              </li>
              <NavLink
                to="/admin/reports/prisoner-wise-visitor-report"
               
                className="nav-link"
              >
                Prisoner wise Report
              </NavLink>
              {/* <NavLink
                to="/admin/reports/visitor-wise-report"
               
                className="nav-link"
              >
                Visitor Wise Report
              </NavLink> */}
              {/* <li class="menu-title">
                <i class="ri-more-fill"></i> <span> Inventory Reports</span>
              </li>
              <NavLink
                to="/admin/reports/receiving-report"
               
                className="nav-link"
              >
                Receiving Report
              </NavLink>
              <NavLink
                to="/admin/reports/issuance-report"
               
                className="nav-link"
              >
                Issuance Report
              </NavLink> */}
              <li class="menu-title">
                <i class="ri-more-fill"></i>{" "}
                <span> Court Production Reports</span>
              </li>
              <NavLink
                to="/admin/reports/court-production-report"
               
                className="nav-link"
              >
                Prisoner wise Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
        </>
      );
    } else return null;
  };

  const renderCourtProduction = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Court Production"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item" uuid={`${isAdmin ? 'b' : 'a'}`} >
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
               activeClassName="inherit-class"
              >
                <i className="icon-court"></i>{" "}
                <span data-key="t-apps">
                  Court Production{" "}
                  {show && <label className="urdu-font">(عدالت)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/court-production/add-hearing"
              className="nav-link menu-link"
              activeClassName="inherit-class"
            >
              <i className="icon-add"></i>
              <span>
                Add Hearings/Zamima{" "}
                {show && <label className="urdu-font">(پیشی اندراج)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/court-production/list"
              className="nav-link menu-link"
              activeClassName="inherit-class"
            >
               <i className="icon-file"></i>
              <span>
                {" "}
                Court Production List
                {show && (
                  <label className="urdu-font">(فہرست برائے پیشیاں)</label>
                )}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderCourtProductionReports = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Court Production Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
            <AccordionItem className="nav-item animation-fade">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <NavLink
                    to="#sidebarAllocation"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarAllocation"
                   activeClassName="inherit-class"
                  >
                    <i className="icon-report"></i>{" "}
                    <span data-key="t-apps">
                      Court Production Reports
                      {show && <label className="urdu-font">(رپورٹس)</label>}
                    </span>
                  </NavLink>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <NavLink
                  to="/admin/reports/court-production-report"
                  className="nav-link"
                >
                  Prisoner wise Report
                </NavLink>
              </AccordionItemPanel>
            </AccordionItem>
      );
    } else return null;
  };

  const renderMedicalStoreReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Medical Store Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="none-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Medical Store Report
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/medical-store-report"
                className="nav-link"
              >
                Medicine Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
      );
    } else return null;
  };

  const renderInventory = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Inventory"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item" uuid={`${isAdmin ? 'b' : 'a'}`} >
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="none-class"
              >
                <i className="fa-solid fa-laptop-medical"></i>{" "}
                <span data-key="t-apps">
                  Manage Inventory
                  {show && <label className="urdu-font">(میڈیکل سٹور)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/inventory/manage-inventory"
                className="nav-link menu-link"
              >
                <i className="fa-solid fa-user-nurse"></i>
                <span>
                  Inventory{" "}
                  {show && <label className="urdu-font">(طبی اسٹاک)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/inventory/manage-inventory-items"
                className="nav-link menu-link"
              >
                <i className="fa-solid fa-file-medical"></i>
                <span>
                  Allocate Items
                  {show && (
                    <label className="urdu-font">(ملازمین کے نسخے)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderInventoryReports = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Inventory Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
              <AccordionItem className="nav-item animation-fade">
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <NavLink
                      className="nav-link menu-link"
                      to="#sidebarAllocation"
                      data-bs-toggle="collapse"
                      role="button"
                      aria-expanded="false"
                      aria-controls="sidebarAllocation"
                     ClassName="nav-link"
                    >
                      <i className="icon-report"></i>{" "}
                      <span data-key="t-apps">
                        Inventory Reports
                        {show && <label className="urdu-font">(رپورٹس)</label>}
                      </span>
                    </NavLink>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <NavLink
                    to="/admin/reports/receiving-report"
                    className="nav-link"
                  >
                    Receiving Report
                  </NavLink>
                  <NavLink
                    to="/admin/reports/issuance-report"
                    className="nav-link"
                  >
                    Issuance Report
                  </NavLink>
                </AccordionItemPanel>
              </AccordionItem>
      );
    } else return null;
  };

  const renderBarrackAllocation = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Barrack Allocation"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
            
              <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/administration/barrack-allocation/allocation"
            
          >
             <i className="icon-prison"></i>{" "}
                <span data-key="t-apps">
                  Barrack Allocation
                  {show && <label className="urdu-font">(بیرک مختص)</label>}
                </span>
          </NavLink>
      );
    } else return null;
  };

  const renderIGCircleOfiice = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "IG Circle Office"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading className="accordion__heading">
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
               
              >
                <i className="icon-prison"></i>{" "}
                <span data-key="t-apps">
                  Prisoners' Affairs
                  {show && <label className="urdu-font">(بیرک مختص)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
          <NavLink
                className="nav-link menu-link accordion__heading "
                to="/admin/prisoner-search"
              >
                <i className="icon-search"></i>
                <span>
                  Search Prisoners
                  {show && (
                    <label className="urdu-font">(تلاش پرائے قیدی)</label>
                  )}
                </span>
              </NavLink>
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/administration/barrack-allocation/allocation"
            
          >
             <i className="icon-prison"></i>{" "}
                <span data-key="t-apps">
                  Barrack Allocation
                  {show && <label className="urdu-font">(بیرک مختص)</label>}
                </span>
          </NavLink>
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/blood-donor-list"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Blood Donor List{" "}
              {show && <label className="urdu-font">(آنے والی ریٹائرمنٹ)</label>}
            </span>
          </NavLink>
          <NavLink
            className="nav-link menu-link"
            to="/admin/court-production/list"
            
          >
            <i className="icon-court"></i>
            <span data-key="t-apps">
              Court Production History{" "}
              {show && (
                <label className="urdu-font">(فہرست برائے پیشیاں)</label>
              )}
            </span>
          </NavLink>
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/upcoming-release"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Upcoming Releases{" "}
              {show && <label className="urdu-font">(رہائیاں)</label>}
            </span>
          </NavLink>
          {/* <NavLink
              to="/admin/prisoner/manage-offences"
              
              className="nav-link"
            >
              <i className="icon-report"></i>
              <span data-key="t-apps"> In-Prison Offences</span>
            </NavLink>
            <NavLink
            className="nav-link menu-link"
            to="/admin/education-management"
            
          >
            <i className="icon-court"></i>
            <span data-key="t-apps">
            In-Prison Education{" "}
              {show && (
                <label className="urdu-font">(جیل تعلیم کے انتظام)</label>
              )}
            </span>
          </NavLink>
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/appeal-management"
            
          >
            <i className="icon-convict"></i>
            <span>
              Appeal Management
              {show && (
                <label className="urdu-font"> (اپیل کا انتظام)</label>
              )}
            </span>
          </NavLink> */}
          <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages" className="ms-3" >
                vistors' info {show && <label className="urdu-font " >(زائرین کی اطلاع)</label>}
              </span>
            </li>
          <NavLink
                to="/admin/vistors/manage-visitors"
                
                className="nav-link"
              >
                <i className="icon-visitor"></i>{" "}
                <span data-key="t-apps">
                  {" "}
                  Visitors' Queue
                  {show && (
                    <label className="urdu-font">(زائرین کی قطار)</label>
                  )}
                </span>
              </NavLink>
              <NavLink
                  to="/admin/visitors/block-visitor"
                  
                  className="nav-link"
                > 
                <i className="fas fa-ban"></i>
                  <span>
                    {" "}
                    Blocked Visitor
                    {show && <label className="urdu-font">(بلاک وزیٹر)</label>}
                  </span>
                </NavLink>

              <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages" className="ms-3" >
                Medical Info {show && <label className="urdu-font " >(طبی اطلاع)</label>}
              </span>
            </li>
              <NavLink to="/admin/hospital/opd-admission" className="nav-link">
                <i className="fas fa-user-md"></i>
                <span>
                  {" "}
                  OPD {show && <label className="urdu-font">(او پی ڈی)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hospital/ipd-admission"
                
                className="nav-link"
              >
                <i className="fas fa-heartbeat"></i>
                <span>
                  {" "}
                  IPD {show && <label className="urdu-font">(آئی پی ڈی)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hospital/outside-admission"
                
                className="nav-link"
              >
                <i className="fas fa-ambulance"></i>
                <span>
                  {" "}
                  Outside Hospital
                  {show && (
                    <label className="urdu-font">(ہسپتال کے باہر)</label>
                  )}
                </span>
              </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderIGAdministration = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "IG Administration"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading className="accordion__heading">
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
               
              >
                <i className="icon-prison"></i>{" "}
                <span data-key="t-apps">
                Administration
                  {show && <label className="urdu-font">(ایچ آر)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
          <NavLink
            className="nav-link menu-link accordion__heading"
            to="/admin/goods-access"
            
          >
            <i className="fa-solid fa-exchange"></i>
            <span>
            Goods Access
              {show && (
                <label className="urdu-font">(سامان تک رسائی)</label>
              )}
            </span>
          </NavLink>
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/employees/gashat-report"
          >
            
            <i className="fa-solid fa-door-open"></i>
            <span>
              Gasht Reports{" "}
              {show && <label className="urdu-font">(رہائیاں)</label>}
            </span>
          </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderIGEmployeesAffairs = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "IG Employees Affairs"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading className="accordion__heading">
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
               
              >
                <i className="icon-prison"></i>{" "}
                <span data-key="t-apps">
                Employees' Affairs
                  {show && <label className="urdu-font">(ایچ آر)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
          <NavLink
              to="/admin/administration/manage-employee"
              
              className="nav-link"
              
            >
              <i className="fa-solid fa-id-card"></i>
              <span>
                {" "}
                Employees{" "}
                {show && <label className="urdu-font">(ملازمین)</label>}
              </span>
            </NavLink>
         
          <NavLink
              to="/admin/hr/attendance"
              className="nav-link menu-link"
            >
              <i className="fas fa-calendar-check"></i>
              <span>
                {" "}
                Attendance{" "}
                {show && <label className="urdu-font">(حاضری)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/hr/leaves"
              className="nav-link menu-link"
            >
              <i className="fas fa-calendar-alt"></i>
              <span>
                Leaves {show && <label className="urdu-font">(چھٹیاں)</label>}
              </span>
            </NavLink>
            <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/upcoming-retirements"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Upcoming Retirements{" "}
              {show && <label className="urdu-font">(آنے والی ریٹائرمنٹ)</label>}
            </span>
          </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };


  const renderViewHistory = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "View History"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade">
        <AccordionItem className="nav-item">        
             <NavLink
               className="nav-link menu-link accordion__heading "
               to="/admin/history-search"
               activeClassName="inherit-class"
             >
               <i className="icon-search"></i>
               <span>
                View History
                {show && <label className="urdu-font">(تاریخ دیکھیں)</label>}
              </span>
             </NavLink>
          </AccordionItem>
          </Accordion>
      );
    } else return null;
  };

  const renderHR = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "HR"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item " uuid={`${isAdmin ? 'b' : 'a'}`} >        
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="none-class"
              >
                <i className="icon-manager"></i>{" "}
                <span data-key="t-apps">
                  HR {show && <label className="urdu-font">(ایچ آر)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/hr/attendance"
              className="nav-link menu-link"
            >
              <i className="fas fa-calendar-check"></i>
              <span>
                {" "}
                Attendance{" "}
                {show && <label className="urdu-font">(حاضری)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/hr/leaves"
              className="nav-link menu-link"
            >
              <i className="fas fa-calendar-alt"></i>
              <span>
                Leaves {show && <label className="urdu-font">(چھٹیاں)</label>}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderMedicalStore = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Medical Store"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item" uuid={`${isAdmin ? 'b' : 'a'}`} >
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="true"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-medical"></i>{" "}
                <span data-key="t-apps">
                  Medical Store
                  {show && <label className="urdu-font">(میڈیکل سٹور)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
            <AccordionItemPanel>
              <>
              <NavLink
                to="/admin/medical-store/store-list"
                className="nav-link menu-link"
              >
                 <i className="fas fa-warehouse"></i>
                <span>
                  {" "}
                  Medical Stock{" "}
                  {show && <label className="urdu-font">(طبی اسٹاک)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/medical-store/prescribe-list"
                className="nav-link menu-link"
              >
                  <i className="fa-solid fa-prescription"></i>
                <span>
                  Prescription List
                  {show && <label className="urdu-font">(نسخے کی فہرست)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/medical-store/employee-priscriptions"
                className="nav-link menu-link"
              >
                 <i className="fa-solid fa-user-nurse"></i>
                <span>
                  Employee Priscriptions
                  {show && (
                    <label className="urdu-font">(ملازمین کے نسخے)</label>
                  )}
                </span>
              </NavLink>
              <NavLink
                to="/admin/medical-store/transfer-medicine"
                className="nav-link menu-link"
               
              >
                  <i className="fa-solid fa-truck-medical"></i>
                <span>
                  Medicine Transfer
                  {show && (
                    <label className="urdu-font">(ادویات کی منتقلی)</label>
                  )}
                </span>
              </NavLink>
              
              </>
            </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };
  const renderSearch = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Search"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade">

        <AccordionItem className="nav-item ">
              <NavLink
                className="nav-link menu-link accordion__heading "
                to="/admin/prisoner-search"
              >
                <i className="icon-search"></i>
                <span>
                  Search Prisoners
                  {show && (
                    <label className="urdu-font">(تلاش پرائے قیدی)</label>
                  )}
                </span>
              </NavLink>
          </AccordionItem>
    </Accordion>
      );
    } else return null;
  };

  const renderReleasePrisoner = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Release Prisoner"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/release-prisoner"
          >
            
            <i className="fa-solid fa-door-open"></i>
            <span>
              Release Prisoners{" "}
              {show && <label className="urdu-font">(رہائیاں)</label>}
            </span>
          </NavLink>
      );
    } else return null;
  };

  const renderGashatReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Gashat Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/employees/gashat-report"
          >
            
            <i className="fa-solid fa-door-open"></i>
            <span>
              Gasht Report{" "}
              {show && <label className="urdu-font">(رہائیاں)</label>}
            </span>
          </NavLink>
      );
    } else return null;
  };

  const renderUpCommingReleases = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Upcoming Releases"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/upcoming-release"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Upcoming Releases{" "}
              {show && <label className="urdu-font">(رہائیاں)</label>}
            </span>
          </NavLink>
     
      );
    } else return null;
  };

  const renderUpCommingRetirements  = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Upcoming Retirements"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/upcoming-retirements"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Upcoming Retirements{" "}
              {show && <label className="urdu-font">(آنے والی ریٹائرمنٹ)</label>}
            </span>
          </NavLink>
     
      );
    } else return null;
  };

  const renderReleasePrisonReport  = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Release Prison Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/release-prisoner-report"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Release Prisoner Report{" "}
              {show && <label className="urdu-font">(رہائیاں کی فہرست)</label>}
            </span>
          </NavLink>
     
      );
    } else return null;
  };
  const renderBloodDonorList  = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Blood Donor List"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/blood-donor-list"
            
          >
            <i className="fa-solid fa-arrow-right "></i>
            <span>
            Blood Donor List{" "}
              {show && <label className="urdu-font">(آنے والی ریٹائرمنٹ)</label>}
            </span>
          </NavLink>
     
      );
    } else return null;
  };

  const renderConvictPrisoner = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Convict Prisoner"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/convict-prisoner"
            
          >
            <i className="icon-convict"></i>
            <span>
              Convict Prisoner
              {show && (
                <label className="urdu-font">(سزا یافتہ قیدی)</label>
              )}
            </span>
          </NavLink>
         
      );
    } else return null;
  };

  const renderAppealManagement = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Appeal Management"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
          <NavLink
            className="nav-link menu-link accordion__heading animation-fade"
            to="/admin/prisoner/appeal-management"
          >
            <i className="icon-convict"></i>
            <span>
              Appeal Management
              {show && (
                <label className="urdu-font"></label>
              )}
            </span>
          </NavLink>
      
      );
    } else return null;
  };

  const renderTransferPrisoner = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Transfer Prisoner"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            className="nav-link menu-link accordion__heading"
            to="/admin/prisoner/transfer-prisoner"
            
          >
            <i className="fa-solid fa-exchange"></i>
            <span>
              Prisoner Transfers
              {show && (
                <label className="urdu-font">(منتقلی برائے قیدیان)</label>
              )}
            </span>
          </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderGoodsAccess = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Goods Access"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            className="nav-link menu-link accordion__heading"
            to="/admin/goods-access"
            
          >
            <i className="fa-solid fa-exchange"></i>
            <span>
            Goods Access
              {show && (
                <label className="urdu-font">(سامان تک رسائی)</label>
              )}
            </span>
          </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderManageVisitors = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Manage Visitors"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item" uuid={`${isAdmin ? 'b' : 'a'}`} >
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link "
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-visitor"></i>{" "}
                <span data-key="t-apps">
                  Manage Visitors
                  {show && (
                    <label className="urdu-font">(وزیٹر کا انتظام کریں)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
              <NavLink
                to="/admin/vistors/add-visitors"
                
                className="nav-link"
              >
                <i className="fas fa-address-card	"></i>
                <span>
                  Add Visitors
                  {show && (
                    <label className="urdu-font">(وزیٹر شامل کریں)</label>
                  )}{" "}
                </span>
              </NavLink>
          
              <NavLink
                to="/admin/vistors/manage-visitors"
                
                className="nav-link"
              >
                <span>
                  {" "}
                  Visitors queue
                  {show && (
                    <label className="urdu-font">(زائرین کی قطار)</label>
                  )}
                </span>
              </NavLink>
          </AccordionItemPanel>
            <AccordionItem className="nav-item">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <NavLink
                    className="nav-link menu-link"
                    to="#sidebarAllocation"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarAllocation"
                    
                  >
                    <i className="icon-report"></i>{" "}
                    <span data-key="t-apps">
                      Visitors Reports{" "}
                      {show && <label className="urdu-font">(رپورٹس)</label>}
                    </span>
                  </NavLink>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <NavLink
                  to="/admin/reports/prisoner-wise-visitor-report"
                  
                  className="nav-link"
                >
                  Prisoner wise Report
                </NavLink>
                {/* <NavLink
                  to="/admin/reports/visitor-wise-report"
                  
                  className="nav-link"
                >
                  Visitor Wise Report
                </NavLink> */}
              </AccordionItemPanel>
            </AccordionItem>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderManageVisitorsForCircleOffice = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Manage Visitors For Circle Office"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item" uuid={`${isAdmin ? 'b' : 'a'}`} >
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link "
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-visitor"></i>{" "}
                <span data-key="t-apps">
                  Manage Visitors
                  {show && (
                    <label className="urdu-font">(وزیٹر کا انتظام کریں)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
          
                <NavLink
                  to="/admin/vistors/manage-visitors"
                  
                  className="nav-link"
                >
                  <i className="fas fa-tasks"></i>
                  <span>
                    {" "}
                    Visitors queue
                    {show && (
                      <label className="urdu-font">(زائرین کی قطار)</label>
                    )}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin/prisoner/visitors-report"
                  
                  className="nav-link"
                >
                   <i className="icon-report"></i>
                  <span>

                    {" "}
                    Report{" "}
                    {show && <label className="urdu-font">(رپورٹ)</label>}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin/visitors/block-visitor"
                  
                  className="nav-link"
                > 
                <i className="fas fa-ban"></i>
                  <span>
                    {" "}
                    Block Visitor
                    {show && <label className="urdu-font">(بلاک وزیٹر)</label>}
                  </span>
                </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderManageVisitorsForAdmin = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Manage Visitors Admin"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" >
        <AccordionItem className="nav-item">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link "
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-visitor"></i>{" "}
                <span data-key="t-apps">
                  Manage Visitors
                  {show && (
                    <label className="urdu-font">(وزیٹر کا انتظام کریں)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
              <NavLink
                to="/admin/vistors/add-visitors"
                
                className="nav-link"
              >
                <i className="fas fa-address-card	"></i>
                <span>
                  Add Visitors
                  {show && (
                    <label className="urdu-font">(وزیٹر شامل کریں)</label>
                  )}{" "}
                </span>
              </NavLink>
           
                <NavLink
                  to="/admin/vistors/manage-visitors"
                  
                  className="nav-link"
                >
                  <i className="fas fa-tasks"></i>
                  <span>
                    {" "}
                    Visitors queue
                    {show && (
                      <label className="urdu-font">(زائرین کی قطار)</label>
                    )}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin/prisoner/visitors-report"
                  
                  className="nav-link"
                >
                   <i className="icon-report"></i>
                  <span>

                    {" "}
                    Report{" "}
                    {show && <label className="urdu-font">(رپورٹ)</label>}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin/visitors/block-visitor"
                  
                  className="nav-link"
                > 
                <i className="fas fa-ban"></i>
                  <span>
                    {" "}
                    Block Visitor
                    {show && <label className="urdu-font">(بلاک وزیٹر)</label>}
                  </span>
                </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderHospitalTreatments = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Hospital Treatment"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <Accordion className="animation-fade" preExpanded={['a']} allowZeroExpanded = {true}>
        <AccordionItem className="nav-item " uuid={`${isAdmin ? 'b' : 'a'}`} >
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link "
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  activeClassName="inherit-class"
                >
                  <i className="icon-hospital"></i>{" "}
                  <span data-key="t-apps">
                    Hospital Treatment
                    {show && (
                      <label className="urdu-font">(ہسپتال میں علاج)</label>
                    )}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink to="/admin/hospital/admission" className="nav-link">
              <i className="fas fa-medkit"></i>
                <span>
                  {" "}
                  New Treatments
                  {show && <label className="urdu-font">(نیا علاج)</label>}
                </span>
              </NavLink>
              <NavLink to="/admin/hospital/opd-admission" className="nav-link">
                <i className="fas fa-user-md"></i>
                <span>
                  {" "}
                  OPD {show && <label className="urdu-font">(او پی ڈی)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hospital/ipd-admission"
                
                className="nav-link"
              >
                <i className="fas fa-heartbeat"></i>
                <span>
                  {" "}
                  IPD {show && <label className="urdu-font">(آئی پی ڈی)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hospital/outside-admission"
                
                className="nav-link"
              >
                <i className="fas fa-ambulance"></i>
                <span>
                  {" "}
                  Outside Hospital
                  {show && (
                    <label className="urdu-font">(ہسپتال کے باہر)</label>
                  )}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hospital/medical-details"
                
                className="nav-link"
              >
                <i className="icon-add"></i>
                <span>
                  {" "}
                  Medical Examination
                  {show && (
                    <label className="urdu-font">
                      (طبی تفصیلات شامل کریں۔)
                    </label>
                  )}
                </span>
              </NavLink>
            </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
      );
    } else return null;
  };

  const renderHospitalTreatmentsReports = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Medical Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
              <AccordionItem className="animation-fade">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <NavLink
                    className="nav-link menu-link"
                    to="#sidebarAllocation"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarAllocation"
                  >
                    <i className="icon-report"></i>{" "}
                    <span data-key="t-apps">
                      Medical Reports{" "}
                      {show && <label className="urdu-font">(رپورٹس)</label>}
                    </span>
                  </NavLink>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <NavLink
                  to="/admin/reports/prisoner-medical-report"
                  
                  className="nav-link"
                >
                  Medical info Report
                </NavLink>
              </AccordionItemPanel>
              <AccordionItemPanel>
                <NavLink
                  to="/admin/reports/hospital-admission-report"
                  
                  className="nav-link"
                >
                  Hospital Admission Report
                </NavLink>
              </AccordionItemPanel>
              </AccordionItem>
         
      );
    } else return null;
  };

  const renderUserPermissions = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "User Permissions"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-confirmation"></i>{" "}
                <span data-key="t-apps">
                  User Permissions
                  {show && <label className="urdu-font">(صارف کی اجازت)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink to="#"  className="nav-link" activeClassName="none-class">
              <i className="fas fa-user-shield"></i>
              <span>
                {" "}
                Departments Permission
                {show && <label className="urdu-font">(محکموں کی اجازت)</label>}
              </span>
            </NavLink>
            <NavLink to="#"  className="nav-link" activeClassName="none-class">
            <i className="fas fa-user-shield"></i>
              <span>
                {" "}
                Prisons Permission
                {show && <label className="urdu-font">(جیلوں کی اجازت)</label>}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderAdministations = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Administration"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="none-class"
              >
                <i className="icon-inquiry"></i>{" "}
                <span data-key="t-apps">
                  Administration{" "}
                  {show && <label className="urdu-font">(انتظامیہ)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/administration/manage-employee"
              
              className="nav-link"
              
            >
              <i className="fa-solid fa-id-card"></i>
              <span>
                {" "}
                Employees{" "}
                {show && <label className="urdu-font">(ملازمین)</label>}
              </span>
            </NavLink>
              <NavLink
                to="/admin/administration/approve-employee"
                
                className="nav-link"
                
              >
                <i className="fa-solid fa-circle-check"></i>
                <span>
                  {" "}
                  Approvals{" "}
                  {show && <label className="urdu-font">(ملازمین)</label>}
                </span>
              </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderAdministationsForHrAndSp = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Administration For Sp And HR"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
              >
                <i className="icon-inquiry"></i>{" "}
                <span data-key="t-apps">
                  Administration{" "}
                  {show && <label className="urdu-font">(انتظامیہ)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/administration/manage-employee"
              
              className="nav-link"
              
            >
              <i className="fa-solid fa-id-card"></i>
              <span>
                {" "}
                Employees{" "}
                {show && <label className="urdu-font">(ملازمین)</label>}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderCircleOffice = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Prison Circle Office"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="none-class"
              >
                <i className="icon-circleoffice"></i>{" "}
                <span data-key="t-apps">
                  Circle Office
                  {show && <label className="urdu-font">(حلقہ دفتر)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/circleoffice/checkout-checkin"
              className="nav-link"
              
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>
                CheckIn/CheckOut
                {show && <label className="urdu-font">(چیک ان/چیک آوٹ)</label>}
              </span>
            </NavLink>
            <NavLink
              to="/admin/circleoffice/hearing-checkout-checkin"
              className="nav-link"
              
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>
                Hearing CheckIn/CheckOut
                {show && (
                  <label className="urdu-font"> (سماعت چیک ان/چیک آوٹ)</label>
                )}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderCircleOfficeReports = () => {   
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Prison Circle Office Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
       

          <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inherit-class"
              >
                <i className="icon-report"></i>{" "}
                <span data-key="t-apps">
                  Reports{" "}
                  {show && <label className="urdu-font">(رپورٹس)</label>}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
          <NavLink
            to="/admin/reports/checkincheckout-report"
            
            className="nav-link"
          >
            CheckIn/CheckOut Report
          </NavLink>
            <NavLink
              to="/admin/reports/darban-report"
            
              className="nav-link"
            >
              Darban Report
            </NavLink>
            <NavLink
              to="/admin/reports/remission-report"
            
              className="nav-link"
            >
              Remission Report
            </NavLink>
            <NavLink
              to="/admin/reports/transfer-report"
            
              className="nav-link"
            >
              Transfer Report
            </NavLink>
            <NavLink
              to="/admin/reports/case-report"
            
              className="nav-link"
            >
              Case Report
            </NavLink>
          
            {/* <li class="menu-title">
              <i class="ri-more-fill"></i> <span> Medical Reports</span>
            </li> */}

            <NavLink
              to="/admin/reports/prisoner-medical-report"
            
              className="nav-link"
            >
              Medical info Report
            </NavLink>
            <NavLink
              to="/admin/reports/hospital-admission-report"
            
              className="nav-link"
            >
              Hospital Admission Report
            </NavLink>
          {/* 
            <li class="menu-title">
              <i class="ri-more-fill"></i> <span> Visitors Reports</span>
            </li> */}
            <NavLink
              to="/admin/reports/prisoner-wise-visitor-report"
            
              className="nav-link"
            >
              Visitor Wise Report
            </NavLink>
            {/* <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span> Court Production Reports</span>
            </li> */}
            <NavLink
              to="/admin/reports/court-production-report"
            
              className="nav-link"
            >
              Court Production Report
            </NavLink>
            <NavLink
              to="/admin/prisoner/release-prisoner-report"
            
              className="nav-link"
            >
              Release Report
            </NavLink>
            <NavLink
              to="/admin/reports/remission-report"
            
              className="nav-link"
            >
          Remission Report
            </NavLink>
          </AccordionItemPanel>
          </AccordionItem>
      );
    } else return null;
  };

  const renderTransferReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Transfer Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <NavLink
              to="/admin/reports/transfer-report"
              
              className="nav-link"
            >
              <i className="icon-report"></i>
              <span data-key="t-apps"> Transfer Report</span>
            </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderCaseReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Case Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <NavLink
              to="/admin/reports/case-report"
              
              className="nav-link"
            >
              <i className="icon-report"></i>
              <span data-key="t-apps"> Case Report</span>
            </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderRemissionReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Remission Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <NavLink
              to="/admin/reports/remission-report"
              
              className="nav-link"
            >
              <i className="icon-report"></i>
              <span data-key="t-apps"> Remission Report</span>
            </NavLink>
        </AccordionItem>
      );
    } else return null;
  };


  const renderOffenseManagement = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Manage Offences"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <NavLink
              to="/admin/prisoner/manage-offences"
              
              className="nav-link"
            >
              <i className="icon-report"></i>
              <span data-key="t-apps"> Manage Offences</span>
            </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderManagePrisoners = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Manage Prisoners"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inhret-class"
              >
                <i className="icon-manage"></i>{" "}
                <span data-key="t-apps">
                  Manage Prisoners
                  {show && (
                    <label className="urdu-font">(قیدیوں کا انتظام کریں)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/prisoner/manage-prisoners"
              
             className='nav-link'
              activeClassName="inherit-class"
            >
              <i className="fa-solid fa-id-card"></i>
              <span>
                {" "}
                Admissions
                {show && (
                  <label className="urdu-font">(زیر التواء داخلے)</label>
                )}
              </span>
            </NavLink>
            <NavLink
              to="/admin/prisoner/manage-darbans"
              
              className="nav-link"
              
            >
              <i className="icon-rating-fill"></i>
              <span>
                {" "}
                Darbans {show && <label className="urdu-font">(دربن)</label>}
              </span>
            </NavLink>
          </AccordionItemPanel>
    
          <NavLink
            to="/admin/prisoner/manage-guests "
            
            className="nav-link accordion__heading"
            
          >
          
            <i className="fa-solid fa-user"></i>{" "}
            <span>
              Official Vistors{" "}
              {show && <label className="urdu-font">(مہمان)</label>}
            </span>
          </NavLink>
          
        </AccordionItem>
      );
    } else return null;
  };

  const renderPrisoners = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Prisoners UTP Convict"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            to="/admin/prisoner/manage-prisoners"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarAllocation"
            activeClassName="inherit-class"
            className='nav-link'
          >
            <i className="icon-corporate"></i>{" "}
            <span data-key="t-apps">
              Pending Admissions
              <span>
                {" "}
                {show && (
                  <label className="urdu-font">(زیر التواء داخلے)</label>
                )}
              </span>
            </span>
          </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderConvictReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Convict Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
         <AccordionItem className="nav-item animation-fade">
         <AccordionItemHeading>
           <AccordionItemButton>
             <NavLink
               className="nav-link menu-link"
               to="#sidebarAllocation"
               data-bs-toggle="collapse"
               role="button"
               aria-expanded="false"
               aria-controls="sidebarAllocation"
               activeClassName="inherit-class"
             >
               <i className="icon-report"></i>{" "}
               <span data-key="t-apps">
                 Reports{" "}
                 {show && <label className="urdu-font">(رپورٹس)</label>}
               </span>
             </NavLink>
           </AccordionItemButton>
         </AccordionItemHeading>
         <AccordionItemPanel>
         <NavLink
              to="/admin/reports/master-report"
              
              className="nav-link"
              >
              {" "}
              Master Report
              {show && <label className="urdu-font">(ماسٹر رپورٹ)</label>}
        </NavLink>
         <NavLink
              to="/admin/reports/convict-report"
              className="nav-link"
            >
              {/* <i className="icon-report"></i> */}
              Convict Report
            </NavLink>
           <NavLink
             to="/admin/reports/darban-report"
            
             className="nav-link"
           >
             Darban Report
           </NavLink>
           <NavLink
             to="/admin/reports/checkincheckout-report"
            
             className="nav-link"
           >
             CheckIn/CheckOut Report
           </NavLink>
           <NavLink
             to="/admin/reports/remission-report"
            
             className="nav-link"
           >
             Remission Report
           </NavLink>
           <NavLink
             to="/admin/reports/transfer-report"
            
             className="nav-link"
           >
             Transfer Report
           </NavLink>
           <NavLink
             to="/admin/reports/case-report"
            
             className="nav-link"
           >
             Case Report
           </NavLink>
          
           {/* <li class="menu-title">
             <i class="ri-more-fill"></i> <span> Medical Reports</span>
           </li> */}

           <NavLink
             to="/admin/reports/prisoner-medical-report"
            
             className="nav-link"
           >
             Medical info Report
           </NavLink>
           <NavLink
             to="/admin/reports/hospital-admission-report"
            
             className="nav-link"
           >
             Hospital Admission Report
           </NavLink>
{/* 
           <li class="menu-title">
             <i class="ri-more-fill"></i> <span> Visitors Reports</span>
           </li> */}
           <NavLink
             to="/admin/reports/prisoner-wise-visitor-report"
            
             className="nav-link"
           >
             Visitor Wise Report
           </NavLink>
           {/* <li class="menu-title">
             <i class="ri-more-fill"></i>{" "}
             <span> Court Production Reports</span>
           </li> */}
           <NavLink
             to="/admin/reports/court-production-report"
            
             className="nav-link"
           >
             Court Production Report
           </NavLink>
           <NavLink
             to="/admin/prisoner/release-prisoner-report"
            
             className="nav-link"
           >
             Release Report
           </NavLink>
           <NavLink
             to="/admin/reports/remission-report"
            
             className="nav-link"
           >
          Remission Report
           </NavLink>
         </AccordionItemPanel>
       </AccordionItem>
      );
    } else return null;
  };
  
  const renderUTPReport = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Under Trial Report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
         <AccordionItem className="nav-item animation-fade">
         <AccordionItemHeading>
           <AccordionItemButton>
             <NavLink
               className="nav-link menu-link"
               to="#sidebarAllocation"
               data-bs-toggle="collapse"
               role="button"
               aria-expanded="false"
               aria-controls="sidebarAllocation"
               activeClassName="inherit-class"
             >
               <i className="icon-report"></i>{" "}
               <span data-key="t-apps">
                 Reports{" "}
                 {show && <label className="urdu-font">(رپورٹس)</label>}
               </span>
             </NavLink>
           </AccordionItemButton>
         </AccordionItemHeading>
         <AccordionItemPanel>
         <NavLink
            to="/admin/reports/master-report"
            
            className="nav-link"
            >
                {" "}
                Master Report
                {show && <label className="urdu-font">(ماسٹر رپورٹ)</label>}
        </NavLink>
         <NavLink
              to="/admin/reports/undertrial-report"
              
              className="nav-link"
            >
              Under Trial Report
            </NavLink>
           <NavLink
             to="/admin/reports/darban-report"
            
             className="nav-link"
           >
             Darban Report
           </NavLink>
           <NavLink
             to="/admin/reports/checkincheckout-report"
            
             className="nav-link"
           >
             CheckIn/CheckOut Report
           </NavLink>
           <NavLink
             to="/admin/reports/remission-report"
            
             className="nav-link"
           >
             Remission Report
           </NavLink>
           <NavLink
             to="/admin/reports/transfer-report"
            
             className="nav-link"
           >
             Transfer Report
           </NavLink>
           <NavLink
             to="/admin/reports/case-report"
            
             className="nav-link"
           >
             Case Report
           </NavLink>
          
           {/* <li class="menu-title">
             <i class="ri-more-fill"></i> <span> Medical Reports</span>
           </li> */}

           <NavLink
             to="/admin/reports/prisoner-medical-report"
            
             className="nav-link"
           >
             Medical info Report
           </NavLink>
           <NavLink
             to="/admin/reports/hospital-admission-report"
            
             className="nav-link"
           >
             Hospital Admission Report
           </NavLink>
{/* 
           <li class="menu-title">
             <i class="ri-more-fill"></i> <span> Visitors Reports</span>
           </li> */}
           <NavLink
             to="/admin/reports/prisoner-wise-visitor-report"
            
             className="nav-link"
           >
             Visitor Wise Report
           </NavLink>
           {/* <li class="menu-title">
             <i class="ri-more-fill"></i>{" "}
             <span> Court Production Reports</span>
           </li> */}
           <NavLink
             to="/admin/reports/court-production-report"
            
             className="nav-link"
           >
             Court Production Report
           </NavLink>
           <NavLink
             to="/admin/prisoner/release-prisoner-report"
            
             className="nav-link"
           >
             Release Report
           </NavLink>
         </AccordionItemPanel>
       </AccordionItem>
      );
    } else return null;
  };

  const renderSystemSettings = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "System Settings"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                activeClassName="inhret-class"
              >
                <i className="icon-settings"></i>{" "}
                <span data-key="t-apps">
                  System Settings
                  {show && (
                    <label className="urdu-font">(نظام کی ترتیبات)</label>
                  )}
                </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages">
              Geography {show && <label className="urdu-font">(جغرافیہ)</label>}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/country"
              
            >
              <span>
                {" "}
                Countries {show && <label className="urdu-font">(ملک)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/province?filter=country&id=countryId"
              
            >
              <span>
                Provinces {show && <label className="urdu-font">(صوبہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/district?filter=province&id=provinceId"
              
            >
              <span>
                {" "}
                Districts {show && <label className="urdu-font">(ضلع)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/city?filter=district&id=districtId"
              
            >
              <span>
                {" "}
                Cities {show && <label className="urdu-font">(شہر)</label>}
              </span>
            </NavLink>
            <li class="menu-title">
              <i class="ri-more-fill"></i> <span data-key="t-pages">Administration</span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/departments"
              
            >
              <span>
                {" "}
                Departments
                {show && <label className="urdu-font">(شعبه جات)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/designation"
              
            >
              <span>
                {" "}
                Designations{" "}
                {show && <label className="urdu-font">(عہدہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/facilityType"
              
            >
              <span>
                {" "}
                Facility Types{" "}
                {show && <label className="urdu-font">(فیشلٹی کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/domicile"
              
            >
              <span>
                {" "}
                Domiciles{" "}
                {show && <label className="urdu-font">(ڈومیسائل)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/employementType"
              
            >
              <span>
                {" "}
                Employment Types
                {show && <label className="urdu-font">(ملازمت کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/hrServiceStatus"
              
            >
              <span>
                {" "}
                HR Service Status
                {show && (
                  <label className="urdu-font">(ایچ آر سروس کی حیثیت)</label>
                )}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/hr-service-type"
              
            >
              <span>
                {" "}
                HR Service Types
                {show && (
                  <label className="urdu-font">(ایچ آر سروس کی قسم)</label>
                )}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/hr-termination-type"
              
            >
              <span>
                {" "}
                HR Termination Types
                {show && (
                  <label className="urdu-font">(ایچ آر ختم کرنے کی قسم)</label>
                )}
              </span>
            </NavLink>
            <li class="menu-title">
              <i class="ri-more-fill"></i> <span data-key="t-pages">Cases</span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/policeStation"
              
            >
              <span>
                Police Stations{" "}
                {show && <label className="urdu-font">(تھانہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/acts"
              
            >
              <span>
                {" "}
                Acts {show && <label className="urdu-font">(ایکٹ)</label>}
              </span>
            </NavLink>

            <NavLink
              
              className="nav-link"

              to="/admin/administration/system-settings/sections?filter=acts&id=actId"
            >
              <span>
                {" "}
                Under Sections
                {show && <label className="urdu-font">(حصوں کے تحت)</label>}
              </span>
            </NavLink>
           
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/bannedOrganizations?filter=sections&id=sectId"
              
            >
              <span>
                {" "}
                Banned Organizations
                {show && <label className="urdu-font">(کالعدم تنظیمیں۔)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/crimeType"
              
            >
              <span>
                {" "}
                Crime Types
                {show && <label className="urdu-font">(جرائم کی اقسام)</label>}
              </span>
            </NavLink>
            
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/remissionType"
              
            >
              <span>
                Remission Types
                {show && <label className="urdu-font">(معافی کی قسم)</label>}
              </span>
            </NavLink>

            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/authorityTypes"
              
            >
              <span>
                Authorities
                {show && <label className="urdu-font"></label>}
              </span>
            </NavLink>
            
            <li class="menu-title">
              <i class="ri-more-fill"></i>
              <span data-key="t-pages">
                courts {show && <label className="urdu-font">(عدالتیں)</label>}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/courtType"
              
            >
              <span>
                {" "}
                Court Types
                {show && <label className="urdu-font">(عدالت کی قسم)</label>}
              </span>
            </NavLink>

            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/court?filter=courtType&id=courtTypeId"
              
            >
              <span>
                {" "}
              Courts {show && <label className="urdu-font">(عدالتیں)</label>}
              </span>
            </NavLink>
            <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages">
                Medical {show && <label className="urdu-font">(طبی)</label>}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/vaccinations"
              
            >
              <span>
                {" "}
                Vaccinations{" "}
                {show && <label className="urdu-font"> (ویکسینیشن)</label>}
              </span>
            </NavLink>
          
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/disease"
              
            >
              <span>
                {" "}
                Diseases{" "}
                {show && <label className="urdu-font">(بیماریاں)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/medicineType"
              
            >
              <span>
                {" "}
                Medicine Types
                {show && <label className="urdu-font">(دوا کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/medicine?filter=medicineType&id=medicineTypeId"
              
            >
              <span>
                {" "}
                Medicines {show && <label className="urdu-font">(دوائی)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/outsideHospitals"
              
            >
              <span>
                {" "}
                Outside Hospitals
                {show && <label className="urdu-font">(ہسپتال کے باہر)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/donors"
              
            >
              <span>
                {" "}
                Donors
                {show && <label className="urdu-font">(عطیہ دہندگان)</label>}
              </span>
            </NavLink>

            <li class="menu-title">
              <i class="ri-more-fill"></i>
              <span data-key="t-pages">
                confinements {show && <label className="urdu-font">(حبسِ جیل)</label>}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/prisonType"
              
            >
              <span>
                Prison Types{" "}
                {show && <label className="urdu-font">(جیل کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/prison?filter=prisonType&id=prisonTypeId&idTwo=countryId&filterTwo=country&idThree=provinceId&filterThree=province&idFour=districtId&filterFour=district&idFive=cityId&filterFive=city"
              
            >
              <span>
                {" "}
                Prisons {show && <label className="urdu-font">(جیل)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/Enclosure?filter=prison&id=prisonId&isAbb=true"
              
            >
              <span>
                {" "}
                Prison Enclosures
                {show && <label className="urdu-font">(قیدی انڭلویر)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/PrisonBarracks?filter=prison&id=prisonId&filterTwo=Enclosure&idTwo=circleId&isAbb=true&isBarrack=true&isCap=true"
              
            >
              <span>
                {" "}
                Prison Barracks
                {show && <label className="urdu-font">(قیدی بیرک)</label>}
              </span>
            </NavLink>

            <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages">
                Prisoners {show && <label className="urdu-font">(قیدی)</label>}
              </span>
            </li>
           
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/prisonerType"
              
            >
              <span>
                {" "}
                Prisoner Types
                {show && <label className="urdu-font">(قیدی کی قسم)</label>}
              </span>
            </NavLink>
          
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/prisonerSubType?filter=prisonerType&id=prisonerTypeId"
              
            >
              <span>
                Prisoner Sub Types
                {show && <label className="urdu-font">(قیدی ذیلی قسم)</label>}
              </span>
            </NavLink>
            {/* <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/outinReason"
              
            >
              <span>
                {" "}
                Check In Outs{" "}
                {show && <label className="urdu-font">(چیک ان/چیک آوٹ)</label>}
              </span>
            </NavLink> */}
            {/* <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/prisonerCategory"
              
            >
              <span>
                {" "}
              Prisoner Categories
                {show && (
                  <label className="urdu-font">(قیدی کی درجہ بندی)</label>
                )}
              </span>
            </NavLink> */}
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/ReleaseType"
              
            >
              <span>
                {" "}
                Release Types
                {show && <label className="urdu-font">(رہائی کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/admin/administration/system-settings/offenceType"
            >
              <span>
                {" "}
                Offence Types
                {show && <label className="urdu-font">(جیل کے جرائم)</label>}
              </span>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/admin/administration/system-settings/inPrisonOffences?filter=offenceType&id=offenseTypeId"
            >
              <span>
                {" "}
                In Prison Offences
                {show && <label className="urdu-font">(جیل کے جرائم)</label>}
              </span>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/admin/administration/system-settings/remissionType"
            >
              <span>
                {" "}
                Remission Types
                {show && <label className="urdu-font">(معافی کی قسم)</label>}
              </span>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/admin/administration/system-settings/remission?filter=remissionType&id=remissionTypeId"
            >
              <span>
                {" "}
                Remission
                {show && <label className="urdu-font">(معافی)</label>}
              </span>
            </NavLink>

            <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages">
                Personal {show && <label className="urdu-font">(ذاتی)</label>}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/religion"
              
            >
              <span>
                {" "}
                Religions {show && <label className="urdu-font"> (فرقہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/sect?filter=religion&id=religionId"
              
            >
              <span>
                {" "}
                Sects {show && <label className="urdu-font"> (فرقہ)</label>}
              </span>
            </NavLink>
            {/* <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/ageCategory"
              
            >
              <span>
                {" "}
                Age Categories{" "}
                {show && <label className="urdu-font">(عمر)</label>}
              </span>
            </NavLink> */}
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/caste"
              
            >
              <span>
                {" "}
                Castes {show && <label className="urdu-font">(ذات)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/gender"
              
            >
              <span>
                {" "}
                Genders {show && <label className="urdu-font">(جنس)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/bloodGroup"
              
            >
              <span>
                {" "}
                Blood Groups
                {show && <label className="urdu-font">(خون کا گروپ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/MaritalStatus"
              
            >
              <span>
                {" "}
                Marital Status
                {show && <label className="urdu-font">(ازدواجی حیثیت)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/NarcoticStatus"
              
            >
              <span>
                {" "}
                Narcotic Status
                {show && <label className="urdu-font">(منشیات کی حیثیت)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/Nationality"
              
            >
              <span>
                Nationalities{" "}
                {show && <label className="urdu-font">(قومیت)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/Occupation"
              
            >
              <span>
                {" "}
                Occupations {show && <label className="urdu-font">(پیشہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/Relationships"
              
            >
              <span>
                {" "}
                Relationships
                {show && <label className="urdu-font">(رشتہ)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/relationshipTypes"
            >
              <span>
                {" "}
                Relationship Types
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/Language"
              
            >
              <span>
                {" "}
                Languages {show && <label className="urdu-font">(زبان)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/EducationLKPT?filter=EducationTypeLkpt&id=educationTypeId"
              
            >
              <span>
                {" "}
                Education {show && <label className="urdu-font">(تعلیم)</label>}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/EducationTypeLkpt"
              
            >
              <span>
                {" "}
                Education Types
                {show && <label className="urdu-font">(تعلیم کی قسم)</label>}
              </span>
            </NavLink>

            <NavLink
              className="nav-link"
              to="/admin/administration/system-settings/leaveTypes"
            >
              <span>
                {" "}
                Leave Types
                {show && <label className="urdu-font">(چھٹی کی اقسام)</label>}
              </span>
            </NavLink>

            <li class="menu-title">
              <i class="ri-more-fill"></i>{" "}
              <span data-key="t-pages">
                Prison Inventory{" "}
                {show && (
                  <label className="urdu-font"> (جیل کی انوینٹری)</label>
                )}
              </span>
            </li>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/inventoryType"
              
            >
              <span>
                {" "}
                Inventory Types
                {show && (
                  <label className="urdu-font"> (انوینٹری کی قسم)</label>
                )}
              </span>
            </NavLink>
            <NavLink
              
              className="nav-link"
              to="/admin/administration/system-settings/inventory?filter=inventoryType&id=inventoryTypeId"
              
            >
              <span>
                {" "}
                Inventory
                {show && <label className="urdu-font"> (انوینٹری)</label>}
              </span>
            </NavLink>
          </AccordionItemPanel>
        </AccordionItem>
      );
    } else return null;
  };

  const renderReports = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Reports"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  activeClassName="inhret-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Reports{" "}
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/master-report"
                
                className="nav-link"
              >
                <i className="fa-solid fa-file"></i>
                <span>
                  {" "}
                  Master Report
                  {show && <label className="urdu-font">(ماسٹر رپورٹ)</label>}
                </span>
              </NavLink>
              <NavLink
                to="/admin/reports/darban-report"
                
                className="nav-link"
              >
                <i className="icon-rating-fill"></i>
                <span> Darban Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/guest-report"
                
                className="nav-link"
              >
                 <i className="fas fa-address-card"></i>
                <span> Guests Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/checkincheckout-report"
                
                className="nav-link"
              >
                 <i className="icon-rating-fill"></i>
                <span> CheckIn/CheckOut Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/undertrial-report"
                
                className="nav-link"
              >
                 <i className="icon-rating-fill"></i>
                <span>Under Trial Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/convict-report"
                
                className="nav-link"
              >
                 <i className="icon-rating-fill"></i>
                <span> Convict Report</span>
              </NavLink>
              <NavLink
                to="/admin/reports/user-activity"
                
                className="nav-link"
              >
                 <i className="icon-rating-fill"></i>
                <span> User Activity Report</span>
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="inhret-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Medical Reports{" "}
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/prisoner-medical-report"
                className="nav-link"
              >
                Prisoner wise Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="inhret-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Visitors Reports{" "}
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/prisoner-wise-visitor-report"
                
                className="nav-link"
              >
                Prisoner wise Report
              </NavLink>
              {/* <NavLink
                to="/admin/reports/visitor-wise-report"
                
                className="nav-link"
              >
                Visitor Wise Report
              </NavLink> */}
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="inhret-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Inventory Reports
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/receiving-report"
                
                className="nav-link"
              >
                Receiving Report
              </NavLink>
              <NavLink
                to="/admin/reports/issuance-report"
                
                className="nav-link"
              >
                Issuance Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="none-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Court Production Reports
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/court-production-report"
                
                className="nav-link"
              
              >
                Prisoner wise Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                  ClassName="nav-link"
                  activeClassName="none-class"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Medical Store Report
                    {show && <label className="urdu-font">(رپورٹس)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <NavLink
                to="/admin/reports/medical-store-report"
                
                className="nav-link"
              
              >
                Medicine Report
              </NavLink>
            </AccordionItemPanel>
          </AccordionItem>
        </>
      );
    } else return null;
  };

  const renderCheckinCheckout = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "CheckIn/CheckOut"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemPanel>
            <NavLink
              className="nav-link menu-link"
              to="/admin/circleoffice/checkout-checkin"
            >
              <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  CheckIn/CheckOut{" "}
                  {show && (
                    <label className="urdu-font"> (چیک ان/چیک آوٹ) </label>
                  )}
                </span>
            </NavLink>
          </AccordionItemPanel>
              <NavLink
                className="nav-link menu-link"
                to="/admin/circleoffice/checkout-checkin"
              >
                <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  CheckIn/CheckOut{" "}
                  {show && (
                    <label className="urdu-font"> (چیک ان/چیک آوٹ) </label>
                  )}
                </span>
              </NavLink>
              <NavLink
                to="/admin/circleoffice/hearing-checkout-checkin"
                className="nav-link"
              >
                <i className="icon-court"></i>
                <span data-key="t-apps">
                  Hearing CheckIn/CheckOut
                  {show && (
                    <label className="urdu-font"> (سماعت چیک ان/چیک آوٹ)</label>
                  )}
                </span>
              </NavLink>
        </AccordionItem>
      );
    }
  };

  const renderCheckinCheckoutSpApprovals = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "CheckIn/CheckOut Sp Approvals"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
            <AccordionItemHeading>
              <AccordionItemButton>
                <NavLink
                  className="nav-link menu-link"
                  to="#sidebarAllocation"
                  data-bs-toggle="collapse"
                  role="button"
                  activeClassName="inherit-class"
                  aria-expanded="false"
                  aria-controls="sidebarAllocation"
                >
                  <i className="icon-report"></i>{" "}
                  <span data-key="t-apps">
                    Approvals{" "}
                    {show && <label className="urdu-font">(منظوریاں)</label>}
                  </span>
                </NavLink>
              </AccordionItemButton>
            </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              className="nav-link menu-link"
              to="/admin/circleoffice/checkout-checkin"
              
            >
              <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  Check-Out Approvals{" "}
                  {show && <label className="urdu-font"> (چیک آوٹ منظوریاں) </label>}
                </span>
            </NavLink>
            {!isDSP && (
              <NavLink
                className="nav-link menu-link"
                to="/admin/hr/leave-approval"
              >
                <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  Leave Approvals
                  {show && (
                    <label className="urdu-font">(چھٹیوں کی منظوریاں)</label>
                  )}
                </span>
              </NavLink>
              )}
              <NavLink
                className="nav-link menu-link"
                to="/admin/sp/retrial-approval"
              >
                <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  Re-trial Approvals
                  {show && <label className="urdu-font">(ری تریل منظوریاں)</label>}
                </span>
              </NavLink>
              <NavLink
                className="nav-link menu-link"
                to="/admin/sp/release-approval"
              >
                <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  Release Approvals
                  {show && <label className="urdu-font">(ریلیز منظوریاں)</label>}
                </span>
              </NavLink>
              <NavLink
                className="nav-link menu-link"
                to="/admin/sp/visit-approval"
              >
                <i className="icon-confirmation"></i>
                <span data-key="t-apps">
                  Visit Approvals
                  {show && <label className="urdu-font">(چھٹیوں کی منظوریاں)</label>}
                </span>
              </NavLink>
          </AccordionItemPanel>
            {!isSp || !isDSP &&   
            <>
             <NavLink
                to="/admin/vistors/manage-visitors"
                
                className="nav-link menu-link"
              >
                <i className="icon-visitor"></i>
                <span>
                  {" "}
                  Visitors queue
                  {show && (
                    <label className="urdu-font">(زائرین کی قطار)</label>
                  )}
                </span>
              </NavLink>
              <NavLink
                to="/admin/hr/attendance"
                className="nav-link menu-link"
                
              >
                <i className="fas fa-calendar-check"></i>
                <span>
                  {" "}
                  Attendance{" "}
                  {show && <label className="urdu-font">(حاضری)</label>}
                </span>
              </NavLink>
              </> }
        </AccordionItem>
      );
    }
  };

  const renderFinalizeAndCheckout = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Attendance and darban report"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            to="/admin/hr/attendance"
            className="nav-link menu-link"
            
          >
            <i className="icon-court"></i>
            <span>
              {" "}
              Attendance {show && <label className="urdu-font">(حاضری)</label>}
            </span>
          </NavLink>
          <NavLink
            to="/admin/reports/darban-report"
            
            className="nav-link"
          >
            {" "}
            <i className="icon-report"></i> <span> Darban Report</span>
          </NavLink>
          <NavLink
            to="/admin/reports/daily-darban-report"
            
            className="nav-link"
          >
            {" "}
            <i className="icon-report"></i> <span> Daily Darban Report</span>
          </NavLink>
        </AccordionItem>
      );
    }
  };

  const renderCourtProductionHistory = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Court Production History"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            className="nav-link menu-link"
            to="/admin/court-production/list"
            
          >
            <i className="icon-court"></i>
            <span data-key="t-apps">
              Court Production History{" "}
              {show && (
                <label className="urdu-font">(فہرست برائے پیشیاں)</label>
              )}
            </span>
          </NavLink>
        </AccordionItem>
      );
    }
  };
  const renderInPrisonEducationManagement = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "in Prison Education Management"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <NavLink
            className="nav-link menu-link"
            to="/admin/education-management"
            
          >
            <i className="icon-court"></i>
            <span data-key="t-apps">
            Manage Education{" "}
              {show && (
                <label className="urdu-font">(جیل تعلیم کے انتظام)</label>
              )}
            </span>
          </NavLink>
        </AccordionItem>
      );
    }
  };
  const renderDarban = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Darbans"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade">
          <AccordionItemHeading>
            <AccordionItemButton>
              <NavLink
                className="nav-link menu-link"
                to="#sidebarAllocation"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="sidebarAllocation"
                
              >
                <i className="icon-manage"></i>{" "}
                <span data-key="t-apps">Manage Prisoners </span>
              </NavLink>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <NavLink
              to="/admin/prisoner/manage-darbans"
              
        
              activeClassName="inherit-class"
              className='nav-link'
           
            >
              <i className="fa-solid fa-id-card"></i>
              <span data-key="t-apps">
                {" "}
                Admissions{" "}
                {show && (
                  <label className="urdu-font">
                    {" "}
                    (قیدی زیر التوا برائے داخلہ)
                  </label>
                )}{" "}
              </span>
            </NavLink>
            <NavLink
              to="/admin/prisoner/manage-eascaped-prisoners"
              
        
              activeClassName="inherit-class"
              className='nav-link'
           
            >
              <i className="fa-solid fa-id-card"></i>
              <span data-key="t-apps">
                {" "}
                Escaped Prisoners{" "}
                {show && (
                  <label className="urdu-font">
                    {" "}
                    (فرار ہونے والے قیدی)
                  </label>
                )}{" "}
              </span>
            </NavLink>
          </AccordionItemPanel>
          <NavLink
            to="/admin/prisoner/manage-guests"
            
            className="nav-link"
            
          >
            <i className="fa-solid fa-user"></i>{" "} Official Vistors
          </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  const renderRemission = () => {
    // const accessRight = userMeta.permissions.filter(
    //   (item) => item.view === "Remission Prisoner"
    // );
    const accessRight = "Allow";
    if (accessRight.length > 0) {
      return (
        <AccordionItem className="nav-item animation-fade ">
          <NavLink
            className="nav-link menu-link accordion__heading"
            to="/admin/prisoner/remission-prisoner"
            activeClassName="inherit-class"
          >
            <i className="icon-remission"></i>
            <span>
              Prisoner Remission
              {show && <label className="urdu-font">(قیدی معافی)</label>}
            </span>
          </NavLink>
        </AccordionItem>
      );
    } else return null;
  };

  return (
    <>
      <div className="app-menu navbar-menu  d-flex flex-column justify-content-between">
        <div className="navbar-brand-box">
          <a href="dashboard" className="logo logo-dark">
            <div className="logo-lg">
               {Logo()}
            </div>
          </a>
          <a href="dashboard" className="logo logo-light">
            <div className="logo-sm">
              <img src="assets/images/1.png" alt="" height="22" />
            </div>
            <span className="logo-lg">
              <img src="assets/images/1.png" alt="" height="17" />
            </span>
          </a>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        <div id="scrollbar" className="flex-grow-1 d-flex flex-column justify-content-between">
          <div className="inner-menu">
            <Accordion allowZeroExpanded>
              {renderDashboard()}
              {renderIGDashboards()}
              {renderIGCircleOfiice()}
              {renderIGEmployeesAffairs()}
              {renderIGAdministration()}
              {!(isIG || isDig || isSp) && (
              renderBarrackAllocation()
              )}
              {renderViewHistory()}
              {renderHR()}
              {renderMedicalStore()}
              {renderInventory()}
              {renderCourtProduction()}
              {!(isIG || isDig || isSp) && (
                renderSearch()
              )}
              {renderHospitalTreatments()}
              {renderUserPermissions()}
              {renderAdministations()}
              {renderManageVisitors()}
              {renderCircleOffice()}
              {renderOffenseManagement()}
              {renderReleasePrisoner()}
              
              {renderUpCommingReleases()}
              {renderUpCommingRetirements()}
              {renderBloodDonorList()}
              {renderConvictPrisoner()}
              {renderAppealManagement()}
              {renderTransferPrisoner()}
              {renderRemission()}
              {renderPrisoners()}
              {renderSystemSettings()}
              {renderCourtProductionHistory()}
              {renderMedicalStoreReport()}
              {/* {renderInventoryReports()} */}
              {renderCourtProductionReports()}
              {renderCaseReport()}
              {renderHospitalTreatmentsReports()}
              {renderAdministationsForHrAndSp()}
              {renderDarban()}
              {renderGoodsAccess()}
              {renderInPrisonEducationManagement()}
              {renderManageVisitorsForCircleOffice()}
              {renderReleasePrisonReport()}
              {renderManageVisitorsForAdmin()}
              {renderGashatReport()}
              {renderCheckinCheckout()}
              {renderTransferReport()}
              {renderCheckinCheckoutSpApprovals()}
              {renderCircleOfficeReports()}
              {renderFinalizeAndCheckout()}
              {renderConvictReport()}
              {renderUTPReport()}
              {renderRemissionReport()}
              {renderManagePrisoners()}
              {renderReports()}
              {renderIGReports()}
            </Accordion>
          </div>
        </div>
        <div className="rebranding-wrapper" style={{position: 'relative', bottom: '-10%' }}>
          <div className="rebranding">
          
            <div className="d-flex flex-column justify-content-center p-2 ps-3 align-items-center">
              <img
                src={unodcLogo}
                alt="UNODC Logo"
                className="mt-2"
                style={{width: '70%', height: '70%', opacity: "0.2"}}
              />
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default AppMenu;
