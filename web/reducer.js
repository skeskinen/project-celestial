import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import game from './actions/game';

const rootReducer = combineReducers({
  routing: routeReducer,
  game
});

export default rootReducer;
