import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_IN = 'LOGIN';
const SIGN_OUT = 'LOGOUT';

export { SIGN_IN, SIGN_OUT };

export const accountReducer = (state, action) => {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                isLoggedIn: true,
                data: action.payload,
            };
        case SIGN_OUT:
            AsyncStorage.multiRemove(['access-token', 'refresh-token']);

            return {
                ...state,
                data: null,
                isLoggedIn: false,
            };
        default:
            return state;
    }
};
