import { AppRegistry } from 'react-native';
import App from './android/app/src/app';  // Correct the import path
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);