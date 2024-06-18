import { LogBox } from 'react-native';
import Providers from './src/Navigation/Providers';
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
