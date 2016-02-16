import _ from 'lodash';

export default class Effect {
  constructor(fn, priority, player) {
    this.effect = fn;
    this.priority = priority;
    this.owningPlayer = player;
  }
}

export function endOfTurn(fn) {
  return new Effect(fn, _.constant(0));
}

export function buffExpire(fn) {
  return new Effect(fn, _.constant(1));
}

export function spell(args, player) {
  return new Effect(args[0], args[1], player);
}
