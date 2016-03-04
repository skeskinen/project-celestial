import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import game from './actions/game';
import ui from './actions/ui';
import log from './actions/log';
import theme from './actions/theme';

const rootReducer = combineReducers({
  routing: routeReducer,
  game,
  ui,
  log,
  theme,
});

export default rootReducer;
