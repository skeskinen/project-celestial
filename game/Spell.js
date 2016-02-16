import * as protocol from './protocol';
import _ from 'lodash';
import * as Effect from './Effect';

function mkMissile(color) {
  var missile = {
    cost: {[color]: 1},
    damage: {[color]: 1},
    target: protocol.TARGET_ENEMY,
    name: 'Magic missile',
    description: 'Basic damage spell',
  };
  const main = (room, info) => {
    const p = info.player;
    return [() => {
      if (info.player.checkMana(missile.cost)) {
        const p = info.player;
        const targetPlayer = _.find(room.players, {id: info.target});
        targetPlayer.takeDamage(missile.damage, room);
        p.paySpell(missile.cost);
        room.sendLogLine(`${p.name} hit ${targetPlayer.name} with missile (${color})`);
      }
    }, () => p.speedCheck(color, room)
    ];
  };
  missile.mkEffects = (room, info) => {
    room.turnEffects(0).push(Effect.spell(main(room, info), info.player));
  };
  return missile;
}

function mkRegen(color) {
  var regen = {
    cost: {[color]: -1},
    damage: {},
    target: protocol.TARGET_NONE,
    name: 'Mana regen',
    description: 'Gain mana this turn',
  };

  const main = (room, info) => {
    const p = info.player;
    return [() => {
      if (info.player.checkMana(regen.cost)) {
        p.paySpell(regen.cost);
        room.sendLogLine(`${p.name} used mana regen (${color})`);
        room.sendLogLine(`${p.name} gained speed buff (2 turns)`);
        p.speed[color] += 3;
        room.turnEffects(2).push(Effect.buffExpire(buffExpire(room, info)));
      }
    }, () => p.speedCheck(color, room)
    ];
  };
  const buffExpire = (room, info) => () => {
    const p = info.player;
    room.sendLogLine(`${p.name} lost speed buff`);
    p.speed[color] -= 3;
  };
  regen.mkEffects = (room, info) => {
    room.turnEffects(0).push(Effect.spell(main(room, info), info.player));
  };
  return regen;
}

function mkWard(color) {
  var ward = {
    cost: {[color]: 1},
    damage: {},
    target: protocol.TARGET_NONE,
    name: 'Spell ward',
    description: 'Basic defensive spell',
  };
  const main = (room, info) => {
    const p = info.player;
    return [() => {
      if (info.player.checkMana(ward.cost)) {
        p.paySpell(ward.cost);
        room.sendLogLine(`${p.name} used spell ward (${color})`);
        room.sendLogLine(`${p.name} gained defence buff (2 turns)`);
        p.defence[color] += 1;
        p.modShield(1);
        room.turnEffects(2).push(Effect.buffExpire(buffExpire(room, info)));
      }
    }, () => p.speedCheck(color, room)
    ];
  };
  const buffExpire = (room, info) => () => {
    const p = info.player;
    room.sendLogLine(`${p.name} lost defence buff`);
    p.defence[color] -= 1;
  };
  ward.mkEffects = (room, info) => {
    room.turnEffects(0).push(Effect.spell(main(room, info), info.player));
  };
  return ward;
}

export const defaultSkills = {
  missile: {
    red: mkMissile('red'),
    blue: mkMissile('blue'),
  },
  regen: {
    red: mkRegen('red'),
    blue: mkRegen('blue'),
  },
  ward: {
    red: mkWard('red'),
    blue: mkWard('blue'),
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
