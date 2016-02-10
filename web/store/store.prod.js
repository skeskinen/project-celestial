import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import { syncHistory } from 'react-router-redux';
import clientMiddleware from './clientMiddleware';

export default function configureStore(history, client, data) {
  var middleware = [clientMiddleware(client)];
  if(__CLIENT__)
    middleware = [...middleware, syncHistory(history, store)];
  const store = applyMiddleware(...middleware)(createStore)(reducer, data);

  if (history)
    syncHistory(history, store);

  return store;
}
