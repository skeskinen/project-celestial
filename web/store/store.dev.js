import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import { syncHistory } from 'react-router-redux';
import clientMiddleware from './clientMiddleware';
import createLogger from 'redux-logger';

export default function configureStore(history, client, data) {
  var middleware = [clientMiddleware(client)];
  if(__CLIENT__)
    middleware = [...middleware, createLogger(), syncHistory(history, store)];
  const store = applyMiddleware(...middleware)(createStore)(reducer, data);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default;
      console.log(nextReducer);
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
