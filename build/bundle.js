(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/manfredcheung/pathway-commons/src/get.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Peforms a GET web query to the Pathway Commons web service
 * @module get
 * @param {object} query_object - Object representing the query parameters to be sent along with the get command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var get = function get(query_object, callback) {
	/**
 * Callback for get function, which is always called on completion
 *
 * @callback requestCallback
 * @param {string} responseStatus - A string which indicates failure, no results returned, or success.
 * @param {string} responseText - Response text, which is the string returned from PC if available, else empty string. Remains as string because data returned can be in multiple formats.
 */
	callback(responseStatus, responseText);
};

exports.default = get;

},{}],"/Users/manfredcheung/pathway-commons/src/getDataSources.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('./private/helpers.js');

/**
 * Fetches data source object from Pathway Commons
 * @module getDataSources
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var getDataSources = function getDataSources(callback) {
	//copy data sources to the global array: kepp just some fields and only pathway data sources (not e.g., ChEBI)
	(0, _helpers._httpGetAsync)(PCUrl + 'metadata/datasources?user=pc2pathways', function (data) {
		var output = {};
		data = (0, _helpers._parseJson)(data).filter(function (source) {
			return source.notPathwayData == false;
		});
		data.map(function (ds) {
			var name = ds.name.length > 1 ? ds.name[1] : ds.name[0];
			output[ds.uri] = {
				id: ds.identifier,
				uri: ds.uri,
				name: name,
				description: ds.description,
				type: ds.type
			};
		});
		dataSources = output;

		/**
  * Callback for get function, which is always called on completion
  *
  * @callback requestCallback
  * @param {array} dataSources - An array containing data sources retrieved from PC, else empty array.
  */
		callback(dataSources);
	});
};

exports.default = getDataSources;

},{"./private/helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js"}],"/Users/manfredcheung/pathway-commons/src/logoUrl.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Fetches the logo for the datasource using either datasources URI or name. Intended to be used to generate image tags.
 * @module logoUrl
 * @param {string} logoIdentifier - Either URI or name of the data source
 * @return {string} logoUrl - URL of datasource in question, else empty string
 */
var logoUrl = function logoUrl(dsUriOrName) {
  return string;
};

exports.default = logoUrl;

},{}],"/Users/manfredcheung/pathway-commons/src/private/helpers.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Private Functions
/**
 * @private
 * @param {string} url
 * @param {requestCallback} callback - responseText
 */
var _httpGetAsync = exports._httpGetAsync = function _httpGetAsync(url, callback) {
  callback(httpResponseText);
};

/**
 * @private
 * @param {string} jsonString
 * @return {object} jsonObject
 */
var _parseJson = exports._parseJson = function _parseJson(jsonString) {
  return jsonObject;
};

},{}],"/Users/manfredcheung/pathway-commons/src/search.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Peforms a SEARCH web query to the Pathway Commons web service
 * @module search
 * @param {object} query_object - Object representing the query parameters to be sent along with the search command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var search = function search(query_object, callback) {
	/**
 * Callback for search function, which is always called on completion
 *
 * @callback requestCallback
 * @param {string} responseStatus - A string which indicates failure, no results returned, or success.
 * @param {object} responseObject - A parsed JSON object returned from PC if available, else empty object. Result from search is assumed to be in JSON format.
 */
	callback(responseStatus, responseObject);
};

exports.default = search;

},{}],"/Users/manfredcheung/pathway-commons/src/traverse.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Peforms a SEARCH web query to the Pathway Commons web service
 * @module traverse
 * @param {object} query_object - Object representing the query parameters to be sent along with the traverse command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var traverse = function traverse(query_array, callback) {
	/**
 * Callback for traverse function, which is always called on completion
 *
 * @callback requestCallback
 * @param {string} responseStatus - A string which indicates failure, no results returned, or success.
 * @param {object} responseObject - A parsed JSON object returned from PC if available, else empty object. Result from traverse is assumed to be in JSON format.
 */
	callback(responseStatus, responseObject);
};

exports.default = traverse;

},{}],"/Users/manfredcheung/pathway-commons/src":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

exports.default = {
	get: require('./get.js'),
	getDataSources: require('./getDataSources.js'),
	logoUrl: require('./logoUrl.js'),
	search: require('./search.js'),
	traverse: require('./traverse.js')
};

},{"./get.js":"/Users/manfredcheung/pathway-commons/src/get.js","./getDataSources.js":"/Users/manfredcheung/pathway-commons/src/getDataSources.js","./logoUrl.js":"/Users/manfredcheung/pathway-commons/src/logoUrl.js","./search.js":"/Users/manfredcheung/pathway-commons/src/search.js","./traverse.js":"/Users/manfredcheung/pathway-commons/src/traverse.js"}]},{},["/Users/manfredcheung/pathway-commons/src"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2V0LmpzIiwic3JjL2dldERhdGFTb3VyY2VzLmpzIiwic3JjL2xvZ29VcmwuanMiLCJzcmMvcHJpdmF0ZS9oZWxwZXJzLmpzIiwic3JjL3NlYXJjaC5qcyIsInNyYy90cmF2ZXJzZS5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQTs7Ozs7O0FBTUEsSUFBTSxNQUFNLFNBQU4sR0FBTSxDQUFDLFlBQUQsRUFBZSxRQUFmLEVBQTRCO0FBQ3ZDOzs7Ozs7O0FBT0EsVUFBUyxjQUFULEVBQXlCLFlBQXpCO0FBQ0EsQ0FURDs7a0JBV2UsRzs7Ozs7Ozs7O0FDakJmOztBQUVBOzs7OztBQUtBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsUUFBRCxFQUFjO0FBQ3BDO0FBQ0EsNkJBQWMsUUFBUSx1Q0FBdEIsRUFBK0QsVUFBQyxJQUFELEVBQVU7QUFDeEUsTUFBSSxTQUFTLEVBQWI7QUFDQSxTQUFPLHlCQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBd0I7QUFBQSxVQUFVLE9BQU8sY0FBUCxJQUF5QixLQUFuQztBQUFBLEdBQXhCLENBQVA7QUFDQSxPQUFLLEdBQUwsQ0FBUyxVQUFDLEVBQUQsRUFBUTtBQUNoQixPQUFJLE9BQVEsR0FBRyxJQUFILENBQVEsTUFBUixHQUFpQixDQUFsQixHQUF1QixHQUFHLElBQUgsQ0FBUSxDQUFSLENBQXZCLEdBQW9DLEdBQUcsSUFBSCxDQUFRLENBQVIsQ0FBL0M7QUFDQSxVQUFPLEdBQUcsR0FBVixJQUFpQjtBQUNoQixRQUFJLEdBQUcsVUFEUztBQUVoQixTQUFLLEdBQUcsR0FGUTtBQUdoQixVQUFNLElBSFU7QUFJaEIsaUJBQWEsR0FBRyxXQUpBO0FBS2hCLFVBQU0sR0FBRztBQUxPLElBQWpCO0FBT0EsR0FURDtBQVVBLGdCQUFjLE1BQWQ7O0FBRUE7Ozs7OztBQU1BLFdBQVMsV0FBVDtBQUNBLEVBdEJEO0FBdUJBLENBekJEOztrQkEyQmUsYzs7Ozs7Ozs7QUNsQ2Y7Ozs7OztBQU1BLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxXQUFELEVBQWlCO0FBQ2hDLFNBQU8sTUFBUDtBQUNBLENBRkQ7O2tCQUllLE87Ozs7Ozs7O0FDVmY7QUFDQTs7Ozs7QUFLTyxJQUFNLHdDQUFnQixTQUFoQixhQUFnQixDQUFDLEdBQUQsRUFBTSxRQUFOLEVBQW1CO0FBQy9DLFdBQVMsZ0JBQVQ7QUFDQSxDQUZNOztBQUlQOzs7OztBQUtPLElBQU0sa0NBQWEsU0FBYixVQUFhLENBQUMsVUFBRCxFQUFnQjtBQUN6QyxTQUFPLFVBQVA7QUFDQSxDQUZNOzs7Ozs7OztBQ2ZQOzs7Ozs7QUFNQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsWUFBRCxFQUFlLFFBQWYsRUFBNEI7QUFDMUM7Ozs7Ozs7QUFPQSxVQUFTLGNBQVQsRUFBeUIsY0FBekI7QUFDQSxDQVREOztrQkFXZSxNOzs7Ozs7OztBQ2pCZjs7Ozs7O0FBTUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQTJCO0FBQzNDOzs7Ozs7O0FBT0EsVUFBUyxjQUFULEVBQXlCLGNBQXpCO0FBQ0EsQ0FURDs7a0JBV2UsUTs7Ozs7Ozs7QUNqQmY7Ozs7OztrQkFNZTtBQUNkLE1BQUssUUFBUSxVQUFSLENBRFM7QUFFZCxpQkFBZ0IsUUFBUSxxQkFBUixDQUZGO0FBR2QsVUFBUyxRQUFRLGNBQVIsQ0FISztBQUlkLFNBQVEsUUFBUSxhQUFSLENBSk07QUFLZCxXQUFVLFFBQVEsZUFBUjtBQUxJLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBQZWZvcm1zIGEgR0VUIHdlYiBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKiBAbW9kdWxlIGdldFxuICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5X29iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBnZXQgY29tbWFuZC5cbiAqIEBwYXJhbSB7cmVxdWVzdENhbGxiYWNrfSBjYWxsYmFjayAtIFRlcm1pbmF0aW5nIGNhbGxiYWNrLCBzZWUgYmVsb3cgZm9yIGFyZ3VtZW50cy5cbiAqL1xuY29uc3QgZ2V0ID0gKHF1ZXJ5X29iamVjdCwgY2FsbGJhY2spID0+IHtcblx0LyoqXG5cdCogQ2FsbGJhY2sgZm9yIGdldCBmdW5jdGlvbiwgd2hpY2ggaXMgYWx3YXlzIGNhbGxlZCBvbiBjb21wbGV0aW9uXG5cdCpcblx0KiBAY2FsbGJhY2sgcmVxdWVzdENhbGxiYWNrXG5cdCogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlU3RhdHVzIC0gQSBzdHJpbmcgd2hpY2ggaW5kaWNhdGVzIGZhaWx1cmUsIG5vIHJlc3VsdHMgcmV0dXJuZWQsIG9yIHN1Y2Nlc3MuXG5cdCogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlVGV4dCAtIFJlc3BvbnNlIHRleHQsIHdoaWNoIGlzIHRoZSBzdHJpbmcgcmV0dXJuZWQgZnJvbSBQQyBpZiBhdmFpbGFibGUsIGVsc2UgZW1wdHkgc3RyaW5nLiBSZW1haW5zIGFzIHN0cmluZyBiZWNhdXNlIGRhdGEgcmV0dXJuZWQgY2FuIGJlIGluIG11bHRpcGxlIGZvcm1hdHMuXG5cdCovXG5cdGNhbGxiYWNrKHJlc3BvbnNlU3RhdHVzLCByZXNwb25zZVRleHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXQ7XG4iLCJpbXBvcnQge19odHRwR2V0QXN5bmMsIF9wYXJzZUpzb259IGZyb20gJy4vcHJpdmF0ZS9oZWxwZXJzLmpzJztcblxuLyoqXG4gKiBGZXRjaGVzIGRhdGEgc291cmNlIG9iamVjdCBmcm9tIFBhdGh3YXkgQ29tbW9uc1xuICogQG1vZHVsZSBnZXREYXRhU291cmNlc1xuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gVGVybWluYXRpbmcgY2FsbGJhY2ssIHNlZSBiZWxvdyBmb3IgYXJndW1lbnRzLlxuICovXG5jb25zdCBnZXREYXRhU291cmNlcyA9IChjYWxsYmFjaykgPT4ge1xuXHQvL2NvcHkgZGF0YSBzb3VyY2VzIHRvIHRoZSBnbG9iYWwgYXJyYXk6IGtlcHAganVzdCBzb21lIGZpZWxkcyBhbmQgb25seSBwYXRod2F5IGRhdGEgc291cmNlcyAobm90IGUuZy4sIENoRUJJKVxuXHRfaHR0cEdldEFzeW5jKFBDVXJsICsgJ21ldGFkYXRhL2RhdGFzb3VyY2VzP3VzZXI9cGMycGF0aHdheXMnLCAoZGF0YSkgPT4ge1xuXHRcdHZhciBvdXRwdXQgPSB7fTtcblx0XHRkYXRhID0gX3BhcnNlSnNvbihkYXRhKS5maWx0ZXIoc291cmNlID0+IHNvdXJjZS5ub3RQYXRod2F5RGF0YSA9PSBmYWxzZSk7XG5cdFx0ZGF0YS5tYXAoKGRzKSA9PiB7XG5cdFx0XHRsZXQgbmFtZSA9IChkcy5uYW1lLmxlbmd0aCA+IDEpID8gZHMubmFtZVsxXSA6IGRzLm5hbWVbMF07XG5cdFx0XHRvdXRwdXRbZHMudXJpXSA9IHtcblx0XHRcdFx0aWQ6IGRzLmlkZW50aWZpZXIsXG5cdFx0XHRcdHVyaTogZHMudXJpLFxuXHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZHMuZGVzY3JpcHRpb24sXG5cdFx0XHRcdHR5cGU6IGRzLnR5cGVcblx0XHRcdH07XG5cdFx0fSk7XG5cdFx0ZGF0YVNvdXJjZXMgPSBvdXRwdXQ7XG5cblx0XHQvKipcblx0XHQqIENhbGxiYWNrIGZvciBnZXQgZnVuY3Rpb24sIHdoaWNoIGlzIGFsd2F5cyBjYWxsZWQgb24gY29tcGxldGlvblxuXHRcdCpcblx0XHQqIEBjYWxsYmFjayByZXF1ZXN0Q2FsbGJhY2tcblx0XHQqIEBwYXJhbSB7YXJyYXl9IGRhdGFTb3VyY2VzIC0gQW4gYXJyYXkgY29udGFpbmluZyBkYXRhIHNvdXJjZXMgcmV0cmlldmVkIGZyb20gUEMsIGVsc2UgZW1wdHkgYXJyYXkuXG5cdFx0Ki9cblx0XHRjYWxsYmFjayhkYXRhU291cmNlcyk7XG5cdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXREYXRhU291cmNlcztcbiIsIi8qKlxuICogRmV0Y2hlcyB0aGUgbG9nbyBmb3IgdGhlIGRhdGFzb3VyY2UgdXNpbmcgZWl0aGVyIGRhdGFzb3VyY2VzIFVSSSBvciBuYW1lLiBJbnRlbmRlZCB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIGltYWdlIHRhZ3MuXG4gKiBAbW9kdWxlIGxvZ29VcmxcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2dvSWRlbnRpZmllciAtIEVpdGhlciBVUkkgb3IgbmFtZSBvZiB0aGUgZGF0YSBzb3VyY2VcbiAqIEByZXR1cm4ge3N0cmluZ30gbG9nb1VybCAtIFVSTCBvZiBkYXRhc291cmNlIGluIHF1ZXN0aW9uLCBlbHNlIGVtcHR5IHN0cmluZ1xuICovXG5jb25zdCBsb2dvVXJsID0gKGRzVXJpT3JOYW1lKSA9PiB7XG5cdHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ29Vcmw7XG4iLCIvLyBQcml2YXRlIEZ1bmN0aW9uc1xuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gcmVzcG9uc2VUZXh0XG4gKi9cbmV4cG9ydCBjb25zdCBfaHR0cEdldEFzeW5jID0gKHVybCwgY2FsbGJhY2spID0+IHtcblx0Y2FsbGJhY2soaHR0cFJlc3BvbnNlVGV4dCk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBqc29uU3RyaW5nXG4gKiBAcmV0dXJuIHtvYmplY3R9IGpzb25PYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IF9wYXJzZUpzb24gPSAoanNvblN0cmluZykgPT4ge1xuXHRyZXR1cm4ganNvbk9iamVjdDtcbn1cbiIsIi8qKlxuICogUGVmb3JtcyBhIFNFQVJDSCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQG1vZHVsZSBzZWFyY2hcbiAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeV9vYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgc2VhcmNoIGNvbW1hbmQuXG4gKiBAcGFyYW0ge3JlcXVlc3RDYWxsYmFja30gY2FsbGJhY2sgLSBUZXJtaW5hdGluZyBjYWxsYmFjaywgc2VlIGJlbG93IGZvciBhcmd1bWVudHMuXG4gKi9cbmNvbnN0IHNlYXJjaCA9IChxdWVyeV9vYmplY3QsIGNhbGxiYWNrKSA9PiB7XG5cdC8qKlxuXHQqIENhbGxiYWNrIGZvciBzZWFyY2ggZnVuY3Rpb24sIHdoaWNoIGlzIGFsd2F5cyBjYWxsZWQgb24gY29tcGxldGlvblxuXHQqXG5cdCogQGNhbGxiYWNrIHJlcXVlc3RDYWxsYmFja1xuXHQqIEBwYXJhbSB7c3RyaW5nfSByZXNwb25zZVN0YXR1cyAtIEEgc3RyaW5nIHdoaWNoIGluZGljYXRlcyBmYWlsdXJlLCBubyByZXN1bHRzIHJldHVybmVkLCBvciBzdWNjZXNzLlxuXHQqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZU9iamVjdCAtIEEgcGFyc2VkIEpTT04gb2JqZWN0IHJldHVybmVkIGZyb20gUEMgaWYgYXZhaWxhYmxlLCBlbHNlIGVtcHR5IG9iamVjdC4gUmVzdWx0IGZyb20gc2VhcmNoIGlzIGFzc3VtZWQgdG8gYmUgaW4gSlNPTiBmb3JtYXQuXG5cdCovXG5cdGNhbGxiYWNrKHJlc3BvbnNlU3RhdHVzLCByZXNwb25zZU9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNlYXJjaDtcbiIsIi8qKlxuICogUGVmb3JtcyBhIFNFQVJDSCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQG1vZHVsZSB0cmF2ZXJzZVxuICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5X29iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSB0cmF2ZXJzZSBjb21tYW5kLlxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gVGVybWluYXRpbmcgY2FsbGJhY2ssIHNlZSBiZWxvdyBmb3IgYXJndW1lbnRzLlxuICovXG5jb25zdCB0cmF2ZXJzZSA9IChxdWVyeV9hcnJheSwgY2FsbGJhY2spID0+IHtcblx0LyoqXG5cdCogQ2FsbGJhY2sgZm9yIHRyYXZlcnNlIGZ1bmN0aW9uLCB3aGljaCBpcyBhbHdheXMgY2FsbGVkIG9uIGNvbXBsZXRpb25cblx0KlxuXHQqIEBjYWxsYmFjayByZXF1ZXN0Q2FsbGJhY2tcblx0KiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2VTdGF0dXMgLSBBIHN0cmluZyB3aGljaCBpbmRpY2F0ZXMgZmFpbHVyZSwgbm8gcmVzdWx0cyByZXR1cm5lZCwgb3Igc3VjY2Vzcy5cblx0KiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2VPYmplY3QgLSBBIHBhcnNlZCBKU09OIG9iamVjdCByZXR1cm5lZCBmcm9tIFBDIGlmIGF2YWlsYWJsZSwgZWxzZSBlbXB0eSBvYmplY3QuIFJlc3VsdCBmcm9tIHRyYXZlcnNlIGlzIGFzc3VtZWQgdG8gYmUgaW4gSlNPTiBmb3JtYXQuXG5cdCovXG5cdGNhbGxiYWNrKHJlc3BvbnNlU3RhdHVzLCByZXNwb25zZU9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYXZlcnNlO1xuIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0Z2V0OiByZXF1aXJlKCcuL2dldC5qcycpLFxuXHRnZXREYXRhU291cmNlczogcmVxdWlyZSgnLi9nZXREYXRhU291cmNlcy5qcycpLFxuXHRsb2dvVXJsOiByZXF1aXJlKCcuL2xvZ29VcmwuanMnKSxcblx0c2VhcmNoOiByZXF1aXJlKCcuL3NlYXJjaC5qcycpLFxuXHR0cmF2ZXJzZTogcmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpXG59O1xuIl19
