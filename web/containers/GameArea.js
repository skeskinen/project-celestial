import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as protocol from '../../game/protocol';

import * as gameActionsRaw from '../actions/game';
import * as uiActionsRaw from '../actions/ui';
import { PlayerInfo, BottomBar, RoundIcon, Popup, Log, StarSystem, NumberIcon } from '../components';
import { wrap, wrapEm, wrapEmPos } from '../styles';

import * as assets from '../assets';

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
    const {game, ui, uiActions, theme} = this.props;
    const {mages, me} = game;
    const playerInfoSize = _.partial(wrap, 18, 13);

    const enemyTargetable = (p) =>
      !p.dead && ui.targetMode === uiActionsRaw.TARGETING_ENEMY;

    const playerInfoOnClick = (player) => {
      return () => {
        if (enemyTargetable(player)) {
          uiActions.selectedTarget(player.id);
        }
      };
    };

    const icons = assets.icons;

    const myIndex = _.findIndex(mages, {id: me.id});
    const others = _.drop(mages, myIndex + 1).concat(_.take(mages, myIndex));

    const skill = (skill, skillIndexOffset, x) => <div>
        {skillIcon(x, <RoundIcon onClick={skillPopup(skill, skillIndexOffset, x - 4)}
          icon={icons[skill]} iconColor={theme.purple}/>)}
    </div>;
    const skillIcon = _.partial(wrapEm, 4.6, 4.6, _, 87);
    const skillPopup = (skill, skillIndexOffset, x) => {
      return (e) => {
        e.stopPropagation();
        return uiActions.showPopup(x, 73, 14, 11,
        <div>
          {wrapEmPos(3.9, 3.9, 0.3, 0.3,
            <RoundIcon onClick={this.selectedSkill(skillIndexOffset + 0)}
              icon={icons.mana['blue']} iconColor={theme.mana['blue']}/>)}
          {wrapEmPos(3.9, 3.9, 4.5, 0.3,
            <RoundIcon onClick={this.selectedSkill(skillIndexOffset + 1)}
              icon={icons.mana['red']} iconColor={theme.mana['red']}/>)}
        </div>);
      };
    };

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
        {/* wrapEm(29, 29, 27, 14, <StarSystem />) */}
        <div style={{pointerEvents: 'none'}}>{wrap(26.5, 38, 0.5, 40, <Log />)}</div>
        {playerInfoSize(20, 86, <PlayerInfo player={me} targetable={false} />)}
        {
          others.map((p, i) => {
            const point = points[i + 1], xOffset = 1, yOffset = 2;
            return enemyInfo(p)(point[0] + xOffset, point[1] + yOffset);
          })
        }
        {skill('missile', 0, 50)}
        {skill('regen', 2, 58)}
        {skill('ward', 4, 66)}

        <Popup/>
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

export default connect(({game, ui, theme}) => ({game, ui, theme}), mapDispatchToProps)(GameArea);
