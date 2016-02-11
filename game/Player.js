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
    };
  }

  start() {
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
  return p;
}
