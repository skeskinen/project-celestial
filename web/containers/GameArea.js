import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { multireducerBindActionCreators } from 'multireducer';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as protocol from '../../game/protocol';

import * as gameActionsRaw from '../actions/game';
import * as uiActionsRaw from '../actions/ui';
import * as popupActionsRaw from '../actions/popup';
import { PlayerInfo, BottomBar, RoundIcon, Popup, Log, StarSystem, NumberIcon } from '../components';
import { wrap, wrapEm, wrapEmPos } from '../styles';

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

    const icons = assets.icons;

    const myIndex = _.findIndex(players, {id: me.id});
    const others = _.drop(players, myIndex + 1).concat(_.take(players, myIndex));

    const skill = (skill, x) => <div>
        {skillPopup(skill, x - 4)}
        {skillIcon(x, <RoundIcon onClick={popupActions[skill].show}
          icon={icons[skill]} iconColor={theme.purple}/>)}
    </div>;
    const skillIcon = _.partial(wrapEm, 4.6, 4.6, _, 87);
    const skillPopup = (skill, x) => {
      const f = (icon, value, color, tc, afterText) => (x, y) =>
        wrapEmPos(3.9, 1.3, x, y, <NumberIcon icon={icon} value={value}
          textColor={tc} iconColor={color} afterText={afterText || ''} />, `${x}${y}`);

      const byColor = (color) => {
        const info = me.skills[skill][color].info;
        const cf = theme.mana[color];
        const tc = theme.textLight;
        const icons = assets.icons;
        var toShow = [];
        const signedStr = (v) => v > 0 ? `+${v}` : v;
        const enoughManaTextColor = (v) => v <= me.mana[color] ? theme.textLight : theme.targetRed;

        if(info.cost[color] !== undefined) {
          const manaCost = info.cost[color];
          toShow.push( f(icons.mana[color], signedStr(-manaCost), cf, enoughManaTextColor(manaCost) ));
        }
        if(info.damage)
          toShow.push( f(icons.spellPower, info.damage[color], cf, tc) );
        if(info.shield)
          toShow.push( f(icons.shield, signedStr(info.shield), cf, tc) );
        if(info.buff) {
          const b = info.buff;
          if(b.attribs.defence)
            toShow.push( f(icons.armor, signedStr(b.attribs.defence[color]), cf, tc, `(${b.duration})`) );
          if(b.attribs.speed)
            toShow.push( f(icons.speed, signedStr(b.attribs.speed[color]), cf, tc, `(${b.duration})`) );
        }
        return toShow;
      };
      const blue = byColor('blue'), red = byColor('red');
      var height = 11 + blue.length * 3.14;
      return <Popup x={x} y={84 - height} w={14} h={height} multireducerKey={skill}>
          {wrapEmPos(3.9, 3.9, 0.3, 0.3,
            <RoundIcon onClick={this.selectedSkill(skill, 'blue')}
              icon={icons.mana['blue']} iconColor={theme.mana['blue']}/>)}
          {blue.map((n, i) => n(0.3, 4.3 + i * 1.4))}
          {wrapEmPos(3.9, 3.9, 4.5, 0.3,
            <RoundIcon onClick={this.selectedSkill(skill, 'red')}
              icon={icons.mana['red']} iconColor={theme.mana['red']}/>)}
          {red.map((n, i) => n(4.5, 4.3 + i * 1.4))}
        </Popup>;
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
