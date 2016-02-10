require('es6-promise').polyfill();
require('bootstrap-loader');

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import { Router, browserHistory } from 'react-router';
import React from 'react';
import routes from './routes';
import { createHistory } from 'history';
import ApiClient from './ApiClient';

import './background';

const client = new ApiClient();
const ws = window.ws = new WebSocket('ws://localhost:8080');

const store = configureStore(browserHistory, client, window.__data);

function dispatchConnect() {
  store.dispatch({
    type: 'game/connect'
  });
}

if (ws.readyState === 1) {
  dispatchConnect();
} else {
  ws.addEventListener('open', dispatchConnect);
}

ws.addEventListener('message', e => {
  store.dispatch(JSON.parse(e.data));
});

render(
  <Provider store={store} key='provider'>
    <Router history={browserHistory}>
      { routes }
    </Router>
  </Provider>,
  document.getElementById('root')
);
