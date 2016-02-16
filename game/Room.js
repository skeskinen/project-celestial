import * as protocol from './protocol';
import * as Player from './Player';
import * as Effect from './Effect';
import _ from 'lodash';

import { deepSum, deepSubstraction } from './util';

export default class Room {
  constructor() {
    this.started = false;
    this.players = [];
    this.currentTurn = 1;
    this.planets = [];

    this.effects = [];

    this.runEffect = ::this.runEffect;
    this.endTurn = ::this.endTurn;
  }

  turnEffects(i) {
    var ef = this.effects;
    _.range(0, Math.max(0, i - ef.length + 1)).forEach(() => ef.push([]));
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
      const speedMult = _.sample(_.range(Math.floor(1 + i / 2), 2 + i));
      const speed = nPlayers * speedMult;
      var name = `${_.sample(possible)}${_.sample(possible).toLowerCase()} ${Math.floor(Math.random() * 99)}`;
      this.planets.push({
        phase: _.sample(_.range(0, speed)),
        speed,
        color: _.sample(colors),
        name,
        bonus: {speed: {blue: 1}},
        orderNumber: i,
      });
    }
  }

  movePlanets() {
    this.planets.forEach(p => {
      p.phase += 1;
      if (p.phase >= p.speed)
        p.phase -= p.speed;
    });
  }

  playerPlanets(p) {
    const ppos = p.orderNumber;
    const pAmount = this.players.length;
    return _.filter(this.planets, (pl) => {
      return Math.floor(pl.phase / pl.speed * pAmount) === ppos;
    });
  }

  start() {
    this.started = true;
    while (this.players.length < 3) {
      this.players.push(Player.dummy());
    }
    this.mkPlanets();
    this.players.forEach((p, i) => p.start(i));
    this.calcPlanetBonuses();
    this.pushStateUpdate();
  }

  spellCast(player, castInfo) {
    if(player.dead)
      return;

    castInfo.player = player;
    player.ready = true;

    var spell;

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

  calcPlanetBonuses() {
    this.players.forEach(p => {
      const { speed: prevSpeed, defence: prevDefence } = p.planetBonuses;
      p.speed = deepSubstraction(p.speed, prevSpeed);
      p.defence = deepSubstraction(p.defence, prevDefence);

      const planets = this.playerPlanets(p);
      var newBonus = _.reduce(planets, (acc, b) => deepSum(acc, b.bonus), {});

      p.speed = deepSum(p.speed, newBonus.speed);
      p.defence = deepSum(p.defence, newBonus.defence);

      p.planetBonuses = newBonus;
    });
  }

  advanceTurn() {
    this.players.forEach(p => p.ready = false);

    var efs = this.turnEffects(0);

    efs = _.sortBy(efs, (e) => -e.priority());

    this.players.forEach(p => p.prevTurnActingOrder = undefined);

    efs.push(Effect.endOfTurn(() => {
      this.sendLogLine(`Moving planets`);
      this.movePlanets();
      this.calcPlanetBonuses();
    }));

    efs.push(Effect.endOfTurn(() => {
      this.sendLogLine(`Turn ${this.currentTurn} ended`);
      this.currentTurn++;
    }));

    this.runEffect(efs, 1);
  }

  runEffect(es, order) {
    const e = es.shift();
    if(e.owningPlayer && e.owningPlayer.prevTurnActingOrder === undefined)
      e.owningPlayer.prevTurnActingOrder = order++;
    e.effect();
    this.pushStateUpdate();
    if(es.length === 0) {
      this.endTurn();
    } else {
      setTimeout(this.runEffect, 1000, es, order);
    }
  }

  endTurn() {
    this.effects.shift();

    var alive = _.filter(this.players, {dead: false});
    if (alive.length === 1)
      this.sendLogLine(`${alive[0].name} Won!`);
    else if (alive.length === 0)
      this.sendLogLine(`Draw!`);

    this.players.forEach(p => {
      if(!p.ws || p.dead) {
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
