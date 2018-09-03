// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import FireGateJS from '../src/index';

var firegate = FireGateJS;

test('attach() should return true', () => {
  var result = firegate.attach();
  expect(result).toBe(true);
});

test('attach() should return false', () => {
  var result = firegate.attach();
  expect(result).toBe(false);
});

test('detach() should return true', () => {
  var result = firegate.detach();
  expect(result).toBe(true);
});

test('detach() should return false', () => {
  var result = firegate.detach();
  expect(result).toBe(false);
});

test('attach() should return true', () => {
  var result = firegate.attach();
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  var result = firegate.setCookiePolicy('permissive');
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  var result = firegate.setCookiePolicy('restrictive');
  expect(result).toBe(true);
});

test('setCookiePolicy() should return false', () => {
  var result = firegate.setCookiePolicy('non_existent');
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false because of invalid type', () => {
  var result = firegate.setCookiePolicy(null);
  expect(result).toBe(false);
});

test('setCookiePolicy() should return true', () => {
  var result = firegate.setCookiePolicy({
    defaultsTo: 'block',
  });
  expect(result).toBe(true);
});

test('setCookiePolicy() should return true', () => {
  var result = firegate.setCookiePolicy({
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
  var result = firegate.setCookiePolicy({
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

test('setCookiePolicy() should return false', () => {
  var result = firegate.setCookiePolicy({
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
  var result = firegate.setCookiePolicy({
    defaultsTo: 'block_invalid',
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  var result = firegate.setCookiePolicy({
    default_invalid: 'block',
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  var result = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: {},
  });
  expect(result).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  var success = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'block',
      when: {}
    }]
  });

  expect(success).toBe(false);
});

test('setCookiePolicy() should return false', () => {
  var success = firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'block',
      when: {
        'non_existent_filter': 'test'
      }
    }]
  });

  expect(success).toBe(false);
});

test('cookie1 should initially be blocked and then freed', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie1=test';
  expect(document.cookie).not.toContain('cookie1=test');

  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1'
      }
    }],
  });

  var cookiesFreed = firegate.freeCookies(false);
  expect(document.cookie).toContain('cookie1=test');
  expect(cookiesFreed).toEqual(['cookie1']);
});

test('cookie2 should be blocked and not be freed', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie2=test';
  expect(document.cookie).not.toContain('cookie2=test');

  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1'
      }
    }],
  });

  var cookiesFreed = firegate.freeCookies(false);

  expect(document.cookie).not.toContain('cookie2=test');
  expect(cookiesFreed).toEqual([]);
});


test('cookie3 should initially be blocked and then freed with cookie2', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie3=test';
  expect(document.cookie).not.toContain('cookie3=test');

  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie1'
      }
    }],
  });

  var cookiesFreed = firegate.freeCookies(true);

  expect(document.cookie).toContain('cookie2=test');
  expect(document.cookie).toContain('cookie3=test');
  expect(cookiesFreed).toEqual(['cookie2', 'cookie3']);
});

test('cookie4 should be blocked', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
  });

  document.cookie = 'cookie4=test';
  expect(document.cookie).not.toContain('cookie4=test');
});

test('cookie5 should be allowed', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'allow',
  });

  document.cookie = 'cookie5=test';
  expect(document.cookie).toContain('cookie5=test');
});

test('cookie6 should be blocked', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'allow',
    rules: [{ 
      action: 'block',
      when: {
        cookieName: 'cookie6'
      }
    }, {
      action: 'allow',
      when: {
        cookieName: 'cookie6'
      }
    }]
  });

  document.cookie = 'cookie6=test';
  expect(document.cookie).not.toContain('cookie6=test');
});

test('cookie7 should be allowed', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{ 
      action: 'allow',
      when: {
        cookieName: 'cookie7'
      }
    }, {
      action: 'block',
      when: {
        cookieName: 'cookie7'
      }
    }]
  });

  document.cookie = 'cookie7=test';
  expect(document.cookie).toContain('cookie7=test');
});

test('cookie8a, cookie9a, cookie10 should be allowed, cookie10a blocked', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: '^cookie8[a-z]$'
      }
    }, {
      action: 'allow',
      when: {
        cookieName: '^cookie9[a-z]$'
      }
    }, {
      action: 'allow',
      when: {
        cookieName: '^cookie10$'
      }
    }]
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
  firegate.setCookiePolicy('permissive');

  document.cookie = 'cookie11=test';
  expect(document.cookie).toContain('cookie11=test');
});

test('cookie12 should be blocked', () => {
  firegate.setCookiePolicy('restrictive');

  document.cookie = 'cookie12=test';
  expect(document.cookie).not.toContain('cookie12=test');
});

test('cookie13 should be allowed', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'block',
    rules: [{
      action: 'allow',
      when: {
        cookieName: 'cookie13'
      }
    }],
  });

  document.cookie = 'cookie13=test';
  expect(document.cookie).toContain('cookie13=test');
});

test('cookie14 should be blocked', () => {
  firegate.setCookiePolicy({
    defaultsTo: 'allow',
    rules: [{
      action: 'block',
      when: {
        cookieName: 'cookie14'
      }
    }],
  });

  document.cookie = 'cookie14=test';
  expect(document.cookie).not.toContain('cookie14=test');
});