// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Returns the pair of getter and setter functions of the supplied object for
 * the specified property of the object.
 * @returns {object} An object with get and set properties where each property
 * contains the getter and setter accessor functions respectively.
 */
function getPropertyAccessors(object, property) {
  let get;
  let set;

  if (Object.getOwnPropertyDescriptor) {
    const pd = Object.getOwnPropertyDescriptor(object, property);
    if (pd && pd.get && pd.set) {
      ({ get } = pd);
      ({ set } = pd);
    }
  }

  return {
    get,
    set,
  };
}

export default getPropertyAccessors;
