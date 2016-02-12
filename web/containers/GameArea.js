import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as protocol from '../../game/protocol';

import * as gameActionsRaw from '../actions/game';
import * as uiActionsRaw from '../actions/ui';
import { PlayerInfo, BottomBar, RoundIcon, Tooltip } from '../components';
import { wrap, wrapEm } from '../styles';
import * as theme from '../theme';

import missileIcon from '../assets/magic-missile.svg';
import blueManaIcon from '../assets/blueMana.svg';
import redManaIcon from '../assets/redMana.svg';
import yellowManaIcon from '../assets/yellowMana.svg';

class GameArea extends Component {
  render() {
    const {game, ui, uiActions} = this.props;
    const {players} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);

    const skillIcon = _.partial(wrapEm, 3.6, 3.6, _, 87);

    const enemyTargetable = _.includes([protocol.TARGET_PLAYER, protocol.TARGET_ENEMY], ui.targetMode);
    const playerInfoOnClick = () => {
      if (enemyTargetable) uiActions.selectedTarget();
    };

    return (
      <div>
        {wrap(100, 20, 0, 85, <BottomBar />)}
        {playerInfoSize(5, 10, <PlayerInfo player={players[0]} targetable={enemyTargetable}
          onClick={playerInfoOnClick} />)}
        {playerInfoSize(20, 86, <PlayerInfo player={players[1]} targetable={false} />)}
        {ui.tooltip ? wrap(22, 11, 43, 72,
          <Tooltip>
            {wrapEm(3, 3, 5, 8,
              <RoundIcon onClick={uiActions.selectedSpell}
                icon={blueManaIcon} iconColor={theme.blueManaStr}/>)}
            {wrapEm(3, 3, 37, 8,
              <RoundIcon onClick={uiActions.selectedSpell}
                icon={redManaIcon} iconColor={theme.redManaStr}/>)}
            {wrapEm(3, 3, 69, 8,
              <RoundIcon onClick={uiActions.selectedSpell}
                icon={yellowManaIcon} iconColor={theme.yellowManaStr}/>)}
          </Tooltip>) : null}
        {skillIcon(50, <RoundIcon onClick={uiActions.showTooltip}
          icon={missileIcon} iconColor={theme.purpleStr}/>)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(gameActionsRaw, dispatch),
    uiActions: bindActionCreators(uiActionsRaw, dispatch),
  };
}

export default connect(({game, ui}) => ({game, ui}), mapDispatchToProps)(GameArea);
