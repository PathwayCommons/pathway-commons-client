'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  get: ((queryObject) => new(require('./get.js'))(queryObject)),
  dataSources: new(require('./datasources.js'))(),
  logoUrl: require('./logo-url.js'),
  search: require('./search.js'),
  traverse: require('./traverse.js')
};
