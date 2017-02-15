'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
  datasources: new(require('./datasources.js'))(),
  get: (() => new(require('./get.js'))()),
  search: (() => new(require('./search.js'))()),
  logoUrl: require('./logo-url.js'),
  traverse: require('./traverse.js'),
  graph: ((user) => new(require('./graph.js'))(user))
};
