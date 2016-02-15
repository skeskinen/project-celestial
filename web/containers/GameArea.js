import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { multireducerBindActionCreators } from 'multireducer';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as protocol from '../../game/protocol';

import * as gameActionsRaw from '../actions/game';
import * as uiActionsRaw from '../actions/ui';
import * as popupActionsRaw from '../actions/popup';
import { PlayerInfo, BottomBar, RoundIcon, Popup, Log, PlanetarySystem } from '../components';
import { wrap, wrapEm } from '../styles';
import * as theme from '../theme';

import missileIcon from '../assets/magic-missile.svg';
import regenIcon from '../assets/regen.svg';
import blueManaIcon from '../assets/blueMana.svg';
import redManaIcon from '../assets/redMana.svg';
import yellowManaIcon from '../assets/yellowMana.svg';

class GameArea extends Component {
  constructor() {
    super();

    this.selectedSkill = ::this.selectedSkill;
  }

  selectedSkill(skill, color) {
    return () => {
      const {uiActions} = this.props;
      uiActions.selectedSkill(skill, color);
    };
  }

  render() {
    const {game, ui, uiActions, missilePopupActions, regenPopupActions, popups} = this.props;
    const {players, me} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);

    const skillIcon = _.partial(wrapEm, 3.6, 3.6, _, 87);

    const enemyTargetable = _.includes([protocol.TARGET_PLAYER, protocol.TARGET_ENEMY], ui.targetMode);
    const playerInfoOnClick = (player) => {
      return () => {
        if (enemyTargetable) {
          uiActions.selectedTarget(player.id);
        }
      };
    };

    const myIndex = _.findIndex(players, {id: me.id});
    const others = _.drop(players, myIndex + 1).concat(_.take(players, myIndex));

    const skillPopup = (skill) => (
      popups[skill].visible ? _.partial(wrap, 22, 11, _, 72,
        <Popup multireducerKey={skill}>
          {wrapEm(3, 3, 5, 8,
            <RoundIcon onClick={this.selectedSkill(skill, 'blue')}
              icon={blueManaIcon} iconColor={theme.blueManaStr}/>)}
          {wrapEm(3, 3, 37, 8,
            <RoundIcon onClick={this.selectedSkill(skill, 'red')}
              icon={redManaIcon} iconColor={theme.redManaStr}/>)}
          {wrapEm(3, 3, 69, 8,
            <RoundIcon onClick={this.selectedSkill(skill, 'yellow')}
              icon={yellowManaIcon} iconColor={theme.yellowManaStr}/>)}
        </Popup>
      ) : _.constant(null));

    const enemyInfo = (p) => _.partial(playerInfoSize, _, _,
      <PlayerInfo player={p} targetable={enemyTargetable}
        onClick={playerInfoOnClick(p)} />, p.id);

    var points = [];
    var numberOfPoints = others.length + 1;
    var angleIncrement = 2 * Math.PI / numberOfPoints;
    var circleRadius = 40;
    const start = Math.PI * 3 / 2;
    for (var i = 0; i < numberOfPoints; i++) {
      var x = (circleRadius * Math.cos(angleIncrement * i + start)) + circleRadius;
      var y = -(circleRadius * Math.sin(angleIncrement * i + start)) + circleRadius;
      points.push([x, y]);
    }

    return (
      <div>
        {wrap(100, 20, 0, 85, <BottomBar />)}
        {wrapEm(23, 23, 27, 14, <PlanetarySystem />)}
        {wrap(60, 16, 20, 65, <Log />)}
        {playerInfoSize(20, 86, <PlayerInfo player={me} targetable={false} />)}
        {
          others.map((p, i) => {
            const point = points[i + 1], xOffset = 1, yOffset = 2;
            return enemyInfo(p)(point[0] + xOffset, point[1] + yOffset);
          })
        }
        {skillPopup('missile')(43)}
        {skillIcon(50, <RoundIcon onClick={missilePopupActions.show}
          icon={missileIcon} iconColor={theme.purpleStr}/>)}
        {skillPopup('regen')(51)}
        {skillIcon(58, <RoundIcon onClick={regenPopupActions.show}
          icon={regenIcon} iconColor={theme.purpleStr}/>)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(gameActionsRaw, dispatch),
    uiActions: bindActionCreators(uiActionsRaw, dispatch),
    missilePopupActions: multireducerBindActionCreators('missile', popupActionsRaw, dispatch),
    regenPopupActions: multireducerBindActionCreators('regen', popupActionsRaw, dispatch),
  };
}

export default connect(({game, ui, popups}) => ({game, ui, popups}), mapDispatchToProps)(GameArea);
