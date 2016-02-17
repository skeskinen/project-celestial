import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

@connect(({theme}) => ({theme}), {})
@Radium
export default class GameLobby extends Component {
  render() {
    const {game, startGame, theme} = this.props;
    return (
      <div style={{color: theme.textLight}}>
        Players:
        <br/>
        {
          game.players ? game.players.map((p) =>
            <div key={p.id}>
              <ul>
                <li>
                  {p.name}
                </li>
              </ul>
              <br/>
            </div>
          ) : null
        }
        <button onClick={startGame}>Start game</button>
      </div>
    );
  }
}
