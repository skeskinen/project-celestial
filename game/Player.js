import * as protocol from './protocol';
import * as Spell from './Spell';
import _ from 'lodash';

export default class Player {
  constructor() {
    this.mana = {
      red: 10,
      blue: 10,
      yellow: 10,
    };
    this.hp = 10;
    this.shield = 3;
    this.deckSize = 0;
    this.cards = [];
    this.skills = Spell.defaultSkills;
    this.ready = false;
  }

  toJSON() {
    return {
      name: this.name,
      id: this.id,
      mana: this.mana,
      hp: this.hp,
      shield: this.shield,
      deckSize: this.deckSize,
      cards: _.map(this.cards, Spell.toJSON),
      skills: _.mapValues(this.skills, _.partial(_.mapValues, _, Spell.toJSON)),
      ready: this.ready,
    };
  }

  start() {
  }

  takeDamage(obj) {
    var s = (a) => a ? a : 0;
    const { blue, red, yellow } = obj;
    const total = s(blue) + s(red) + s(yellow);
    if (this.shield < total) {
      this.hp -= total - this.shield;
      this.shield = 0;
    } else {
      this.shield -= total;
    }
  }

  paySpell(obj) {
    var s = (a) => a ? a : 0;
    const { blue, red, yellow } = obj;
    this.mana.blue -= s(blue);
    this.mana.red -= s(red);
    this.mana.yellow -= s(yellow);
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
