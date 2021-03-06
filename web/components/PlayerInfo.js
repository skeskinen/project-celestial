import React, { Component, PropTypes } from 'react';
import InlineSVG from 'svg-inline-react';
import Radium from 'radium';
import _ from 'lodash';
import { connect } from 'react-redux';

import * as styles from '../styles';
import NumberIcon from './NumberIcon';

import assets from '../assets';

@connect(({theme}) => ({theme}), {})
@Radium
export default class PlayerInfo extends Component {
  render() {
    const {player, targetable, onClick, theme} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: targetable ? theme.targetRed : theme.moderateBlue,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      overflow: 'hidden',
      textAlign: 'center',
    };

    const head = {
      ...styles.gameComponent,
      height: '1em',
      background: theme.hpRed,
      textAlign: 'center',
    };
    const body = {...styles.gameComponent, height: '76%', bottom: 0};

    const readyIndicatorStyle = {
      ...styles.gameComponent,
      background: player.ready ? theme.greenReady : theme.redReady,
      borderRadius: '50%',
    };

    const iconSize = _.partial(styles.wrapEm, 2.4, 1.2);
    const iconsTop = _.partial(iconSize, _, 36);
    const iconsBottom = _.partial(iconSize, _, 68);

    const icons = assets.icons;

    const maxHp = 20;
    const maxShield = 5;
    const hpIndicator = {
      ...styles.gameComponent,
      width: player.hp < 0 ? '0' : `${player.hp / maxHp * 100}%`,
      backgroundColor: theme.hpGreen
    };
    const shieldIndicator = {
      ...styles.gameComponent,
      width: `${player.shield / maxShield * 100}%`,
      height: '50%',
      backgroundColor: theme.purple
    };
    const hpString = {
      ...styles.gameComponent,
      marginTop: '-0.1em',
    };

    const icon = (f, x, icon, value, textColor, iconColor) => {
      return f(x,
      <NumberIcon icon={icon} value={value}
        textColor={textColor}
        iconColor={iconColor}/>, x);
    };

    const xs = [4, 28, 52, 76];

    const manaIcons = (type) => [
      [icons.mana[type], player.mana[type], theme.textLightC, theme.mana[type]],
      [icons.spellPower, player.spellPower[type], theme.textLightC, theme.mana[type]],
      [icons.armor, player.defence[type], theme.textLightC, theme.mana[type]],
      [icons.speed, player.speed[type], theme.textLightC, theme.mana[type]],
    ];

    return (
      <div style={containerStyle} onClick={onClick}>
        <div style={head}>
          <div style={hpIndicator}/>
          <div style={shieldIndicator}/>
          <div style={hpString}>
            {player.hp}/20 + {player.shield}
          </div>
        </div>
        <div style={body}>
          { player.name }
          {
            styles.wrapEm(0.5, 0.5, 90, 5, <div style={readyIndicatorStyle}></div>
            )
          }
          {
            xs.map((x, i) =>
              icon(iconsTop, x, ...manaIcons('blue')[i])
            )
          }
          {
            xs.map((x, i) =>
              icon(iconsBottom, x, ...manaIcons('red')[i])
            )
          }
        </div>
      </div>
    );
  }
}
