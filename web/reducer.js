import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import game from './actions/game';
import ui from './actions/ui';

const rootReducer = combineReducers({
  routing: routeReducer,
  game,
  ui,
});

export default rootReducer;
