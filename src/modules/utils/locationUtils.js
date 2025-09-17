// src/utils/locationUtils.js
import { parsePath } from "history";

/**
 * If `to` is a function, pass the current location into it.
 * Otherwise return `to` directly.
 */
export const resolveToLocation = (to, currentLocation) =>
  typeof to === "function" ? to(currentLocation) : to;

/**
 * In v6, there's no createLocation.
 * We can normalize a string path into a location-like object using parsePath.
 */
export const normalizeToLocation = (to, currentLocation) => {
  if (typeof to === "string") {
    // parsePath returns an object { pathname, search, hash }
    const parsed = parsePath(to);
    return {
      ...parsed,
      // carry over state from current location if needed
      state: currentLocation?.state,
      key: currentLocation?.key
    };
  }
  // already a location object
  return to;
};


// import { createLocation } from "history";

// export const resolveToLocation = (to, currentLocation) =>
//   typeof to === "function" ? to(currentLocation) : to;

// export const normalizeToLocation = (to, currentLocation) => {
//   return typeof to === "string"
//     ? createLocation(to, null, null, currentLocation)
//     : to;
// };
