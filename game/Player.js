//import * as protocol from './protocol';

global.playerIdCounter = 1;

export default class Player {

  constructor(ws, name) {
    this.ws = ws;
    this.name = name;
    this.id = global.playerIdCounter++;

    this.room = null;
    this.mage = null;
  }
}
