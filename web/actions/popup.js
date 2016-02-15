export const SHOW = 'popup/show';
export const HIDE = 'popup/hide';

const initialState = {
  visible: false,
};

export default function(state = initialState, action) {
  if(action) {
    // console.log('foobar');
    // console.log(action);
    switch (action.type) {
      case SHOW:
        return {
          ...state,
          visible: true,
        };
      case HIDE:
        return {
          ...state,
          visible: false,
        };
    }
  }
  return state;
}

export function show() {
  return (dispatch) => setTimeout(() => dispatch({
    type: SHOW,
  }), 0);
}

export function hide() {
  return {
    type: HIDE,
  };
}
