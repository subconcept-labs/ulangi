module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "node",
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  setupTestFrameworkScriptFile: "./src/setup/setupTest.ts",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
