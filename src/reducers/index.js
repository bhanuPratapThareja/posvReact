import { combineReducers } from 'redux';
import { UserReducer } from './user/reducer_user';
import HealthReducer from './health/reducer_health';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    user: UserReducer,
    healthQuestions: HealthReducer,
    form: formReducer
});

export default rootReducer;