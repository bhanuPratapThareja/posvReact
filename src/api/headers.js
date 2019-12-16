import { mode } from './api';

const getHeader = () => {
    console.log('mode:: ', mode)
    let header;
    switch(mode){
        case 'qualTechDev':
            header = 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg';
            break;
        case 'mliDev':
            header = 'niu7mbEQoX1rGcOOEEOVV4x289vK8MT89D5Dd0nR';
            break;
    }
    return header
}

export const headers = {
    'x-api-key': getHeader() 
}