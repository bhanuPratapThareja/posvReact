import { combineReducers } from 'redux';
import { UserReducer } from './user/reducer_user';
import HealthReducer from './health/reducer_health';

const rootReducer = combineReducers({
    user: UserReducer,
    healthQuestions: HealthReducer
});

export default rootReducer;