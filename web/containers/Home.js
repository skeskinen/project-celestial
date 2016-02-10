import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import * as gameActions from '../actions/game';
import { bindActionCreators } from 'redux';
import { Input, ButtonInput, Panel } from 'react-bootstrap';
import GameLobby from '../components/GameLobby';
import GameArea from './GameArea';
import * as theme from '../theme';

class Home extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
  }

  submitName(e) {
    e.preventDefault();
    const { gameActions } = this.props;
    gameActions.sendName(this.refs.nameInput.getValue());
  }

  startGame() {
    const { gameActions } = this.props;
    gameActions.startGame();
  }

  quickStart() {
    const { gameActions } = this.props;
    gameActions.quickStart();
  }

  render() {
    const { game } = this.props;

    const panelStyle = {
      border: '3px',
      borderStyle: 'solid',
      borderRadius: '10px',
      borderColor: theme.borderBlue,
      backgroundColor: theme.bgBlue,
    };

    var gameElement = () => {
      if(game.nameSet === false) {
        return <form onSubmit={::this.submitName}>
          <Input ref='nameInput' type='text' placeholder='Player name' />
          <ButtonInput type='submit' value='ok' />
          <br/>
          <ButtonInput onClick={::this.quickStart} value='Quick start' />
        </form>;
      } else if (!game.started) {
        return <GameLobby game={game} startGame={::this.startGame} />;
      } else {
        return <GameArea />;
      }
    };

    return (
      <div style={panelStyle}>
        { gameElement() }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    routeActions: bindActionCreators(routeActions, dispatch),
    gameActions: bindActionCreators(gameActions, dispatch),
  };
}

export default connect(({game}) => ({game}), mapDispatchToProps)(Home);
