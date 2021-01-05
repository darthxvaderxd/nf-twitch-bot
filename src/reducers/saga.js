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
            yield put({ type: 'SHOULD_SKIP_SONG' });
        }
    } catch (e) {
        console.error(e);
    }

    // check for pause/unpause
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/should_pause_song`);
        const data = yield response.json();
        if (data.pauseSong === true) {
            yield put({ type: 'SHOULD_PAUSE_SONG' });
        } else {
            yield put({ type: 'SHOULD_NOT_PAUSE_SONG' });
        }
    } catch (e) {
        console.error(e);
    }
}

function* saveTriviaQuestion(action) {
    try {
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.question),
        };
        const response = yield call(fetch, `http://${window.location.host}/api/new_trivia_question', param`);
    } catch (e) {
        console.error(e);
    }
}

function* fetchTriviaQuestions() {
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/trivia_game`);
        const data = yield response.json();
        if (data.triviaQuestions.length > 0) {
            yield put({type: 'UPDATE_TRIVIA_QUESTIONS', questions: data.triviaQuestions});
        }
    } catch (e) {
        console.error(e);
    }
}

function* fetchTriviaAnswers() {
    // fetch the trivia answers
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/trivia_answers`);
        const data = yield response.json();
        if (data.triviaAnswers.length > 0) {
            yield put({type: 'UPDATE_TRIVIA_ANSWERS', triviaAnswers: data.triviaAnswers});
        }
    } catch (e) {
        console.error(e);
    }
}

function* fetchTriviaState() {
    // fetch the trivia game state
    try {
        const response = yield call(fetch, `http://${window.location.host}/api/trivia_live`);
        const data = yield response.json();
        yield put({
            type: 'UPDATE_PLAYING_TRIVIA',
            playingTrivia: data.playingTrivia,
        });
        yield put({
            type: 'UPDATE_TRIVIA_PAUSED',
            triviaPaused: data.triviaPaused,
        });
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
        takeEvery('SAVE_TRIVIA_QUESTION', saveTriviaQuestion),
        takeEvery('FETCH_TRIVIA_QUESTIONS', fetchTriviaQuestions),
        takeEvery('FETCH_TRIVIA_ANSWERS', fetchTriviaAnswers),
        takeEvery('FETCH_TRIVIA_STATE', fetchTriviaState),
        takeEvery('FETCH_FRIENDS', fetchFriends),
    ]);
}

export default sagas;

