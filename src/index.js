'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
  get: ((user) => new(require('./get.js'))(user)),
  datasources: new(require('./datasources.js'))(),
  logoUrl: require('./logo-url.js'),
  search: require('./search.js'),
  traverse: require('./traverse.js'),
  graph: ((user) => new(require('./graph.js'))(user))
};
