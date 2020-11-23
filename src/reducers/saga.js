import {
    all,
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';

function* fetchQueue() {
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/queue');
        const data = yield response.json();
        if (typeof data.messages !== 'undefined') {
            yield put({
                type: 'UPDATE_QUEUE',
                queue: data.messages,
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function* fetchHangmanGuesses() {
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/hangman');
        const data = yield response.json();
        if (typeof data.messages !== 'undefined') {
            yield put({
                type: 'UPDATE_HANGMAN',
                guesses: data.messages[0],
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function* sagas() {
    yield all([
        takeEvery('FETCH_QUEUE', fetchQueue),
        takeEvery('FETCH_HANGMAN_GUESSES', fetchHangmanGuesses)
    ]);
}

export default sagas;
