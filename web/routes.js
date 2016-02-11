import { Route, IndexRoute, Router, Redirect} from 'react-router';
import App from './containers/App';
import GameContainer from './containers/GameContainer';
import About from './containers/About';
import React from 'react';

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={GameContainer} />
    <Route path='about' component={About} />
  </Route>
);

export default routes;
