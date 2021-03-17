// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import FireGateJS from '../src/index';

const cookiesModule = FireGateJS.cookies;

test('attach() should return true', () => {
  const result = cookiesModule.startFiltering();
  expect(result).toBe(true);
});

test('attach() should return false', () => {
  const result = cookiesModule.startFiltering();
  expect(result).toBe(false);
});

test('detach() should return true', () => {
  const result = cookiesModule.stopFiltering();
  expect(result).toBe(true);
});

test('detach() should return false', () => {
  const result = cookiesModule.stopFiltering();
  expect(result).toBe(false);
});

test('attach() should return true', () => {
  const result = cookiesModule.startFiltering();
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  const result = cookiesModule.setFilteringPolicy('permissive');
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  const result = cookiesModule.setFilteringPolicy('restrictive');
  expect(result).toBe(true);
});

test('setCookiePolicy() should return false', () => {
  const result = cookiesModule.setFilteringPolicy('non_existent');
  expect(result).toBe(false);
});
/*
test('setCookiePolicy() should return false because of invalid type', () => {
  const result = firegate.setCookiePolicy(null);
  expect(result).toBe(false);
});
*/
test('setCookiePolicy() should return true', () => {
  const result = cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
  });
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  const result = cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'block',
      when: {
        cookieName: 'test',
      },
    }],
  });
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  const result = cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'test',
      },
    }],
  });
  expect(result).toBe(true);
});
/*
test('setCookiePolicy() should return false', () => {
  const result = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'invalid',
      when: {
        cookieName: 'test',
      },
    }],
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  const result = firegate.setCookiePolicy({
    defaultsTo: 'block_invalid',
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  const result = firegate.setCookiePolicy({
    default_invalid: 'block',
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  const result = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: {},
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  const success = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'block',
      when: {},
    }],
  });

  expect(success).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  const success = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'block',
      when: {
        non_existent_filter: 'test',
      },
    }],
  });

  expect(success).toBe(false);
});
*/
test('cookie1 should initially be blocked and then freed', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie1=test';
  expect(document.cookie).not.toContain('cookie1=test');

  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1',
      },
    }],
  });

  const cookiesFreed = cookiesModule.freeCookies('allowed');
  expect(document.cookie).toContain('cookie1=test');
  expect(cookiesFreed).toEqual(['cookie1']);
});

test('cookie2 should be blocked and not be freed', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie2=test';
  expect(document.cookie).not.toContain('cookie2=test');

  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1',
      },
    }],
  });

  const cookiesFreed = cookiesModule.freeCookies('allowed');

  expect(document.cookie).not.toContain('cookie2=test');
  expect(cookiesFreed).toEqual([]);
});

test('cookie3 should initially be blocked and then freed with cookie2', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie3=test';
  expect(document.cookie).not.toContain('cookie3=test');

  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1',
      },
    }],
  });

  const cookiesFreed = cookiesModule.freeCookies('all');

  expect(document.cookie).toContain('cookie2=test');
  expect(document.cookie).toContain('cookie3=test');
  expect(cookiesFreed).toEqual(['cookie2', 'cookie3']);
});

test('cookie4 should be blocked', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie4=test';
  expect(document.cookie).not.toContain('cookie4=test');
});

test('cookie5 should be allowed', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'allow',
  });

  document.cookie = 'cookie5=test';
  expect(document.cookie).toContain('cookie5=test');
});

test('cookie6 should be blocked', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'allow',
    rules: [{
      action: 'block',
      when: {
        cookieName: 'cookie6',
      },
    }, {
      action: 'allow',
      when: {
        cookieName: 'cookie6',
      },
    }],
  });

  document.cookie = 'cookie6=test';
  expect(document.cookie).not.toContain('cookie6=test');
});

test('cookie7 should be allowed', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie7',
      },
    }, {
      action: 'block',
      when: {
        cookieName: 'cookie7',
      },
    }],
  });

  document.cookie = 'cookie7=test';
  expect(document.cookie).toContain('cookie7=test');
});

test('cookie8a, cookie9a, cookie10 should be allowed, cookie10a blocked', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: '^cookie8[a-z]$',
      },
    }, {
      action: 'allow',
      when: {
        cookieName: '^cookie9[a-z]$',
      },
    }, {
      action: 'allow',
      when: {
        cookieName: '^cookie10$',
      },
    }],
  });

  document.cookie = 'cookie8a=test';
  expect(document.cookie).toContain('cookie8a=test');

  document.cookie = 'cookie9a=test';
  expect(document.cookie).toContain('cookie9a=test');

  document.cookie = 'cookie10=test';
  expect(document.cookie).toContain('cookie10=test');

  document.cookie = 'cookie10a=test';
  expect(document.cookie).not.toContain('cookie10a=test');
});

test('cookie11 should be allowed', () => {
  cookiesModule.setFilteringPolicy('permissive');

  document.cookie = 'cookie11=test';
  expect(document.cookie).toContain('cookie11=test');
});

test('cookie12 should be blocked', () => {
  cookiesModule.setFilteringPolicy('restrictive');

  document.cookie = 'cookie12=test';
  expect(document.cookie).not.toContain('cookie12=test');
});

test('cookie13 should be allowed', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie13',
      },
    }],
  });

  document.cookie = 'cookie13=test';
  expect(document.cookie).toContain('cookie13=test');
});

test('cookie14 should be blocked', () => {
  cookiesModule.setFilteringPolicy({
    defaultsTo: 'allow',
    rules: [{
      action: 'block',
      when: {
        cookieName: 'cookie14',
      },
    }],
  });

  document.cookie = 'cookie14=test';
  expect(document.cookie).not.toContain('cookie14=test');
});

test('cookie15 should be blocked', () => {
  cookiesModule.setFilteringPolicy('restrictive');

  document.cookie = 'cookie15=test';
  expect(document.cookie).not.toContain('cookie15=test');
});

test('cookie14 should be freed but cookie15 should not.', () => {
  cookiesModule.freeCookies(['cookie14']);
  expect(document.cookie).toContain('cookie14=test');
  expect(document.cookie).not.toContain('cookie15=test');
});
