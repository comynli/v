import 'isomorphic-fetch';
import {encode} from 'querystring';
import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';
import Store from '@comynli/store';
import {UNAUTHORIZED, FORBIDDEN, MESSAGE} from '../types';

const PAYLOAD = Symbol('PAYLOAD');
const FETCH = '@@v/FETCH';

const defaultOptions = {
    CONTEXT_PATH: '',
    DEFAULT_HEADERS: {},
    REQUIRE_AUTH: false,
    TOKEN_KEY: '',
    TOKEN_HEADER: ''
};


async function _request(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        const error = new Error(data.message);
        error.code = response.status;
        error.context = response;
        throw error;
    }
}


function* doFetch(action) {
    const {
        url,
        options = {},
        types = {SUCCESS: '', FAILURE: ''},
    } = action[PAYLOAD];

    try {
        const res = yield call(_request, url, options);
        yield put({type: types.SUCCESS, res});
    } catch (err) {
        if (err.code === 401) {
            yield put({type: UNAUTHORIZED});
            return;
        }
        if (err.code === 403) {
            yield put({type: FORBIDDEN});
            return;
        }
        yield put({type: MESSAGE, level: 'error', message: err.message});
        yield put({type: types.FAILURE, err});
    }
}

export function* requestWatcher() {
    yield* takeEvery(FETCH, doFetch);
}

export function* request(payload = {endpoint: ''}, options = defaultOptions) {
    if (!payload.hasOwnProperty('options')) {
        payload.options = {'method': 'GET'};
    }
    if (!payload.hasOwnProperty('authenticated')) {
        payload.authenticated = true;
    }
    let url = `${options.CONTEXT_PATH}${payload.endpoint}`;
    if (payload.params) {
        url = `${url}?${encode(payload.params)}`;
    }
    let headers = new Headers(payload.options.headers || options.DEFAULT_HEADERS);
    if (options.REQUIRE_AUTH) {
        const token = Store.get(options.TOKEN_KEY);
        if (token) {
            headers.set(options.TOKEN_HEADER, token);
        } else if (payload.authenticated) {
            yield put({type: UNAUTHORIZED});
            return;
        }
    }
    payload.options.headers = headers;
    yield put({type: FETCH, [PAYLOAD]: {url,
        types: payload.types,
        options: payload.options,
        authenticated: payload.authenticated}});
}
