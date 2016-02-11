import React, { Component, PropTypes } from 'react';

export default class GameLobby extends Component {
  render() {
    const {game, startGame} = this.props;
    return (
      <div>
        Players:
        <br/>
        {
          game.players ? game.players.map((p) =>
            <div key={p.id}>
              {p.name}
              <br/>
            </div>
          ) : null
        }
        <button onClick={startGame}>Start game</button>
      </div>
    );
  }
}
