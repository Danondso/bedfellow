module.exports = {
  root: true,
  extends: ['airbnb', '@react-native-community'],
  rules: {
    'react/jsx-filename-extension': 0,
    'import/extensions': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
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
