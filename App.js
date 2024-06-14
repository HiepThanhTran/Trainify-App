import { LogBox } from 'react-native';
import Providers from './src/routers/Providers';
// LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
   'Warning: TNodeChildrenRenderer',
   'Warning: MemoizedTNodeRenderer',
   'Warning: TRenderEngineProvider',
   'Warning: TextInput.Icon',
]);

export default function App() {
   return <Providers />;
}
