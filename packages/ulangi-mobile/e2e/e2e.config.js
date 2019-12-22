const { join } = require('path');

module.exports = {
  bundleId: "com.ulangi.Ulangi-Dev",
  appPackage: "com.ulangi.dev",
  appActivity: "com.ulangi.MainActivity",
  screenshotDir: join(process.cwd(), "screenshots"),
  testTimeout: 200000, //timeout interval for tests and before/after hooks in milliseconds.
  waitTimeout: 10000,
  scrollAmount: 100,
  guestEmailDomain: '@gu.est',
  guestPassword: '12345678',
  apiUrl: 'http://localhost:8082/api/v1',
}
