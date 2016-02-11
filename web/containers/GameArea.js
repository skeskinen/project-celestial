import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import InlineSVG from 'svg-inline-react';

import * as gameActions from '../actions/game';
import { PlayerInfo, BottomBar } from '../components';

class GameArea extends Component {
  render() {
    const {game} = this.props;
    const {players} = game;
    const playerInfoStyle = {
      height: '10%',
      width: '20%',
      position: 'absolute',
    };
    return (
      <div>
        <div style={playerInfoStyle}><PlayerInfo player={players[0]} /></div>
        <div style={{...playerInfoStyle, top: '60%'}}><PlayerInfo player={players[1]} /></div>
      </div>
    );
  }
}

export default connect(({game}) => ({game}), {gameActions})(GameArea);
