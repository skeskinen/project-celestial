import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import multireducer from 'multireducer';

import game from './actions/game';
import ui from './actions/ui';
import popup from './actions/popup';
import log from './actions/log';

const rootReducer = combineReducers({
  routing: routeReducer,
  game,
  ui,
  log,
  popups: multireducer({
    missile: popup,
    regen: popup,
    planet: popup,
  }),
});

export default rootReducer;
