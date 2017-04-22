'use strict';

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias top_pathways
 */
module.exports = class Top_Pathways {
  /**
   * Initialises top_pathways. Chainable.
   * @constructor
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("top_pathways");
  }

  /**
   * Sets all query parameters which are sent with the request. Will overwrite existing query settings.
   * @method top_pathways#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  query(queryObject) {
    this.request.query(queryObject);

    return this;
  }

  /**
   * Sets q parameter which is to be sent with the top_pathways request
   * @method top_pathways#q
   * @param {string} value - q
   * @returns {this}
   */
  q(value) {
    this.request.set("q", value);

    return this;
  }

  /**
   * Sets datasource parameter which is to be sent with the top_pathways request
   * @method top_pathways#datasource
   * @param {string|array} value - datasource
   * @returns {this}
   */
  datasource(value) {
    this.request.set("datasource", value);

    return this;
  }

  /**
   * Sets organism parameter which is to be sent with the top_pathways request
   * @method top_pathways#organism
   * @param {string} value - organism
   * @returns {this}
   */
  organism(value) {
    this.request.set("organism", value);

    return this;
  }

  /**
   * Sets format of returned data
   * @method top_pathways#format
   * @param {string} value - format
   * @returns {this}
   */
  format(value) {
    this.request.set("format", value);

    return this;
  }

  /**
   * Makes a fetch call to the PC API and return results
   * @method top_pathways#fetch
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
   */
  fetch() {
    return this.request.fetch();
  }
}
