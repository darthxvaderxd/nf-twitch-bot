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

function* fetchShouldStopWatch() {
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/watch');
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
        const response = yield call(fetch, 'http://localhost:8000/api/song_requests');
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
        const response = yield call(fetch, 'http://localhost:8000/api/should_skip_song');
        const data = yield response.json();
        if (data.skipSong === true) {
            yield put({ type: 'SHOULD_SKIP_SONG' });
        }
    } catch (e) {
        console.error(e);
    }

    // check for pause/unpause
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/should_pause_song');
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
        const response = yield call(fetch, 'http://localhost:8000/api/new_trivia_question', params);
        console.log(yield response.json());
    } catch (e) {
        console.error(e);
    }
}

function* fetchTriviaQuestions() {
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/fetch_trivia_questions');
        const data = yield response.json();
        yield put({ type: 'UPDATE_TRIVIA_QUESTIONS', questions: data.questions });
    } catch (e) {
        console.error(e);
    }
}

function* fetchTriviaAnswers() {
    try {
        const response = yield call(fetch, 'http://localhost:8000/api/fetch_trivia_answers');
        const data = yield response.json();
        if (data.skipSong === true) {
            yield put({ type: 'UPDATE_TRIVIA_ANSWERS', questions: data.answers });
        }
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
    ]);
}

export default sagas;
