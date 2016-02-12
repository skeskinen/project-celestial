import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import * as theme from '../theme';


import InlineSVG from 'svg-inline-react';

@Radium
export default class NumberIcon extends Component {
  render() {
    const {icon, iconColor} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.grey.rgbaString(),
      borderRadius: '50%',
      textAlign: 'center',
    };
    const iconStyle = {
    };

    return (
      <div style={containerStyle}>
        {styles.wrap(76, 76, 12, 12, <InlineSVG style={{...iconStyle, fill: iconColor}} src={icon}/>)}
      </div>
    );
  }
}
