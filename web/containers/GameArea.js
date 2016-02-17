import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { multireducerBindActionCreators } from 'multireducer';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as protocol from '../../game/protocol';

import * as gameActionsRaw from '../actions/game';
import * as uiActionsRaw from '../actions/ui';
import * as popupActionsRaw from '../actions/popup';
import { PlayerInfo, BottomBar, RoundIcon, Popup, Log, StarSystem } from '../components';
import { wrap, wrapEm } from '../styles';

import * as assets from '../assets'

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
    const {game, ui, uiActions, popupActions, theme} = this.props;
    const {players, me} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);


    const enemyTargetable = (p) =>
      !p.dead && _.includes([protocol.TARGET_PLAYER, protocol.TARGET_ENEMY], ui.targetMode);

    const playerInfoOnClick = (player) => {
      return () => {
        if (enemyTargetable(player)) {
          uiActions.selectedTarget(player.id);
        }
      };
    };

    const myIndex = _.findIndex(players, {id: me.id});
    const others = _.drop(players, myIndex + 1).concat(_.take(players, myIndex));

    const skill = (skill, x) => <div>
        {skillPopup(skill, x - 4)}
        {skillIcon(x, <RoundIcon onClick={popupActions[skill].show}
          icon={assets.icons[skill]} iconColor={theme.purpleStr}/>)}
    </div>;
    const skillIcon = _.partial(wrapEm, 4.6, 4.6, _, 87);
    const skillPopup = (skill, x) =>
        <Popup x={x} y={72} w={14} h={11} multireducerKey={skill}>
          {wrapEm(3.9, 3.9, 5, 8,
            <RoundIcon onClick={this.selectedSkill(skill, 'blue')}
              icon={assets.icons.mana['blue']} iconColor={theme.mana['blueStr']}/>)}
          {wrapEm(3.9, 3.9, 53, 8,
            <RoundIcon onClick={this.selectedSkill(skill, 'red')}
              icon={assets.icons.mana['red']} iconColor={theme.mana['redStr']}/>)}
        </Popup>;

    const enemyInfo = (p) => _.partial(playerInfoSize, _, _,
      <PlayerInfo player={p} targetable={enemyTargetable(p)}
        onClick={playerInfoOnClick(p)} />, p.id);

    var points = [];
    var numberOfPoints = others.length + 1;
    var angleIncrement = -2 * Math.PI / numberOfPoints;
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
        {wrapEm(29, 29, 27, 14, <StarSystem />)}
        <div style={{pointerEvents: 'none'}}>{wrap(26.5, 38, 0.5, 40, <Log />)}</div>
        {playerInfoSize(20, 86, <PlayerInfo player={me} targetable={false} />)}
        {
          others.map((p, i) => {
            const point = points[i + 1], xOffset = 1, yOffset = 2;
            return enemyInfo(p)(point[0] + xOffset, point[1] + yOffset);
          })
        }
        {skill('missile', 50)}
        {skill('regen', 58)}
        {skill('ward', 66)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(gameActionsRaw, dispatch),
    uiActions: bindActionCreators(uiActionsRaw, dispatch),
    popupActions: {
      missile: multireducerBindActionCreators('missile', popupActionsRaw, dispatch),
      regen: multireducerBindActionCreators('regen', popupActionsRaw, dispatch),
      ward: multireducerBindActionCreators('ward', popupActionsRaw, dispatch),
    }
  };
}

export default connect(({game, ui, theme}) => ({game, ui, theme}), mapDispatchToProps)(GameArea);
