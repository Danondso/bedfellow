module.exports = {
  root: true,
  extends: [
    'airbnb',
    '@react-native-community',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-continue': 'off',
    'react/jsx-filename-extension': 0,
    'import/extensions': 0,
    'react/display-name': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['__tests__/**/*.js', '__tests__/**/*.ts'],
      rules: {
        // this is here so we can use ts aliases
        'import/no-unresolved': 'off',
      },
    },
  ],
};
