import * as protocol from './protocol';
import World from './World';
import Ai from './Ai';

import _ from 'lodash';
import { nextTick } from 'process';

export default class Room {
  constructor() {
    this.started = false;
    this.controllers = [];
    this.players = [];
    this.ais = [];

    this.currentSpells = [];
    this.world = new World();

    this.onTurnStart = ::this.onTurnStart;
  }

  pushStateUpdate() {
    this.players.forEach((p, i) => {
      p.ws.send(JSON.stringify({
        type: protocol.STATE_UPDATE,
        data: this.toJSON(p, i),
      }));
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
    this.controllers.push(player);
    player.room = this;
    this.pushStateUpdate();
  }

  start() {
    while (this.controllers.length < 2) {
      var a = new Ai(this);
      this.controllers.push(a);
      this.ais.push(a);
    }

    this.started = true;

    this.world.start(this.controllers);

    this.pushStateUpdate();

    setTimeout(this.onTurnStart, 50);
  }

  spellCast(player, castInfo) {
    var mage = player.mage;
    if(mage.dead || mage.ready)
      return;

    var skill = mage.skills[castInfo.skillIndex];

    var target = 0;
    if(castInfo.target)
      target = castInfo.target;

    var possibleTargets = skill.possibleTargets(this.world, mage);

    if (!_.includes(possibleTargets, target))
      return;

    this.currentSpells.push({mage, spell: skill, target});
    mage.ready = true;

    this.maybeAdvanceTurn();
  }

  maybeAdvanceTurn() {
    if(this.world.isEveryoneReady()) {
      this.world.advanceTurn(this.currentSpells);
      this.currentSpells = [];
      if(!this.world.ended)
        setTimeout(this.onTurnStart, 50);
    }
    this.pushStateUpdate();
  }

  onTurnStart() {
    this.ais.forEach(ai => ai.makeMove());
  }

  toJSON(player) {
    var world = this.world.toJSON();
    var me = _.find(world.mages, {id: player.id});

    return {
      started: this.started,
      me,
      ...this.world.toJSON(player),
    };
  }
}
