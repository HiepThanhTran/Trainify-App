import { SIGN_IN, SIGN_OUT, UPDATE_DATA } from '../actions/AccountAction';

export const accountReducer = (state, action) => {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                isLoggedIn: true,
                data: action.payload,
            };
        case SIGN_OUT:
            return {
                ...state,
                data: null,
                isLoggedIn: false,
            };
        case UPDATE_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};
