import * as protocol from './protocol';
import _ from 'lodash';
import * as Effect from './Effect';
import * as util from './util';

function manaCostFail(p, room) {
  room.sendLogLine(`${p.name}: not enough mana!`);
}

function mkMissile(color) {
  var missile = {
    targetType: protocol.TARGET_ENEMY,
    name: 'Magic missile',
    description: 'Basic damage spell',
    infoFn: (player, _room) => ({
      cost: {[color]: 3},
      damage: {[color]: 1 + player.attribs.spellPower[color]},
    }),
  };
  const main = (room, info) => {
    const p = info.player;
    return [() => {
      const p = info.player;
      const { cost, damage } = missile.infoFn(p, room);
      room.sendLogLine(`${p.name} casts ${missile.name} (${color})`);
      if (info.player.checkMana(cost)) {
        const targetPlayer = _.find(room.players, {id: info.target});
        room.sendLogLine(`${p.name} hit ${targetPlayer.name} with missile`);
        targetPlayer.takeDamage(damage, room);
        p.paySpell(cost);
      } else
        manaCostFail(p, room);
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
    targetType: protocol.TARGET_NONE,
    name: 'Mana regen',
    description: 'Gain mana this turn',
    infoFn: (player, _room) => ({
      cost: {
        [color]: Math.ceil(-2 - player.attribs.spellPower[color] / 2)
      },
      buff: {
        duration: 3,
        attribs: {
          speed: {
            [color]: 5,
          },
        }
      }
    }),
  };

  const main = (room, info) => {
    const p = info.player;
    return [() => {
      const { cost, buff } = regen.infoFn(p, room);
      room.sendLogLine(`${p.name} casts ${regen.name} (${color})`);
      p.paySpell(cost);
      room.sendLogLine(`${p.name} gained speed buff`);
      p.attribs = util.deepSum(p.attribs, buff.attribs);
      room.turnEffects(buff.duration - 1).push(Effect.buffExpire(buffExpire(room, info)));
    }, () => p.speedCheck(color, room)
    ];
  };
  const buffExpire = (room, info) => {
    const p = info.player;
    const { buff } = regen.infoFn(p, room);
    return () => {
      room.sendLogLine(`${p.name} lost speed buff`);
      p.attribs = util.deepSubstraction(p.attribs, buff.attribs);
    };
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
    targetType: protocol.TARGET_NONE,
    name: 'Spell ward',
    description: 'Basic defensive spell',
    infoFn: (player, _room) => ({
      cost: {
        [color]: 1
      },
      buff: {
        duration: 2,
        attribs: {
          defence: {
            [color]: Math.floor(1 + player.attribs.spellPower[color] / 2),
          },
        },
      },
      shield: 1,
    }),
  };
  const main = (room, info) => {
    const p = info.player;
    return [() => {
      const { cost, buff, shield } = ward.infoFn(p, room);
      room.sendLogLine(`${p.name} casts ${ward.name} (${color})`);
      if (info.player.checkMana(cost)) {
        p.paySpell(cost);
        room.sendLogLine(`${p.name} gained defence buff`);
        p.attribs = util.deepSum(p.attribs, buff.attribs);
        room.sendLogLine(`${p.name} gained ${shield} point${shield === 1 ? '' : 's'} of shield`);
        p.modShield(shield);
        room.turnEffects(buff.duration - 1).push(Effect.buffExpire(buffExpire(room, info)));
      } else
        manaCostFail(p, room);
    }, () => p.speedCheck(color, room)
    ];
  };
  const buffExpire = (room, info) => {
    const p = info.player;
    const { buff } = ward.infoFn(p, room);
    return () => {
      room.sendLogLine(`${p.name} lost defence buff`);
      p.attribs = util.deepSubstraction(p.attribs, buff.attribs);
    };
  };
  ward.mkEffects = (room, info) => {
    room.turnEffects(0).push(Effect.spell(main(room, info), info.player));
  };
  return ward;
}

export const pass = {
  mkEffects: (room, info) => {
    const p = info.player;
    room.turnEffects(0).push(Effect.spell([() => {
      room.sendLogLine(`${p.name} passes`);
    }, () => Effect.constantSpeed(10)
    ], info.player));
  },
  infoFn: () => ({}),
};

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

export function toJSON(spell, player, room) {
  return {
    info: spell.infoFn(player, room),
    targetType: spell.targetType,
    name: spell.name,
    description: spell.description,
  };
}
