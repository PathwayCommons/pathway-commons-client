'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a traverse query to the Pathway Commons web service
 * @alias traverse
 */
module.exports = function () {
  /**
   * Initialises traverse. Chainable.
   * @constructor
   * @returns {this}
   */
  function Traverse() {
    _classCallCheck(this, Traverse);

    this.request = new PcRequest("traverse");
  }

  /**
   * Sets all query parameters which are sent with the traverse request. Will overwrite existing query settings.
   * @method traverse#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the traverse command.
   * @returns {this}
   */


  _createClass(Traverse, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the traverse request
     * @method traverse#uri
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
     * Sets path parameter which is to be sent with the traverse request
     * @method traverse#path
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'path',
    value: function path(value) {
      this.request.set("path", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method traverse#format
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
     * @method traverse#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Traverse;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYXZlcnNlLmpzIl0sIm5hbWVzIjpbIlBjUmVxdWVzdCIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWVzdCIsInF1ZXJ5T2JqZWN0IiwicXVlcnkiLCJ2YWx1ZSIsInNldCIsImZvcm1hdFN0cmluZyIsImZvcm1hdCIsImZldGNoIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBSUEsWUFBWUMsUUFBUSx5QkFBUixDQUFoQjs7QUFFQTs7Ozs7QUFLQUMsT0FBT0MsT0FBUDtBQUNFOzs7OztBQUtBLHNCQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLElBQUlKLFNBQUosQ0FBYyxVQUFkLENBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFWRjtBQUFBO0FBQUEsMEJBZ0JRSyxXQWhCUixFQWdCcUI7QUFDcEIsV0FBS0QsT0FBTCxDQUFhRSxLQUFiLENBQW1CRCxXQUFuQjs7QUFFQSxhQUFPLElBQVA7QUFDRTs7QUFFRDs7Ozs7OztBQXRCRjtBQUFBO0FBQUEsd0JBNEJNRSxLQTVCTixFQTRCYTtBQUNULFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixLQUFqQixFQUF3QkQsS0FBeEI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFsQ0Y7QUFBQTtBQUFBLHlCQXdDT0EsS0F4Q1AsRUF3Q2M7QUFDVixXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUJELEtBQXpCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBOUNGO0FBQUE7QUFBQSwyQkFvRFNFLFlBcERULEVBb0R1QjtBQUNuQixXQUFLTCxPQUFMLENBQWFNLE1BQWIsQ0FBb0JELFlBQXBCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7QUExREY7QUFBQTtBQUFBLDRCQStEVTtBQUNOLGFBQU8sS0FBS0wsT0FBTCxDQUFhTyxLQUFiLEVBQVA7QUFDRDtBQWpFSDs7QUFBQTtBQUFBIiwiZmlsZSI6InRyYXZlcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIHRyYXZlcnNlIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyB0cmF2ZXJzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRyYXZlcnNlIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIHRyYXZlcnNlLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJ0cmF2ZXJzZVwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIHRyYXZlcnNlIHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIHRyYXZlcnNlI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSB0cmF2ZXJzZSBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG5cdHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cblx0cmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cmkgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdHJhdmVyc2UgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRyYXZlcnNlI3VyaVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1cmkodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwidXJpXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcGF0aCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0cmF2ZXJzZSByZXF1ZXN0XG4gICAqIEBtZXRob2QgdHJhdmVyc2UjcGF0aFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBwYXRoKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInBhdGhcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgb2YgcmV0dXJuZWQgZGF0YVxuICAgKiBAbWV0aG9kIHRyYXZlcnNlI2Zvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0U3RyaW5nXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIHRoaXMucmVxdWVzdC5mb3JtYXQoZm9ybWF0U3RyaW5nKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgZmV0Y2ggY2FsbCB0byB0aGUgUEMgQVBJIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgKiBAbWV0aG9kIHRyYXZlcnNlI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iXX0=