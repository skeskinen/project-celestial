import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import * as gameActions from '../actions/game';
import { bindActionCreators } from 'redux';
import { GameLobby } from '../components';
import GameArea from './GameArea';
import * as theme from '../theme';

class Home extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.handleResize = ::this.handleResize;
    this.submitName = ::this.submitName;

    this.state = {windowWidth: 800, windowHeight: 600, fullyLoaded: false}; //windowWidth and windowHeight are for SSR
  }

  handleResize() {
    this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight, fullyLoaded: true});
  }

  componentDidMount() {
    if(__CLIENT__)
      window.addEventListener('resize', ::this.handleResize);
    this.handleResize(); // Fix SSR. Needs to be done after initial client render so that mapping of elements works.
  }

  componentWillUnmount() {
    if(__CLIENT__)
      window.removeEventListener('resize', ::this.handleResize);
  }

  submitName(e) {
    e.preventDefault();
    const { gameActions } = this.props;
    gameActions.sendName(this.refs.nameInput.value);
  }

  render() {
    const { game, gameActions } = this.props;
    var { windowWidth, windowHeight, fullyLoaded } = this.state;

    const borderSize = 2;
    windowWidth -= borderSize*2;
    windowHeight -= borderSize*2;

    const targetRatio = 3 / 2;
    const curRatio = windowWidth / windowHeight;
    var newWidth, newHeight, marginTop = 0, marginLeft = 0;

    if(curRatio >= targetRatio) { //landscape
      newHeight = windowHeight;
      newWidth = windowHeight * targetRatio;
      marginLeft = (windowWidth - newWidth) / 2;
    } else { //portrait
      newWidth = windowWidth;
      newHeight = windowWidth / targetRatio;
      marginTop = (windowHeight - newHeight) / 2;
    }

    const fontNativeWidth = 800;

    const panelStyle = {
      border: `${borderSize}px`,
      borderStyle: 'solid',
      borderRadius: '10px',
      borderColor: theme.borderBlue,
      backgroundColor: theme.bgBlue,
      width: `${newWidth}px`,
      height: `${newHeight}px`,
      marginLeft: `${marginLeft}px`,
      marginTop: `${marginTop}px`,
      position: 'absolute',
      fontSize: `${newWidth / fontNativeWidth}em`,
      overflow: 'hidden',
      visibility: fullyLoaded ? 'visible' : 'hidden',
    };

    var gameElement = () => {
      if(game.nameSet === false) {
        return (<div>
            <form onSubmit={this.submitName}>
            <input ref='nameInput' type='text' placeholder='Player name' />
            <button type='submit'>ok</button>
            <br/>
          </form>;
          <button onClick={gameActions.quickStart}>Quick start</button>
        </div>);
      } else if (!game.started) {
        return <GameLobby game={game} startGame={gameActions.startGame} />;
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
