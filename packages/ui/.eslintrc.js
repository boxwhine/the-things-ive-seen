module.exports = {
  extends: ["next/core-web-vitals"],
  // extends: ['next/babel', 'next/core-web-vitals'],
  // extends: 'airbnb',
  // env: {
  //   browser: true,
  //   jest: true,
  // },
  // rules: {
  //   'react/jsx-filename-extension': 0,
  //   'react/jsx-one-expression-per-line': 0,
  //   'react/no-unescaped-entities': 0,
  //   'react/prefer-stateless-function': 1,
  //   'react/prop-types': 0,
  // },
  overrides: [
    {
      // Adapt to your needs (e.g. some might want to only override "next.config.js")
      files: ["*.js"],
      // This is the default parser of ESLint
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    // {
    //   files: ["*.test.js"],
    //   env: {
    //     jest: true,
    //   },
    //   rules: {},
    // },
  ],
  // plugins: ['import'],
  // settings: {
  //   'import/parsers': {
  //     '@typescript-eslint/parser': ['.ts', '.tsx']
  //   },
  //   'import/resolver': {
  //     typescript: {},
  //   }
  // }
};
