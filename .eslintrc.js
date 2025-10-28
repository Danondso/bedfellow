module.exports = {
  root: true,
  extends: [
    '@react-native/eslint-config',
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
    // Disable overly strict rules for React Native
    'react/require-default-props': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-native/no-inline-styles': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'max-classes-per-file': ['error', 6],
    'no-bitwise': 'off',
    'no-multi-assign': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-shadow': 'off',
    'react/jsx-no-bind': 'off',
    'no-catch-shadow': 'off', // IE8 and earlier is not a concern for React Native
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
      files: ['__tests__/**/*.js', '__tests__/**/*.ts', '__tests__/**/*.tsx', '**/*.test.tsx', '**/*.test.ts'],
      rules: {
        // this is here so we can use ts aliases
        'import/no-unresolved': 'off',
        // Allow testID in test files
        'react/no-unknown-property': ['error', { ignore: ['testID'] }],
      },
    },
  ],
};
