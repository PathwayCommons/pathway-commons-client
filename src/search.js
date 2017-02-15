'use strict';

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a search web query to the Pathway Commons web service
 */
module.exports = class Search {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("search").format("json");
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
   * Sets q parameter which is to be sent with the search request
   * @param {string} value - uri
   * @returns {this}
   */
  q(value) {
    this.request.set("q", value);

    return this;
  }

  /**
   * Sets page parameter which is to be sent with the search request
   * @param {string} value - page
   * @returns {this}
   */
  page(value) {
    this.request.set("page", value);

    return this;
  }

  /**
   * Sets datasource parameter which is to be sent with the search request
   * @param {string|array} value - datasource
   * @returns {this}
   */
  datasource(value) {
    this.request.set("datasource", value);

    return this;
  }

  /**
   * Sets organism parameter which is to be sent with the search request
   * @param {string} value - organism
   * @returns {this}
   */
  organism(value) {
    this.request.set("organism", value);

    return this;
  }

  /**
   * Sets type parameter which is to be sent with the search request
   * @param {string} value - type
   * @returns {this}
   */
  type(value) {
    this.request.set("type", value);

    return this;
  }

  format(formatString) {
    this.request.format(formatString);

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
