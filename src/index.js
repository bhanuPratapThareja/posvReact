import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import axios from 'axios';
import { generateCorrelationId } from './utils/correlationId';
import { getHeader } from './api/headers';
// import * as serviceWorker from './serviceWorker';

axios.defaults.headers.common['x-api-key'] = getHeader();

axios.interceptors.request.use(config => {
    let newConfig = Object.assign({}, config);
    newConfig.data.request.header.correlationId = generateCorrelationId();
    const posvRefNumber = newConfig.data.request.payload.posvRefNumber;
    if (!posvRefNumber) {
        newConfig.data.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        newConfig.data.request.payload.planCode = localStorage.getItem('planCode');
    }
    console.log('newConfig: ', newConfig.data)
    return newConfig
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
