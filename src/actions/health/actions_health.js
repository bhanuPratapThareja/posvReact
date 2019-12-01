import { LOAD_HEALTH_QUESTIONS } from './../action_types';
import { healthQuestions } from './questions_health';

export const loadHealthQuestions = () => {
    return {
        type: LOAD_HEALTH_QUESTIONS,
        payload: healthQuestions
    }
}