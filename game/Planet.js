import _ from 'lodash';

import { deepSum, deepSubstraction } from './util';

export function calcPlanetBonuses(room) {
  room.players.forEach(p => {
    const prev = p.planetBonuses;

    p.attribs = deepSubstraction(p.attribs, prev);

    const planets = playerPlanets(room, p);
    var newBonus = _.reduce(planets, (acc, pl) => deepSum(acc, pl.bonus), {});

    p.attribs = deepSum(p.attribs, newBonus);
    p.planetBonuses = newBonus;
  });
}

export function mkPlanets(room) {
  const nPlayers = room.players.length;
  return [closePlanet, closePlanet, closePlanet,
    midPlanet, midPlanet, midPlanet,
    outerPlanet, outerPlanet].map((p, i) => p(nPlayers, i));
}

function genName() {
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${_.sample(possible)}${_.sample(possible).toLowerCase()} ${Math.floor(Math.random() * 99)}`;
}

const closeTypes = [
  {
    type: 'red.ca',
    bonus: {
      speed: {red: 2},
    },
  },
  {
    type: 'blue.ca',
    bonus: {
      speed: {blue: 2},
    },
  },
];
function closePlanet(n, i) {
  const speedMult = _.sample(_.range(1, 3));
  const speed = n * speedMult;
  const type = _.sample(closeTypes);
  return {
    ...type,
    phase: _.sample(_.range(0, speed)),
    speed,
    name: genName(),
    orderNumber: i,
  };
}

const midTypes = [
  {
    type: 'red.ma',
    bonus: {
      speed: {red: 1},
      spellPower: {red: 1},
      defence: {red: 1},
    },
  },
  {
    type: 'blue.ma',
    bonus: {
      speed: {blue: 1},
      spellPower: {blue: 1},
      defence: {blue: 1},
    },
  },
  {
    type: 'brown.ma',
    bonus: {
      defence: {
        blue: 2,
        red: 2,
      },
    },
  },
];
function midPlanet(n, i) {
  const speedMult = _.sample(_.range(2, 6));
  const speed = n * speedMult;
  const type = _.sample(midTypes);
  return {
    ...type,
    phase: _.sample(_.range(0, speed)),
    speed,
    name: genName(),
    orderNumber: i,
  };
}

const outerTypes = [
  {
    type: 'red.oa',
    bonus: {
      speed: {red: 2},
      spellPower: {red: 2},
    },
  },
  {
    type: 'blue.oa',
    bonus: {
      speed: {blue: 2},
      spellPower: {blue: 2},
    },
  },
];
function outerPlanet(n, i) {
  const speedMult = _.sample(_.range(4, 8));
  const speed = n * speedMult;
  const type = _.sample(outerTypes);
  return {
    ...type,
    phase: _.sample(_.range(0, speed)),
    speed,
    name: genName(),
    orderNumber: i,
  };

}

export function movePlanets(room) {
  room.planets.forEach(p => {
    p.phase += 1;
    if (p.phase >= p.speed)
      p.phase -= p.speed;
  });
}

export function playerPlanets(room, p) {
  const ppos = p.orderNumber;
  const pAmount = room.players.length;
  return _.filter(room.planets, (pl) => {
    return Math.floor(pl.phase / pl.speed * pAmount) === ppos;
  });
}
