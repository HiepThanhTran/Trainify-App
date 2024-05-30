import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AccountProvider } from '../store/contexts/AccountContext';
import Theme from '../styles/Theme';
import Routers from './Routers';
import { GlobalProvider } from '../store/contexts/GlobalContext';

const Providers = () => {
    return (
        <PaperProvider theme={theme}>
            <GlobalProvider>
                <AccountProvider>
                    <Routers />
                </AccountProvider>
            </GlobalProvider>
        </PaperProvider>
    );
};

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Theme.PrimaryColor,
        accent: Theme.PrimaryColor,
    },
};

export default Providers;
