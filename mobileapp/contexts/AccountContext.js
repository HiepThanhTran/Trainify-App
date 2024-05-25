import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import APIs, { authAPI, endPoints } from '../configs/APIs';
import { SIGN_IN } from '../configs/Constants';
import { accountReducer } from '../reducers/AccountReducer';

export const AccountContext = createContext();
export const AccountDispatchContext = createContext();

const initialState = {
    data: null,
    isLoggedIn: false,
};

export const AccountProvider = ({ children }) => {
    const [account, dispatch] = useReducer(accountReducer, initialState);

    const getNewAccessToken = async (refreshToken) => {
        const tokens = await APIs.post(endPoints['token'], {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        await AsyncStorage.multiSet([
            ['access-token', tokens.data.access_token],
            ['refresh-token', tokens.data.refresh_token],
        ]);
    };

    const checkLogged = async () => {
        const accessToken = await AsyncStorage.getItem('access-token');
        if (!accessToken) return;

        try {
            const user = await authAPI(accessToken).get(endPoints['me']);
            dispatch({ type: SIGN_IN, payload: user.data });
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                const refreshToken = await AsyncStorage.getItem('refresh-token');
                if (refreshToken) {
                    await getNewAccessToken(refreshToken);
                    checkLogged();
                }
            } else {
                console.error(error)
            }
        }
    };

    useEffect(() => {
        AsyncStorage.getAllKeys().then((data) => console.log(data));
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
