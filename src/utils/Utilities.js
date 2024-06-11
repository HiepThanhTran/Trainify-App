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

export const refreshAccessToken = async (refreshToken, dispatch) => {
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
      console.log(error);
      dispatch(SignOutAction());
      return null;
   }
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
   const paddingToBottom = 20;
   return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const loadMore = (nativeEvent, loading, page, setPage) => {
   if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
   }
};

export const onRefresh = (setPage, setRefreshing, setFilter = null) => {
   setPage(1);
   if (setFilter) setFilter('');
   setRefreshing(true);
};

export const search = (value, setPage, callback) => {
   setPage(1);
   callback(value);
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
