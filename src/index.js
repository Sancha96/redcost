import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ActuallyMainApp from './ActuallyMainApp';
import reducers from './reducers';
import * as serviceWorker from './serviceWorker';

import './index.scss';


ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <HashRouter>
            <ActuallyMainApp />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
