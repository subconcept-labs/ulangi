module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "node",
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  setupTestFrameworkScriptFile: "./src/setupTest.ts",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
      pageTitle: "E2E Testing",
      includeFailureMsg: true
    }]
  ]
}
