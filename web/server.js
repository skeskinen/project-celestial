/*  eslint no-console:0 */
import { renderToStaticMarkup } from 'react-dom/server';
import { match } from 'react-router';
import React from 'react';

// html page markup
import Html from './Html';
import routes from './routes';
import Express from 'express';
import compression from 'compression';
import path from 'path';
import configureStore from './store';

export function pageRenderingMiddleware(req, res) {
  // clear require() cache if in development mode
  // (makes asset hot reloading work)
  if (process.env.NODE_ENV !== 'production')
  {
    global.webpackIsomorphicTools.refresh();
  }

  const store = configureStore();
  if (false) { // true to skip server side rendering
    const html = <Html assets={global.webpackIsomorphicTools.assets()} store={store} />;
    res.send('<!doctype html>\n' + renderToStaticMarkup(html));
    return;
  }
  match({routes, location: req.url}, (error, redirect, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (renderProps) {
      const html = <Html assets={global.webpackIsomorphicTools.assets()} renderProps={renderProps} store={store} />;
      res.send('<!doctype html>\n' + renderToStaticMarkup(html));
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else {
      res.status(404).send('Not found');
    }
  });
}

const app = new Express();
const port = process.env.PORT || 5000;

app.use(compression());
app.use('/public', Express.static(path.join(__dirname, 'dist')));
app.use(pageRenderingMiddleware);

app.listen(port);
console.log(`Server running at http://localhost:${port}`);
