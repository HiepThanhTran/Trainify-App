import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_IN = 'LOGIN';
const SIGN_OUT = 'LOGOUT';
const UPDATE_DATA = 'UPDATE_DATA';

export { SIGN_IN, SIGN_OUT, UPDATE_DATA };

export const SignInAction = (payload) => {
    return {
        type: SIGN_IN,
        payload: payload,
    };
};

export const SignOutAction = () => {
    AsyncStorage.multiRemove(['access-token', 'refresh-token']);

    return {
        type: SIGN_OUT,
    };
};

export const UpdateAccountAction = (payload) => {
    return {
        type: UPDATE_DATA,
        payload: payload,
    };
};
