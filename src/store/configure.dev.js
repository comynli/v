import {createStore, applyMiddleware, compose} from 'redux';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createSagaMiddleware, {END} from 'redux-saga';
import DevTools from '../containers/DevTools';

export default function configure(initialState, reducer, ...middleware) {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
                createLogger(),
                routerMiddleware(browserHistory),
                ...middleware
            ),
            DevTools.instrument()
        )
    );

    store.watch = sagaMiddleware.run;
    store.close = () => store.dispatch(END);
    return store;
}