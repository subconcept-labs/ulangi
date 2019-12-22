module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-navigation)/"
  ],
  testRegex: "tests/.*\\.(js|jsx|ts|tsx)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
  coverageDirectory: "coverage",
  coverageReporters: [
    "text-summary",
    "html"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}"
  ]
};
