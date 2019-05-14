module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-unescaped-entities': 0,
    'react/prefer-stateless-function': 1,
    'react/prop-types': 0,
  },
  overrides: [{
    files: ['*.test.js'],
    env: {
      jest: true,
    },
    rules: {}
  }],
  plugins: ['import'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {},
    }
  }
};
