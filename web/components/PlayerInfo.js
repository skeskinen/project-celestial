import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default class PlayerInfo extends Component {
  render() {
    const {player} = this.props;

    const containerStyle = {
      height: '100%',
      width: '100%',
      background: 'blue',
      border: '2px',
      borderRadius: 4,
      color: 'white',
      padding: '1.5em'
    };

    return (
      <div style={containerStyle}>
        { player.name }
      </div>
    );
  }
}
