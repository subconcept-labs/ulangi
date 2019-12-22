module.exports = {
  roots: [
    "<rootDir>"
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  setupTestFrameworkScriptFile: "./src/setupTest.ts",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
      pageTitle: "Specification Testing",
      includeFailureMsg: true
    }]
  ]
}
