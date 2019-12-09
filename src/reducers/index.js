import { combineReducers } from 'redux';
import { UserReducer } from './user/reducer_user';
// import { QuestionnairReducer } from './questionnair/reducer_questionair';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    user: UserReducer,
    form: formReducer
});

export default rootReducer;