import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as gameActions from '../actions/game';
import { PlayerInfo, BottomBar } from '../components';
import { wrap } from '../styles';

class GameArea extends Component {
  render() {
    const {game} = this.props;
    const {players} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);

    return (
      <div>
        {wrap(100, 20, 0, 85, <BottomBar />)}
        {playerInfoSize(5, 10, <PlayerInfo player={players[0]} />)}
        {playerInfoSize(20, 86, <PlayerInfo player={players[1]}/>)}
      </div>
    );
  }
}

export default connect(({game}) => ({game}), {gameActions})(GameArea);
