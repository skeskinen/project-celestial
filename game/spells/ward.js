import {SpellDesc, Buff} from './base';

class BlueWardBuff extends Buff {
  constructor(mage) {
    super(mage);
    this.duration = 3;
    this.givenDefence = Math.floor(1 + mage.spellPower.blue / 2);
  }

  clone(mage) {
    var b = new BlueWardBuff(mage);
    b.duration = this.duration;
    b.givenDefence = this.givenDefence;
    return b;
  }

  onUp() {
    this.mage.defence.blue += this.givenDefence;
  }

  onDown() {
    this.mage.defence.blue -= this.givenDefence;
  }
}

class BlueWard extends SpellDesc {
  constructor() {
    super();
    this.blueCost = 1;
    this.id = 'ward.blue';
  }

  speed(world, mage) {
    return mage.speed.blue;
  }

  onCast(world, mage) {
    mage.applyBuff(new BlueWardBuff(mage));
    mage.modShield(1);
  }
}

class RedWardBuff extends Buff {
  constructor(mage) {
    super(mage);
    this.duration = 3;
    this.givenDefence = Math.floor(1 + mage.spellPower.red / 2);
  }

  clone(mage) {
    var b = new RedWardBuff(mage);
    b.duration = this.duration;
    b.givenDefence = this.givenDefence;
    return b;
  }

  onUp() {
    this.mage.defence.red += this.givenDefence;
  }

  onDown() {
    this.mage.defence.red -= this.givenDefence;
  }
}

class RedWard extends SpellDesc {
  constructor() {
    super();
    this.redCost = 1;
    this.id = 'ward.red';
  }

  speed(world, mage) {
    return mage.speed.red;
  }

  onCast(world, mage) {
    mage.applyBuff(new RedWardBuff(mage));
    mage.modShield(1);
  }
}

export const blueWard = new BlueWard();
export const redWard = new RedWard();
