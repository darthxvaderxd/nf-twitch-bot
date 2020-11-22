import { combineReducers } from 'redux';

const initialState = {
    queue: [],
};

function queueReducer(state = initialState.queue, action) {
    if (action.type === 'UPDATE_QUEUE') {
        return [...state, ...action.queue];
    } else if (action.type === 'REMOVE_FROM_QUEUE') {
        const queue = Object.values(state).filter((q) => q.id !== action.id);
        return [ ...queue ];
    }
    return state;
}

export default combineReducers({
    queue: queueReducer,
});
