module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'react/no-unescaped-entities': 0,
    'react/prefer-stateless-function': 1,
  },
  overrides: [{
    files: ['*.test.js'],
    env: {
      jest: true,
    },
    rules: {
      'react/jsx-filename-extension': 0,
    }
  }],
};
