import React, { Component, PropTypes } from 'react';
import * as styles from '../styles';
import * as theme from '../theme';
import Radium from 'radium';
import { connect } from 'react-redux';
import _ from 'lodash';

@Radium
class Log extends Component {
  render() {
    const {log} = this.props;

    const style = {
      ...styles.gameComponent,
      background: theme.bottomBarGrey,
      border: '2px',
      borderRadius: 4,
      color: 'white',
      padding: '0.4em'
    };

    const lines = _.takeRight(log.lines, 4);

    return (
      <div style={style}>
        { lines.map((l, i) => <div key={i}>
            <span>{l}</span>
          </div>
        )
        }
      </div>
    );
  }
}

export default connect(({log}) => ({ log }), {})(Log);
