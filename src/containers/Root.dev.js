import React from 'react';
import {Provider} from 'react-redux';
import {Router, RouterContext} from 'react-router';
import DevTools from './DevTools';

const PropTypes = React.PropTypes;

export default class Root extends React.Component {
    render() {
        const {store, history, routes, type, renderProps} = this.props;
        return (
            <Provider store={store}>
                <div>
                    { type === 'server'
                        ? <RouterContext {...renderProps} />
                        : <Router history={history} routes={routes}/>
                    }
                    <DevTools />
                </div>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    type: PropTypes.object,
    renderProps: PropTypes.any
};