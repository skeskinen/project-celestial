import React, { Component, PropTypes } from 'react';
import InlineSVG from 'svg-inline-react';
import Radium from 'radium';
import _ from 'lodash';

import * as styles from '../styles';
import * as theme from '../theme';
import NumberIcon from './NumberIcon';

import blueManaIcon from '../assets/blueMana.svg';
import redManaIcon from '../assets/redMana.svg';
import healthIcon from '../assets/health.svg';
import deckIcon from '../assets/deck.svg';
import shieldIcon from '../assets/shield.svg';

@Radium
export default class PlayerInfo extends Component {
  render() {
    const {player, targetable, onClick} = this.props;

    const containerStyle = {
      ...styles.gameComponent,
      background: targetable ? theme.targetRedStr : theme.moderateBlueStr,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      overflow: 'hidden',
      textAlign: 'center',
    };

    const readyIndicatorStyle = {
      ...styles.gameComponent,
      background: player.ready ? theme.greenReadyStr : theme.redReadyStr,
      borderRadius: '50%',
    };

    const iconSize = _.partial(styles.wrapEm, 2.4, 1.2);
    const iconsTop = _.partial(iconSize, _, 36);
    const iconsBottom = _.partial(iconSize, _, 68);

    const black = _.constant('black');
    const white = _.constant('white');

    return (
      <div style={containerStyle} onClick={onClick}>
        { player.name }

        {
          styles.wrapEm(0.5, 0.5, 90, 5, <div style={readyIndicatorStyle}></div>
          )
        }
        {iconsTop(7.5,
          <NumberIcon icon={deckIcon} value={player.deckSize}
          textColor={black}
          iconColor={white} /> )
        }
        {iconsTop(37.5,
          <NumberIcon icon={shieldIcon} value={player.shield}
          textColor={black}
          iconColor={theme.purpleC} /> )
        }
        {iconsTop(67.5,
          <NumberIcon icon={healthIcon} value={player.hp}
          textColor={black}
          iconColor={theme.healthC} /> )
        }

        {iconsBottom(7.5,
          <NumberIcon icon={blueManaIcon} value={player.mana.blue}
          textColor={black}
          iconColor={theme.blueManaC} /> )
        }
        {iconsBottom(37.5,
          <NumberIcon icon={redManaIcon} value={player.mana.red}
          textColor={black}
          iconColor={theme.redManaC} /> )
        }
      </div>
    );
  }
}
