// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieDetails from '../interfaces/CookieDetails';

function cookieName(details: CookieDetails, expression: string): boolean {
  return (new RegExp(expression)).test(details.name);
}

export default cookieName;
