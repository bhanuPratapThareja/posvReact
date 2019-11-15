const uatMode = true;

const api = {
    baseUrl: 'https://n913i5xkoi.execute-api.ap-south-1.amazonaws.com/',
    routes: {
        getotp: {
            uatUrl: 'Stage/getotp',
            prodUrl: 'prod/getotp',
            body: { "request": { "header": { "correlationId": "25478965874", "appId": "ABC" }, "payload": { "posvRefNumber": "31323334353637387c7c6d70726f7c7c616263", "mobile": "7428453608", "email": "adit.kumar@qualtechedge.com", "productName": "Max Term Plan", "sumAssured": "2000", "initialPremiumPaid": "32000", "policyTerm": "Test policy", "modeOfPayment": "NEFT", "authToken": "wtewe834jwe" } } },
            headers: [{ keyName: 'x-api-key', keyValue: 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg' }]
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

const getHeaders = route => {
    if (api['routes'][route].headers) {
        const headers = {};
        api['routes'][route].headers.forEach(header => {
            Object.defineProperty(headers, header.keyName, {
                value: header.keyValue
            })
        });
        return headers
    }
    return null
}

export const getApiData = route => {
    const url = getUrl(route);
    const data = getBody(route);
    const headers = getHeaders(route);
    return { url, data, headers };
}