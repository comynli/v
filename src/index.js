import React from 'react';
import ReactDOM from 'react-dom';
import {Route, browserHistory} from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import configure from './store';
import Root from './containers/Root';
import Module from './Module';
import {requestWatcher} from './utils/request';
import { createReducer } from './utils/reducer';
import {UNAUTHORIZED, FORBIDDEN, MESSAGE} from './types';

export {request, publish, action, createRequestTypes, subscribe} from './utils/index';
export {UNAUTHORIZED, FORBIDDEN, MESSAGE} from './types';
export Module from './Module';

const emptyMessage = {message: '', level: '', show: false, type: ''};

function message(state = emptyMessage, action) {
    if (action.type === MESSAGE) {
        return {message: action.message, level: action.level, show: true, type: action.type};
    }
    if (action.type === UNAUTHORIZED) {
        return {message: 'unauthorized', level: 'error', show: true, type: action.type};
    }

    if (action.type === FORBIDDEN) {
        return {message: 'forbidden', level: 'error', show: true, type: action.type};
    }
    return emptyMessage;
}

export default class Application {
    constructor(initialState = {}, ...middleware) {
        this._modules = new Map();
        this._routes = [];
        this._store = configure(initialState,
            createReducer(initialState, {message, routing: routerReducer}),
            ...middleware);
    }

    get store() {
        return this._store;
    }

    use(Mod) {
        const mod = new Mod(this);

        if (!(mod instanceof Module)) {
            throw new Error('it is not instance of Module');
        }
        if (this._modules.has(mod.name)) {
            throw new Error(`conflicting module name ${mod.name}`);
        }
        this._modules.set(mod.name, mod);
        this._routes.push(mod.router);
    }

    watch(...sagas) {
        sagas.forEach(it => this._store.watch(it));
    }

    start(el, prefix, component) {
        const routes = (
            <Route path={prefix} component={component}>
                {this._routes}
            </Route>
        );

        this._store.watch(requestWatcher);
        for (let m of this._modules.values()) {
            m.start();
        }
        const history = syncHistoryWithStore(browserHistory, this._store);

        ReactDOM.render(
            <Root
                store={this._store}
                history={history}
                routes={routes}/>,
            el
        );
    }
}