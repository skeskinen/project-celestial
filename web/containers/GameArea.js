import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import InlineSVG from 'svg-inline-react';

import image from '../assets/icons/pinball-flipper.svg';
import * as gameActions from '../actions/game';
import PlayerInfo from '../components/PlayerInfo';

class GameArea extends Component {
  render() {
    const {game} = this.props;
    const playerInfoStyle = {
      height: '100px',
      width: '300px',
    };
    return (
      <div>
        { game.players.map(p => <div style={playerInfoStyle} key={p.id}><PlayerInfo player={p} /></div>) }
        <br/>
        {JSON.stringify(game)}
        <br/>
        {JSON.stringify(game)}
        <br/>
        {JSON.stringify(game)}
        <br/>
        {JSON.stringify(game)}
        <br/>
        {JSON.stringify(game)}
        <br/>
        {JSON.stringify(game)}
      </div>
    );
  }
}

export default connect(({game}) => ({game}), {gameActions})(GameArea);
