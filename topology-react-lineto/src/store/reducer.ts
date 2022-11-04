import { combineReducers } from 'redux';
import { createSelectorHook } from 'react-redux';
import ableReducer, { initialState as AbleState } from './ableReducer';
import accountReducer, { initialState as AccountState } from './accountReducer';

const reducer = combineReducers({
    able: ableReducer,
    account: accountReducer
});

export const useSelector = createSelectorHook<{
    able: typeof AbleState;
    account: typeof AccountState;
}>();

export default reducer;
