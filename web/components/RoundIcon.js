import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';

import InlineSVG from 'svg-inline-react';

@connect(({theme}) => ({theme}), {})
@Radium
export default class RoundIcon extends Component {
  render() {
    const {icon, iconColor, onClick, theme} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.black,
      borderSize: '1px',
      borderStyle: 'solid',
      borderRadius: '50%',
      textAlign: 'center',
    };
    const iconStyle = {
    };

    return (
      <div style={containerStyle} onClick={onClick}>
        {styles.wrap(76, 76, 12, 12, <InlineSVG style={{...iconStyle, fill: iconColor}} src={icon}/>)}
      </div>
    );
  }
}
