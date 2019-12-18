export const mode = 'mliDev'; // qualTechDev // mliDev

const api = {
    qualTechDevbaseUrl: 'https://n913i5xkoi.execute-api.ap-south-1.amazonaws.com/',
    mliDevBaseUrl: 'https://djedtvaxn2.execute-api.ap-south-1.amazonaws.com/posvdev/',
    routes: {
        verifyUser: {
            qualTechDevUrl: 'Stage/verify-customer-link',
            mliDevUrl: 'validate-customer-link-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "posvRefNumber": "" } } }
        },
        verifyCustomerImage: {
            qualTechDevUrl: 'Stage/verify-customer-image',
            mliDevUrl: 'validate-customer-image-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "posvRefNumber": "", imageFile: "", authToken: "", fileExtension: "" } } }
        },
        getotp: {
            qualTechDevUrl: 'Stage/getotp',
            mliDevUrl: 'get-otp-dev',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "authToken": "", "onCallOTP": "No" } } },
        },
        validateOtp: {
            qualTechDevUrl: 'Stage/validateotp',
            mliDevUrl: 'validate-otp-dev',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "otp": "", "authToken": "" } } }
        },
        declaration: {
            qualTechDevUrl: 'Stage/customer-disclaimer',
            mliDevUrl: 'customer-disclaimer-dev',
            body: { "request": { "header": { "correlationId": "", "appId": "ABC" }, "payload": { "posvRefNumber": "", "customerDisclaimer": "", "authToken": "" } } }
        },
        pdf: {
            qualTechDevUrl: 'Stage/get-pdf-transcript',
            mliDevUrl: 'get-pdf-transcript-dev',
            body: { "request": { "header": { "correlationId": "", "appId": "mpro" }, "payload": { "posvRefNumber": "" } } }
        },
        getQuestions: {
            qualTechDevUrl: 'Stage/get-questions',
            mliDevUrl: 'get-questions-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "", "qstCatNameNext": null, "qstCatNamePrevious": null, "LANG": "ENG", "authToken": "", "planCode": "" } } }
        },
        saveCustomerResponse: {
            qualTechDevUrl: 'Stage/save-customer-response',
            mliDevUrl: 'save-customer-response-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "" }, "payload": { "customerResponse": { "qst": [] }, "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "", "lang": "EN", "planCode": "EFGEP8", "qstCatNameNext": null, "qstSubCatNameNext": null, "qstCatNamePrevious": null, "qstSubCatNamePrevious": null, "authToken": "wtewe834jwe" } } }
        }
    }
}

const getUrl = route => {
    let baseUrl;
    let url;
    switch (mode) {
        case 'qualTechDev':
            baseUrl = `${api.qualTechDevbaseUrl}`;
            url = `${baseUrl}${api['routes'][route]['qualTechDevUrl']}`;
            break;
        default:
            baseUrl = `${api.mliDevBaseUrl}`;
            url = `${baseUrl}${api['routes'][route]['mliDevUrl']}`;
            break;
    }
    return url;
}

const getBody = route => {
    return api['routes'][route]['body']
}

export const getApiData = route => {
    const url = getUrl(route);
    const body = getBody(route);
    return { url, body };
}