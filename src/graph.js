'use strict';

var PcRequest = require('./private/pc-request.js');
var sourceCheck = require('./private/helpers.js').sourceCheck;

/**
 * @class
 * @classdesc Peforms a graph web query to the Pathway Commons web service
 */
module.exports = class Graph {
  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("graph");
  }

  /**
   * Sets kind parameter which is to be sent with the graph request
   * @param {string} value - kind
   * @returns {this}
   */
  kind(value) {
    this.request.set("kind", value);

    return this;
  }

  /**
   * Sets source parameter which is to be sent with the graph request
   * @param {string|array} value - source
   * @returns {this}
   */
  source(value, datasource) {
    if (datasource === undefined || sourceCheck(datasource, value)) {
      this.request.set("source", value);
    } else {
      throw new SyntaxError(value + " is an invalid " + datasource.toUpperCase() + " ID");
    }

    return this;
  }

  /**
   * Sets target parameter which is to be sent with the graph request
   * @param {string|array} value - target
   * @returns {this}
   */
  target(value, datasource) {
    if (datasource !== undefined) {
      this.request.set("target", value);
    } else {
      sourceCheck(datasource, value) ? this.request.set("target", value) : () => {
        throw new SyntaxError(value + " invalid " + datasource)
      };
    }

    return this;
  }

  /**
   * Sets direction parameter which is to be sent with the graph request
   * @param {string} value - direction
   * @returns {this}
   */
  direction(value) {
    this.request.set("direction", value);

    return this;
  }

  /**
   * Sets limit parameter which is to be sent with the graph request
   * @param {number} value - limit
   * @returns {this}
   */
  limit(value) {
    this.request.set("limit", value);

    return this;
  }

  /**
   * Sets format parameter which is to be sent with the graph request
   * @param {string} value - format
   * @returns {this}
   */
  format(value) {
    this.request.set("format", value);

    return this;
  }

  /**
   * Sets datasource parameter which is to be sent with the graph request
   * @param {string|array} value - datasource
   * @returns {this}
   */
  datasource(value) {
    this.request.set("datasource", value);

    return this;
  }

  /**
   * Sets organism parameter which is to be sent with the graph request
   * @param {string} value - organism
   * @returns {this}
   */
  organism(value) {
    this.request.set("organism", value);

    return this;
  }

  /**
   * Makes a fetch call to the PC API and return results
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on response headers
   */
  fetch() {
    return this.request.fetch();
  }
}
