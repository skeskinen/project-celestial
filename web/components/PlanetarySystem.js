import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import * as theme from '../theme';
import Radium from 'radium';
import { connect } from 'react-redux';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';

import bluePlanet from '../assets/bluePlanet.png';
import redPlanet from '../assets/redPlanet.png';
import yellowPlanet from '../assets/yellowPlanet.png';

@Radium
class PlanetarySystem extends Component {
  componentDidMount() {
    var { game: { players, me } } = this.props;
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

  render() {
    var { game: { planets, players, me } } = this.props;
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

    return (
      <div style={style}>
        <canvas style={{...styles.gameComponent, opacity: '0.3'}} ref='canvas' width={1000} height={1000}/>
        { planets.map((_p, i) => {
          const j = 18 + 82 / planets.length * i;
          const s = j, p = 50 - j / 2;
          return styles.wrap(s, s, p, p, <div style={lineStyle}/>, i); }
        )}

        { planets.map((p, i) => {
          const j = 18 + 82 / planets.length * i;
          const s = 8;
          const point = calcCircleLocation(p.phase, p.speed);
          const x = point[0] * j / 2 + 50 - s / 2, y = point[1] * j / 2 + 50 - s / 2 ;
          var texture;
          switch (p.color) {
            case 'blue':
              texture = bluePlanet;
              break;
            case 'red':
              texture = redPlanet;
              break;
            case 'yellow':
              texture = yellowPlanet;
              break;

          }
          return styles.wrap(s, s, x, y,
            <img src={texture} style={styles.gameComponent}/>, i);
        }
        )}
      </div>
    );
  }
}

export default connect(({game}) => ({game}), {})(PlanetarySystem);
