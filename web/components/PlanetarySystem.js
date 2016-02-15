import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import * as theme from '../theme';
import Radium from 'radium';
import { connect } from 'react-redux';
import _ from 'lodash';

import bluePlanet from '../assets/bluePlanet.png';
import redPlanet from '../assets/redPlanet.png';
import yellowPlanet from '../assets/yellowPlanet.png';

@Radium
class PlanetarySystem extends Component {
  render() {
    var { game: { planets } } = this.props;

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
      var angleIncrement = 2 * Math.PI / numberOfPoints;
      var circleRadius = 1;
      var start = 0;
      var x = (circleRadius * Math.cos(angleIncrement * phase + start));
      var y = -(circleRadius * Math.sin(angleIncrement * phase + start));
      return [x, y];
    }

    return (
      <div style={style}>
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
