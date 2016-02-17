import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';
import _ from 'lodash';

import Popup from './Popup';
import * as popupActionsRaw from '../actions/popup';
import { multireducerBindActionCreators } from 'multireducer';

import * as assets from '../assets';
import NumberIcon from './NumberIcon';

@Radium
class StarSystem extends Component {
  constructor() {
    super();

    this.popupW = 20;
    this.popupH = 20;
    this.planetSize = 8;

    this.planetClicked = ::this.planetClicked;

    this.state = { popupX: 0, popupY: 0, popupPlanet: undefined };
  }

  componentDidMount() {
    var { game: { players, me }, theme } = this.props;
    const myIndex = _.findIndex(players, {id: me.id});
    var canvas = this.refs.canvas;
    var ctx = canvas.getContext('2d');
    players.forEach((_p, i) => {
      const l = players.length;
      var start = +(Math.PI / 2) - (Math.PI / l); // phase 0 is at the start of player 0's sector
      var sectorSize = 2 * Math.PI / l;
      var offset = myIndex * sectorSize; // make everyone see planets in the same phase
      ctx.beginPath();
      ctx.moveTo(500, 500);
      ctx.arc(500, 500, 500, start + sectorSize * i + offset, start + sectorSize * (i + 1) + offset);
      ctx.fillStyle = theme.players[i];
      ctx.fill();
    });
  }

  planetClicked(p, x, y) {
    return () => {
      const { popupActions } = this.props;

      popupActions.show();

      const popupX = x > 50 ? x - this.popupW : x + this.planetSize;
      const popupY = y > 80 ? y - this.popupH : (y < 20 ? y + this.planetSize : y);

      this.setState({popupX, popupY, popupPlanet: p});
    };
  }

  render() {
    var { game: { planets, players, me }, theme } = this.props;
    const myIndex = _.findIndex(players, {id: me.id});

    const style = {
      ...styles.gameComponent,
    };


    const lineStyle = {
      ...styles.gameComponent,
      //background: theme.bottomBarGrey,
      border: '0.2em white dotted',
      borderRadius: '50%',
      color: 'white',
      //padding: '0.4em'
    };

    function calcCircleLocation(phase, speed) {
      var numberOfPoints = speed;
      var angleIncrement = - 2 * Math.PI / numberOfPoints;
      var circleRadius = 1;
      var start = -(Math.PI / 2) + (Math.PI / players.length); // phase 0 is at the start of player 0's sector
      var phaseOffset = 0.5 + myIndex * (speed / players.length); // make everyone see planets in the same phase
      var x = (circleRadius * Math.cos(angleIncrement * (phase + phaseOffset) + start));
      var y = -(circleRadius * Math.sin(angleIncrement * (phase + phaseOffset) + start));
      return [x, y];
    }

    function planetBonusElement(bonus) {
      const byColor = (color) => {
        const cf = theme.mana[`${color}C`];
        const text = theme.textLightC;
        const icons = assets.icons;
        var toShow = [];

        if(bonus.speed && bonus.speed[color])
          toShow.push(icon(icons.speed, bonus.speed[color], text, cf));
        if(bonus.defence && bonus.defence[color])
          toShow.push(icon(icons.armor, bonus.defence[color], text, cf));
        if(bonus.spellPower && bonus.spellPower[color])
          toShow.push(icon(icons.spellPower, bonus.spellPower[color], text, cf));
        return toShow;
      };
      const icon = (icon, value, textColor, iconColor) => {
        if (value > 0) value = `+${value}`;
        return (x, y) => styles.wrapEm(2.4, 1.2, x, y, <NumberIcon icon={icon} value={value}
          textColor={textColor}
          iconColor={iconColor}/>, `${x}${y}`);
      };

      const showList = (is) => {
        var y = 20;
        var x = 5;
        return is.map(i => {
          var r = i(x, y);
          y += 25;
          if (y > 80) {
            y = 20;
            x = 50;
          }
          return r;
        });
      };
      return <div>
        {showList(byColor('blue').concat(byColor('red')))}
        {/*byColor('red')*/}
      </div>;
    }

    return (
      <div style={style}>
        <canvas style={{...styles.gameComponent, opacity: '0.3'}} ref='canvas' width={1000} height={1000}/>
        { planets.map((_p, i) => {
          const j = 25 + 75 / planets.length * i;
          const s = j, p = 50 - j / 2;
          return styles.wrap(s, s, p, p, <div style={lineStyle}/>, i);
        })}

        { planets.map((p, i) => {
          const j = 25 + 75 / planets.length * i;
          const s = this.planetSize;
          const point = calcCircleLocation(p.phase, p.speed);
          const x = point[0] * j / 2 + 50 - s / 2;
          const y = point[1] * j / 2 + 50 - s / 2;
          const ghostPoint = calcCircleLocation(p.phase + 1, p.speed);
          const ghostX = ghostPoint[0] * j / 2 + 50 - s / 2;
          const ghostY = ghostPoint[1] * j / 2 + 50 - s / 2;
          var texture = _.property(p.type)(assets.planets);
          return <div key={i}>
            {styles.wrap(s, s, x, y,
                  <img src={texture} style={styles.gameComponent} onClick={this.planetClicked(p, x, y)} />)}
              <div style={{opacity:'0.2'}} key={`ghost ${i}`}>
                {styles.wrap(s, s, ghostX, ghostY,
                  <img src={texture} style={styles.gameComponent} />)}
              </div>
            </div>;
        })}
        {styles.wrap(this.planetSize + 9, this.planetSize + 9, 42, 42,
              <img src={assets.stars['basic']} style={styles.gameComponent} />)
        }

        <Popup multireducerKey='planet' x={this.state.popupX} y={this.state.popupY}
          w={this.popupW} h={this.popupH} bgColor={theme.blackStr} ref='popup'>
          { (() => {
            const p = this.state.popupPlanet;
            return <div>
              <div style={{textAlign: 'center'}}>{p ? p.name : ''}</div>
              {p ? planetBonusElement(p.bonus) : null}
            </div>;
          })()}
        </Popup>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    popupActions: multireducerBindActionCreators('planet', popupActionsRaw, dispatch),
  };
}

export default connect(({game, popups, theme}) => ({game, popups, theme}), mapDispatchToProps)(StarSystem);
