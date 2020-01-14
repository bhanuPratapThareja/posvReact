import { env } from './../env/env';

const api = {
    qualTechDevBaseUrl: 'https://n913i5xkoi.execute-api.ap-south-1.amazonaws.com/',
    mliDevBaseUrl: 'https://djedtvaxn2.execute-api.ap-south-1.amazonaws.com/posvdev/',
    mliUatBaseUrl: 'https://oqh2u2s6hf.execute-api.ap-south-1.amazonaws.com/posvuat/',
    mliProdBaseUrl: 'https://lg0gitgvtb.execute-api.ap-south-1.amazonaws.com/posvprod/',
    routes: {
        verifyUser: {
            qualTechDevUrl: 'Stage/verify-customer-link',
            mliDevUrl: 'validate-customer-link-dev',
            mliUatUrl: 'validate-customer-link-uat',
            mliProdUrl: 'validate-customer-link-prod',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "posvRefNumber": "" } } }
        },
        verifyCustomerImage: {
            qualTechDevUrl: 'Stage/verify-customer-image',
            mliDevUrl: 'validate-customer-image-dev',
            mliUatUrl: 'validate-customer-image-uat',
            mliProdUrl: 'validate-customer-image-prod',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "posvRefNumber": "", imageFile: "", authToken: "", fileExtension: "" } } }
        },
        getotp: {
            qualTechDevUrl: 'Stage/getotp',
            mliDevUrl: 'get-otp-dev',
            mliUatUrl: 'get-otp-uat',
            mliProdUrl: 'get-otp-prod',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "authToken": "", "onCallOTP": "No" } } },
        },
        validateOtp: {
            qualTechDevUrl: 'Stage/validateotp',
            mliDevUrl: 'validate-otp-dev',
            mliUatUrl: 'validate-otp-uat',
            mliProdUrl: 'validate-otp-prod',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "otp": "", "authToken": "" } } }
        },
        declaration: {
            qualTechDevUrl: 'Stage/customer-disclaimer',
            mliDevUrl: 'customer-disclaimer-dev',
            mliUatUrl: 'customer-disclaimer-uat',
            mliProdUrl: 'customer-disclaimer-prod',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "customerDisclaimer": "", "authToken": "" } } }
        },
        pdf: {
            qualTechDevUrl: 'Stage/get-pdf-transcript',
            mliDevUrl: 'get-pdf-transcript-dev',
            mliUatUrl: 'get-pdf-transcript-uat',
            mliProdUrl: 'get-pdf-transcript-prod',
            body: { "request": { "header": { "correlationId": "", "appId": "mpro" }, "payload": { "posvRefNumber": "" } } }
        },
        getQuestions: {
            qualTechDevUrl: 'Stage/get-questions',
            mliDevUrl: 'get-questions-dev',
            mliUatUrl: 'get-questions-uat',
            mliProdUrl: 'get-questions-prod',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "", "qstCatNameNext": null, "qstCatNamePrevious": null, "LANG": "ENG", "authToken": "", "planCode": "" } } }
        },
        saveCustomerResponse: {
            qualTechDevUrl: 'Stage/save-customer-response',
            mliDevUrl: 'save-customer-response-dev',
            mliUatUrl: 'save-customer-response-uat',
            mliProdUrl: 'save-customer-response-prod',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "customerResponse": { "qst": [] }, "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "", "lang": "EN", "planCode": "", "qstCatNameNext": null, "qstSubCatNameNext": null, "qstCatNamePrevious": null, "qstSubCatNamePrevious": null, "authToken": "" } } }
        }
    }
}

const getUrl = route => {
    const baseUrl = api[`${env}BaseUrl`];
    const pathUrl = `${env}Url`;
    let url = `${baseUrl}${api['routes'][route][pathUrl]}`;
    return url;
}

const getBody = route => {
    return api['routes'][route]['body'];
}

export const getApiData = route => {
    const url = getUrl(route);
    const body = getBody(route);
    return { url, body };
}