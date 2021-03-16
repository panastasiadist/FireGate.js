// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieDetails from '../interfaces/CookieDetails';

/**
 * Returns an object containing details extracted from a cookie string.
 * @param cookieString A cookie string to extract details from.
 * @returns An object containing the extracted details, or null on failure.
 */
function getCookieDetails(cookieString: string): CookieDetails | null {
  const ret: CookieDetails = {
    name: '',
    value: '',
    expires: '',
    maxage: '0',
    path: '',
    domain: '',
    secure: false,
    httponly: false,
  };

  const pairs = cookieString.split(';');

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const map = pair.split('=');
    const value = map.length === 2 ? map[1].trim() : null;
    let key = map[0].trim();

    // If i = 0, then this is the key=value pair of the cookie.
    if (i === 0) {
      // If no value (second part after equal sign) has been provided, then this cookie isn't valid.
      if (value === null) {
        return null;
      }

      ret.name = key;
      ret.value = value;
    } else {
      // i is greater than zero, so this key represents a cookie attribute.
      key = key.toLowerCase();

      if (typeof ret[key] !== 'undefined') {
        // Not every cookie attribute supports a value. Handle each case appropriately.
        if (key === 'secure' || key === 'httponly') {
          // These attributes don't have a value and the key is guaranteed to exist in the object.
          ret[key] = true;
        } else if (key === 'max-age') {
          ret.maxage = value ?? '';
        } else {
          // Any other attribute should have a value. Otherwise, the cookie string is invalid.
          if (value === null) {
            return null;
          }

          // Assign value to the returned object. The key is guaranteed to exist on it.
          ret[key] = value;
        }
      }
    }
  }

  // At least the following details should have been set. Otherwise the cookie string is malformed.
  if (ret.name === '' || ret.value === '') {
    return null;
  }

  return ret;
}

export default getCookieDetails;
