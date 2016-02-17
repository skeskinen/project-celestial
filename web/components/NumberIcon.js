import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';

import InlineSVG from 'svg-inline-react';

@connect(({theme}) => ({theme}), {})
@Radium
export default class NumberIcon extends Component {
  render() {
    const {icon, value, iconColor, textColor, theme, afterText} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.black,
      border: '1px',
      borderRadius: 4,
      color: textColor,
      textAlign: 'center',
    };
    const iconStyle = {
    };

    return (
      <div style={containerStyle}>
        { afterText !== undefined ?
          <div>
            {styles.wrap(34, 100, 0, 0, <span>{value}</span>)}
            {styles.wrap(34, 100, 34, 0, <InlineSVG style={{...iconStyle, fill: iconColor}} src={icon}/>)}
            {styles.wrap(32, 100, 68, 0, <span>{afterText}</span>)}
          </div>
          :
          <div>
            {styles.wrap(50, 100, 0, 0, <span>{value}</span>)}
            {styles.wrap(50, 100, 50, 0, <InlineSVG style={{...iconStyle, fill: iconColor}} src={icon}/>)}
          </div>
        }
      </div>
    );
  }
}
