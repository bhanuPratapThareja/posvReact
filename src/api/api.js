export const mode = 'mliDev'; // qualTechDev // mliDev

const api = {
    qualTechDevbaseUrl: 'https://n913i5xkoi.execute-api.ap-south-1.amazonaws.com/',
    mliDevBaseUrl: 'https://djedtvaxn2.execute-api.ap-south-1.amazonaws.com/posvdev/',
    routes: {
        verifyUser: {
            qualTechDevUrl: 'Stage/verify-customer-link',
            mliDevUrl: 'validate-customer-link-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "121324324" }, "payload": { "posvRefNumber": "343030303035323234397c7c6d70726f7c7c616263" } } }
        },
        verifyCustomerImage: {
            qualTechDevUrl: 'Stage/verify-customer-image',
            mliDevUrl: 'validate-customer-image-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "25478965874" }, "payload": { "posvRefNumber": "", imageFile: "", authToken: "", fileExtension: "" } } }
        },
        getotp: {
            qualTechDevUrl: 'Stage/getotp',
            mliDevUrl: 'get-otp-dev',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "ABC" }, "payload": { "posvRefNumber": "", "authToken": "", "onCallOTP":"No" } } },
        },
        validateOtp: {
            qualTechDevUrl: 'Stage/validateotp',
            mliDevUrl: 'validate-otp-dev',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "ABC" }, "payload": { "posvRefNumber": "", "otp": "", "authToken": "" } } }
        },
        declaration: {
            qualTechDevUrl: 'Stage/customer-disclaimer',
            mliDevUrl: 'customer-disclaimer-dev',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "ABC" }, "payload": { "posvRefNumber": "", "customerDisclaimer": "", "authToken": "" } } }
        },
        pdf: {
            qualTechDevUrl: 'Stage/get-pdf-transcript',
            mliDevUrl: 'get-pdf-transcript-dev',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "mpro" }, "payload": { "posvRefNumber": "", "authToken": "" } } }
        },
        getQuestions: {
            qualTechDevUrl: 'Stage/get-questions',
            mliDevUrl: 'get-questions-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "25478965874" }, "payload": { "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "", "qstCatNameNext": null, "qstCatNamePrevious": null, "LANG": "ENG", "authToken": "", "planCode": "" } } }
        },
        saveCustomerResponse: {
            qualTechDevUrl: 'Stage/save-customer-response',
            mliDevUrl: 'save-customer-response-dev',
            body: { "request": { "header": { "appId": "mpro", "correlationId": "25478965874" }, "payload": { "customerResponse": { "qst": [] }, "qstCatName": "", "qstSubCatName": null, "posvRefNumber": "4000052249", "lang": "EN", "planCode": "EFGEP8", "qstCatNameNext": null, "qstSubCatNameNext": null, "qstCatNamePrevious": null, "qstSubCatNamePrevious": null, "authToken": "wtewe834jwe" } } }
        }
    }
}

const getUrl = route => {
    let baseUrl;
    let url;
    if(mode === 'qualTechDev'){
        baseUrl = `${api.qualTechDevbaseUrl}`;
        url =  `${baseUrl}${api['routes'][route]['qualTechDevUrl']}`;
    }
    if(mode === 'mliDev'){
        baseUrl = `${api.mliDevBaseUrl}`;
        url =  `${baseUrl}${api['routes'][route]['mliDevUrl']}`;
    }
    console.log('url: ', url)
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