'use strict';

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias get
 */
module.exports = class Get {
  /**
   * Initialises get. Chainable.
   * @constructor
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("get");
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @method get#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  query(queryObject) {
    this.request.query(queryObject);

    return this;
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @method get#uri
   * @param {string} value - uri
   * @returns {this}
   */
  uri(value) {
    this.request.set("uri", value);

    return this;
  }

  /**
   * Sets format parameter which is to be sent with the get request
   * @method get#format
   * @param {string} value - format
   * @returns {this}
   */
  format(value) {
    this.request.set("format", value);

    return this;
  }

  /**
   * Initialises get and sets query object if one is provided
   * @method get#fetch
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
   */
  fetch() {
    return this.request.fetch();
  }
}
