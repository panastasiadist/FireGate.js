// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieDetails from './CookieDetails';

/**
 * Describes an object acting as a dictionary of functions that test a cookie's details according to
 * a regular expression.
 * - Each key is the name of the test.
 * - Each value is the function performing the test on a cookie's details.
 */
interface CookieTestDictionary {
  [index: string]: (details: CookieDetails, expression: string) => boolean;
}

export default CookieTestDictionary;
