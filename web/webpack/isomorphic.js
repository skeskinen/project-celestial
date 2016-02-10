var path = require('path');
var webpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
  webpack_assets_file_path: 'webpack-assets.json',
  webpack_stats_file_path: 'webpack-stats.json',
  //debug: true,
  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico']
    },
    fonts: {
      extensions: ['ttf', 'woff', 'woff2', 'eot']
    },
    svg: {
      extensions: ['svg'],
      parser: webpackIsomorphicToolsPlugin.css_modules_loader_parser,
      //path: webpackIsomorphicToolsPlugin.style_loader_path_extractor,
    },
    styles: {
      extensions: ['scss', 'css'],
      // filter: webpackIsomorphicToolsPlugin.style_loader_filter,
      // parser: webpackIsomorphicToolsPlugin.css_modules_loader_parser,
      // path: webpackIsomorphicToolsPlugin.style_loader_path_extractor,
      filter: (module, regex) => regex.test(module.name),
      path: (module) => module.name,
      parser: (module) => module.source,
    }
  }
};
