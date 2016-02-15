import _ from 'lodash';

import * as protocol from '../../game/protocol';

export const initialState = {
  lines: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case protocol.LOG_LINE:
      return {
        ...state,
        lines: _.concat(state.lines, [action.data]),
      };
  }
  return state;
}
