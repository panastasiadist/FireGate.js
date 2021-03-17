// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import cookiesModule from './modules/cookies';

function FireGate() {
  return {
    cookies: cookiesModule(),
  };
}

export default FireGate();
