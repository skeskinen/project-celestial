import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';

@connect(({theme}) => ({theme}), {})
@Radium
export default class BottomBar extends Component {
  render() {
    const {theme} = this.props;

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
