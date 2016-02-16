import * as protocol from './protocol';
import * as Spell from './Spell';
import _ from 'lodash';

export default class Player {
  constructor() {
    this.mana = {
      blue: 1,
      red: 1,
    };
    this.speed = {
      blue: 0,
      red: 0,
    };
    this.defence = {
      blue: 0,
      red: 0,
    };
    this.hp = 2;
    this.shield = 3;
    this.planetBonuses = {

    };
    this.deckSize = 0;
    this.cards = [];
    this.skills = Spell.defaultSkills;
    this.ready = false;
    this.dead = false;
    this.orderNumber = undefined;
    this.prevTurnActingOrder = undefined;
  }

  toJSON() {
    return {
      name: this.name,
      id: this.id,
      mana: this.mana,
      speed: this.speed,
      defence: this.defence,
      hp: this.hp,
      shield: this.shield,
      deckSize: this.deckSize,
      cards: _.map(this.cards, Spell.toJSON),
      skills: _.mapValues(this.skills, _.partial(_.mapValues, _, Spell.toJSON)),
      ready: this.ready,
      dead: this.dead,
      orderNumber: this.orderNumber,
    };
  }

  start(i) {
    this.orderNumber = i;
    this.prevTurnActingOrder = i + 1;
  }

  speedCheck(color, room) {
    const speedFactor = this.speed[color] * 10000;
    const pls = room.playerPlanets(this);
    const maxPlanets = 100;
    const planetsFactor = pls.length ? (maxPlanets - pls[0].orderNumber) * 10 : 0;
    const maxPlayers = 15;
    const prevTurnFactor = maxPlayers - this.prevTurnActingOrder;
    const final = speedFactor + planetsFactor + prevTurnFactor;
    return final;
  }

  takeDamage(obj, room) {
    var s = (a, b) => a ? Math.max(a - b, 0) : 0;
    const { blue, red } = obj;
    const { blue: blueD, red: redD  } = this.defence;
    const total = s(blue, blueD) + s(red, redD);
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
    this.shield = s > 20 ? 20 : (s < 0 ? 0 : s);
  }

  paySpell(obj) {
    var s = (a) => a ? a : 0;
    const { blue, red } = obj;
    this.mana.blue -= s(blue);
    this.mana.red -= s(red);
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

export function dummy() {
  var p = new Player();
  p.name = 'Dummy';
  p.id = global.clientIdCounter++;
  p.ready = true;
  return p;
}
