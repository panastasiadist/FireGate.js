// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieAccessors from '../interfaces/CookieAccessors';

/**
 * Returns an object containing the accessors of a supplied object's property.
 * Currently designed to return only cookie string accessors.
 * @returns An object whose properties correspond to the 2 property accessors. Null on failure.
 */
function getPropertyAccessors(
  object: unknown,
  property: string,
): CookieAccessors | null {
  let get = null;
  let set = null;

  if (Object.getOwnPropertyDescriptor) {
    const pd = Object.getOwnPropertyDescriptor(object, property);
    if (pd && pd.get && pd.set) {
      ({ get } = pd);
      ({ set } = pd);
    }
  }

  if (get && set) {
    return {
      get,
      set,
    };
  }

  return null;
}

export default getPropertyAccessors;
