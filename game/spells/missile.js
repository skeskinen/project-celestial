import {SpellDesc, TARGET_ENEMY} from './base';

import _ from 'lodash';

class BlueMissile extends SpellDesc {
  constructor() {
    super();
    this.targetType = TARGET_ENEMY;
    this.blueCost = 3;
    this.id = 'missile.blue';
  }

  speed(world, mage) {
    return mage.speed.blue;
  }

  onCast(world, mage, targetId) {
    const targetMage = _.find(world.mages, {id: targetId});
    const damage = 2 + mage.spellPower.blue;
    targetMage.takeDamage(damage, 0);
  }
}

class RedMissile extends SpellDesc {
  constructor() {
    super();
    this.targetType = TARGET_ENEMY;
    this.redCost = 3;
    this.id = 'missile.red';
  }

  speed(world, mage) {
    return mage.speed.red;
  }

  onCast(world, mage, targetId) {
    const targetMage = _.find(world.mages, {id: targetId});
    const damage = 2 + mage.spellPower.red;
    targetMage.takeDamage(0, damage);
  }
}


export const blueMissile = new BlueMissile();
export const redMissile = new RedMissile();
