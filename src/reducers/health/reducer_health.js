import { LOAD_HEALTH_QUESTIONS } from './../../actions/action_types';

export default function HealthReducer(state = null, action) {
    switch(action.type){
        case LOAD_HEALTH_QUESTIONS:
            return [...action.payload]

    }
    return state
}