import * as protocol from './protocol';

function mkMissile(type) {
  return {
    cost: {[type]: 1},
    damage: {[type]: 1},
    target: protocol.TARGET_PLAYER,
    name: 'Magic missile',
    description: 'Basic damage spell',
  };
}

export const defaultSkills = {
  missile: {
    red: mkMissile('red'),
    blue: mkMissile('blue'),
    yellow: mkMissile('yellow'),
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
