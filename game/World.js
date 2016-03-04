//import * as Planet from './Planet';
import Mage from './Mage';

import _ from 'lodash';

export default class World {
  constructor() {
    this.currentTurn = 1;
    //this.planets = [];
    this.mages = [];
    this.livingMages = [];
    this.ended = false;
    this.winner = 0;
  }

  start(controllers) {
    //this.planets = Planet.mkPlanets(this);

    controllers.forEach(c => {
      var mage = new Mage(this, c);
      this.mages.push(mage);
      this.livingMages.push(mage);
      c.mage = mage;
    });
  }

  clone() {
    var w = new World();
    w.currentTurn = this.currentTurn;
    w.mages = this.mages.map(_.method('clone'));
    w.livingMages = _.filter(w.mages, m => !m.dead);
    w.ended = this.ended;
    w.winner = this.winner;
    return w;
  }

  advanceTurn(castedSpells) {
    var step = new WorldStep(castedSpells);

    var groupedSpells = _.groupBy(castedSpells, s => s.spell.speed(this, s.mage));
    var speeds = _.keys(groupedSpells).sort((a, b) => b > a);

    var sortedSpells = [];
    for (var s of speeds) {
      var sameSpeedSpells = groupedSpells[s];
      var l = sameSpeedSpells.length;
      if (l > 1) {
        var permutedSpells = step.randomPermutation(sameSpeedSpells);
        sortedSpells = sortedSpells.concat(permutedSpells);
      } else {
        sortedSpells.push(sameSpeedSpells[0]);
      }
    }

    sortedSpells.forEach(s => {
      if (!s.mage.dead) {
        s.spell.onPaySpell(this, s.mage);
        s.spell.onCast(this, s.mage, s.target);
      }
    });
    var living = _.filter(this.mages, m => !m.dead);
    this.livingMages = living;
    if(living.length > 1) {
      living.forEach(m => {
        m.ready = false
        m.onTurnEnd();
      });
      this.currentTurn++;
    } else {
      this.ended = true;
      if (living.length === 1) {
        this.winner = living[0].id;
      } else {
        console.error('no winner!');
      }
    }

    return step;
  }

  isEveryoneReady() {
    return _.every(this.mages, {ready: true});
  }

  toJSON() {
    return {
      currentTurn: this.currentTurn,
      mages: this.mages.map(_.method('toJSON')),
    };
  }
}

function factorial(num)
{
  var rval = 1;
  for (var i = 2; i <= num; i++)
    rval = rval * i;
  return rval;
}

function kthPermutation(k, mod, xs) {
  var res = [];
  var l = xs.length;
  for(var i = 0; i < l; i++) {
    mod = mod / (l - i);
    var curIndex = k / mod;
    k = k % mod;
    res.push(xs[curIndex]);
    xs.splice(curIndex, 1);
  }
  return res;
}

class WorldStep {
  constructor(spells) {
    this.spells = spells;
    this.randoms = [];
  }
  randomPermutation(xs) {
    var l = xs.length;
    var permutationCount = factorial(l);
    var r = _.random(permutationCount - 1);

    this.randoms.push(r);

    return kthPermutation(r, permutationCount, xs);
  }
  hash() {
    const { spells, randoms } = this;
    const prime = 31;
    const mod = Math.pow(2, 25);
    var hc = spells.length * 2 + randoms.length;
    for(var i = 0; i < spells.length; i++) {
      hc = (hc * prime) % mod + spells[i].spell.hashId;
      hc = (hc * prime) % mod + spells[i].target;
    }
    for(var j = 0; j < randoms.length; j++) {
      hc = (hc * prime) % mod + randoms[j];
    }
    return hc;
  }
}
