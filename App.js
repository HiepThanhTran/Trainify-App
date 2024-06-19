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
   return <Providers />;
}
