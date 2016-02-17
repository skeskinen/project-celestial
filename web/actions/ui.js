import * as protocol from '../../game/protocol';
import * as gameActions from './game';
import * as popupActions from './popup';
import { multireducerWrapAction } from 'multireducer';

import _ from 'lodash';

const SELECTED_SPELL = 'ui/select_spell';
const SELECTED_TARGET = 'ui/select_target';

export const initialState = {
  targetMode: protocol.TARGET_NONE,
  readyToConfirm: false,
  spellInfo: undefined,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECTED_SPELL:
      return {
        ...state,
        targetMode: protocol.TARGET_ENEMY,
        spellInfo: action.spellInfo,
      };
    case SELECTED_TARGET:
      return {
        ...state,
        targetMode: protocol.TARGET_NONE,
      };
  }
  return state;
}

export function selectedSpell(spell) {
  return {
    type: SELECTED_SPELL,
  };
}

export function selectedSkill(skillName, color) {
  return (dispatch, getState) => {
    const state = getState();
    const skill = state.game.me.skills[skillName][color];
    switch (skill.targetType) {
      case protocol.TARGET_NONE:
        dispatch(gameActions.castSpell({
          spellType: protocol.SPELL_TYPE_SKILL,
          id: `${skillName}.${color}`,
        }));
        break;
      case protocol.TARGET_ENEMY:
        dispatch({
          type: SELECTED_SPELL,
          spellInfo: {
            spellType: protocol.SPELL_TYPE_SKILL,
            id: `${skillName}.${color}`,
          }
        });
        break;
    }

    dispatch(closeAllPopups());
  };
}

export function selectedTarget(target) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({type: SELECTED_TARGET});
    dispatch(gameActions.castSpell({
      ...state.ui.spellInfo,
      target,
    }));
  };
}

export function closeAllPopups() {
  return (dispatch, getState) => {
    const state = getState();
    const keys = _.keys(state.popups);
    keys.forEach(k =>
      dispatch(multireducerWrapAction(popupActions.hide(), k)));
  };
}
