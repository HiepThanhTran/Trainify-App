import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AccountProvider } from '../store/contexts/AccountContext';
import Theme from '../styles/Theme';
import Routers from './Routers';

const Providers = () => {
    return (
        <PaperProvider theme={theme}>
            <AccountProvider>
                <Routers />
            </AccountProvider>
        </PaperProvider>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Theme.PrimaryColor,
    },
};

export default Providers;
