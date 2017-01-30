(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pathwayCommons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @param {array} query_array
 * @param {requestCallback} callback - getResponseObject
 */
var get = function get(query_array, callback) {
  callback(responseText);
};

exports.default = get;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('./private/helpers.js');

/**
 * @param {requestCallback} callback - dataSourcesArray
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
		callback(dataSources);
	});
};

exports.default = getDataSources;

},{"./private/helpers.js":5}],3:[function(require,module,exports){
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

},{"./get.js":1,"./getDataSources.js":2,"./logoUrl.js":4,"./search.js":6,"./traverse.js":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @param {string} logoIdentifier
 * @return {string} logoUrl
 */
var logoUrl = function logoUrl(dsUriOrName) {
  return string;
};

exports.default = logoUrl;

},{}],5:[function(require,module,exports){
"use strict";

// Private Functions
/**
 * @private
 * @param {string} url
 * @param {requestCallback} callback - responseText
 */
function _httpGetAsync(url, callback) {
  callback(httpResponseText);
}

/**
 * @private
 * @param {string} jsonString
 * @return {object} jsonObject
 */
function _parseJson(jsonString) {
  return jsonObject;
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @param {array} query_array
 * @param {requestCallback} callback - searchResponseObject
 */
var search = function search(query_array, callback) {
  callback(responseObj);
};

exports.default = search;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @param {array} query_array
 * @param {requestCallback} callback - traverseResponseObject
 */
var traverse = function traverse(query_array, callback) {
  callback(responseObj);
};

exports.default = traverse;

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2V0LmpzIiwic3JjL2dldERhdGFTb3VyY2VzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2xvZ29VcmwuanMiLCJzcmMvcHJpdmF0ZS9oZWxwZXJzLmpzIiwic3JjL3NlYXJjaC5qcyIsInNyYy90cmF2ZXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUE7Ozs7QUFJQSxJQUFNLE1BQU0sU0FBTixHQUFNLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBMkI7QUFDdEMsV0FBUyxZQUFUO0FBQ0EsQ0FGRDs7a0JBSWUsRzs7Ozs7Ozs7O0FDUmY7O0FBRUE7OztBQUdBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsUUFBRCxFQUFjO0FBQ3BDO0FBQ0EsNkJBQWMsUUFBUSx1Q0FBdEIsRUFBK0QsVUFBQyxJQUFELEVBQVU7QUFDeEUsTUFBSSxTQUFTLEVBQWI7QUFDQSxTQUFPLHlCQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBd0I7QUFBQSxVQUFVLE9BQU8sY0FBUCxJQUF5QixLQUFuQztBQUFBLEdBQXhCLENBQVA7QUFDQSxPQUFLLEdBQUwsQ0FBUyxVQUFDLEVBQUQsRUFBUTtBQUNoQixPQUFJLE9BQVEsR0FBRyxJQUFILENBQVEsTUFBUixHQUFpQixDQUFsQixHQUF1QixHQUFHLElBQUgsQ0FBUSxDQUFSLENBQXZCLEdBQW9DLEdBQUcsSUFBSCxDQUFRLENBQVIsQ0FBL0M7QUFDQSxVQUFPLEdBQUcsR0FBVixJQUFpQjtBQUNoQixRQUFJLEdBQUcsVUFEUztBQUVoQixTQUFLLEdBQUcsR0FGUTtBQUdoQixVQUFNLElBSFU7QUFJaEIsaUJBQWEsR0FBRyxXQUpBO0FBS2hCLFVBQU0sR0FBRztBQUxPLElBQWpCO0FBT0EsR0FURDtBQVVBLGdCQUFjLE1BQWQ7QUFDQSxXQUFTLFdBQVQ7QUFDQSxFQWZEO0FBZ0JBLENBbEJEOztrQkFvQmUsYzs7Ozs7Ozs7QUN6QmY7Ozs7OztrQkFNZTtBQUNkLE1BQUssUUFBUSxVQUFSLENBRFM7QUFFZCxpQkFBZ0IsUUFBUSxxQkFBUixDQUZGO0FBR2QsVUFBUyxRQUFRLGNBQVIsQ0FISztBQUlkLFNBQVEsUUFBUSxhQUFSLENBSk07QUFLZCxXQUFVLFFBQVEsZUFBUjtBQUxJLEM7Ozs7Ozs7O0FDTmY7Ozs7QUFJQSxJQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsV0FBRCxFQUFpQjtBQUNoQyxTQUFPLE1BQVA7QUFDQSxDQUZEOztrQkFJZSxPOzs7OztBQ1JmO0FBQ0E7Ozs7O0FBS0EsU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQTRCLFFBQTVCLEVBQXNDO0FBQ3JDLFdBQVMsZ0JBQVQ7QUFDQTs7QUFFRDs7Ozs7QUFLQSxTQUFTLFVBQVQsQ0FBb0IsVUFBcEIsRUFBZ0M7QUFDL0IsU0FBTyxVQUFQO0FBQ0E7Ozs7Ozs7O0FDakJEOzs7O0FBSUEsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQTJCO0FBQ3pDLFdBQVMsV0FBVDtBQUNBLENBRkQ7O2tCQUllLE07Ozs7Ozs7O0FDUmY7Ozs7QUFJQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBMkI7QUFDM0MsV0FBUyxXQUFUO0FBQ0EsQ0FGRDs7a0JBSWUsUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBwYXJhbSB7YXJyYXl9IHF1ZXJ5X2FycmF5XG4gKiBAcGFyYW0ge3JlcXVlc3RDYWxsYmFja30gY2FsbGJhY2sgLSBnZXRSZXNwb25zZU9iamVjdFxuICovXG5jb25zdCBnZXQgPSAocXVlcnlfYXJyYXksIGNhbGxiYWNrKSA9PiB7XG5cdGNhbGxiYWNrKHJlc3BvbnNlVGV4dCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldDtcbiIsImltcG9ydCB7X2h0dHBHZXRBc3luYywgX3BhcnNlSnNvbn0gZnJvbSAnLi9wcml2YXRlL2hlbHBlcnMuanMnO1xuXG4vKipcbiAqIEBwYXJhbSB7cmVxdWVzdENhbGxiYWNrfSBjYWxsYmFjayAtIGRhdGFTb3VyY2VzQXJyYXlcbiAqL1xuY29uc3QgZ2V0RGF0YVNvdXJjZXMgPSAoY2FsbGJhY2spID0+IHtcblx0Ly9jb3B5IGRhdGEgc291cmNlcyB0byB0aGUgZ2xvYmFsIGFycmF5OiBrZXBwIGp1c3Qgc29tZSBmaWVsZHMgYW5kIG9ubHkgcGF0aHdheSBkYXRhIHNvdXJjZXMgKG5vdCBlLmcuLCBDaEVCSSlcblx0X2h0dHBHZXRBc3luYyhQQ1VybCArICdtZXRhZGF0YS9kYXRhc291cmNlcz91c2VyPXBjMnBhdGh3YXlzJywgKGRhdGEpID0+IHtcblx0XHR2YXIgb3V0cHV0ID0ge307XG5cdFx0ZGF0YSA9IF9wYXJzZUpzb24oZGF0YSkuZmlsdGVyKHNvdXJjZSA9PiBzb3VyY2Uubm90UGF0aHdheURhdGEgPT0gZmFsc2UpO1xuXHRcdGRhdGEubWFwKChkcykgPT4ge1xuXHRcdFx0bGV0IG5hbWUgPSAoZHMubmFtZS5sZW5ndGggPiAxKSA/IGRzLm5hbWVbMV0gOiBkcy5uYW1lWzBdO1xuXHRcdFx0b3V0cHV0W2RzLnVyaV0gPSB7XG5cdFx0XHRcdGlkOiBkcy5pZGVudGlmaWVyLFxuXHRcdFx0XHR1cmk6IGRzLnVyaSxcblx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IGRzLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHR0eXBlOiBkcy50eXBlXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdGRhdGFTb3VyY2VzID0gb3V0cHV0O1xuXHRcdGNhbGxiYWNrKGRhdGFTb3VyY2VzKTtcblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldERhdGFTb3VyY2VzO1xuIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0Z2V0OiByZXF1aXJlKCcuL2dldC5qcycpLFxuXHRnZXREYXRhU291cmNlczogcmVxdWlyZSgnLi9nZXREYXRhU291cmNlcy5qcycpLFxuXHRsb2dvVXJsOiByZXF1aXJlKCcuL2xvZ29VcmwuanMnKSxcblx0c2VhcmNoOiByZXF1aXJlKCcuL3NlYXJjaC5qcycpLFxuXHR0cmF2ZXJzZTogcmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpXG59O1xuIiwiLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9nb0lkZW50aWZpZXJcbiAqIEByZXR1cm4ge3N0cmluZ30gbG9nb1VybFxuICovXG5jb25zdCBsb2dvVXJsID0gKGRzVXJpT3JOYW1lKSA9PiB7XG5cdHJldHVybiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ29Vcmw7XG4iLCIvLyBQcml2YXRlIEZ1bmN0aW9uc1xuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gcmVzcG9uc2VUZXh0XG4gKi9cbmZ1bmN0aW9uIF9odHRwR2V0QXN5bmModXJsLCBjYWxsYmFjaykge1xuXHRjYWxsYmFjayhodHRwUmVzcG9uc2VUZXh0KTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGpzb25TdHJpbmdcbiAqIEByZXR1cm4ge29iamVjdH0ganNvbk9iamVjdFxuICovXG5mdW5jdGlvbiBfcGFyc2VKc29uKGpzb25TdHJpbmcpIHtcblx0cmV0dXJuIGpzb25PYmplY3Q7XG59XG4iLCIvKipcbiAqIEBwYXJhbSB7YXJyYXl9IHF1ZXJ5X2FycmF5XG4gKiBAcGFyYW0ge3JlcXVlc3RDYWxsYmFja30gY2FsbGJhY2sgLSBzZWFyY2hSZXNwb25zZU9iamVjdFxuICovXG5jb25zdCBzZWFyY2ggPSAocXVlcnlfYXJyYXksIGNhbGxiYWNrKSA9PiB7XG5cdGNhbGxiYWNrKHJlc3BvbnNlT2JqKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VhcmNoO1xuIiwiLyoqXG4gKiBAcGFyYW0ge2FycmF5fSBxdWVyeV9hcnJheVxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gdHJhdmVyc2VSZXNwb25zZU9iamVjdFxuICovXG5jb25zdCB0cmF2ZXJzZSA9IChxdWVyeV9hcnJheSwgY2FsbGJhY2spID0+IHtcblx0Y2FsbGJhY2socmVzcG9uc2VPYmopO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmF2ZXJzZTtcbiJdfQ==
