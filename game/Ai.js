import names from './names';

import _ from 'lodash';
import { inspect } from 'util';

global.aiIdCounter = 10000000;

var explorationBias = 2.0;
var rolloutMaxTurns = 100;
var steps = 5000;

export default class Ai {
  constructor(room) {
    this.id = global.aiIdCounter++;
    this.name = names() + ' Bot';

    this.room = room;
    this.world = room.world;
    this.mage = null;
  }

  makeMove() {
    var root = new MctsNode(this.world);
    for(var i = 0; i < steps; i++) {
      root.step(this.world.clone());
    }
    var chosenSpell = root.findBestMove(this.world, this.mage);
    console.log(this.mage.controller.name + ' chose ' + chosenSpell.spell.id);

    // console.log('world post choice', this.world.mages);


    this.mage.ready = true;
    const room = this.room;
    room.currentSpells.push(chosenSpell);
    // console.log(room.currentSpells);
    room.maybeAdvanceTurn();
  }
}

function allMoves(world, mage) {
  return _.flatten(
    mage.skills.map(s => {
      var targets = s.possibleTargets(world, mage);
      return targets.map(t => ({spell: s, target: t}));
    })
  );
}

function ucbFormula(reward, visits, parentVisits) {
  if(visits === 0) return Infinity;
  var ev = reward / visits;
  var explore = explorationBias * Math.sqrt(Math.log(parentVisits) / visits);
  // console.log('ev', ev, 'explore', explore);
  return ev + explore;
}

class MctsNode {
  constructor(world) {
    this.totalVisits = 0;
    var mages = world.livingMages;
    var moves = this.moves = mages.map(mage => allMoves(world, mage));

    this.rewards = moves.map(magesMoves => magesMoves.map(_.constant(0)));
    this.visits = moves.map(magesMoves => magesMoves.map(_.constant(0)));

    this.children = {};
  }

  findBestMove(world, aiMage) {
    // console.log(this.visits);
    // console.log(this.rewards);
    var mages = world.livingMages;
    for(var mageIndex = 0, magesLength = mages.length; mageIndex < magesLength; mageIndex++) {
      var mage = mages[mageIndex];
      if(mage.id === aiMage.id) {
        var visits = this.visits[mageIndex];
        var best = -Infinity;
        var bestIndex = -1;
        visits.forEach((n, moveIndex) => {
          var prettyWeight = Math.round(n / this.totalVisits * 1000) / 10.0;
          console.log(this.moves[mageIndex][moveIndex].spell.id + ' has weight of ' + prettyWeight);
          if (n > best) {
            best = n;
            bestIndex = moveIndex;
          }
        });
        return {...this.moves[mageIndex][bestIndex], mage: aiMage};
      }
    }
    console.error('find best move returned empty');
    return {};
  }

  step(world) {
    var mages = world.livingMages;
    if(world.ended) {
      return world.winner;
    }
    var winner;
    this.totalVisits++;
    var selectedMoves = this.select();
    var spells = selectedMoves.map((s, i) => ({...this.moves[i][s], mage: mages[i]}));
    var worldStep = world.advanceTurn(spells);
    var stepHash = worldStep.hash();
    var childNode = this.children[stepHash];
    if(childNode !== undefined) {
      winner = childNode.step(world);
    } else {
      var childMcts = new MctsNode(world);
      this.children[stepHash] = childMcts;
      winner = childMcts.rollout(world);
    }

    this.rewards.forEach((mageRewards, i) => {
      if (winner === mages[i].id) {
        mageRewards[selectedMoves[i]]++;
        // console.log(mages[i].controller.name + ' won simulation');
      }
    });
    this.visits.forEach((mageVisits, i) => {
      mageVisits[selectedMoves[i]]++;
    });

    return winner;
  }

  rollout(world) {
    var startingTurn = world.currentTurn;
    while (!world.ended) {
      if(world.currentTurn - startingTurn > rolloutMaxTurns) {
        // console.log('rollout max reached');
        // console.log(inspect(world, {depth: 3}));
        return _.last(_.sortBy(world.livingMages, m => m.hp + m.shield)).id;
      }
      var mages = world.livingMages;
      var moves = mages.map((mage, i) => {
        var randomMove = _.sample(this.moves[i]);
        return {...randomMove, mage};
      });
      world.advanceTurn(moves);
    }
    // console.log('simulation ended', world.winner);
    // console.log(inspect(world, {depth: 3}));
    return world.winner;
  }

  select() {
    const moves = this.moves;
    var selected = moves.map((magesMoves, mageIndex) => {
      var max = -Infinity;
      var maxIndex = -1;
      magesMoves.forEach((move, moveIndex) => {
        var reward = this.rewards[mageIndex][moveIndex];
        var visits = this.visits[mageIndex][moveIndex];
        var value = ucbFormula(reward, visits, this.totalVisits);
        if(value > max) {
          max = value;
          maxIndex = moveIndex;
        }
      });
      // console.log('selected node with ucb ' + max);
      return maxIndex;
    });
    //console.log(selected);
    return selected;
  }
}
