module.exports = {
  project: {
    android: {
      packageName: 'com.bedfellow',
    },
    ios: {},
  },
  dependencies: {
    // Disable autolinking for react-native-tcp since it's removed
    'react-native-tcp': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
