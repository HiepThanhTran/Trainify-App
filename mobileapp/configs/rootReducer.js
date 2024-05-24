import { combineReducers } from 'redux';
import { accountReducer } from './Reducer';

export const rootReducer = combineReducers({
    account: accountReducer,
});
