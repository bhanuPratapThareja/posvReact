const uatMode = true;

const api = {
    baseUrl: 'https://n913i5xkoi.execute-api.ap-south-1.amazonaws.com/',
    routes: {
        verifyUser: {
            uatUrl: 'Stage/verify-customer-link',
            prodUrl: 'prod/verify-customer-link',
            body: { "request": { "header": { "appId":"mpro", "correlationId":"121324324" }, "payload": { "posvRefNumber": "343030303035323234397c7c6d70726f7c7c616263" } } }
        },
        verifyCustomerImage: {
            uatUrl: 'Stage/verify-customer-image',
            prodUrl: 'prod/verify-customer-image',
            body: { "request": { "header": { "appId":"mpro", "correlationId":"25478965874" }, "payload": { "posvRefNumber": "", imageFile: "", authToken: "", fileExtension:"" } } }
        },
        getotp: {
            uatUrl: 'Stage/getotp',
            prodUrl: 'prod/getotp',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "ABC" }, "payload": { "posvRefNumber": "", "mobile": "7428453608", "email": "adit.kumar@qualtechedge.com", "productName": "Max Term Plan", "sumAssured": "2000", "initialPremiumPaid": "32000", "policyTerm": "Test policy", "modeOfPayment": "NEFT", "authToken": "wtewe834jwe" } } },
        }
    }
}

const getUrl = route => {
    const baseUrl = `${api.baseUrl}`;
    if (uatMode) {
        return `${baseUrl}${api['routes'][route]['uatUrl']}`;
    }
    return `${baseUrl}${api['routes'][route]['prodUrl']}`;
}

const getBody = route => {
    return api['routes'][route]['body']
}

export const getApiData = route => {
    const url = getUrl(route);
    const body = getBody(route);
    return { url, body };
}