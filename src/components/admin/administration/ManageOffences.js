import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ViewPrisonersListing from "../../../modules/hospital/components/ViewAdmissions";
import ManageHearing from "../../../modules/courtProduction/components/ManageHearing";
import ViewOffences from "./offences/ViewOffences";

const ManageOffences = (props) => {
  const [activetab, setActiveTab] = useState(0);
  const show = useSelector((state) => state.language.urdu);
  const userMeta = useSelector((state) => state.user);
  const isSp = userMeta?.role === "Prison Superintendent";
  const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";

  return (
    <>
      <div className="row">
        <div class="row flex">
          <h4 class="third-heading  just-space ">
            <span>
              Manage Prisoners Offense {show && <label>(قیدیوں کا انتظام کریں)</label>}
            </span>
          </h4>
        </div>
        <Tabs selectedIndex={activetab}>
          <TabList className="nav nav-tabs nav-justified nav-border-top nav-border-top-success mb-0">
            <Tab
              className="nav-item  nav-link"
              onClick={() => {
                setActiveTab(0);
              }}
            >
              {isSp || isDig || isIG ?
              "Prisoners with offenses"
              :
              `Prisoners List`
              }
             {} 
            </Tab>
            <Tab
              className="nav-item  nav-link"
              // onClick={() => {
              //   setActiveTab(1);
              // }}
            >
              Manage Priosner Offenses {show && <label>(قیدی کے رویے)</label>}
            </Tab>
            
          </TabList>
          <div className='card'>
						<div className='card-body'>
							<TabPanel>
								<ViewPrisonersListing
									setActiveTab={setActiveTab}
									redirectTab={1}
                  type="offence"
                  btnTitle={`${isSp || isDig || isIG ? "View" : "Add"}`}
                  icon={`${isSp || isDig || isIG ? "icon-show-password" : "icon-add"}`}
									item='prisonerHearingEntry'
									getURL={`${isSp || isDig || isIG ? "SearchPrisonersWithOffenses" : "SearchPrisonersWithoutOffenses"}`}
									navItem={1}
								/>
							</TabPanel>
							<TabPanel>
                <ViewOffences />
							</TabPanel>
						</div>
					</div>
        </Tabs>
      </div>
    </>
  );
};


export default ManageOffences;
