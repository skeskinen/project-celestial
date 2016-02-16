import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import multireducer from 'multireducer';

import game from './actions/game';
import ui from './actions/ui';
import popup from './actions/popup';
import log from './actions/log';
import theme from './actions/theme';

const rootReducer = combineReducers({
  routing: routeReducer,
  game,
  ui,
  log,
  theme,
  popups: multireducer({
    missile: popup,
    regen: popup,
    ward: popup,
    planet: popup,
  }),
});

export default rootReducer;
