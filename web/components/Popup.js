import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {connectMultireducer} from 'multireducer';
import { connect } from 'react-redux';

import * as styles from '../styles';
import * as popupActionsRaw from '../actions/popup';

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
    const {children, popup, x, y, w, h, theme, bgColor} = this.props;

    const style = {
      ...styles.gameComponent,
      background: bgColor ? bgColor : theme.grey,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      left: `${x}%`,
      top: `${y}%`,
      width: `${w}%`,
      height: `${h}%`,

      display: popup.visible ? 'block' : 'none',
    };

    return (
      <div onClick={this.onClick} style={style}>
        { children }
      </div>
     );
  }
}

const mapStateToProps = (key, state) => ({ popup: state.popups[key], theme: state.theme });

const mapDispatchToProps = popupActionsRaw;

export default connectMultireducer(
  mapStateToProps,
  mapDispatchToProps
)(Popup);
