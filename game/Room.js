import * as protocol from './protocol';
import * as Player from './Player';
import * as Effect from './Effect';
import * as Spell from './Spell';
import * as util from './util';
import * as Planet from './Planet';
import _ from 'lodash';

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

  start() {
    this.started = true;
    var bots = [];
    while (this.players.length < 2) {
      const p = Player.dummy(this.players.length);
      this.players.push(p);
      bots.push(p);
    }
    this.planets = Planet.mkPlanets(this);
    this.players.forEach((p, i) => p.start(i));
    Planet.calcPlanetBonuses(this);

    bots.forEach(p =>
      this.spellCast(p, {spellType: protocol.SPELL_TYPE_PASS})
    );

    this.pushStateUpdate();
  }

  spellCast(player, castInfo) {
    if(player.dead || player.ready)
      return;

    castInfo.player = player;
    player.ready = true;

    var spell;

    if (castInfo.spellType === protocol.SPELL_TYPE_SKILL)
      spell = _.get(player.skills, castInfo.id);
    else if (castInfo.spellType === protocol.SPELL_TYPE_PASS)
      spell = Spell.pass;

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
    var efs = this.turnEffects(0);

    efs.push(Effect.endOfTurn(() => {
      this.sendLogLine(`Moving planets`);
      Planet.movePlanets(this);
      Planet.calcPlanetBonuses(this);
    }));

    efs.push(Effect.endOfTurn(() => {
      this.sendLogLine(`Turn ${this.currentTurn} ended`);
      this.currentTurn++;
    }));

    efs = _.sortBy(efs, (e) => -e.priority());

    this.players.forEach(p => p.prevTurnActingOrder = undefined);

    this.runEffect(efs, 1);
  }

  runEffect(es, order) {
    const betweenActionDelay = 2000;
    const actingOrderTextDelay = 500;

    const e = es.shift();
    function run() {
      e.effect();
      this.pushStateUpdate();
      if(es.length === 0) {
        this.endTurn();
      } else {
        setTimeout(this.runEffect, betweenActionDelay, es, order);
      }
    }

    if(e.owningPlayer && e.owningPlayer.prevTurnActingOrder === undefined) {
      const ordinal = util.ordinals.length >= order ? util.ordinals[order - 1] : '';
      const speed = Math.floor(e.priority() / Effect.speedMult);
      this.sendLogLine(`${e.owningPlayer.name} acts ${ordinal} (speed ${speed})`);
      e.owningPlayer.prevTurnActingOrder = order++;
      setTimeout(run.bind(this), actingOrderTextDelay);
    } else
      run.call(this);
  }

  endTurn() {
    this.effects.shift();

    var alive = _.filter(this.players, {dead: false});
    if (alive.length === 1)
      this.sendLogLine(`${alive[0].name} Won!`);
    else if (alive.length === 0)
      this.sendLogLine(`Draw!`);

    this.players.forEach(p => {
      if (!p.dead)
        p.ready = false;
    });

    this.players.forEach(p => {
      if(!p.ws && !p.ready) {
        this.spellCast(p, {spellType: protocol.SPELL_TYPE_PASS});
      }
    });

    this.pushStateUpdate();
  }

  toJSON(player) {
    return {
      started: this.started,
      players: this.players.map(_.method('toJSON', false, this)),
      me: player.toJSON(true, this),
      planets : this.planets,
    };
  }
}
