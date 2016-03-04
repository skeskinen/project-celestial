import {SpellDesc, Buff} from './base';

class BlueRegenBuff extends Buff {
  constructor(mage) {
    super(mage);
    this.duration = 3;
  }

  clone(mage) {
    var b = new BlueRegenBuff(mage);
    b.duration = this.duration;
    return b;
  }

  onUp() {
    this.mage.speed.blue += 2;
  }

  onDown() {
    this.mage.speed.blue -= 2;
  }
}

class BlueRegen extends SpellDesc {
  constructor() {
    super();
    this.id = 'regen.blue';
  }

  hasEnoughMana() {
    return true;
  }

  speed(world, mage) {
    return mage.speed.blue;
  }

  onPaySpell(world, mage) {
    const manaGained = Math.ceil(2 + mage.spellPower.blue / 2);
    mage.gainMana(manaGained, 0);
  }

  onCast(world, mage) {
    mage.applyBuff(new BlueRegenBuff(mage));
  }
}

class RedRegenBuff extends Buff {
  constructor(mage) {
    super(mage);
    this.duration = 3;
  }

  clone(mage) {
    var b = new RedRegenBuff(mage);
    b.duration = this.duration;
    return b;
  }

  onUp() {
    this.mage.speed.red += 2;
  }

  onDown() {
    this.mage.speed.red -= 2;
  }
}

class RedRegen extends SpellDesc {
  constructor() {
    super();
    this.id = 'regen.red';
  }

  hasEnoughMana() {
    return true;
  }

  speed(world, mage) {
    return mage.speed.red;
  }

  onPaySpell(world, mage) {
    const manaGained = Math.ceil(2 + mage.spellPower.red / 2);
    mage.gainMana(0, manaGained);
  }

  onCast(world, mage) {
    mage.applyBuff(new RedRegenBuff(mage));
  }
}

export const blueRegen = new BlueRegen();
export const redRegen = new RedRegen();
