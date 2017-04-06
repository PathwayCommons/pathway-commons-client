'use strict';

var PcRequest = require('./private/pc-request.js');
var escapeLucene = require('./private/helpers.js').escapeLucene;

/**
 * @class
 * @classdesc Peforms a search web query to the Pathway Commons web service
 * @alias search
 */
module.exports = class Search {
  /**
   * Initialises search. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  constructor() {
    this.request = new PcRequest("search").format("json");
  }

  /**
   * Sets all query parameters which are sent with the search request. Will overwrite existing query settings.
   * @method search#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  query(queryObject) {
    this.request.query(queryObject);

    return this;
  }

  /**
   * Sets q parameter which is to be sent with the search request
   * @method search#q
   * @param {string} value - uri
   * @returns {this}
   */
  q(value) {
    this.request.set("q", value);

    return this;
  }

  /**
   * Sets page parameter which is to be sent with the search request
   * @method search#page
   * @param {string} value - page
   * @returns {this}
   */
  page(value) {
    this.request.set("page", value);

    return this;
  }

  /**
   * Sets datasource parameter which is to be sent with the search request
   * @method search#datasource
   * @param {string|array} value - datasource
   * @returns {this}
   */
  datasource(value) {
    this.request.set("datasource", value);

    return this;
  }

  /**
   * Sets organism parameter which is to be sent with the search request
   * @method search#organism
   * @param {string} value - organism
   * @returns {this}
   */
  organism(value) {
    this.request.set("organism", value);

    return this;
  }

  /**
   * Sets type parameter which is to be sent with the search request
   * @method search#type
   * @param {string} value - type
   * @returns {this}
   */
  type(value) {
    this.request.set("type", value);

    return this;
  }

  /**
   * Escapes whatever value is contained in q at the moment
   * @method search#escape
   * @param {boolean} [toggle=true] - Switches lucene escaping on or off.
   * @returns {this}
   */
  escape(toggle) {
    if(toggle === undefined || toggle === true) {
      this.q(escapeLucene(this.request.queryObject.q));
    }

    return this;
  }

  /**
   * Sets format of returned data
   * @method search#format
   * @param {string} formatString
   * @returns {this}
   */
  format(formatString) {
    this.request.format(formatString);

    return this;
  }

  /**
   * Makes a fetch call to the PC API and return results
   * @method search#fetch
   * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
   */
  fetch() {
    return this.request.fetch();
  }
}
