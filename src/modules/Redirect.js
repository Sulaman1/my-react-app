import React from "react";
import PropTypes from "prop-types";
import { Navigate, generatePath, useMatch } from "react-router-dom";

/**
 * The public API for navigating programmatically with a component (v6 style).
 */
function Redirect({ computedMatch, to, push = false }) {
  // If your app is passing computedMatch from a <Route>, you can still support it:
  const path =
    computedMatch && typeof to === "string"
      ? generatePath(to, computedMatch.params)
      : typeof to === "object" && computedMatch
      ? {
          ...to,
          pathname: generatePath(to.pathname, computedMatch.params),
        }
      : to;

  return (
    <Navigate to={path} replace={!push} />
  );
}

Redirect.propTypes = {
  push: PropTypes.bool,
  from: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default Redirect;


// import React from "react";
// import PropTypes from "prop-types";
// import { createLocation, locationsAreEqual } from "history";
// import invariant from "tiny-invariant";

// import Lifecycle from "./Lifecycle.js";
// import RouterContext from "./RouterContext.js";
// import generatePath from "./generatePath.js";

// /**
//  * The public API for navigating programmatically with a component.
//  */
// function Redirect({ computedMatch, to, push = false }) {
//   return (
//     <RouterContext.Consumer>
//       {context => {
//         invariant(context, "You should not use <Redirect> outside a <Router>");

//         const { history, staticContext } = context;

//         const method = push ? history.push : history.replace;
//         const location = createLocation(
//           computedMatch
//             ? typeof to === "string"
//               ? generatePath(to, computedMatch.params)
//               : {
//                   ...to,
//                   pathname: generatePath(to.pathname, computedMatch.params)
//                 }
//             : to
//         );

//         // When rendering in a static context,
//         // set the new location immediately.
//         if (staticContext) {
//           method(location);
//           return null;
//         }

//         return (
//           <Lifecycle
//             onMount={() => {
//               method(location);
//             }}
//             onUpdate={(self, prevProps) => {
//               const prevLocation = createLocation(prevProps.to);
//               if (
//                 !locationsAreEqual(prevLocation, {
//                   ...location,
//                   key: prevLocation.key
//                 })
//               ) {
//                 method(location);
//               }
//             }}
//             to={to}
//           />
//         );
//       }}
//     </RouterContext.Consumer>
//   );
// }

// if (__DEV__) {
//   Redirect.propTypes = {
//     push: PropTypes.bool,
//     from: PropTypes.string,
//     to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
//   };
// }

// export default Redirect;
