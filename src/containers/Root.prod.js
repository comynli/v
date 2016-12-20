import React from 'react';
import {Provider} from 'react-redux';
import {Router, RouterContext} from 'react-router';

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
                </div>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    routes: PropTypes.node.isRequired,
    type: PropTypes.object,
    renderProps: PropTypes.any
};