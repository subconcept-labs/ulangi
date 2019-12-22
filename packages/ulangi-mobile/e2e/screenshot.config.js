module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "node",
  testRegex: "(/tests/.*|(\\.|/)(screenshot))\\.tsx?$",
  setupTestFrameworkScriptFile: "./src/setupTest.ts",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
