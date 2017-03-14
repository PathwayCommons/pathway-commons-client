'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias get
 */
module.exports = function () {
  /**
   * Initialises get. Chainable.
   * @constructor
   * @returns {this}
   */
  function Get() {
    _classCallCheck(this, Get);

    this.request = new PcRequest("get");
  }

  /**
   * Sets all query parameters which are sent with the get request. Will overwrite existing query settings.
   * @method get#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Get, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the get request
     * @method get#uri
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      this.request.set("uri", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the get request
     * @method get#format
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
     * @method get#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Get;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldC5qcyJdLCJuYW1lcyI6WyJQY1JlcXVlc3QiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVlc3QiLCJxdWVyeU9iamVjdCIsInF1ZXJ5IiwidmFsdWUiLCJzZXQiLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7O0FBRUE7Ozs7O0FBS0FDLE9BQU9DLE9BQVA7QUFDRTs7Ozs7QUFLQSxpQkFBYztBQUFBOztBQUNaLFNBQUtDLE9BQUwsR0FBZSxJQUFJSixTQUFKLENBQWMsS0FBZCxDQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBVkY7QUFBQTtBQUFBLDBCQWdCUUssV0FoQlIsRUFnQnFCO0FBQ2pCLFdBQUtELE9BQUwsQ0FBYUUsS0FBYixDQUFtQkQsV0FBbkI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF0QkY7QUFBQTtBQUFBLHdCQTRCTUUsS0E1Qk4sRUE0QmE7QUFDVCxXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsS0FBakIsRUFBd0JELEtBQXhCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbENGO0FBQUE7QUFBQSwyQkF3Q1NBLEtBeENULEVBd0NnQjtBQUNaLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixRQUFqQixFQUEyQkQsS0FBM0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQTlDRjtBQUFBO0FBQUEsNEJBbURVO0FBQ04sYUFBTyxLQUFLSCxPQUFMLENBQWFLLEtBQWIsRUFBUDtBQUNEO0FBckRIOztBQUFBO0FBQUEiLCJmaWxlIjoiZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIGdldFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdldCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBnZXQuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcImdldFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCBnZXQjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdldCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I3VyaVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1cmkodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwidXJpXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I2Zvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBmb3JtYXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZm9ybWF0XCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgZmV0Y2ggY2FsbCB0byB0aGUgUEMgQVBJIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgKiBAbWV0aG9kIGdldCNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiBmb3JtYXRcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuZmV0Y2goKTtcbiAgfVxufVxuIl19