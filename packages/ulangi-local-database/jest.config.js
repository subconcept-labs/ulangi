module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupTestFrameworkScriptFile: "./src/setup/setupTest.ts",
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}
