// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Describes an object containing cookie handling functions.
 */
interface CookieAccessors {
  /**
   * Function used to return a cookie string.
   */
  get: () => string;

  /**
   * Function used to set a cookie.
   * - Browser's native cookie setter function does not return a value (void).
   * - Library's cookie setter function returns a boolean, informing about success or failure.
   */
  set: (cookie: string) => boolean | void;
}

export default CookieAccessors;
