'use strict';

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a GET web query to the Pathway Commons web service
 */
module.exports = class Get {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("get");
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  query(queryObject) {
    this.request.query(queryObject);

    return this;
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @param {string} value - uri
   * @returns {this}
   */
  uri(value) {
    this.request.set("uri", value);

    return this;
  }

  /**
   * Sets format parameter which is to be sent with the get request
   * @param {string} value - format
   * @returns {this}
   */
  format(value) {
    this.request.set("format", value);

    return this;
  }

  /**
   * Initialises get and sets query object if one is provided
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
   */
  fetch() {
    return this.request.fetch();
  }
}
