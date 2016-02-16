import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import Radium from 'radium';
import { connect } from 'react-redux';
import _ from 'lodash';

@Radium
class Log extends Component {
  render() {
    const {log, theme} = this.props;

    const style = {
      ...styles.gameComponent,
      background: theme.bottomBarGrey,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      padding: '0.4em',
      pointerEvents: 'none',
      fontSize: '0.8em',
    };

    const lines = _.takeRight(log.lines, 15);

    return (
      <div style={style}>
        { lines.map((l, i) => <div key={i}>
            <span style={{whiteSpace: 'nowrap'}}>{l}</span>
          </div>
        )
        }
      </div>
    );
  }
}

export default connect(({log, theme}) => ({ log, theme }), {})(Log);
