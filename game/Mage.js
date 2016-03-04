import { defaultSkills } from './spells';

import _ from 'lodash';

export default class Mage {
  constructor(world, controller) {
    this.controller = controller;
    this.id = controller.id;
    this.world = world;
    this.shield = 0;
    this.mana = {
      blue: 5,
      red: 5,
    };
    // this.speed = {
    //   blue: 0,
    //   red: 0,
    // };
    // this.defence = {
    //   blue: 0,
    //   red: 0,
    // };
    // this.spellPower = {
    //   blue: 0,
    //   red: 0,
    // };

    this.hp = 2;
    this.speed = {
      blue: _.sample(_.range(1, 2)),
      red: _.sample(_.range(0, 1)),
    };
    this.defence = {
      blue: _.sample(_.range(1, 2)),
      red: _.sample(_.range(0, 1)),
    };
    this.spellPower = {
      blue: _.sample(_.range(1, 2)),
      red: _.sample(_.range(0, 1)),
    };
    // this.hp = 5;
    // this.speed = {
    //   blue: _.sample(_.range(0, 3)),
    //   red: _.sample(_.range(0, 3)),
    // };
    // this.defence = {
    //   blue: _.sample(_.range(0, 3)),
    //   red: _.sample(_.range(0, 3)),
    // };
    // this.spellPower = {
    //   blue: _.sample(_.range(0, 3)),
    //   red: _.sample(_.range(0, 3)),
    // };
    this.skills = defaultSkills;
    this.ready = false;
    this.dead = false;
    this.buffs = [];
  }

  clone(world) {
    var m = new Mage(world, this.controller);
    m.id = this.id;
    m.hp = this.hp;
    m.shield = this.shield;
    m.mana = _.clone(this.mana);
    m.speed = _.clone(this.speed);
    m.defence = _.clone(this.defence);
    m.spellPower = _.clone(this.spellPower);
    m.ready = this.ready;
    m.dead = this.dead;
    m.buffs = this.buffs.map(_.method('clone', m));
    m.skills = this.skills;

    return m;
  }

  toJSON() {
    var json =  {
      name: this.controller.name,
      id: this.id,
      hp: this.hp,
      shield: this.shield,
      mana: this.mana,
      speed: this.speed,
      defence: this.defence,
      spellPower: this.spellPower,
      ready: this.ready,
      dead: this.dead,
      skills: this.skills.map(_.property('id')),
    };
    return json;
  }

  takeDamage(blue, red) {
    var r = (a, b) => a ? Math.max(a - b, 0) : 0;
    const { blue: blueD, red: redD  } = this.defence;
    const total = r(blue, blueD) + r(red, redD);
    if (this.shield < total) {
      this.hp -= total - this.shield;
      this.shield = 0;
    } else {
      this.shield -= total;
    }
    if(this.hp <= 0) {
      this.dead = true;
    }
  }

  modShield(i) {
    this.shield += i;
    const s = this.shield;
    this.shield = s > 5 ? 5 : (s < 0 ? 0 : s);
  }

  paySpell(blue, red) {
    this.mana.blue -= blue;
    this.mana.red -= red;
  }

  gainMana(blue, red) {
    const m = (v) => (v > 10 ? 10 : v);
    this.mana.blue = m(this.mana.blue + blue);
    this.mana.red = m(this.mana.red + red);
  }

  hasMana(blue, red) {
    return this.mana.blue - blue >= 0 && this.mana.red - red >= 0;
  }

  applyBuff(buff) {
    this.buffs.push(buff);
    buff.onUp();
  }

  onTurnEnd() {
    var newBuffs = _.filter(this.buffs, _.method('tickDown'));
    this.buffs = newBuffs;
  }
}
