const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      events: require.resolve('events'),
      util: require.resolve('util'),
      process: require.resolve('process'),
      assert: require.resolve('assert'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url'),
      querystring: require.resolve('querystring-es3'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify'),
      crypto: require.resolve('crypto-browserify'),
      vm: require.resolve('vm-browserify'),
      console: require.resolve('console-browserify'),
      constants: require.resolve('constants-browserify'),
      domain: require.resolve('domain-browser'),
      timers: require.resolve('timers-browserify'),
      tty: require.resolve('tty-browserify'),
      fs: require.resolve('react-native-fs'),
      // Add path aliases
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
