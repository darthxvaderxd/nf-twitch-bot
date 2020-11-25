import { combineReducers } from 'redux';
const { defaultPlaylist } = require('../../token.json');


const initialState = {
    queue: [],
    guesses: {
        letters: [],
        words: [],
    },
    videos: [],
    stopWatchStream: false,
    skipSong: false,
    pauseSong: false,
    defaultPlaylist,
    triviaQuestions: [],
    triviaAnswers: [],
};

function queueReducer(state = initialState.queue, action) {
    switch(action.type) {
        case 'UPDATE_QUEUE':
            return [...state, ...action.queue];
        case 'REMOVE_FROM_QUEUE':
            const queue = Object.values(state).filter((q) => q.id !== action.id);
            return [ ...queue ];
        default:
            return state;
    }
}

function hangmanReducer(state = initialState.guesses, action) {
    switch(action.type) {
        case 'UPDATE_HANGMAN':
            const newState = { ...state };
            if (action.guesses) {
                if (action.guesses.params.letter) {
                    newState.letters = [...newState.letters, action.guesses.params.letter];
                } else if (action.guesses.params.word) {
                    newState.words = [...newState.words, action.guesses.params.word];
                }
            }
            return newState;
        case 'RESET_HANGMAN':
            return { letters: [], words: [] };
        default:
            return state;
    }
}

function watchReducer(state = initialState.stopWatchStream, action) {
    switch(action.type) {
        case 'SHOULD_STOP_WATCH':
            return true;
        case 'SHOULD_START_WATCH':
            return false;
    }
    return state;
}

function songRequestReducer(state = initialState.videos, action) {
    switch (action.type) {
        case 'UPDATED_SONG_QUEUE':
            return [...state, ...action.videos];
        case 'REMOVE_SONG_FROM_QUEUE':
            const queue = Object.values(state).filter((q) => q.params.videoId !== action.video.videoId);
            return [ ...queue ];
    }
    return state;
}

function skipSongReducer(state = initialState.skipSong, action) {
    switch (action.type) {
        case 'SHOULD_SKIP_SONG':
            return true;
        case 'SHOULD_NOT_SKIP_SONG':
            return false;
    }
    return state;
}

function pauseSongReducer(state = initialState.pauseSong, action) {
    switch (action.type) {
        case 'SHOULD_PAUSE_SONG':
            return true;
        case 'SHOULD_NOT_PAUSE_SONG':
            return false;
    }
    return state;
}

function playlistReducer(state = initialState.defaultPlaylist, action) {
    return state;
}

function triviaQuestionsReducer(state = initialState.triviaQuestions, action) {
    switch (action.type) {
        case 'UPDATE_TRIVIA_QUESTIONS':
            return action.triviaQuestions;
    }
    return state;
}

function triviaAnswersReducer(state = initialState.triviaAnswers, action) {
    switch (action.type) {
        case 'UPDATE_TRIVIA_ANSWERS':
            return [...state, ...action.triviaQuestions];
    }
    return state;
}

export default combineReducers({
    queue: queueReducer,
    guesses: hangmanReducer,
    stopWatchStream: watchReducer,
    videos: songRequestReducer,
    skipSong: skipSongReducer,
    pauseSong: pauseSongReducer,
    defaultPlaylist: playlistReducer,
    triviaQuestions: triviaQuestionsReducer,
    triviaAnswers: triviaAnswersReducer,
});
