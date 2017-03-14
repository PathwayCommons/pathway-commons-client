'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a search web query to the Pathway Commons web service
 * @alias search
 */
module.exports = function () {
  /**
   * Initialises search. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  function Search() {
    _classCallCheck(this, Search);

    this.request = new PcRequest("search").format("json");
  }

  /**
   * Sets all query parameters which are sent with the search request. Will overwrite existing query settings.
   * @method search#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */


  _createClass(Search, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the search request
     * @method search#q
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets page parameter which is to be sent with the search request
     * @method search#page
     * @param {string} value - page
     * @returns {this}
     */

  }, {
    key: 'page',
    value: function page(value) {
      this.request.set("page", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the search request
     * @method search#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the search request
     * @method search#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Sets type parameter which is to be sent with the search request
     * @method search#type
     * @param {string} value - type
     * @returns {this}
     */

  }, {
    key: 'type',
    value: function type(value) {
      this.request.set("type", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method search#format
     * @param {string} formatString
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(formatString) {
      this.request.format(formatString);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method search#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Search;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaC5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVlc3QiLCJmb3JtYXQiLCJxdWVyeU9iamVjdCIsInF1ZXJ5IiwidmFsdWUiLCJzZXQiLCJmb3JtYXRTdHJpbmciLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7O0FBTUEsb0JBQWM7QUFBQTs7QUFDWixTQUFLQyxPQUFMLEdBQWUsSUFBSUosU0FBSixDQUFjLFFBQWQsRUFBd0JLLE1BQXhCLENBQStCLE1BQS9CLENBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFYRjtBQUFBO0FBQUEsMEJBaUJRQyxXQWpCUixFQWlCcUI7QUFDakIsV0FBS0YsT0FBTCxDQUFhRyxLQUFiLENBQW1CRCxXQUFuQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQXZCRjtBQUFBO0FBQUEsc0JBNkJJRSxLQTdCSixFQTZCVztBQUNQLFdBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQixHQUFqQixFQUFzQkQsS0FBdEI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFuQ0Y7QUFBQTtBQUFBLHlCQXlDT0EsS0F6Q1AsRUF5Q2M7QUFDVixXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUJELEtBQXpCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBL0NGO0FBQUE7QUFBQSwrQkFxRGFBLEtBckRiLEVBcURvQjtBQUNoQixXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsWUFBakIsRUFBK0JELEtBQS9COztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBM0RGO0FBQUE7QUFBQSw2QkFpRVdBLEtBakVYLEVBaUVrQjtBQUNkLFdBQUtKLE9BQUwsQ0FBYUssR0FBYixDQUFpQixVQUFqQixFQUE2QkQsS0FBN0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF2RUY7QUFBQTtBQUFBLHlCQTZFT0EsS0E3RVAsRUE2RWM7QUFDVixXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUJELEtBQXpCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbkZGO0FBQUE7QUFBQSwyQkF5RlNFLFlBekZULEVBeUZ1QjtBQUNuQixXQUFLTixPQUFMLENBQWFDLE1BQWIsQ0FBb0JLLFlBQXBCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUEvRkY7QUFBQTtBQUFBLDRCQW9HVTtBQUNOLGFBQU8sS0FBS04sT0FBTCxDQUFhTyxLQUFiLEVBQVA7QUFDRDtBQXRHSDs7QUFBQTtBQUFBIiwiZmlsZSI6InNlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBzZWFyY2ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyBzZWFyY2hcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZWFyY2gge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgc2VhcmNoLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge29iamVjdH0gW3F1ZXJ5T2JqZWN0XSAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwic2VhcmNoXCIpLmZvcm1hdChcImpzb25cIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2Qgc2VhcmNoI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHEgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInFcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBwYWdlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHNlYXJjaCByZXF1ZXN0XG4gICAqIEBtZXRob2Qgc2VhcmNoI3BhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gcGFnZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHBhZ2UodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicGFnZVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGFzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjZGF0YXNvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBkYXRhc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGF0YXNvdXJjZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkYXRhc291cmNlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHR5cGUgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0eXBlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgdHlwZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ0eXBlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCBzZWFyY2gjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQoZm9ybWF0U3RyaW5nKSB7XG4gICAgdGhpcy5yZXF1ZXN0LmZvcm1hdChmb3JtYXRTdHJpbmcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2Qgc2VhcmNoI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iXX0=