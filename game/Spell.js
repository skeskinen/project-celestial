import * as protocol from './protocol';
import _ from 'lodash';

const defaultMkEffects = function(spell) {
  return (room, info) => {
    var ef = room.turnEffects(0);
    ef.push([spell.effect, room, info]);
  };
};

function mkMissile(type) {
  var missile = {
    cost: {[type]: 1},
    damage: {[type]: 1},
    target: protocol.TARGET_ENEMY,
    name: 'Magic missile',
    description: 'Basic damage spell',
  };
  missile.effect = (room, info) => {
    const targetPlayer = _.find(room.players, {id: info.target});
    targetPlayer.takeDamage(missile.damage);
    info.player.paySpell(missile.cost);
    room.sendLogLine(`${info.player.name} hit ${targetPlayer.name} with magic missile`);
  };
  missile.mkEffects = defaultMkEffects(missile);
  return missile;
}

function mkRegen(type) {
  var regen = {
    cost: {[type]: -1},
    damage: {},
    target: protocol.TARGET_NONE,
    name: 'Mana regen',
    description: 'Gain mana this turn',
  };
  regen.effect = (room, info) => {
    info.player.paySpell(regen.cost);
    room.sendLogLine(`${info.player.name} used mana regen`);
  };
  regen.mkEffects = defaultMkEffects(regen);
  return regen;
}

export const defaultSkills = {
  missile: {
    red: mkMissile('red'),
    blue: mkMissile('blue'),
  },
  regen: {
    red: mkRegen('red'),
    blue: mkRegen('blue'),
  }
};

export function toJSON(spell) {
  return {
    cost: spell.cost,
    damage: spell.damage,
    target: spell.target,
    name: spell.name,
    description: spell.description,
  };
}
