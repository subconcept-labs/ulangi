module.exports = {
  root: true, //stop cascading config
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'import',
    'jest'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended'
  ],
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "simple-import-sort/sort": "error",
    "sort-imports": "off",
    "import/order": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error"
  }
}
