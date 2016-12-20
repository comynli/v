import {combineReducers} from 'redux';
import {put} from 'redux-saga/effects';


export const PUBLISH = '@@v/publish';

export function* publish(key, data) {
    yield put({type: PUBLISH, key, data});
}

export function createReducer(name, initialState, reducers = {}) {
    function consumer(state = initialState, action) {
        if (action.type === PUBLISH) {
            return {...state, [action.key]: action.data};
        }
        return state;
    }
    return combineReducers({...reducers, [name]: consumer});
}