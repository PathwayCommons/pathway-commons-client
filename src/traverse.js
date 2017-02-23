'use strict';

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a traverse query to the Pathway Commons web service
 * @alias traverse
 */
module.exports = class Traverse {
  /**
   * Initialises traverse. Chainable.
   * @constructor
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("traverse");
  }

  /**
   * Sets all query parameters which are sent with the traverse request. Will overwrite existing query settings.
   * @method traverse#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the traverse command.
   * @returns {this}
   */
  query(queryObject) {
	this.request.query(queryObject);

	return this;
  }

  /**
   * Sets uri parameter which is to be sent with the traverse request
   * @method traverse#uri
   * @param {string} value - uri
   * @returns {this}
   */
  uri(value) {
    this.request.set("uri", value);

    return this;
  }

  /**
   * Sets path parameter which is to be sent with the traverse request
   * @method traverse#path
   * @param {string} value - uri
   * @returns {this}
   */
  path(value) {
    this.request.set("path", value);

    return this;
  }

  /**
   * Sets format of returned data
   * @method traverse#format
   * @param {string} formatString
   * @returns {this}
   */
  format(formatString) {
    this.request.format(formatString);

    return this;
  }

  /**
   * Makes a fetch call to the PC API and return results
   * @method traverse#fetch
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
   */
  fetch() {
    return this.request.fetch();
  }
}
