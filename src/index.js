/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
	get: require('./get.js'),
	dataSources: new (require('./datasources.js'))(),
	logoUrl: require('./logo-url.js'),
	search: require('./search.js'),
	traverse: require('./traverse.js')
};
