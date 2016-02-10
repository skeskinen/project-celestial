import React, {Component, PropTypes} from 'react';
import { RouterContext } from 'react-router';
import serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server';
import _ from 'lodash';
import { Provider } from 'react-redux';

import * as theme from './theme';

export default class Html extends Component
{
  static propTypes = {
    assets    : PropTypes.object,
    renderProps : PropTypes.object,
    store     : PropTypes.object
  };

  // a sidenote for "advanced" users:
  // (you may skip this)
  //
  // this file is usually not included in your Webpack build
  // because this React component is only needed for server side React rendering.
  //
  // so, if this React component is not `require()`d from anywhere in your client code,
  // then Webpack won't ever get here
  // which means Webpack won't detect and parse any of the `require()` calls here,
  // which in turn means that if you `require()` any unique assets here
  // you should also `require()` those assets somewhere in your client code,
  // otherwise those assets won't be present in your Webpack bundle and won't be found.
  //
  render()
  {
    const { assets, renderProps, store } = this.props;

    // "import" will work here too
    // but if you want hot reloading to work while developing your project
    // then you need to use require()
    // because import will only be executed a single time
    // (when the application launches)
    // you can refer to the "Require() vs import" section for more explanation
    return (
      <html lang="en-us">
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Project Celestial</title>

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}


          {/* resolves the initial style flash (flicker) on page load in development mode */}
          { /* Object.keys(assets.styles).length === 0 ?
            <style dangerouslySetInnerHTML={{__html: require('./assets/stylesheets/style.scss')}}/> : null */}
        </head>

        <body style={{backgroundColor: theme.backgroundColor}}>
          <div style={{position: 'fixed', zIndex: -100 }} id='backgroundContainer' />

          { renderProps ?
            <div id='root' dangerouslySetInnerHTML={{__html: renderToString(
              <Provider store={store} key='provider'>
                <RouterContext {...renderProps}/>
              </Provider>
              )}} />
            : <div id='root' /> }

          {/* Flux store data will be reloaded into the store on the client */}
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} />

          {/* javascripts */}
          {/* (usually one for each "entry" in webpack configuration) */}
          {/* (for more informations on "entries" see https://github.com/petehunt/webpack-howto/) */}
          {Object.keys(assets.javascript).map((script, i) =>
            <script src={assets.javascript[script]} key={i}/>
          )}
        </body>
      </html>
    );
  }
}
