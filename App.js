import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { LogBox, PermissionsAndroid } from 'react-native';
import Providers from './src/Navigation/Providers';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

// LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
   'Warning: Avatar',
   'Warning: TextInput.Icon',
   'Warning: TNodeChildrenRenderer',
   'Warning: MemoizedTNodeRenderer',
   'Warning: TRenderEngineProvider',
   'Warning: bound renderChildren',
]);

export default function App() {
   const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
         console.log('Authorization status:', authStatus);
      }
   };

   const getToken = async () => {
      let token = await messaging().getToken();
      console.log('Token', token);
   };

   useEffect(() => {
      requestUserPermission();
      getToken();
   }, []);

   return <Providers />;
}
