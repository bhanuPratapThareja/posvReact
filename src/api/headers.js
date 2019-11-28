export const verifyHeader = { 
    'x-api-key': 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg' 
}

export const headers = {
    'Authorization': 'Bearer eyJraWQiOiJDOU9NcGZZZDZjRFwvQ3JCKzRya3hlbUdPMDBWOXBSQkZsU2ZUUGJcL05wbW89IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIydTg5NGMzbTFibG04YXE2OGFobWV1MnI3IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJQT1NWX1JFU09VUkNFX1NFUlZFUlwvV1JJVEVfREFUQSBQT1NWX1JFU09VUkNFX1NFUlZFUlwvUkVBRF9EQVRBIiwiYXV0aF90aW1lIjoxNTc0OTQ0MTIxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX1AzSDhNSWJmbCIsImV4cCI6MTU3NDk0NzcyMSwiaWF0IjoxNTc0OTQ0MTIxLCJ2ZXJzaW9uIjoyLCJqdGkiOiI4YWE1NDljNC0xNjQyLTQyNmMtOTM4Mi00NzMwZDgyZjczNTkiLCJjbGllbnRfaWQiOiIydTg5NGMzbTFibG04YXE2OGFobWV1MnI3In0.i6QIxwkTJ0CT9dI9XzHnSWb_buYpUX6aF6bqrhM-sqoHSXrIsI-H4DEWQVpe3jBFW7f7ahmC14_3XWk0IxrdVca11lWwcUR9ovzQ7iWDDVozcR2l-sObxr32IlPxgK8isguWC_H54V5aHZLm5u6t4phmAsxxkjtFoRsNKSXeYiapG64B1sDFeQQvkEyI430E7p-diVPGhhLAA_zRFnJ2VDtMuuC9AXrqA3AcrSqrJV36x0973ciPKQ844yqnFDYXj7tZAm9grLWaT8e0s4zxA-Em-vbEE_bWTvVbxufZcKHlBecQ87tAphZyrHByQuIxCxGBpRuYzhPES-JVicSqtw'
}

// export const updateHeader = authToken => {
//     headers.Authorization = authToken
// }

export const appHeaders = {
    authToken: '',
    set headers(authToken) {
        this.authToken = authToken
    },
    get headers() {
        return {'Authorization': `Bearer ${this.authToken}`}
    }
}