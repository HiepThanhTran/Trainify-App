import { LogBox } from 'react-native';
import Providers from './src/routers/Providers';
LogBox.ignoreAllLogs();

export default function App() {
   return <Providers />;
}
