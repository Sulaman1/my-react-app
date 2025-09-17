import React, { useEffect, useState } from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { NavLink } from "react-router-dom";
const routes = [
  { path: "/", breadcrumb: "Home" },
  { path: "/admin/administration", breadcrumb: "Dashboard" },
  { path: "/tourist/", breadcrumb: "Dashboard" },
  { path: "/admin/dashboard/over-view", breadcrumb: "Overview" },
  { path: "/tourist/dashboard/over-view", breadcrumb: "Dashboard" },
  { path: "admin/employee-new-view/over-view", breadcrumb: "Overview" },
  {
    path: "/tourist/Employee-new-view/over-view",
    breadcrumb: "Employee-New-view",
  },
];

const Bradcurms = (props) => {

  const [title, setTitle] = useState("");
  const breadcrumbs = useBreadcrumbs(routes, { excludePaths: ["/admin", "/"] });
  useEffect(() => {
    let query = props.location.pathname.split("/");
    let type = query[query.length - 1];
    setTitle(type.replace(/-/g, " "))
  }, []);

  return (
    <>
      <div className="page-title-box d-sm-flex align-items-right justify-content-between brad-navigate">
        <div className="col-12 d-flex ">
          <h4 className="mb-sm-0">&nbsp;</h4>
          <div className="breadcrums">
            {breadcrumbs.map(({ match, breadcrumb }) => (
              <li key={match.url}>
                <NavLink to={match.url}>{breadcrumb}</NavLink>
              </li>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bradcurms;
