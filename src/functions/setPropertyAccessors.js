// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Defines a pair of getter and setter functions on the supplied object for the
 * specified property of the object.
 * @param {object} object The object on which to set accessor functions.
 * @param {string} property The property of the object for which to set accessor
 * functions.
 * @param {object} accessors An object with get and set properties where each
 * property contains the getter and setter accessor function to be set
 * respectively.
 * @returns {boolean} True if the browser supports setting accessor functions
 * and these functions have been successfully set for the supplied property of
 * the passed-in object.
 */
function setPropertyAccessors(object, property, accessors) {
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
