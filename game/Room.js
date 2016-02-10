import * as protocol from './protocol';
import * as Player from './Player';
import _ from 'lodash';

export default class Room {
  constructor() {
    this.started = false;
    this.players = [];
  }

  pushStateUpdate() {
    this.players.forEach(p => {
      if (p.ws) {
        p.ws.send(JSON.stringify({
          type: protocol.STATE_UPDATE,
          data: this.toJSON(),
        }));
      }
    });
  }

  addPlayer(player) {
    this.players.push(player);
    this.pushStateUpdate();
  }

  start() {
    this.started = true;
    if (this.players.length < 2) {
      this.players.push(Player.dummy());
    }
    this.players.forEach(_.method('start'));
    this.pushStateUpdate();
  }

  toJSON() {
    return {
      started: this.started,
      players: this.players.map(_.method('toJSON')),
    };
  }
}
