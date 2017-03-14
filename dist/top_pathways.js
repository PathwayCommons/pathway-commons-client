'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias top_pathways
 */
module.exports = function () {
  /**
   * Initialises top_pathways. Chainable.
   * @constructor
   * @returns {this}
   */
  function Top_Pathways() {
    _classCallCheck(this, Top_Pathways);

    this.request = new PcRequest("top_pathways");
  }

  /**
   * Sets all query parameters which are sent with the request. Will overwrite existing query settings.
   * @method top_pathways#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Top_Pathways, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the top_pathways request
     * @method top_pathways#q
     * @param {string} value - q
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the top_pathways request
     * @method top_pathways#datasource
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
     * Sets organism parameter which is to be sent with the top_pathways request
     * @method top_pathways#organism
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
     * Sets format of returned data
     * @method top_pathways#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method top_pathways#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Top_Pathways;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvcF9wYXRod2F5cy5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVlc3QiLCJxdWVyeU9iamVjdCIsInF1ZXJ5IiwidmFsdWUiLCJzZXQiLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSwwQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJSixTQUFKLENBQWMsY0FBZCxDQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBVkY7QUFBQTtBQUFBLDBCQWdCUUssV0FoQlIsRUFnQnFCO0FBQ2pCLFdBQUtELE9BQUwsQ0FBYUUsS0FBYixDQUFtQkQsV0FBbkI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF0QkY7QUFBQTtBQUFBLHNCQTRCSUUsS0E1QkosRUE0Qlc7QUFDUCxXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsR0FBakIsRUFBc0JELEtBQXRCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbENGO0FBQUE7QUFBQSwrQkF3Q2FBLEtBeENiLEVBd0NvQjtBQUNuQixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsWUFBakIsRUFBK0JELEtBQS9COztBQUVBLGFBQU8sSUFBUDtBQUNFOztBQUVEOzs7Ozs7O0FBOUNGO0FBQUE7QUFBQSw2QkFvRFdBLEtBcERYLEVBb0RrQjtBQUNqQixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkJELEtBQTdCOztBQUVBLGFBQU8sSUFBUDtBQUNFOztBQUVEOzs7Ozs7O0FBMURGO0FBQUE7QUFBQSwyQkFnRVNBLEtBaEVULEVBZ0VnQjtBQUNaLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixRQUFqQixFQUEyQkQsS0FBM0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQXRFRjtBQUFBO0FBQUEsNEJBMkVVO0FBQ04sYUFBTyxLQUFLSCxPQUFMLENBQWFLLEtBQWIsRUFBUDtBQUNEO0FBN0VIOztBQUFBO0FBQUEiLCJmaWxlIjoidG9wX3BhdGh3YXlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHRvcF9wYXRod2F5c1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRvcF9QYXRod2F5cyB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyB0b3BfcGF0aHdheXMuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcInRvcF9wYXRod2F5c1wiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNxdWVyeVxuICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnlPYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICB0aGlzLnJlcXVlc3QucXVlcnkocXVlcnlPYmplY3QpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBxIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRvcF9wYXRod2F5cyByZXF1ZXN0XG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI3FcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gcVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHEodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGFzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9wX3BhdGh3YXlzIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZGF0YXNvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBkYXRhc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGF0YXNvdXJjZSh2YWx1ZSkge1xuXHR0aGlzLnJlcXVlc3Quc2V0KFwiZGF0YXNvdXJjZVwiLCB2YWx1ZSk7XG5cblx0cmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBvcmdhbmlzbVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIG9yZ2FuaXNtKHZhbHVlKSB7XG5cdHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cblx0cmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgb2YgcmV0dXJuZWQgZGF0YVxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gZm9ybWF0XG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZm9ybWF0KHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImZvcm1hdFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiJdfQ==