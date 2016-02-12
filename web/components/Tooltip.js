import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import * as theme from '../theme';
import Radium from 'radium';

@Radium
export default class BottomBar extends Component {
  constructor() {
    super();

    this.onClick = ::this.onClick;
  }

  onClick(e) {
    console.log('onclick');
    e.stopPropagation();
  }

  render() {
    const {children} = this.props;

    const style = {
      ...styles.gameComponent,
      background: theme.greyStr,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      padding: '1.5em'
    };

    return (
      <div onClick={this.onClick} style={style}>
        { children }
      </div>
    );
  }
}
