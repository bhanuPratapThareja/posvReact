import axios from 'axios';
import { getApiData } from './../api/api';

export const getQuestions = (qstCatName) => {
    const { url, body } = getApiData('getQuestions');
    body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
    body.request.payload.authToken = localStorage.getItem('authToken');
    body.request.payload.planCode = localStorage.getItem('planCode');
    // qstCatNamePrevious ? body.request.payload.qstCatName = qstCatNamePrevious : body.request.payload.qstCatName = qstCatName;
}