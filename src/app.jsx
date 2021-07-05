import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import reducer from './reducers/index';
import saga from './reducers/saga';
import Messages from './components/Messages';
import SongRequest from './components/SongRequest';
import Lurker from "./components/Lurker";

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
        <Router>
            <div>
                <Route path="/interact" component={Messages} />
                <Route path="/music" component={SongRequest} />
                <Route path="/lurker" component={Lurker} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('nf-root'),
);
