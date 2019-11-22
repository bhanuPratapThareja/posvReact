import axios from 'axios';

axios.interceptors.request.use(config => {
    console.log('config: ', config)

}, error => {
    return Promise.reject(error);
});