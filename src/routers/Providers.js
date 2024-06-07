import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AccountProvider } from '../store/contexts/AccountContext';
import { GlobalProvider } from '../store/contexts/GlobalContext';
import Theme from '../styles/Theme';
import Routers from './Routers';

const Providers = () => {
    useEffect(() => {
        AsyncStorage.getAllKeys().then((key) => console.log(key));
        // AsyncStorage.clear().then(() => console.log('Cleared'));
    }, []);

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
