import React, { Component, PropTypes } from 'react';
import InlineSVG from 'svg-inline-react';
import Radium from 'radium';
import _ from 'lodash';

import * as styles from '../styles';
import * as theme from '../theme';
import NumberIcon from './NumberIcon';

import blueManaIcon from '../assets/blueMana.svg';
import redManaIcon from '../assets/redMana.svg';
import yellowManaIcon from '../assets/yellowMana.svg';
import healthIcon from '../assets/health.svg';
import deckIcon from '../assets/deck.svg';
import shieldIcon from '../assets/shield.svg';

@Radium
export default class PlayerInfo extends Component {
  render() {
    const {player} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: theme.moderateBlue.rgbaString(),
      border: '2px',
      borderRadius: 4,
      color: 'white',
      overflow: 'hidden',
      textAlign: 'center',
    };

    const iconSize = _.partial(styles.wrapEm, 2.4, 1.2);
    const iconsTop = _.partial(iconSize, _, 36);
    const iconsBottom = _.partial(iconSize, _, 68);

    const black = _.constant('black');
    const white = _.constant('white');

    return (
      <div style={containerStyle}>
        { player.name }
        {iconsTop(7.5,
          <NumberIcon icon={deckIcon} value={player.deckSize}
          textColor={black}
          iconColor={white} /> )
        }
        {iconsTop(37.5,
          <NumberIcon icon={shieldIcon} value={player.shield}
          textColor={black}
          iconColor={_.constant(theme.purple.rgbaString())} /> )
        }
        {iconsTop(67.5,
          <NumberIcon icon={healthIcon} value={player.hp}
          textColor={black}
          iconColor={_.constant(theme.health.rgbaString())} /> )
        }

        {iconsBottom(7.5,
          <NumberIcon icon={blueManaIcon} value={player.mana.blue}
          textColor={black}
          iconColor={_.constant(theme.blueMana.rgbaString())} /> )
        }
        {iconsBottom(37.5,
          <NumberIcon icon={redManaIcon} value={player.mana.red}
          textColor={black}
          iconColor={_.constant(theme.redMana.rgbaString())} /> )
        }
        {iconsBottom(67.5,
          <NumberIcon icon={yellowManaIcon} value={player.mana.yellow}
          textColor={black}
          iconColor={_.constant(theme.yellowMana.rgbaString())} /> )
        }

        {/*
        <InlineSVG style={{...icon, fill: theme.blueMana.rgbaString(), left:'10%'}} src={blueMana}/>
        <InlineSVG style={{...icon, fill: theme.redMana.rgbaString(), left: '30%'}} src={redMana}/>
        <InlineSVG style={{...icon, fill: theme.yellowMana.rgbaString(), left:'50%'}} src={yellowMana}/>
        */
        }

      </div>
    );
  }
}
