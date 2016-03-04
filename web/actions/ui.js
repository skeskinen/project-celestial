import * as protocol from '../../game/protocol';
import * as gameActions from './game';
import { multireducerWrapAction } from 'multireducer';

import _ from 'lodash';

const SELECTED_SPELL = 'ui/select_spell';
const SELECTED_TARGET = 'ui/select_target';

const SHOW_POPUP = 'ui/show_popup';
const CLOSE_POPUP = 'ui/close_popup';

export const NO_TARGETING = 'NO_TARGETING';
export const TARGETING_ENEMY = 'TARGETING_ENEMY';

export const initialState = {
  targetMode: NO_TARGETING,
  readyToConfirm: false,
  spellInfo: undefined,
  popupVisible: false,
  popupX: 0,
  popupY: 0,
  popupW: 0,
  popupH: 0,
  popupContent: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECTED_SPELL:
      return {
        ...state,
        targetMode: TARGETING_ENEMY,
        spellInfo: action.spellInfo,
      };
    case SELECTED_TARGET:
      return {
        ...state,
        targetMode: NO_TARGETING,
      };
    case SHOW_POPUP:
      return {
        ...state,
        popupVisible: true,
        popupX: action.x,
        popupY: action.y,
        popupW: action.w,
        popupH: action.h,
        popupContent: action.content,
      };
    case CLOSE_POPUP:
      return {
        ...state,
        popupVisible: false,
      };
  }
  return state;
}

export function selectedSpell(spell) {
  return {
    type: SELECTED_SPELL,
  };
}

export function selectedSkill(skillIndex) {
  return (dispatch, getState) => {
    const state = getState();
    if(skillIndex > 1) {
      dispatch(gameActions.castSpell({
        skillIndex: skillIndex,
      }));
    } else {
      dispatch({
        type: SELECTED_SPELL,
        spellInfo: {
          skillIndex: skillIndex,
        }
      });
    }
    dispatch(closePopup());
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

export function showPopup(x, y, w, h, content) {
  return {
    type: SHOW_POPUP,
    x, y, w, h, content
  };
}

export function closePopup() {
  return {type: CLOSE_POPUP};
}
