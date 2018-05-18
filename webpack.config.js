const webpack = require('webpack');
const { env } = require('process');
const isProd = env.NODE_ENV === 'production';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const isNonNil = x => x != null;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProfile = env.PROFILE == 'true';
const pkg = require('./package.json');

let conf = {
  entry: './src/index.js',

  output: {
    filename: './dist/pathway-commons.js'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },

  externals: Object.keys( pkg.dependencies ),

  plugins: [
    isProd ? new UglifyJSPlugin() : null,
    isProfile ? new BundleAnalyzerPlugin() : null,

    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ].filter( isNonNil )
};

module.exports = conf;
