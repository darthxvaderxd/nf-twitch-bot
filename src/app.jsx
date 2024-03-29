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
import TriviaAdmin from './components/TriviaAdmin';
import TriviaGame from './components/TrivaGame';
import Lurker from "./components/Lurker";
import PokerHandRandomGen from "./components/PokerHandRandomGen";

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
                <Route path="/trivia/game" component={TriviaGame} />
                <Route path="/trivia/admin" component={TriviaAdmin} />
                <Route path="/lurker" component={Lurker} />
                <Route path="/poker/gen" component={PokerHandRandomGen} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('nf-root'),
);
