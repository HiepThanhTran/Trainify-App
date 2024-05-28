import { LogBox } from 'react-native';
import Providers from './routers/Providers';
LogBox.ignoreAllLogs();

export default function App() {
    return <Providers />;
}
