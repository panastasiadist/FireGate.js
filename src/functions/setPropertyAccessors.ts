// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieAccessors from '../interfaces/CookieAccessors';

/**
 * Sets a pair of accessor functions on the supplied object for the specified property.
 * @param object The object to set the accessor functions on.
 * @param property The property of the object for which to set the accessor functions.
 * @param accessors An object containing the pair of accessor functions to set.
 * @returns True if the accessor functions have been successfully set.
 */
function setPropertyAccessors(
  object: unknown,
  property: string,
  accessors: CookieAccessors,
): boolean {
  if (Object.defineProperty) {
    Object.defineProperty(object, property, {
      get: accessors.get,
      set: accessors.set,
      configurable: true,
    });
    return true;
  }

  return false;
}

export default setPropertyAccessors;
