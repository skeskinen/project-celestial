import * as protocol from './protocol';
import * as Player from './Player';
import _ from 'lodash';

export default class Room {
  constructor() {
    this.started = false;
    this.players = [];
    this.currentTurn = 1;
    this.planets = [];

    this.effects = [];
  }

  turnEffects(i) {
    var ef = this.effects;
    if (ef.length - 1 < i) {
      for (var j = 0; j < i - ef.length + 1; j++) {
        ef.push([]);
      }
    }
    return ef[i];
  }

  pushStateUpdate() {
    this.players.forEach((p, i) => {
      if (p.ws) {
        p.ws.send(JSON.stringify({
          type: protocol.STATE_UPDATE,
          data: this.toJSON(p, i),
        }));
      }
    });
  }

  sendLogLine(line) {
    this.players.forEach(p => {
      if (p.ws) {
        p.ws.send(JSON.stringify({
          type: protocol.LOG_LINE,
          data: line,
        }));
      }
    });
  }

  addPlayer(player) {
    this.players.push(player);
    this.pushStateUpdate();
  }

  mkPlanets() {
    const nPlayers = this.players.length;
    const colors = ['blue', 'red', 'yellow'];
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < 6; i++) {
      const speedMult = _.sample(_.range(2, 6));
      const speed = nPlayers * speedMult;
      var name = `${_.sample(possible)}${_.sample(possible).toLowerCase()} ${Math.floor(Math.random() * 99)}`;
      this.planets.push({phase: _.sample(_.range(0, speed)), speed, color: _.sample(colors), name });
    }
  }

  movePlanets() {
    this.planets.forEach(p => {
      p.phase += 1;
      if (p.phase >= p.speed)
        p.phase -= p.speed;
    });
  }

  start() {
    this.started = true;
    while (this.players.length < 3) {
      this.players.push(Player.dummy());
    }
    this.mkPlanets();
    this.players.forEach(_.method('start'));
    this.pushStateUpdate();
  }

  spellCast(player, castInfo) {
    castInfo.player = player;

    var spell;

    player.ready = true;
    if (castInfo.spellType === protocol.SPELL_TYPE_SKILL)
      spell = _.get(player.skills, castInfo.id);

    spell.mkEffects(this, castInfo);
    if (!this.checkReady())
      this.pushStateUpdate();
  }

  checkReady() {
    if(_.every(this.players, {ready: true})) {
      this.advanceTurn();
      return true;
    } else
      return false;
  }

  advanceTurn() {
    this.players.forEach(p => p.ready = false);

    var efs = this.turnEffects(0);

    efs.push([() => {
      this.sendLogLine(`Turn ${this.currentTurn} ended`);
      this.movePlanets();
      this.currentTurn++;
    }]);

    efs.forEach(e => {
      e[0].apply(null, _.tail(e));
    });

    this.effects.shift();

    this.players.forEach(p => { //make bots ready
      if(!p.ws) {
        p.ready = true;
      }
    });

    this.pushStateUpdate();
  }

  toJSON(player) {
    return {
      started: this.started,
      players: this.players.map(_.method('toJSON')),
      me: player.toJSON(),
      planets : this.planets,
    };
  }
}
