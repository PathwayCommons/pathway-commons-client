'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');
var sourceCheck = require('./private/helpers.js').sourceCheck;

/**
 * @class
 * @classdesc Peforms a graph web query to the Pathway Commons web service
 * @alias graph
 */
module.exports = function () {
  /**
   * Initialises graph. Chainable.
   * @constructor
   * @returns {this}
   */
  function Graph() {
    _classCallCheck(this, Graph);

    this.request = new PcRequest("graph");
  }

  /**
   * Sets all query parameters which are sent with the graph request. Will overwrite existing query settings.
   * @method graph#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the graph command.
   * @returns {this}
   */


  _createClass(Graph, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets kind parameter which is to be sent with the graph request
     * @method graph#kind
     * @param {string} value - kind
     * @returns {this}
     */

  }, {
    key: 'kind',
    value: function kind(value) {
      this.request.set("kind", value);

      return this;
    }

    /**
     * Sets source parameter which is to be sent with the graph request
     * @method graph#source
     * @param {string|array} value - source
     * @returns {this}
     */

  }, {
    key: 'source',
    value: function source(value, datasource) {
      if (datasource === undefined || sourceCheck(datasource, value)) {
        this.request.set("source", value);
      } else {
        throw new SyntaxError(value + " is an invalid " + datasource.toUpperCase() + " ID");
      }

      return this;
    }

    /**
     * Sets target parameter which is to be sent with the graph request
     * @method graph#target
     * @param {string|array} value - target
     * @returns {this}
     */

  }, {
    key: 'target',
    value: function target(value, datasource) {
      if (datasource !== undefined) {
        this.request.set("target", value);
      } else {
        sourceCheck(datasource, value) ? this.request.set("target", value) : function () {
          throw new SyntaxError(value + " invalid " + datasource);
        };
      }

      return this;
    }

    /**
     * Sets direction parameter which is to be sent with the graph request
     * @method graph#direction
     * @param {string} value - direction
     * @returns {this}
     */

  }, {
    key: 'direction',
    value: function direction(value) {
      this.request.set("direction", value);

      return this;
    }

    /**
     * Sets limit parameter which is to be sent with the graph request
     * @method graph#limit
     * @param {number} value - limit
     * @returns {this}
     */

  }, {
    key: 'limit',
    value: function limit(value) {
      this.request.set("limit", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the graph request
     * @method graph#format
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
     * Sets datasource parameter which is to be sent with the graph request
     * @method graph#datasource
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
     * Sets organism parameter which is to be sent with the graph request
     * @method graph#organism
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
     * Makes a fetch call to the PC API and return results
     * @method graph#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on response headers
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Graph;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYXBoLmpzIl0sIm5hbWVzIjpbIlBjUmVxdWVzdCIsInJlcXVpcmUiLCJzb3VyY2VDaGVjayIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwicXVlcnlPYmplY3QiLCJxdWVyeSIsInZhbHVlIiwic2V0IiwiZGF0YXNvdXJjZSIsInVuZGVmaW5lZCIsIlN5bnRheEVycm9yIiwidG9VcHBlckNhc2UiLCJmZXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVlDLFFBQVEseUJBQVIsQ0FBaEI7QUFDQSxJQUFJQyxjQUFjRCxRQUFRLHNCQUFSLEVBQWdDQyxXQUFsRDs7QUFFQTs7Ozs7QUFLQUMsT0FBT0MsT0FBUDtBQUNFOzs7OztBQUtBLG1CQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLElBQUlMLFNBQUosQ0FBYyxPQUFkLENBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFWRjtBQUFBO0FBQUEsMEJBZ0JRTSxXQWhCUixFQWdCcUI7QUFDakIsV0FBS0QsT0FBTCxDQUFhRSxLQUFiLENBQW1CRCxXQUFuQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQXRCRjtBQUFBO0FBQUEseUJBNEJPRSxLQTVCUCxFQTRCYztBQUNWLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixNQUFqQixFQUF5QkQsS0FBekI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFsQ0Y7QUFBQTtBQUFBLDJCQXdDU0EsS0F4Q1QsRUF3Q2dCRSxVQXhDaEIsRUF3QzRCO0FBQ3hCLFVBQUlBLGVBQWVDLFNBQWYsSUFBNEJULFlBQVlRLFVBQVosRUFBd0JGLEtBQXhCLENBQWhDLEVBQWdFO0FBQzlELGFBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixRQUFqQixFQUEyQkQsS0FBM0I7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNLElBQUlJLFdBQUosQ0FBZ0JKLFFBQVEsaUJBQVIsR0FBNEJFLFdBQVdHLFdBQVgsRUFBNUIsR0FBdUQsS0FBdkUsQ0FBTjtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBbERGO0FBQUE7QUFBQSwyQkF3RFNMLEtBeERULEVBd0RnQkUsVUF4RGhCLEVBd0Q0QjtBQUN4QixVQUFJQSxlQUFlQyxTQUFuQixFQUE4QjtBQUM1QixhQUFLTixPQUFMLENBQWFJLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkJELEtBQTNCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xOLG9CQUFZUSxVQUFaLEVBQXdCRixLQUF4QixJQUFpQyxLQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsUUFBakIsRUFBMkJELEtBQTNCLENBQWpDLEdBQXFFLFlBQU07QUFDekUsZ0JBQU0sSUFBSUksV0FBSixDQUFnQkosUUFBUSxXQUFSLEdBQXNCRSxVQUF0QyxDQUFOO0FBQ0QsU0FGRDtBQUdEOztBQUVELGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBcEVGO0FBQUE7QUFBQSw4QkEwRVlGLEtBMUVaLEVBMEVtQjtBQUNmLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixXQUFqQixFQUE4QkQsS0FBOUI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFoRkY7QUFBQTtBQUFBLDBCQXNGUUEsS0F0RlIsRUFzRmU7QUFDWCxXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUIsT0FBakIsRUFBMEJELEtBQTFCOztBQUVBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBNUZGO0FBQUE7QUFBQSwyQkFrR1NBLEtBbEdULEVBa0dnQjtBQUNaLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixRQUFqQixFQUEyQkQsS0FBM0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUF4R0Y7QUFBQTtBQUFBLCtCQThHYUEsS0E5R2IsRUE4R29CO0FBQ2hCLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQixZQUFqQixFQUErQkQsS0FBL0I7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFwSEY7QUFBQTtBQUFBLDZCQTBIV0EsS0ExSFgsRUEwSGtCO0FBQ2QsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCLFVBQWpCLEVBQTZCRCxLQUE3Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBaElGO0FBQUE7QUFBQSw0QkFxSVU7QUFDTixhQUFPLEtBQUtILE9BQUwsQ0FBYVMsS0FBYixFQUFQO0FBQ0Q7QUF2SUg7O0FBQUE7QUFBQSIsImZpbGUiOiJncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG52YXIgc291cmNlQ2hlY2sgPSByZXF1aXJlKCcuL3ByaXZhdGUvaGVscGVycy5qcycpLnNvdXJjZUNoZWNrO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgZ3JhcGggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyBncmFwaFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdyYXBoIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGdyYXBoLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJncmFwaFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIGdyYXBoI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBncmFwaCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMga2luZCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgja2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBraW5kXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAga2luZCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJraW5kXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNzb3VyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgc291cmNlKHZhbHVlLCBkYXRhc291cmNlKSB7XG4gICAgaWYgKGRhdGFzb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBzb3VyY2VDaGVjayhkYXRhc291cmNlLCB2YWx1ZSkpIHtcbiAgICAgIHRoaXMucmVxdWVzdC5zZXQoXCJzb3VyY2VcIiwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IodmFsdWUgKyBcIiBpcyBhbiBpbnZhbGlkIFwiICsgZGF0YXNvdXJjZS50b1VwcGVyQ2FzZSgpICsgXCIgSURcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0YXJnZXQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI3RhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSB0YXJnZXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB0YXJnZXQodmFsdWUsIGRhdGFzb3VyY2UpIHtcbiAgICBpZiAoZGF0YXNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlcXVlc3Quc2V0KFwidGFyZ2V0XCIsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlQ2hlY2soZGF0YXNvdXJjZSwgdmFsdWUpID8gdGhpcy5yZXF1ZXN0LnNldChcInRhcmdldFwiLCB2YWx1ZSkgOiAoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcih2YWx1ZSArIFwiIGludmFsaWQgXCIgKyBkYXRhc291cmNlKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRpcmVjdGlvbiBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjZGlyZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGRpcmVjdGlvblxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGRpcmVjdGlvbih2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkaXJlY3Rpb25cIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBsaW1pdCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjbGltaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gbGltaXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBsaW1pdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJsaW1pdFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvcm1hdCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkYXRhc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNkYXRhc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIGRhdGFzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkYXRhc291cmNlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCBncmFwaCNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiByZXNwb25zZSBoZWFkZXJzXG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiJdfQ==