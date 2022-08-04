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
};
