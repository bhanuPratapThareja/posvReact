import { mode } from './api';

export const getHeader = () => {
    let header;
    switch(mode){
        case 'qualTechDev':
            header = 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg';
            break;
        default:
            header = 'niu7mbEQoX1rGcOOEEOVV4x289vK8MT89D5Dd0nR';
            break;
    }
    return header
}

export const headers = {
    'x-api-key': getHeader() 
}