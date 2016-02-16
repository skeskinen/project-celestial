import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';

import InlineSVG from 'svg-inline-react';

@connect(({theme}) => ({theme}), {})
@Radium
export default class NumberIcon extends Component {
  render() {
    const {icon, value, iconColor, textColor, theme} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.greyStr,
      border: '1px',
      borderRadius: 4,
      color: textColor(value),
      textAlign: 'center',
    };
    const iconStyle = {
    };

    return (
      <div style={containerStyle}>
        {styles.wrap(50, 100, 0, 0, <span>{value}</span>)}
        {styles.wrap(50, 100, 50, 0, <InlineSVG style={{...iconStyle, fill: iconColor(value)}} src={icon}/>)}
      </div>
    );
  }
}
