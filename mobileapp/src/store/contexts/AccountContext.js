import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { Status } from '../../configs/Constants';
import { SignInAction, SignOutAction } from '../actions/AccountAction';
import { accountReducer } from '../reducers/AccountReducer';

export const AccountContext = createContext(null);
export const AccountDispatchContext = createContext(null);

const initialState = {
    data: null,
    loading: true,
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
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error(`Error message: ${error.message}`);
            }
        }
    };

    const checkLogged = async (retryCount = 0) => {
        const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet(['access-token', 'refresh-token']);

        if (!accessToken || !refreshToken) {
            dispatch(SignOutAction());
            return;
        }

        try {
            const user = await authAPI(accessToken).get(endPoints['me']);
            dispatch(SignInAction(user.data));
        } catch (error) {
            if (error.response) {
                errorStatus = error.response.status;
                if (
                    (errorStatus !== Status.HTTP_401_UNAUTHORIZED && errorStatus !== Status.HTTP_403_FORBIDDEN) ||
                    retryCount > 3
                ) {
                    dispatch(SignOutAction());
                    return;
                }

                await getNewAccessToken(refreshToken);
                checkLogged(retryCount + 1);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error(`Error message: ${error.message}`);
            }
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
