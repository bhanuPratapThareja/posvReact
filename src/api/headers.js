import { env } from './../env/env';

const appHeaders = {
    qualTechDev: 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg',
    mliDev: 'niu7mbEQoX1rGcOOEEOVV4x289vK8MT89D5Dd0nR',
    mliUat: 'VUukasqEIe7VjquvpqFy84K43WsYsVjM4fb2xps7',
    mliProd: 'uyp3aFwF3t6nchnVgKfQt5zx8lfSKjNq6V2feotG'
}

export const getHeader = () => {
    return appHeaders[env];
}

export const headers = {
    'x-api-key': getHeader() 
}