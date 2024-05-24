import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIGN_IN, SIGN_OUT } from './Constants';

const initialState = {
    data: null,
    isLoggedIn: false,
};

export const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                isLoggedIn: true,
                data: action.payload,
            };
        case SIGN_OUT:
            AsyncStorage.removeItem('token');
            return {
                ...state,
                data: null,
                isLoggedIn: false,
            };
    }
    return state;
};
