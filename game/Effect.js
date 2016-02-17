import _ from 'lodash';

export default class Effect {
  constructor(fn, priority, player) {
    this.effect = fn;
    this.priority = priority;
    this.owningPlayer = player;
  }
}

export const speedMult = 10000;
const maxPlanets = 100;
const maxPlayers = 15;

export function calcPriority(speed, closestPlanet, lastTurnOrder) {
  const speedFactor = speed * speedMult;
  const planetsFactor = closestPlanet !== undefined ? (maxPlanets - closestPlanet) * 10 : 0;
  const prevTurnFactor = lastTurnOrder !== undefined ? maxPlayers - lastTurnOrder : 0;
  return speedFactor + planetsFactor + prevTurnFactor;
}

export function constantSpeed(speed) {
  return calcPriority(speed);
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
