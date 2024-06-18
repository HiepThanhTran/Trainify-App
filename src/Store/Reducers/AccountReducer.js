import { SIGN_IN, SIGN_OUT, UPDATE_ACCOUNT } from '../Actions/AccountAction';

export const accountReducer = (state, action) => {
   switch (action.type) {
      case SIGN_IN:
         return {
            ...state,
            loading: false,
            isLoggedIn: true,
            data: action.payload,
         };
      case SIGN_OUT:
         return {
            ...state,
            data: null,
            loading: false,
            isLoggedIn: false,
         };
      case UPDATE_ACCOUNT:
         return {
            ...state,
            loading: false,
            data: {
               ...state.data,
               ...action.payload,
            },
         };
      default:
         return state;
   }
};
