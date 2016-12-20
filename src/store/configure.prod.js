import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createSagaMiddleware, { END } from 'redux-saga';

export default function configure(initialState, reducer, ...middleware) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        reducer,
        initialState,
        applyMiddleware(sagaMiddleware, routerMiddleware(browserHistory), ...middleware)
    );

    store.watch = sagaMiddleware.run;
    store.close = () => store.dispatch(END);
    return store;
}