import {
    all,
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';

function* fetchQueue() {
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/queue`);
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
        const response = yield call(fetch, `http://${window.location.host}/api/hangman`);
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

function* fetchShouldStopWatch() {
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/watch`);
        const data = yield response.json();
        if (data.stopWatchStream === true) {
            yield put({
                type: 'SHOULD_STOP_WATCH',
            });
            window.queueLocked = false;
        }
    } catch (e) {
        console.error(e);
    }
}

function* fetchSongQueue() {
    // check for new songs
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/song_requests`);
        const data = yield response.json();
        yield put({
            type: 'UPDATED_SONG_QUEUE',
            videos: data.songs,
        });
    } catch (e) {
        console.error(e);
    }

    // check for song skips
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/should_skip_song`);
        const data = yield response.json();
        if (data.skipSong === true) {
            yield put({type: 'SHOULD_SKIP_SONG'});
        }
    } catch (e) {
        console.error(e);
    }

    // check for pause/unpause
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/should_pause_song`);
        const data = yield response.json();
        if (data.pauseSong === true) {
            yield put({type: 'SHOULD_PAUSE_SONG'});
        } else {
            yield put({type: 'SHOULD_NOT_PAUSE_SONG'});
        }
    } catch (e) {
        console.error(e);
    }
}

function* fetchFriends() {
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/live_friends`);
        const data = yield response.json();
        yield put({
            type: 'UPDATE_FRIENDS',
            friends: data.friends,
        });
    } catch (e) {
        console.error(e);
    }
}

function* sagas() {
    yield all([
        takeEvery('FETCH_QUEUE', fetchQueue),
        takeEvery('FETCH_HANGMAN_GUESSES', fetchHangmanGuesses),
        takeEvery('FETCH_SHOULD_STOP_WATCH', fetchShouldStopWatch),
        takeEvery('FETCH_SONG_QUEUE', fetchSongQueue),
        takeEvery('FETCH_FRIENDS', fetchFriends),
    ]);
}

export default sagas;

