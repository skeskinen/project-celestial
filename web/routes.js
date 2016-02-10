import { Route, IndexRoute, Router, Redirect} from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import About from './containers/About';
import React from 'react';

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='about' component={About} />
  </Route>
);

export default routes;
