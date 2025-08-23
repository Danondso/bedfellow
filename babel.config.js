module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module:react-native-dotenv',
      {
        allowUndefined: false,
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
