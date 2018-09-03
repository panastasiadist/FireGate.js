// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import getCookieDetails from '../../src/functions/getCookieDetails';

var sets = [{
  cookie: 'cookie=test',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '0',
    path: '',
    domain: '',
    secure: false,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;expires=14 Jun 2019 00:00:00 PDT',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '14 Jun 2019 00:00:00 PDT',
    maxage: '0',
    path: '',
    domain: '',
    secure: false,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;maxage=3600',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '3600',
    path: '',
    domain: '',
    secure: false,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;path=/',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '0',
    path: '/',
    domain: '',
    secure: false,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;domain=example.com',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '0',
    path: '',
    domain: 'example.com',
    secure: false,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;secure',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '0',
    path: '',
    domain: '',
    secure: true,
    httponly: false,
  },
}, {
  cookie: 'cookie=test;httpOnly',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '',
    maxage: '0',
    path: '',
    domain: '',
    secure: false,
    httponly: true,
  },
}, {
  cookie: 'cookie=test;expires=14 Jun 2019 00:00:00 PDT;maxage=3600;path=/;domain=example.com;secure;httpOnly;;;',
  expected: {
    name: 'cookie',
    value: 'test',
    expires: '14 Jun 2019 00:00:00 PDT',
    maxage: '3600',
    path: '/',
    domain: 'example.com',
    secure: true,
    httponly: true,
  },
}];

var length = sets.length;
for (var i = 0; i < length; i += 1) {
  var set = sets[i];
  test(`cookie '${set.cookie}' details should result to ${JSON.stringify(set.expected)}`, () => {
    expect(getCookieDetails(set.cookie)).toStrictEqual(set.expected);
  });
}

test("cookie 'cookie=' should return null", () => {
  expect(getCookieDetails('cookie=')).toBeNull();
});

test("cookie 'cookie' should return null", () => {
  expect(getCookieDetails('cookie')).toBeNull();
});

test("cookie 'cookie=test;expires' should return null", () => {
  expect(getCookieDetails('cookie=test;expires')).toBeNull();
});