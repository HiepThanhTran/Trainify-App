import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_IN = 'LOGIN';
const SIGN_OUT = 'LOGOUT';
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export { SIGN_IN, SIGN_OUT, UPDATE_ACCOUNT };

const SigninAction = (payload) => {
    return {
        type: SIGN_IN,
        payload: payload,
    };
};

const SignoutAction = () => {
    AsyncStorage.multiRemove(['access-token', 'refresh-token']);

    return {
        type: SIGN_OUT,
    };
};

const UpdateAccountAction = (payload) => {
    return {
        type: UPDATE_ACCOUNT,
        payload: payload,
    };
};

export { SigninAction, SignoutAction, UpdateAccountAction };
