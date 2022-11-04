import { combineReducers } from 'redux';
import ableReducer from './ableReducer';
import accountReducer from './accountReducer';

const reducer = combineReducers({
    able: ableReducer,
    account: accountReducer
});


export default reducer;
