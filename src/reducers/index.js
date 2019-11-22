import { combineReducers } from 'redux';
import { UserReducer } from './user/reducer_user';

const rootReducer = combineReducers({
    user: UserReducer
});

export default rootReducer;