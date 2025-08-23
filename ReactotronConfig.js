/* eslint-disable import/no-extraneous-dependencies */
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'Bedfellow',
  })
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: false,
    overlay: false,
  })
  .connect();

// Attach to console for debugging in dev
if (__DEV__) {
  console.tron = reactotron;
}

export default reactotron;
