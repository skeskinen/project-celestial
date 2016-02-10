import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

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
        <Button onClick={startGame}>Start game</Button>
      </div>
    );
  }
}
