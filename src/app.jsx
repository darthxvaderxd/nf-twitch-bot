import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers/index';
import saga from './reducers/saga';
import Messages from "./components/Messages";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// mount it on the Store
const store = createStore(
    reducer,
    compose(
        applyMiddleware(sagaMiddleware),
        // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    ),
);

// then run the saga
sagaMiddleware.run(saga);

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Messages />
        </div>
    </Provider>,
    document.getElementById('nf-root'),
);
