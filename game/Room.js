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

  spellCast(player, msg) {
    const { target } = msg;
    var spell = { player, spellType: protocol.SPELL_TYPE_SKILL, id: 'missile.blue', target };

    player.castedSpell = spell;
    player.ready = true;
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
    const castedSpells = this.players.map(p => p.castedSpell);

    castedSpells.forEach(spellMsg => {
      if(!spellMsg.id)
        return;
      const { player, id, target, spellType } = spellMsg;
      var spell;
      if (spellType === protocol.SPELL_TYPE_SKILL)
        spell = _.get(player.skills, id);
      const targetPlayer = _.find(this.players, {id: target});
      targetPlayer.takeDamage(spell.damage);
    });

    this.players.forEach(p => { //make bots ready
      if(!p.ws) {
        p.ready = true;
      }
    });

    this.pushStateUpdate();
  }

  toJSON() {
    return {
      started: this.started,
      players: this.players.map(_.method('toJSON')),
    };
  }
}
