import * as protocol from './protocol';
import * as Spell from './Spell';
import * as Effect from './Effect';
import * as Planet from './Planet';
import _ from 'lodash';

export default class Player {
  constructor() {
    this.mana = {
      blue: 5,
      red: 5,
    };
    this.hp = 20;
    this.shield = 3;
    this.planetBonuses = {

    };
    this.attribs = {
      speed: {
        blue: 0,
        red: 0,
      },
      defence: {
        blue: 0,
        red: 0,
      },
      spellPower: {
        blue: 0,
        red: 0,
      }
    };
    this.deckSize = 0;
    this.cards = [];
    this.skills = Spell.defaultSkills;
    this.ready = false;
    this.dead = false;
    this.orderNumber = undefined;
    this.prevTurnActingOrder = undefined;
  }

  toJSON(completeInfo, room) {
    var json =  {
      name: this.name,
      id: this.id,
      mana: this.mana,
      attribs: this.attribs,
      hp: this.hp,
      shield: this.shield,
      deckSize: this.deckSize,
      ready: this.ready,
      dead: this.dead,
      orderNumber: this.orderNumber,
    };
    if (completeInfo) {
      return {
        ...json,
        cards: _.map(this.cards, _.partial(Spell.toJSON, _, this, room)),
        skills: _.mapValues(this.skills, _.partial(_.mapValues, _, _.partial(Spell.toJSON, _, this, room))),
      };
    }
    return json;
  }

  start(i) {
    this.orderNumber = i;
    this.prevTurnActingOrder = i + 1;
  }

  speedCheck(color, room) {
    const speed = this.attribs.speed[color];
    const pls = Planet.playerPlanets(room, this);
    const firstPlanet = pls.length ? Planet.playerPlanets(room, this)[0].orderNumber : undefined;

    return Effect.calcPriority(speed, firstPlanet, this.prevTurnActingOrder);
  }

  takeDamage(obj, room) {
    var s = (a) => a ? a : 0;
    var r = (a, b) => a ? Math.max(a - b, 0) : 0;
    const { blue, red } = obj;
    const { blue: blueD, red: redD  } = this.attribs.defence;
    var total = s(blue) + s(red);
    const final = r(blue, blueD) + r(red, redD);
    room.sendLogLine(`${total} points of damage, ${final} after reductions`);
    if (this.shield < total) {
      this.hp -= total - this.shield;
      this.shield = 0;
    } else {
      this.shield -= total;
    }
    if(this.hp <= 0) {
      this.dead = true;
      room.sendLogLine(`${this.name} died!`);
    }
  }

  modShield(i) {
    this.shield += i;
    const s = this.shield;
    this.shield = s > 5 ? 5 : (s < 0 ? 0 : s);
  }

  paySpell(obj) {
    var s = (a) => a ? a : 0;
    const { blue, red } = obj;
    this.mana.blue -= s(blue);
    this.mana.red -= s(red);

    const m = (v) => (v > 10 ? 10 : v);

    this.mana.blue = m(this.mana.blue);
    this.mana.red = m(this.mana.red);
  }

  checkMana(obj) {
    var s = (a) => a ? a : 0;
    const { blue, red } = obj;
    return this.mana.blue - s(blue) >= 0 && this.mana.red - s(red) >= 0;
  }
}

export function fromSocketNameId(ws, name, id) {
  var p = new Player();
  p.ws = ws;
  p.name = name;
  p.id = id;
  return p;
}

export function dummy(i) {
  var p = new Player();
  p.name = 'Dummy ' + i;
  p.id = global.clientIdCounter++;
  return p;
}
