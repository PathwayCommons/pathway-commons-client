'use strict';

var PcRequest = require('./private/pc-request.js');
var _buildUniprotUri = require('./private/helpers.js')._buildUniprotUri;

/**
 * @class
 * @classdesc Peforms a GET web query to the Pathway Commons web service
 */
class Get {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  constructor(queryObject) {
    this.request = new PcRequest("get").query(queryObject);
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
   * Sets uri parameter using the uniprot ID
   * @param {string} value - uri
   * @returns {this}
   */
  uniprot(uniprotId) {
    this.uri(_buildUniprotUri(uniprotId));

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
   *
   */
  /** Initialises get and sets query object if one is provided
   * @param {requestCallback} [callback] - Terminating callback, see below for arguments
   * @return {this}
   */
  fetch(callback) {
    return this.request.fetch().then((response) => {
      if (callback !== undefined) {
        /**
         * Callback for get function, which is always called on completion
         *
         * @callback get~requestCallback
         * @param {string|object} response - Response text or object returned from PC if available. Otherwise if no response returned, returns false. If there was a network failure, null returned.
         */
        callback(response);
        return this;
      } else {
        return response;
      }
    });
  }
}

module.exports = Get;
