import * as protocol from '../../game/protocol';

export const initialState = {
  nameSet: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case protocol.STATE_UPDATE:
      return action.data;
    case protocol.NAME:
      return {...state, nameSet: true};
  }
  return state;
}

function send(msg) {
  window.ws.send(JSON.stringify(msg));
}

export function sendName(name) {
  const q = { type: protocol.NAME, data: name };
  send(q);
  return q;
}

export function setState(text) {
  const q = { type: protocol.SET_STATE, data: {text} };
  send(q);
  return q;
}

export function startGame() {
  const q = { type: protocol.START_GAME };
  send(q);
  return q;
}

export function quickStart() {
  sendName('Mike foobar');
  startGame();
  return { type: 'quik start' };
}

export function castSpell(target) {
  const q = { type: protocol.CAST_SPELL, target };
  send(q);
  return q;
}
