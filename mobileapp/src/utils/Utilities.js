import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { endPoints } from '../configs/APIs';
import { SignOutAction } from '../store/actions/AccountAction';

export const getTokens = async () => {
    const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet(['access-token', 'refresh-token']);

    return { accessToken, refreshToken };
};

export const setTokens = async (tokens) => {
    let [accessToken, refreshToken] = [tokens.data.access_token, tokens.data.refresh_token];
    await AsyncStorage.multiSet([
        ['access-token', accessToken],
        ['refresh-token', refreshToken],
    ]);

    return { accessToken, refreshToken };
};

export const removeTokens = async () => {
    return await AsyncStorage.multiRemove(['access-token', 'refresh-token']);
};

export const getNewAccessToken = async (refreshToken, dispatch) => {
    try {
        const tokens = await APIs.post(endPoints['token'], {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const { accessToken } = await setTokens(tokens);
        return accessToken;
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
        dispatch(SignOutAction());
        return null;
    }
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

export const getFirstDayOfYear = (date) => {
    return new Date(date.getFullYear(), 0, 1);
};

export const getLastDayOfYear = (date) => {
    return new Date(date.getFullYear(), 11, 31);
};
