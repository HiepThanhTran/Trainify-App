import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import { SignInAction } from '../actions/AccountAction';
import { accountReducer } from '../reducers/AccountReducer';

export const AccountContext = createContext(null);
export const AccountDispatchContext = createContext(null);

const initialState = {
    data: null,
    isLoggedIn: false,
};

export const AccountProvider = ({ children }) => {
    const [account, dispatch] = useReducer(accountReducer, initialState);

    const getNewAccessToken = async (refreshToken) => {
        try {
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
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error);
            }
        }
    };

    const checkLogged = async () => {
        const accessToken = await AsyncStorage.getItem('access-token');
        if (!accessToken) return;

        try {
            const user = await authAPI(accessToken).get(endPoints['me']);
            dispatch(SignInAction(user.data));
        } catch (error) {
            if (error.response) {
                if (error.response.status === status.HTTP_401_UNAUTHORIZED || status.HTTP_403_FORBIDDEN) {
                    const refreshToken = await AsyncStorage.getItem('refresh-token');
                    if (!refreshToken) return;

                    await getNewAccessToken(refreshToken);
                    checkLogged();
                }
            } else {
                console.error(error);
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
