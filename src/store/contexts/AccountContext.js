import { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { getTokens } from '../../utils/Utilities';
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

   const checkLogged = async (retryCount = 0) => {
      const { accessToken, refreshToken } = await getTokens();

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
               (errorStatus !== statusCode.HTTP_401_UNAUTHORIZED && errorStatus !== statusCode.HTTP_403_FORBIDDEN) ||
               retryCount > 3
            ) {
               dispatch(SignOutAction());
               return;
            }

            const newAccessToken = await refreshToken(refreshToken, dispatch);
            if (newAccessToken) checkLogged(retryCount + 1);
         } else console.error(error);
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
