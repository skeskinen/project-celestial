import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import * as theme from '../theme';


import InlineSVG from 'svg-inline-react';

@Radium
export default class NumberIcon extends Component {
  render() {
    const {icon, value, iconColor, textColor} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.grey.rgbaString(),
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
