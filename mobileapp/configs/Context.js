import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI, endPoints } from './APIs';
import { SIGN_IN } from './Constants';
import { accountReducer } from './Reducer';

export const AccountContext = createContext();
export const AccountDispatchContext = createContext();

export const AccountProvider = ({ children }) => {
    const [account, dispatch] = useReducer(accountReducer, { isLoggedIn: false });

    const checkLogged = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            let user = await authAPI(token).get(endPoints['me']);
            dispatch({
                type: SIGN_IN,
                payload: user.data,
            });
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        checkLogged();
    }, []);

    return (
        <AccountContext.Provider value={account}>
            <AccountDispatchContext.Provider value={dispatch}>{children}</AccountDispatchContext.Provider>
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    return useContext(AccountContext);
};

export const useAccountDispatch = () => {
    return useContext(AccountDispatchContext);
};
