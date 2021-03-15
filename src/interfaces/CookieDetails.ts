// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Describes an object containing details of a cookie.
 */
interface CookieDetails {
  name: string;
  value: string;
  expires: string;
  maxage: string;
  path: string;
  domain: string;
  secure: boolean;
  httponly: boolean;

  // Allows accessing object's properties using an expression.
  [index: string]: string | boolean;
}

export default CookieDetails;
