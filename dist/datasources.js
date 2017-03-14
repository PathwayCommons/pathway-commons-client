'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = require('lodash/isObject');

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Fetches an array of datasources from PC.
 * @alias datasources
 */
module.exports = function () {
  /**
   * Initialises datasources and makes a request to PC server fetching datasource data. Chainable.
   * @constructor
   * @returns {this}
   */
  function Datasources() {
    _classCallCheck(this, Datasources);

    this.request = new PcRequest("metadata/datasources", false);
    this.data = this.fetch();
  }

  /**
   * Makes a fetch request to PC requesting data sources. If called after class initialization, purges existing data source cache and makes a call to PC to re-fetch data sources.
   * @method datasources#fetch
   * @returns {Promise<object>} - Returns promise containing either the data source array or null if data source is not available
   */


  _createClass(Datasources, [{
    key: 'fetch',
    value: function fetch() {
      var dataPromise = this.request.fetch().then(function (response) {
        var output = {};
        if (isObject(response)) {
          response.filter(function (source) {
            return source.notPathwayData == false;
          }).map(function (ds) {
            var name = ds.name.length > 1 ? ds.name[1] : ds.name[0];
            output[ds.uri] = {
              id: ds.identifier,
              uri: ds.uri,
              name: name,
              description: ds.description,
              type: ds.type,
              iconUrl: ds.iconUrl
            };
          });
        } else {
          output = null;
        }
        return output;
      }).catch(function () {
        return null;
      });

      this.data = dataPromise;
      return dataPromise;
    }

    /**
     * Returns promise containing data sources from PC.
     * @method datasources#get
     * @returns {Promise<object>} - Returns cached promise from the fetch method
     */

  }, {
    key: 'get',
    value: function get() {
      return this.data;
    }

    /**
     * Fetches the logo for the datasource using either datasources URI or name. Intended to be used to generate image tags for thumbnails.
     * @method datasources#lookupIcon
     * @param {string} dsUriOrName - Either URI or name of the data source
     * @return {Promise<string>} logoUrl - Promise containing URL of datasource in question, else undefined if datasource not found
     */

  }, {
    key: 'lookupIcon',
    value: function lookupIcon(dsUriOrName) {
      dsUriOrName = dsUriOrName || "";
      return this.data.then(function (dataSources) {
        for (var key in dataSources) {
          var ds = dataSources[key];
          if (ds.uri == dsUriOrName || ds.name.toLowerCase() == dsUriOrName.toLowerCase()) {
            return ds.iconUrl;
          }
        }
      });
    }
  }]);

  return Datasources;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzb3VyY2VzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwicmVxdWlyZSIsIlBjUmVxdWVzdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1ZXN0IiwiZGF0YSIsImZldGNoIiwiZGF0YVByb21pc2UiLCJ0aGVuIiwicmVzcG9uc2UiLCJvdXRwdXQiLCJmaWx0ZXIiLCJzb3VyY2UiLCJub3RQYXRod2F5RGF0YSIsIm1hcCIsImRzIiwibmFtZSIsImxlbmd0aCIsInVyaSIsImlkIiwiaWRlbnRpZmllciIsImRlc2NyaXB0aW9uIiwidHlwZSIsImljb25VcmwiLCJjYXRjaCIsImRzVXJpT3JOYW1lIiwiZGF0YVNvdXJjZXMiLCJrZXkiLCJ0b0xvd2VyQ2FzZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFdBQVdDLFFBQVEsaUJBQVIsQ0FBZjs7QUFFQSxJQUFJQyxZQUFZRCxRQUFRLHlCQUFSLENBQWhCOztBQUVBOzs7OztBQUtBRSxPQUFPQyxPQUFQO0FBQ0U7Ozs7O0FBS0EseUJBQWM7QUFBQTs7QUFDWixTQUFLQyxPQUFMLEdBQWUsSUFBSUgsU0FBSixDQUFjLHNCQUFkLEVBQXNDLEtBQXRDLENBQWY7QUFDQSxTQUFLSSxJQUFMLEdBQVksS0FBS0MsS0FBTCxFQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFYRjtBQUFBO0FBQUEsNEJBZ0JVO0FBQ04sVUFBSUMsY0FBYyxLQUFLSCxPQUFMLENBQWFFLEtBQWIsR0FBcUJFLElBQXJCLENBQTBCLFVBQUNDLFFBQUQsRUFBYztBQUN4RCxZQUFJQyxTQUFTLEVBQWI7QUFDQSxZQUFJWCxTQUFTVSxRQUFULENBQUosRUFBd0I7QUFDdEJBLG1CQUNHRSxNQURILENBQ1U7QUFBQSxtQkFBVUMsT0FBT0MsY0FBUCxJQUF5QixLQUFuQztBQUFBLFdBRFYsRUFFR0MsR0FGSCxDQUVPLFVBQUNDLEVBQUQsRUFBUTtBQUNYLGdCQUFJQyxPQUFRRCxHQUFHQyxJQUFILENBQVFDLE1BQVIsR0FBaUIsQ0FBbEIsR0FBdUJGLEdBQUdDLElBQUgsQ0FBUSxDQUFSLENBQXZCLEdBQW9DRCxHQUFHQyxJQUFILENBQVEsQ0FBUixDQUEvQztBQUNBTixtQkFBT0ssR0FBR0csR0FBVixJQUFpQjtBQUNmQyxrQkFBSUosR0FBR0ssVUFEUTtBQUVmRixtQkFBS0gsR0FBR0csR0FGTztBQUdmRixvQkFBTUEsSUFIUztBQUlmSywyQkFBYU4sR0FBR00sV0FKRDtBQUtmQyxvQkFBTVAsR0FBR08sSUFMTTtBQU1mQyx1QkFBU1IsR0FBR1E7QUFORyxhQUFqQjtBQVFELFdBWkg7QUFhRCxTQWRELE1BY087QUFDTGIsbUJBQVMsSUFBVDtBQUNEO0FBQ0QsZUFBT0EsTUFBUDtBQUNELE9BcEJpQixFQW9CZmMsS0FwQmUsQ0FvQlQsWUFBTTtBQUNiLGVBQU8sSUFBUDtBQUNELE9BdEJpQixDQUFsQjs7QUF3QkEsV0FBS25CLElBQUwsR0FBWUUsV0FBWjtBQUNBLGFBQU9BLFdBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBN0NGO0FBQUE7QUFBQSwwQkFrRFE7QUFDSixhQUFPLEtBQUtGLElBQVo7QUFDRDs7QUFFRDs7Ozs7OztBQXRERjtBQUFBO0FBQUEsK0JBNERhb0IsV0E1RGIsRUE0RDBCO0FBQ3RCQSxvQkFBY0EsZUFBZSxFQUE3QjtBQUNBLGFBQU8sS0FBS3BCLElBQUwsQ0FBVUcsSUFBVixDQUFlLFVBQUNrQixXQUFELEVBQWlCO0FBQ3JDLGFBQUssSUFBSUMsR0FBVCxJQUFnQkQsV0FBaEIsRUFBNkI7QUFDM0IsY0FBSVgsS0FBS1csWUFBWUMsR0FBWixDQUFUO0FBQ0EsY0FBSVosR0FBR0csR0FBSCxJQUFVTyxXQUFWLElBQXlCVixHQUFHQyxJQUFILENBQVFZLFdBQVIsTUFBeUJILFlBQVlHLFdBQVosRUFBdEQsRUFBaUY7QUFDL0UsbUJBQU9iLEdBQUdRLE9BQVY7QUFDRDtBQUNGO0FBQ0YsT0FQTSxDQUFQO0FBUUQ7QUF0RUg7O0FBQUE7QUFBQSIsImZpbGUiOiJkYXRhc291cmNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBGZXRjaGVzIGFuIGFycmF5IG9mIGRhdGFzb3VyY2VzIGZyb20gUEMuXG4gKiBAYWxpYXMgZGF0YXNvdXJjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEYXRhc291cmNlcyB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBkYXRhc291cmNlcyBhbmQgbWFrZXMgYSByZXF1ZXN0IHRvIFBDIHNlcnZlciBmZXRjaGluZyBkYXRhc291cmNlIGRhdGEuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcIm1ldGFkYXRhL2RhdGFzb3VyY2VzXCIsIGZhbHNlKTtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmZldGNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNmZXRjaFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3Q+fSAtIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGVpdGhlciB0aGUgZGF0YSBzb3VyY2UgYXJyYXkgb3IgbnVsbCBpZiBkYXRhIHNvdXJjZSBpcyBub3QgYXZhaWxhYmxlXG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICB2YXIgZGF0YVByb21pc2UgPSB0aGlzLnJlcXVlc3QuZmV0Y2goKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgaWYgKGlzT2JqZWN0KHJlc3BvbnNlKSkge1xuICAgICAgICByZXNwb25zZVxuICAgICAgICAgIC5maWx0ZXIoc291cmNlID0+IHNvdXJjZS5ub3RQYXRod2F5RGF0YSA9PSBmYWxzZSlcbiAgICAgICAgICAubWFwKChkcykgPT4ge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAoZHMubmFtZS5sZW5ndGggPiAxKSA/IGRzLm5hbWVbMV0gOiBkcy5uYW1lWzBdO1xuICAgICAgICAgICAgb3V0cHV0W2RzLnVyaV0gPSB7XG4gICAgICAgICAgICAgIGlkOiBkcy5pZGVudGlmaWVyLFxuICAgICAgICAgICAgICB1cmk6IGRzLnVyaSxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICB0eXBlOiBkcy50eXBlLFxuICAgICAgICAgICAgICBpY29uVXJsOiBkcy5pY29uVXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhUHJvbWlzZTtcbiAgICByZXR1cm4gZGF0YVByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZGF0YSBzb3VyY2VzIGZyb20gUEMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjZ2V0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGxvZ28gZm9yIHRoZSBkYXRhc291cmNlIHVzaW5nIGVpdGhlciBkYXRhc291cmNlcyBVUkkgb3IgbmFtZS4gSW50ZW5kZWQgdG8gYmUgdXNlZCB0byBnZW5lcmF0ZSBpbWFnZSB0YWdzIGZvciB0aHVtYm5haWxzLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2xvb2t1cEljb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRzVXJpT3JOYW1lIC0gRWl0aGVyIFVSSSBvciBuYW1lIG9mIHRoZSBkYXRhIHNvdXJjZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59IGxvZ29VcmwgLSBQcm9taXNlIGNvbnRhaW5pbmcgVVJMIG9mIGRhdGFzb3VyY2UgaW4gcXVlc3Rpb24sIGVsc2UgdW5kZWZpbmVkIGlmIGRhdGFzb3VyY2Ugbm90IGZvdW5kXG4gICAqL1xuICBsb29rdXBJY29uKGRzVXJpT3JOYW1lKSB7XG4gICAgZHNVcmlPck5hbWUgPSBkc1VyaU9yTmFtZSB8fCBcIlwiO1xuICAgIHJldHVybiB0aGlzLmRhdGEudGhlbigoZGF0YVNvdXJjZXMpID0+IHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhU291cmNlcykge1xuICAgICAgICB2YXIgZHMgPSBkYXRhU291cmNlc1trZXldO1xuICAgICAgICBpZiAoZHMudXJpID09IGRzVXJpT3JOYW1lIHx8IGRzLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBkc1VyaU9yTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGRzLmljb25Vcmw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19