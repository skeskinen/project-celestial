import _ from 'lodash';

export const TARGET_ENEMY = 'TARGET_ENEMY';
export const TARGET_PLAYER = 'TARGET_PLAYER';
export const TARGET_NONE = 'TARGET_NONE';

var spellCounter = 0;

export class SpellDesc {
  constructor() {
    this.targetType = TARGET_NONE;
    this.blueCost = 0;
    this.redCost = 0;
    this.id = '';
    this.hashId = spellCounter++;
  }

  hasEnoughMana(world, mage) {
    return mage.hasMana(this.blueCost, this.redCost);
  }

  onPaySpell(world, mage) {
    mage.paySpell(this.blueCost, this.redCost);
  }

  onCast(world, mage, targetId) {
  }

  speed(world, mage) {
    return 0;
  }

  possibleTargets(world, mage) {
    if (!this.hasEnoughMana(world, mage))
      return [];
    switch (this.targetType) {
      case TARGET_NONE:
        return [0];
      case TARGET_ENEMY:
        const targets = _.filter(world.livingMages.map(m => m.id), id => id !== mage.id);
        return targets;
    }
  }
}

export class Buff {
  constructor(mage) {
    this.duration = 1;
    this.mage = mage;
  }

  clone(mage) {
  }

  onUp() {
  }

  onDown() {
  }

  tickDown() {
    if(--this.duration)
      return true;
    else {
      this.onDown();
      return false;
    }
  }
}
