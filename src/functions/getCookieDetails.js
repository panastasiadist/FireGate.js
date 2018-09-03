// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Returns information extracted from a cookie string in a structured manner.
 * @param {string} cookieString The cookie string to return information about.
 * @returns {(string|null)} An object containing information about the supplied
 * cookie string or null if the cookie string is invalid.
 */
function getCookieDetails(cookieString) {
  const ret = {
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

    // If i = 0; then this is the key=value pair of the cookie.
    if (i === 0) {
      /**
       * If no value (second part after equal sign) has been provided,
       * then this cookie isn't valid.
       */
      if (value === null) {
        return null;
      }
      ret.name = key;
      ret.value = value;
    } else {
      // i is greater than zero and this key is a cookie attribute.
      key = key.toLowerCase();

      if (typeof ret[key] !== 'undefined') {
        /**
         * There are cookie attributes which require a value and other
         * attributes which don't need a value set. Treat them as required.
         */
        if (key === 'secure' || key === 'httponly') {
          // These attributes don't have a value
          ret[key] = true;
        } else if (key === 'max-age') {
          ret.maxage = value;
        } else {
          /**
           * Any other attribute must have a value. Otherwise the cookie string
           * is not valid.
           */
          if (value === null) {
            return null;
          }

          /**
           * Assign the value of the current attribute to the relevant key in
           * the response structure.
           */
          ret[key] = value;
        }
      }
    }
  }

  /**
   * At least name and value should be set. Otherwise the cookie string is
   * somehow malformed or invalid.
   */
  if (ret.name === '' || ret.value === '') {
    return null;
  }

  return ret;
}

export default getCookieDetails;
