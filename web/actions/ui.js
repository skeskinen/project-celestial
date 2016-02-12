import * as protocol from '../../game/protocol';

const SHOW_TOOLTIP = 'ui/show_tooltip';
const CLOSE_TOOLTIPS = 'ui/close_tooltip';

const SELECTED_SPELL = 'ui/select_spell';
const SELECTED_TARGET = 'ui/select_target';

export const initialState = {
  tooltip: false,
  targetMode: protocol.TARGET_NONE,
  readyToConfirm: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_TOOLTIP:
      return {
        ...state,
        tooltip: true,
      };
    case CLOSE_TOOLTIPS:
      return {
        ...state,
        tooltip: false,
      };
    case SELECTED_SPELL:
      return {
        ...state,
        targetMode: protocol.TARGET_ENEMY,
      };
    case SELECTED_TARGET:
      return {
        ...state,
        targetMode: protocol.TARGET_NONE,
      };
  }
  return state;
}

export function showTooltip() {
  return (dispatch) => setTimeout(() => dispatch({
    type: SHOW_TOOLTIP,
  }), 0);
}

export function closeTooltips() {
  return {
    type: CLOSE_TOOLTIPS,
  };
}

export function selectedSpell(spell) {
  return {
    type: SELECTED_SPELL,
  };
}

export function selectedTarget(target) {
  return {
    type: SELECTED_TARGET,
  };
}
