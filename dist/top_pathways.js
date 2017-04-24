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

    this.request = new PcRequest("top_pathways").format("json");
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
      this.request.format(value);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvcF9wYXRod2F5cy5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVlc3QiLCJmb3JtYXQiLCJxdWVyeU9iamVjdCIsInF1ZXJ5IiwidmFsdWUiLCJzZXQiLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSwwQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJSixTQUFKLENBQWMsY0FBZCxFQUE4QkssTUFBOUIsQ0FBcUMsTUFBckMsQ0FBZjtBQUNEOztBQUVEOzs7Ozs7OztBQVZGO0FBQUE7QUFBQSwwQkFnQlFDLFdBaEJSLEVBZ0JxQjtBQUNqQixXQUFLRixPQUFMLENBQWFHLEtBQWIsQ0FBbUJELFdBQW5COztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBdEJGO0FBQUE7QUFBQSxzQkE0QklFLEtBNUJKLEVBNEJXO0FBQ1AsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLEdBQWpCLEVBQXNCRCxLQUF0Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQWxDRjtBQUFBO0FBQUEsK0JBd0NhQSxLQXhDYixFQXdDb0I7QUFDaEIsV0FBS0osT0FBTCxDQUFhSyxHQUFiLENBQWlCLFlBQWpCLEVBQStCRCxLQUEvQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQTlDRjtBQUFBO0FBQUEsNkJBb0RXQSxLQXBEWCxFQW9Ea0I7QUFDZCxXQUFLSixPQUFMLENBQWFLLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkJELEtBQTdCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBMURGO0FBQUE7QUFBQSwyQkFnRVNBLEtBaEVULEVBZ0VnQjtBQUNaLFdBQUtKLE9BQUwsQ0FBYUMsTUFBYixDQUFvQkcsS0FBcEI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQXRFRjtBQUFBO0FBQUEsNEJBMkVVO0FBQ04sYUFBTyxLQUFLSixPQUFMLENBQWFNLEtBQWIsRUFBUDtBQUNEO0FBN0VIOztBQUFBO0FBQUEiLCJmaWxlIjoidG9wX3BhdGh3YXlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHRvcF9wYXRod2F5c1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRvcF9QYXRod2F5cyB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyB0b3BfcGF0aHdheXMuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcInRvcF9wYXRod2F5c1wiKS5mb3JtYXQoXCJqc29uXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBnZXQgY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHEgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9wX3BhdGh3YXlzIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBxXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJxXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGF0YXNvdXJjZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNkYXRhc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIGRhdGFzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkYXRhc291cmNlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBvcmdhbmlzbVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIG9yZ2FuaXNtKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcIm9yZ2FuaXNtXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5mb3JtYXQodmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iXX0=