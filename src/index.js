'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
  utilities: require('./utilities.js'),
  datasources: new(require('./datasources.js'))(),
  get: (() => new(require('./get.js'))()),
  search: (() => new(require('./search.js'))()),
  traverse: (() => new(require('./traverse.js'))()),
  graph: (() => new(require('./graph.js'))()),
  top_pathways: (() => new(require('./top_pathways.js'))())
};
