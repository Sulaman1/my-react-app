// src/modules/NavLink.js
import React from "react";
import PropTypes from "prop-types";
import { useLocation, useResolvedPath, useMatch, useInRouterContext } from "react-router-dom";
import invariant from "tiny-invariant";
import Link from "./Link.js";
import {
  resolveToLocation,
  normalizeToLocation
} from "./utils/locationUtils.js";

// React 15 compat
const forwardRefShim = C => C;
let { forwardRef } = React;
if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

function joinClassnames(...classnames) {
  return classnames.filter(Boolean).join(" ");
}

const NavLink = forwardRef(
  (
    {
      "aria-current": ariaCurrent = "page",
      activeClassName = "active",
      activeStyle,
      className: classNameProp,
      // “exact”, “strict”, “sensitive” are old v5 props
      // In v6, you simply supply “end” for exact behavior
      end = false,
      isActive: isActiveProp,
      location: locationProp,
      style: styleProp,
      to,
      innerRef,
      ...rest
    },
    forwardedRef
  ) => {
    const inRouter = useInRouterContext();
    invariant(inRouter, "You should not use <NavLink> outside a <Router>");

    const currentLocation = useLocation();
    const resolvedPath = useResolvedPath(to);

    // If a location prop is given, use it instead of current location
    const loc = locationProp || currentLocation;

    // useMatch returns match object or null
    const match = useMatch({ path: resolvedPath.pathname, end });

    const isActive = !!(isActiveProp
      ? isActiveProp(match, loc)
      : match);

    let className =
      typeof classNameProp === "function"
        ? classNameProp(isActive)
        : classNameProp;

    let style =
      typeof styleProp === "function" ? styleProp(isActive) : styleProp;

    if (isActive) {
      className = joinClassnames(className, activeClassName);
      style = { ...style, ...activeStyle };
    }

    // Normalize to location for your custom Link
    const toLocation = normalizeToLocation(
      resolveToLocation(to, loc),
      loc
    );

    const props = {
      "aria-current": (isActive && ariaCurrent) || null,
      className,
      style,
      to: toLocation,
      ...rest
    };

    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return <Link {...props} />;
  }
);

if (__DEV__) {
  NavLink.displayName = "NavLink";

  const ariaCurrentType = PropTypes.oneOf([
    "page",
    "step",
    "location",
    "date",
    "time",
    "true",
    "false"
  ]);

  NavLink.propTypes = {
    ...Link.propTypes,
    "aria-current": ariaCurrentType,
    activeClassName: PropTypes.string,
    activeStyle: PropTypes.object,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    end: PropTypes.bool, // replaces exact
    isActive: PropTypes.func,
    location: PropTypes.object,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
  };
}

export default NavLink;


// import React from "react";
// import { __RouterContext as RouterContext, matchPath } from "react-router";
// import PropTypes from "prop-types";
// import invariant from "tiny-invariant";
// import Link from "./Link.js";
// import {
//   resolveToLocation,
//   normalizeToLocation
// } from "./utils/locationUtils.js";

// // React 15 compat
// const forwardRefShim = C => C;
// let { forwardRef } = React;
// if (typeof forwardRef === "undefined") {
//   forwardRef = forwardRefShim;
// }

// function joinClassnames(...classnames) {
//   return classnames.filter(i => i).join(" ");
// }

// /**
//  * A <Link> wrapper that knows if it's "active" or not.
//  */
// const NavLink = forwardRef(
//   (
//     {
//       "aria-current": ariaCurrent = "page",
//       activeClassName = "active", // TODO: deprecate
//       activeStyle, // TODO: deprecate
//       className: classNameProp,
//       exact,
//       isActive: isActiveProp,
//       location: locationProp,
//       sensitive,
//       strict,
//       style: styleProp,
//       to,
//       innerRef, // TODO: deprecate
//       ...rest
//     },
//     forwardedRef
//   ) => {
//     return (
//       <RouterContext.Consumer>
//         {context => {
//           invariant(context, "You should not use <NavLink> outside a <Router>");

//           const currentLocation = locationProp || context.location;
//           const toLocation = normalizeToLocation(
//             resolveToLocation(to, currentLocation),
//             currentLocation
//           );
//           const { pathname: path } = toLocation;
//           // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
//           const escapedPath =
//             path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

//           const match = escapedPath
//             ? matchPath(currentLocation.pathname, {
//                 path: escapedPath,
//                 exact,
//                 sensitive,
//                 strict
//               })
//             : null;
//           const isActive = !!(isActiveProp
//             ? isActiveProp(match, currentLocation)
//             : match);

//           let className =
//             typeof classNameProp === "function"
//               ? classNameProp(isActive)
//               : classNameProp;

//           let style =
//             typeof styleProp === "function" ? styleProp(isActive) : styleProp;

//           if (isActive) {
//             className = joinClassnames(className, activeClassName);
//             style = { ...style, ...activeStyle };
//           }

//           const props = {
//             "aria-current": (isActive && ariaCurrent) || null,
//             className,
//             style,
//             to: toLocation,
//             ...rest
//           };

//           // React 15 compat
//           if (forwardRefShim !== forwardRef) {
//             props.ref = forwardedRef || innerRef;
//           } else {
//             props.innerRef = innerRef;
//           }

//           return <Link {...props} />;
//         }}
//       </RouterContext.Consumer>
//     );
//   }
// );

// if (__DEV__) {
//   NavLink.displayName = "NavLink";

//   const ariaCurrentType = PropTypes.oneOf([
//     "page",
//     "step",
//     "location",
//     "date",
//     "time",
//     "true",
//     "false"
//   ]);

//   NavLink.propTypes = {
//     ...Link.propTypes,
//     "aria-current": ariaCurrentType,
//     activeClassName: PropTypes.string,
//     activeStyle: PropTypes.object,
//     className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
//     exact: PropTypes.bool,
//     isActive: PropTypes.func,
//     location: PropTypes.object,
//     sensitive: PropTypes.bool,
//     strict: PropTypes.bool,
//     style: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
//   };
// }

// export default NavLink;
