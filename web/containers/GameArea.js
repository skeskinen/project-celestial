import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as gameActions from '../actions/game';
import { PlayerInfo, BottomBar, RoundIcon } from '../components';
import { wrap, wrapEm } from '../styles';
import * as theme from '../theme';

import missileIcon from '../assets/magic-missile.svg';

class GameArea extends Component {
  render() {
    const {game} = this.props;
    const {players} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);

    const skillIcon = _.partial(wrapEm, 3.6, 3.6, _, 87);

    return (
      <div>
        {wrap(100, 20, 0, 85, <BottomBar />)}
        {playerInfoSize(5, 10, <PlayerInfo player={players[0]} />)}
        {playerInfoSize(20, 86, <PlayerInfo player={players[1]}/>)}
        {skillIcon(50, <RoundIcon icon={missileIcon} iconColor={theme.purple.rgbaString()}/>)}
      </div>
    );
  }
}

export default connect(({game}) => ({game}), {gameActions})(GameArea);
