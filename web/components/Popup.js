import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

import * as styles from '../styles';

@Radium
class Popup extends Component {
  constructor() {
    super();

    this.onClick = ::this.onClick;
  }

  onClick(e) {
    e.stopPropagation();
  }

  render() {
    const {ui, theme} = this.props;

    const {popupVisible: visible, popupX: x, popupY: y, popupW: w, popupH: h, popupContent: content} = ui;

    const style = {
      ...styles.gameComponent,
      background: theme.black,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      left: `${x}%`,
      top: `${y}%`,
      width: `${w}%`,
      height: `${h}%`,

      display: visible ? 'block' : 'none',
    };

    return (
      <div onClick={this.onClick} style={style}>
        { content }
      </div>
     );
  }
}

export default connect(
  ({ui, theme}) => ({ui, theme}),
  {},
)(Popup);
