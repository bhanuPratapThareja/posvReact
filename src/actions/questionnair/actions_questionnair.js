import axios from 'axios';
import { getApiData } from '../../api/api';
import { headers } from '../../api/headers';

export const getQuestions = (qstCatName) => {
    const { url, body } = getApiData('getQuestions');
    body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
    body.request.payload.authToken = localStorage.getItem('authToken');
    body.request.payload.qstCatName = this.state.qstCatName;
    return async function (dispatch) {
        try {
            const response = await axios.post(url, body, { headers })
            this.handleRsponse(response)
        } catch (err) {
            console.log(err)
        }
    }
}