import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import * as theme from '../theme';
import Radium from 'radium';

@Radium
export default class BottomBar extends Component {
  render() {
    //const {player} = this.props;

    const style = {
      ...styles.gameComponent,
      background: theme.bottomBarGrey,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      padding: '1.5em'
    };

    return (
      <div style={style}>
      </div>
    );
  }
}
