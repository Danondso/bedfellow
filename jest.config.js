const path = require('path');

module.exports = {
  preset: '@testing-library/react-native',
  transform: {
    '\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',
  ],
  moduleDirectories: ['node_modules', path.join(__dirname, 'src')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.js',
    '^@src/(.*)': '<rootDir>/src/$1',
    '^@screens/(.*)': '<rootDir>/src/screens/$1',
    '^@components/(.*)': '<rootDir>/src/components/$1',
    '^@context/(.*)': '<rootDir>/src/context/$1',
    '^@theme/(.*)': '<rootDir>/src/theme/$1',
    '^@types/(.*)': '<rootDir>/src/types/$1',
  },
  modulePathIgnorePatterns: ['__tests__/fixtures'],
  setupFilesAfterEnv: ['./setupJest.js'],
};
